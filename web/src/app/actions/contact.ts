"use server";

import { createClient } from "next-sanity";

// Kontaktskjemaet. Henvendelsen lagres i Sanity («Henvendelse») og/eller sendes
// på e-post (Resend). Minst én av dem må være satt opp, ellers får besøkende
// beskjed om å ringe eller sende e-post i stedet for å tro at noe er sendt.
//
// Miljøvariabler (se web/.env.example):
//   SANITY_API_WRITE_TOKEN   lagre i Sanity (token med skrivetilgang)
//   RESEND_API_KEY + CONTACT_TO_EMAIL (+ CONTACT_FROM_EMAIL)   varsel på e-post
//   CONTACT_DRY_RUN=true     bare for testing: svarer «sendt» uten å levere

export type ContactValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  pref: string;
  topics: string[];
  message: string;
  consent: boolean;
};

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof ContactValues | "form", string>>;
  values?: ContactValues;
};

const str = (v: FormDataEntryValue | null, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot og tidsjekk: roboter fyller ut skjulte felt eller sender umiddelbart.
  // De får et falskt «sendt»-svar, så de ikke lærer hva som ble blokkert.
  const trap = str(formData.get("website"), 200);
  const startedAt = Number(str(formData.get("startedAt"), 20));
  const tooFast = Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 2500;
  if (trap || tooFast) return { status: "success" };

  const values: ContactValues = {
    name: str(formData.get("name"), 100),
    email: str(formData.get("email"), 200),
    phone: str(formData.get("phone"), 40),
    company: str(formData.get("company"), 160),
    pref: str(formData.get("pref"), 10) === "telefon" ? "telefon" : "epost",
    topics: formData
      .getAll("topics")
      .map((t) => str(t, 100))
      .filter(Boolean)
      .slice(0, 8),
    message: str(formData.get("message"), 3000),
    consent: formData.get("consent") === "on",
  };

  const errors: NonNullable<ContactState["errors"]> = {};
  if (values.name.length < 2) errors.name = "Skriv inn navnet ditt.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
    errors.email = "Skriv inn en gyldig e-postadresse.";
  }
  if (values.phone && !/^[+\d][\d\s()-]{5,}$/.test(values.phone)) {
    errors.phone = "Skriv inn et gyldig telefonnummer.";
  }
  if (values.pref === "telefon" && !values.phone) {
    errors.phone = "Legg inn telefonnummeret ditt, så ringer vi deg.";
  }
  if (!values.consent) {
    errors.consent = "Du må godta at vi lagrer opplysningene for å svare deg.";
  }
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Sjekk feltene som er markert, så er du i mål.",
      errors,
      values,
    };
  }

  const page = str(formData.get("page"), 200) || "/snakk-med-oss";
  const createdAt = new Date().toISOString();

  if (process.env.CONTACT_DRY_RUN === "true") {
    console.log("[contact] DRY RUN: henvendelsen ble ikke levert");
    return { status: "success", values };
  }

  const writeToken = process.env.SANITY_API_WRITE_TOKEN;
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const configured = Boolean(writeToken) || Boolean(resendKey && to);

  if (!configured) {
    console.error("[contact] Ingen leveringsmåte er satt opp (SANITY_API_WRITE_TOKEN eller RESEND_API_KEY + CONTACT_TO_EMAIL).");
    return {
      status: "error",
      message: "Skjemaet er ikke koblet til ennå. Ring oss eller send en e-post i stedet, så hjelper vi deg.",
      errors: { form: "unconfigured" },
      values,
    };
  }

  const jobs: Promise<void>[] = [];

  if (writeToken) {
    jobs.push(
      createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
        apiVersion: "2026-11-05",
        useCdn: false,
        token: writeToken,
      })
        .create({
          // Datasettet er offentlig: publiserte dokumenter kan leses av alle. Utkast
          // (`drafts.`-ID) krever token, så henvendelsene med personopplysninger
          // lagres som utkast og skal aldri publiseres (Publiser er fjernet i Studio).
          _id: `drafts.inquiry-${crypto.randomUUID()}`,
          _type: "inquiry",
          status: "new",
          name: values.name,
          email: values.email,
          phone: values.phone,
          company: values.company,
          contactPreference: values.pref === "telefon" ? "Ring meg" : "Send e-post",
          topics: values.topics,
          message: values.message,
          page,
          createdAt,
        })
        .then(() => undefined),
    );
  }

  if (resendKey && to) {
    jobs.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? "Hubro Digital <onboarding@resend.dev>",
          to: [to],
          reply_to: values.email,
          subject: `Ny henvendelse fra ${values.name}`,
          text: [
            `Navn: ${values.name}`,
            `E-post: ${values.email}`,
            `Telefon: ${values.phone || "–"}`,
            `Selskap/nettside: ${values.company || "–"}`,
            `Ønsker: ${values.pref === "telefon" ? "Å bli ringt" : "Svar på e-post"}`,
            `Hjelp til: ${values.topics.join(", ") || "–"}`,
            "",
            values.message || "(ingen melding)",
            "",
            `Sendt fra ${page}`,
          ].join("\n"),
        }),
      }).then(async (res) => {
        if (!res.ok) throw new Error(`Resend svarte ${res.status}`);
      }),
    );
  }

  const results = await Promise.allSettled(jobs);
  const delivered = results.some((r) => r.status === "fulfilled");
  for (const r of results) {
    if (r.status === "rejected") {
      console.error("[contact] Levering feilet:", r.reason instanceof Error ? r.reason.message : "ukjent feil");
    }
  }

  if (!delivered) {
    return {
      status: "error",
      message: "Noe gikk galt, og henvendelsen ble ikke sendt. Prøv igjen, eller ring oss, så hjelper vi deg.",
      errors: { form: "failed" },
      values,
    };
  }

  return { status: "success", values };
}
