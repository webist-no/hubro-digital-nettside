"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { ButtonLink } from "./button-link";

type Props = {
  topics: string[];
  submitLabel: string;
  successTitle: string;
  successText: string;
  phone?: string;
  email?: string;
  page: string;
};

const initial: ContactState = { status: "idle" };

// Strekfelt som hos Vivamedia: bare en understrek, og en omrammet tekstboks for meldingen.
const input =
  "w-full rounded-none border-0 border-b border-ink/60 bg-transparent px-0 py-3 text-lg text-ink placeholder:text-ink/45 focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink aria-[invalid=true]:border-error";
const textbox =
  "w-full rounded-card border border-ink/60 bg-transparent px-4 py-3 text-lg text-ink placeholder:text-ink/45 focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-display text-base font-semibold tracking-[-0.02em]">
        {label}
        {hint && <span className="ml-2 font-sans text-sm font-normal tracking-normal text-ink/60">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm({ topics, submitLabel, successTitle, successText, phone, email, page }: Props) {
  const [state, action, pending] = useActionState(sendContact, initial);
  const [pref, setPref] = useState(state.values?.pref ?? "epost");
  const [startedAt, setStartedAt] = useState("");
  const alertRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  // Tidspunktet brukes bare til å skille mennesker fra roboter som sender umiddelbart.
  useEffect(() => setStartedAt(String(Date.now())), []);

  // Flytt fokus til feilmeldingen eller takken, slik at skjermlesere og tastaturbrukere får med seg resultatet.
  useEffect(() => {
    if (state.status === "error") alertRef.current?.focus();
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  const errors = state.errors ?? {};
  const v = state.values;
  const firstName = v?.name.split(/\s+/)[0];

  if (state.status === "success") {
    return (
      <div className="rounded-card bg-lime p-7 text-lime-ink md:p-10">
        <span
          aria-hidden="true"
          className="mb-5 flex size-12 items-center justify-center rounded-full bg-paper text-xl"
        >
          ✓
        </span>
        <h3 ref={successRef} tabIndex={-1} className="text-subhead outline-none">
          {firstName ? `Takk, ${firstName}!` : successTitle}
        </h3>
        <p className="mt-4 max-w-[46ch] text-lead">{successText}</p>
        {phone && (
          <p className="mt-6">
            Vil du ikke vente? Ring oss på{" "}
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="underline underline-offset-4">
              {phone}
            </a>
            .
          </p>
        )}
        <ButtonLink href="/prosess" variant="dark" className="mt-8">
          Se hvordan vi jobber
        </ButtonLink>
      </div>
    );
  }

  return (
    <form
      action={action}
      noValidate
      className="space-y-6 rounded-card bg-fog p-6 md:p-10"
      aria-describedby={state.status === "error" ? "form-alert" : undefined}
    >
      {state.status === "error" && (
        <div
          ref={alertRef}
          id="form-alert"
          role="alert"
          tabIndex={-1}
          className="rounded-card border border-error bg-paper p-4 text-error outline-none"
        >
          <p className="font-semibold">{state.message}</p>
          {(errors.form === "unconfigured" || errors.form === "failed") && (
            <p className="mt-2 text-ink">
              {phone && (
                <>
                  Ring{" "}
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="underline underline-offset-4">
                    {phone}
                  </a>
                </>
              )}
              {phone && email && " eller skriv til "}
              {email && (
                <a href={`mailto:${email}`} className="underline underline-offset-4">
                  {email}
                </a>
              )}
              .
            </p>
          )}
        </div>
      )}

      {topics.length > 0 && (
        <fieldset>
          <legend className="mb-1.5 font-display text-base font-semibold tracking-[-0.02em]">
            Hva vil du ha hjelp til?
            <span className="ml-2 font-sans text-sm font-normal tracking-normal text-ink/60">
              Velg gjerne flere
            </span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <label key={topic} className="cursor-pointer">
                <input
                  type="checkbox"
                  name="topics"
                  value={topic}
                  defaultChecked={v?.topics.includes(topic)}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-ink/40 bg-paper px-4 py-2 text-[0.95rem] motion-safe:transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                  {topic}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Field id="name" label="Navn" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            defaultValue={v?.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={input}
          />
        </Field>
        <Field id="email" label="E-post" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            defaultValue={v?.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={input}
          />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-1.5 font-display text-base font-semibold tracking-[-0.02em]">
          Hvordan vil du helst bli kontaktet?
        </legend>
        <div className="flex gap-2">
          {[
            { value: "epost", label: "På e-post" },
            { value: "telefon", label: "Ring meg" },
          ].map((o) => (
            <label key={o.value} className="cursor-pointer">
              <input
                type="radio"
                name="pref"
                value={o.value}
                checked={pref === o.value}
                onChange={() => setPref(o.value)}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full border border-ink/40 bg-paper px-5 py-2 text-[0.95rem] motion-safe:transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 md:grid-cols-2">
        <Field
          id="phone"
          label="Telefon"
          hint={pref === "telefon" ? "Trengs for at vi kan ringe" : "Valgfritt"}
          error={errors.phone}
        >
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required={pref === "telefon"}
            defaultValue={v?.phone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={input}
          />
        </Field>
        <Field id="company" label="Selskap eller nettside" hint="Valgfritt">
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            defaultValue={v?.company}
            className={input}
          />
        </Field>
      </div>

      <Field id="message" label="Noe mer vi bør vite?" hint="Valgfritt">
        <textarea
          id="message"
          name="message"
          rows={4}
          defaultValue={v?.message}
          placeholder="F.eks. hva dere driver med, og hva dere ønsker å oppnå."
          className={textbox}
        />
      </Field>

      {/* Skjult felt for roboter. Mennesker ser det aldri. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Ikke fyll ut dette feltet
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />
      <input type="hidden" name="page" value={page} />

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[0.95rem]">
          <input
            type="checkbox"
            name="consent"
            defaultChecked={v?.consent}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-1 size-5 shrink-0 accent-ink"
          />
          <span>
            Jeg godtar at Hubro Digital lagrer opplysningene mine for å svare på henvendelsen. Les{" "}
            <a
              href="https://hubrodigital.no/personvern/"
              className="underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              personvernerklæringen
            </a>
            .
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-1.5 text-sm text-error">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full bg-ink px-8 py-3.5 text-lg text-white motion-safe:transition-colors hover:bg-lime-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Sender …" : submitLabel}
        </button>
        <p className="text-sm text-ink/70">Vi bruker opplysningene dine bare til å svare deg.</p>
      </div>
    </form>
  );
}
