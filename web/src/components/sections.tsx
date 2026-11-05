import Image from "next/image";
import Link from "next/link";
import { stegaClean } from "next-sanity";
import { casesEnabled } from "@/config/features";
import { getSettings } from "@/sanity/data";
import { urlFor } from "@/sanity/image";
import type { PAGE_QUERY_RESULT } from "../../sanity.types";
import { ArrowLink, ButtonLink, Pill } from "./button-link";
import { ContactForm } from "./contact-form";
import { CtaBand } from "./cta-band";
import { PortableBody } from "./portable-body";
import { ServiceCards } from "./service-cards";

type Section = NonNullable<NonNullable<PAGE_QUERY_RESULT>["sections"]>[number];
type Of<T extends Section["_type"]> = Extract<Section, { _type: T }>;
type Pkg = NonNullable<NonNullable<Of<"packagesSection">["packages"]>[number]>;

const slugify = (s: string | null) =>
  stegaClean(s ?? "").toLowerCase().replace(/[^a-z0-9æøå]+/g, "-").replace(/^-|-$/g, "");

function Heading({
  heading,
  intro,
  className = "",
}: {
  heading?: string | null;
  intro?: string | null;
  className?: string;
}) {
  if (!heading && !intro) return null;
  return (
    <div className={`mb-12 grid gap-6 md:mb-16 md:grid-cols-2 md:items-end ${className}`}>
      {heading && <h2 className="text-headline">{heading}</h2>}
      {intro && <p className="max-w-[44ch] text-lead">{intro}</p>}
    </div>
  );
}

function Bullets({ items, className = "" }: { items: string[] | null; className?: string }) {
  if (!items?.length) return null;
  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-current" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ---------- Seksjoner ----------

function TextSection({ s }: { s: Of<"textSection"> }) {
  return (
    <section className="wrap grid gap-10 py-16 md:grid-cols-2 md:gap-16 md:py-24">
      <h2 className="text-headline">{s.heading}</h2>
      {s.body && (
        <div className="max-w-[48ch] text-lg">
          <PortableBody value={s.body} />
        </div>
      )}
    </section>
  );
}

function ServiceCardsSection({ s }: { s: Of<"serviceCardsSection"> }) {
  const services = (s.services ?? []).filter(Boolean) as Parameters<typeof ServiceCards>[0]["services"];

  // Lenkeliste (Vivamedias kunnskapsliste): tittel, kort tekst og pil på hver rad.
  if (stegaClean(s.variant) === "list") {
    return (
      <section className="wrap py-16 md:py-24">
        <Heading heading={s.heading} intro={s.intro} />
        <ul className="border-b border-ink/30">
          {services.map((service) => (
            <li key={service._id} className="border-t border-ink/30">
              <Link
                href={`/tjenester/${service.slug}`}
                className="group grid items-center gap-2 py-6 md:grid-cols-[1fr_1.4fr_auto] md:gap-10"
              >
                <span className="font-display text-title font-semibold group-hover:text-lime-ink">
                  {service.title}
                </span>
                <span className="text-ink/75">{service.summary}</span>
                <span aria-hidden="true" className="text-2xl motion-safe:transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="wrap py-16 md:py-24">
      <Heading heading={s.heading} intro={s.intro} />
      <ServiceCards services={services} />
    </section>
  );
}

// Tekst og bilde side om side (Vivamedias «Varför …»).
function SplitSection({ s }: { s: Of<"splitSection"> }) {
  const imageLeft = s.imageSide === "left";
  return (
    <section className="wrap grid gap-10 py-16 md:grid-cols-2 md:items-center md:gap-16 md:py-24">
      <div className={imageLeft ? "md:order-2" : ""}>
        <h2 className="text-subhead">{s.heading}</h2>
        {s.body && (
          <div className="mt-6 max-w-[52ch] text-lg">
            <PortableBody value={s.body} />
          </div>
        )}
        {s.buttonLabel && s.buttonHref && (
          <ButtonLink href={s.buttonHref} className="mt-8">
            {s.buttonLabel}
          </ButtonLink>
        )}
      </div>
      {s.image?.asset && (
        <div className={`relative aspect-[4/3] overflow-hidden rounded-card ${imageLeft ? "md:order-1" : ""}`}>
          <Image
            src={urlFor(s.image).width(1200).height(900).url()}
            alt={s.image.alt ?? ""}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
    </section>
  );
}

// Fordeler i tre kolonner med tynn linje over (Vivamedias fordelsgrid).
function BenefitsSection({ s }: { s: Of<"benefitsSection"> }) {
  return (
    <section className="wrap py-16 md:py-24">
      <Heading heading={s.heading} intro={s.intro} />
      <ul className="grid gap-x-8 gap-y-12 md:grid-cols-3">
        {s.items?.map((item) => (
          <li key={item._key} className="border-t border-ink/30 pt-5">
            <h3 className="text-title">{item.title}</h3>
            <p className="mt-3 max-w-[40ch] text-ink/80">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Store titler med limemarkering og forklaring (Vivamedias «effekt»-seksjon).
function HighlightsSection({ s }: { s: Of<"highlightsSection"> }) {
  return (
    // Overskriften følger med mens du scroller; limemarkeringen sveiper over hver tittel
    // og teksten løfter seg inn (ren CSS, se .hl-* i globals.css).
    <section className="wrap grid gap-10 py-16 md:grid-cols-[1fr_1.1fr] md:gap-16 md:py-28">
      <h2 className="max-w-[14ch] text-headline md:sticky md:top-12 md:self-start">{s.heading}</h2>
      <ul className="space-y-14 md:space-y-24">
        {s.items?.map((item, i) => (
          <li key={item._key} className="border-t border-ink/25 pt-6 md:pt-8">
            <span aria-hidden="true" className="mb-5 block font-display text-sm font-semibold tracking-[0.08em] text-lime-ink">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-subhead font-normal tracking-[-0.04em]">
              <span className="hl-mark box-decoration-clone px-2 py-0.5">{item.title}</span>
            </h3>
            <p className="hl-rise mt-5 max-w-[44ch] text-lg md:text-xl">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Uten og med: hva det koster å la være, og hva du får.
function CompareSection({ s }: { s: Of<"compareSection"> }) {
  return (
    <section className="bg-fog">
      <div className="wrap py-16 md:py-24">
        <Heading heading={s.heading} intro={s.intro} />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-card bg-paper p-7 md:p-9">
            <h3 className="text-title text-ink/70">{s.withoutTitle}</h3>
            <ul className="mt-6 space-y-4">
              {s.withoutItems?.map((item) => (
                <li key={item} className="flex gap-3 text-ink/80">
                  <span aria-hidden="true" className="mt-0.5 text-ink/40">
                    –
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card bg-ink p-7 text-white md:p-9">
            <h3 className="text-title text-lime">{s.withTitle}</h3>
            <ul className="mt-6 space-y-4">
              {s.withItems?.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-0.5 text-lime">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// Stor typografisk setning (Vivamedias typografidrevne uttrykk).
function StatementSection({ s }: { s: Of<"statementSection"> }) {
  return (
    <section className="wrap py-14 md:py-20">
      <p className="max-w-[24ch] font-display text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.04em] md:max-w-[28ch]">
        {s.text}
        {s.accent && (
          <>
            {" "}
            <span className="text-lime-ink">{s.accent}</span>
          </>
        )}
      </p>
    </section>
  );
}

function StatsSection({ s }: { s: Of<"statsSection"> }) {
  return (
    <section className="wrap py-16 md:py-24">
      <Heading heading={s.heading} />
      <dl className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
        {s.items?.map((item) => (
          <div key={item._key}>
            <dd className="font-display text-[clamp(2.5rem,7vw,6.25rem)] font-semibold leading-none tracking-[-0.04em]">
              {item.value}
            </dd>
            <dt className="mt-3 max-w-[22ch]">{item.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

function PackageCard({ p }: { p: Pkg }) {
  const popular = Boolean(p.badge);
  return (
    <li
      className={`flex flex-col rounded-card p-7 md:p-8 ${popular ? "bg-ink text-white" : "bg-fog"}`}
    >
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {p.tier && (
          <span
            className={`inline-block rounded-full border px-3 py-0.5 text-xs ${popular ? "border-white/60" : "border-ink/60"}`}
          >
            {p.tier}
          </span>
        )}
        {p.badge && (
          <span className="inline-block rounded-full bg-lime px-3 py-0.5 text-xs text-lime-ink">
            {p.badge}
          </span>
        )}
      </div>
      <p className={popular ? "text-lime" : "text-lime-ink"}>{p.name}</p>
      <h3 className="mt-2 text-title">{p.tagline}</h3>
      <p className={`mt-3 ${popular ? "text-white/85" : "text-ink/75"}`}>{p.audience}</p>
      <Bullets items={p.cardFeatures} className="mt-6 flex-1 text-[0.95rem]" />
      <div className={`mt-8 border-t pt-6 ${popular ? "border-line" : "border-ink/20"}`}>
        <p className="font-display text-2xl font-semibold tracking-[-0.04em]">{p.priceFrom}</p>
        <p className={`mt-1 text-sm ${popular ? "text-white/75" : "text-ink/70"}`}>{p.priceNote}</p>
        <ButtonLink href="/snakk-med-oss" className="mt-6">
          Snakk med oss
        </ButtonLink>
      </div>
    </li>
  );
}

function PackageDetail({ p, index }: { p: Pkg; index: number }) {
  return (
    <section id={slugify(p.name)} className={`scroll-mt-8 ${index % 2 === 0 ? "bg-fog" : ""}`}>
      <div className="wrap py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <Pill>{p.name}</Pill>
            <h2 className="mt-5 text-subhead">{p.detailHeading}</h2>
            <p className="mt-5 text-lg">{p.detailIntro}</p>
            {p.responsibilities && p.responsibilities.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-3 font-display text-lg font-semibold tracking-[-0.04em]">Vi tar ansvar for</h3>
                <Bullets items={p.responsibilities} />
              </div>
            )}
          </div>
          <div>
            <h3 className="mb-5 font-display text-lg font-semibold tracking-[-0.04em]">{p.youGetIntro}</h3>
            <ul className="grid gap-4 sm:grid-cols-2">
              {p.youGet?.map((y) => (
                <li key={y._key} className={`rounded-card p-6 ${index % 2 === 0 ? "bg-paper" : "bg-fog"}`}>
                  <p className="font-display text-lg font-semibold tracking-[-0.04em]">{y.title}</p>
                  <p className="mt-2 text-[0.95rem] text-ink/80">{y.text}</p>
                </li>
              ))}
            </ul>

            {p.channels && p.channels.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-3 font-display text-lg font-semibold tracking-[-0.04em]">Kanaler inkludert</h3>
                <ul className="flex flex-wrap gap-2">
                  {p.channels.map((c) => (
                    <li key={c}>
                      <Pill>{c}</Pill>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-display text-lg font-semibold tracking-[-0.04em]">Passer for deg som</h3>
                <Bullets items={p.fitFor} className="text-[0.95rem]" />
              </div>
              <div className="rounded-card bg-ink p-6 text-white">
                <h3 className="mb-3 font-display text-lg font-semibold tracking-[-0.04em] text-lime">Priser og detaljer</h3>
                <p className="font-display text-3xl font-semibold tracking-[-0.04em]">{p.priceLine}</p>
                <p className="mb-4 text-sm text-white/75">{p.priceSuffix}</p>
                <dl className="space-y-2 text-sm">
                  {p.terms?.map((t) => (
                    <div key={t._key} className="flex justify-between gap-4 border-t border-line pt-2">
                      <dt className="text-white/75">{t.label}</dt>
                      <dd>{t.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 rounded-card border border-ink/25 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-lg font-semibold tracking-[-0.04em]">{p.ctaHeading}</p>
                <p className="text-[0.95rem] text-ink/75">{p.ctaText}</p>
              </div>
              <ButtonLink href="/snakk-med-oss" className="shrink-0">
                {p.ctaLabel}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PackagesSection({ s }: { s: Of<"packagesSection"> }) {
  const packages = (s.packages ?? []).filter(Boolean) as Pkg[];
  if (stegaClean(s.variant) === "detailed") {
    return (
      <div>
        {packages.map((p, i) => (
          <PackageDetail key={p._id} p={p} index={i} />
        ))}
      </div>
    );
  }

  if (stegaClean(s.variant) === "picker") {
    return (
      <section className="wrap py-16 md:py-24">
        <Heading heading={s.heading} intro={s.intro} />
        <ul className="grid gap-5 md:grid-cols-3">
          {packages.map((p) => (
            <li key={p._id} className="flex flex-col rounded-card bg-fog p-7 md:p-8">
              <h3 className="text-title">{p.pickHeading}</h3>
              <p className="mt-3">{p.pickText}</p>
              <Bullets items={p.pickBullets} className="mt-5 flex-1 text-[0.95rem]" />
              <ButtonLink href={`#${slugify(p.name)}`} className="mt-8 self-start">
                {p.pickLabel}
              </ButtonLink>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="wrap py-16 md:py-24">
      <Heading heading={s.heading} intro={s.intro} />
      <ul className="grid gap-5 md:grid-cols-3">
        {packages.map((p) => (
          <PackageCard key={p._id} p={p} />
        ))}
      </ul>
      {s.note && <p className="mt-8 max-w-[70ch] text-sm text-ink/75">{s.note}</p>}
    </section>
  );
}

function StepsSection({ s }: { s: Of<"stepsSection"> }) {
  return (
    <section className="wrap py-16 md:py-24">
      <Heading heading={s.heading} intro={s.intro} />
      <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
        {s.steps?.map((step, i) => (
          <li key={step._key} className="border-t border-ink/30 pt-6">
            <span className="font-display text-[clamp(2.75rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.04em] text-lime-ink">
              {i + 1}
            </span>
            <h3 className="mt-4 text-title">{step.title}</h3>
            <p className="mt-2 max-w-[36ch]">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PhasesSection({ s }: { s: Of<"phasesSection"> }) {
  return (
    <section className="bg-fog">
      <div className="wrap py-16 md:py-24">
        <Heading heading={s.heading} />
        <div className="space-y-16 md:space-y-24">
          {s.phases?.map((phase) => (
            <article key={phase._key} className="grid gap-8 md:grid-cols-2 md:gap-16">
              <div>
                <Pill>{phase.label}</Pill>
                <h3 className="mt-5 text-subhead">{phase.title}</h3>
                <p className="mt-5 max-w-[44ch] text-lg">{phase.text}</p>
              </div>
              <ul className="divide-y divide-ink/20 border-y border-ink/20">
                {phase.items?.map((item) => (
                  <li key={item._key} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                    <span className="font-display font-semibold tracking-[-0.04em]">{item.title}</span>
                    <span className="text-ink/80">{item.text}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection({ s }: { s: Of<"timelineSection"> }) {
  return (
    <section className="wrap py-16 md:py-24">
      <Heading heading={s.heading} intro={s.intro} />
      <ol className="grid gap-5 md:grid-cols-3">
        {s.items?.map((item) => (
          <li key={item._key} className="rounded-card bg-ink p-7 text-white">
            <span className="inline-block rounded-full bg-lime px-3 py-0.5 text-xs text-lime-ink">
              {item.period}
            </span>
            <h3 className="mt-5 text-title">{item.title}</h3>
            <p className="mt-3 text-white/85">{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PrinciplesSection({ s }: { s: Of<"principlesSection"> }) {
  return (
    <section className="wrap py-16 md:py-24">
      <Heading heading={s.heading} intro={s.intro} />
      <ul className="grid gap-x-8 gap-y-10 md:grid-cols-3">
        {s.items?.map((item) => (
          <li key={item._key} className="border-t border-ink/30 pt-5">
            <h3 className="text-title">{item.title}</h3>
            <p className="mt-3 max-w-[38ch] text-ink/80">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Grå flate (#cbccc7) med hvite kort, etter Vivamedias «Kunskapsbanken».
function TestimonialsSection({ s }: { s: Of<"testimonialsSection"> }) {
  const testimonials = (s.testimonials ?? []).filter(Boolean);
  if (!testimonials.length) return null;
  // Én fremhevet uttalelse i stor skrift (Vivamedia-aktig typografisk flate), resten
  // som rolige kolonner under. Mørk flate gir de hvite kundelogoene kontrast.
  const featured = testimonials.find((t) => t!.featured) ?? testimonials[0];
  const rest = testimonials.filter((t) => t !== featured);

  const Who = ({ t, size }: { t: NonNullable<typeof featured>; size: "lg" | "md" }) => (
    <figcaption className={`flex flex-wrap items-center justify-between gap-x-8 gap-y-5 ${size === "lg" ? "mt-10 md:mt-14" : "mt-8"}`}>
      <div>
        <p className={`font-display font-semibold tracking-[-0.04em] ${size === "lg" ? "text-title" : "text-lg"}`}>{t.author}</p>
        <p className="text-white/70">
          {[t.role, t.company].filter(Boolean).join(" · ")}
        </p>
      </div>
      {t.logo && (
        // eslint-disable-next-line @next/next/no-img-element -- logoer fra Sanity trenger ingen optimalisering
        <img
          src={t.logo}
          alt=""
          className={`w-auto object-contain brightness-0 invert ${size === "lg" ? "h-9 max-w-[11rem] md:h-12 md:max-w-[14rem]" : "h-7 max-w-[9rem]"}`}
        />
      )}
    </figcaption>
  );

  return (
    <section className="bg-ink text-white">
      <div className="wrap py-20 md:py-32">
        <h2 className="mb-10 flex items-center gap-3 text-lead text-white/80 md:mb-14">
          <span aria-hidden="true" className="size-3 rounded-full bg-lime" />
          {s.heading}
        </h2>

        {featured && (
          <figure className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-1 -top-10 select-none font-display text-[9rem] font-semibold leading-none text-lime md:-top-16 md:text-[16rem]"
            >
              “
            </span>
            <blockquote className="relative max-w-[28ch] pt-24 text-subhead md:pt-36 md:max-w-[26ch] md:text-[clamp(2.4rem,5vw,4.6rem)]">
              {featured.quote}
            </blockquote>
            <Who t={featured} size="lg" />
          </figure>
        )}

        {rest.length > 0 && (
          <ul className="mt-16 grid gap-x-12 gap-y-14 border-t border-line pt-12 md:mt-24 md:grid-cols-2 md:pt-16">
            {rest.map((t) => (
              <li key={t!._id}>
                <figure className="flex h-full flex-col">
                  <blockquote className="max-w-[44ch] text-xl leading-snug md:text-2xl">“{t!.quote}”</blockquote>
                  <Who t={t!} size="md" />
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// Case-kort etter Vivamedias casegrid: kunde, tittel, nøkkeltall og tagger.
function CasesSection({ s }: { s: Of<"casesSection"> }) {
  if (!casesEnabled) return null;
  const cases = (s.cases ?? []).filter(Boolean);
  return (
    <section className="wrap py-16 md:py-24">
      <Heading heading={s.heading} intro={s.intro} />
      <ul className="grid gap-5 lg:grid-cols-3">
        {cases.map((c) => (
          <li key={c!._id}>
            <Link
              href={`/case/${c!.slug}`}
              className="group flex h-full flex-col rounded-card bg-ink p-7 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:p-8"
            >
              <p className="text-white/70">{c!.client}</p>
              <h3 className="mt-2 text-title group-hover:text-lime">{c!.title}</h3>
              <p className="mt-4 line-clamp-5 text-[0.95rem] text-white/85">{c!.summary}</p>
              <dl className="mt-8 grid flex-1 grid-cols-2 content-end gap-x-4 gap-y-5 border-t border-line pt-6">
                {c!.metrics?.map((m) => (
                  <div key={m._key}>
                    <dd className="font-display text-3xl font-semibold tracking-[-0.04em] text-lime">{m.value}</dd>
                    <dt className="text-sm text-white/75">{m.label}</dt>
                  </div>
                ))}
              </dl>
              {c!.tags && c!.tags.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {c!.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-white/50 px-3 py-0.5 text-xs">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ClientsSection({ s }: { s: Of<"clientsSection"> }) {
  const clients = s.clients ?? [];
  if (!clients.length) return null;
  return (
    // Som hos Vivamedia: lys flate, sentrert overskrift og én rad med store, ensfargede
    // logoer som sakte glir forbi fra kant til kant (se .marquee i globals.css).
    <section aria-label={s.heading ?? "Kunder"} className="bg-fog py-16 md:py-24">
      {s.heading && (
        <div className="wrap">
          <h2 className="mx-auto mb-12 max-w-[26ch] text-center text-subhead md:mb-20">{s.heading}</h2>
        </div>
      )}
      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex shrink-0 items-center text-title motion-reduce:flex-wrap motion-reduce:justify-center"
            >
              {clients.map((c) => (
                <li key={c._key} className="flex h-14 items-center px-8 md:h-20 md:px-14">
                  {c.logo?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- SVG/WebP-logoer fra Sanity trenger ingen optimalisering
                    <img
                      src={c.logo.url}
                      alt={copy === 1 ? "" : (c.name ?? "")}
                      className="max-h-full w-auto max-w-[10rem] object-contain brightness-0 md:max-w-[14rem]"
                    />
                  ) : (
                    c.name
                  )}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ s }: { s: Of<"faqSection"> }) {
  return (
    <section className="wrap grid gap-10 py-16 md:grid-cols-[1fr_1.6fr] md:gap-16 md:py-24">
      <h2 className="text-headline">{s.heading}</h2>
      <div className="divide-y divide-ink/25 border-y border-ink/25">
        {s.items?.map((item) => (
          <details key={item._key} className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-xl font-semibold tracking-[-0.04em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink [&::-webkit-details-marker]:hidden">
              {item.question}
              <span aria-hidden="true" className="mt-1 text-lime-ink motion-safe:transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-4 max-w-[62ch] whitespace-pre-line text-ink/85">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

async function ContactSection({ s }: { s: Of<"contactSection"> }) {
  const settings = await getSettings();
  const email = stegaClean(s.email ?? settings?.email);
  return (
    <section className="wrap py-16 md:py-24">
      <Heading heading={s.heading} intro={s.intro} />
      <ul className="grid gap-5 md:grid-cols-2">
        {settings?.phone && (
          <li className="rounded-card bg-fog p-8">
            <h3 className="mb-3 text-title">Telefon</h3>
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="text-lead underline underline-offset-4">
              {settings.phone}
            </a>
          </li>
        )}
        {email && (
          <li className="rounded-card bg-fog p-8">
            <h3 className="mb-3 text-title">E-post</h3>
            <a href={`mailto:${email}`} className="text-lead underline underline-offset-4">
              {email}
            </a>
            {s.buttonLabel && (
              <div className="mt-6">
                <ButtonLink href={`mailto:${email}`}>{s.buttonLabel}</ButtonLink>
              </div>
            )}
          </li>
        )}
        {settings?.offices?.map((office) => (
          <li key={office._key} className="rounded-card bg-ink p-8 text-white">
            <h3 className="mb-3 text-title text-lime">{office.city}</h3>
            <p className="text-lead">
              {office.street}
              <br />
              {office.postalCode}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const initials = (name: string) => {
  const parts = stegaClean(name).split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "")).toUpperCase();
};

const mapUrl = (street?: string | null, postal?: string | null) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stegaClean(`${street ?? ""}, ${postal ?? ""}`))}`;

// Kontaktskjema med forklaring og fordeler til venstre, og ulike veier til å nå oss til høyre.
async function ContactFormSection({ s }: { s: Of<"contactFormSection"> }) {
  const settings = await getSettings();
  // Skjemaets valg og kontaktinfo er funksjonelle tekster: stega-tegn renses bort.
  const topics = (s.topics ?? []).map((t) => stegaClean(t));
  const phone = settings?.phone ? stegaClean(settings.phone) : undefined;
  const email = settings?.email ? stegaClean(settings.email) : undefined;
  const people = s.showPeople === false ? [] : (s.people ?? []);

  return (
    <section className="wrap py-12 md:py-20">
      <Heading heading={s.heading} intro={s.intro} />
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <div className="space-y-8">
          {s.benefits && s.benefits.length > 0 && (
            <div>
              {s.benefitsTitle && <h3 className="mb-4 text-title">{s.benefitsTitle}</h3>}
              <ul className="space-y-3">
                {s.benefits.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-lime text-sm text-lime-ink"
                    >
                      ✓
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ContactForm
            topics={topics}
            submitLabel={stegaClean(s.submitLabel) || "Send forespørsel"}
            successTitle={stegaClean(s.successTitle) || "Takk for henvendelsen!"}
            successText={
              stegaClean(s.successText) ||
              "Vi hører fra oss innen én virkedag, vanligvis samme dag."
            }
            phone={phone}
            email={email}
            page="/snakk-med-oss"
          />
        </div>

        <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
          {(phone || email) && (
            <div className="rounded-card bg-ink p-7 text-white">
              <h3 className="mb-4 text-title text-lime">Foretrekker du å ringe?</h3>
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="block font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold leading-tight tracking-[-0.04em] hover:text-lime"
                >
                  {phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="mt-3 inline-block underline underline-offset-4 hover:text-lime">
                  {email}
                </a>
              )}
            </div>
          )}

          {settings?.offices && settings.offices.length > 0 && (
            <div className="rounded-card bg-fog p-7">
              <h3 className="mb-4 text-title">Besøk oss</h3>
              <ul className="space-y-5">
                {settings.offices.map((o) => (
                  <li key={o._key}>
                    <p className="font-display font-semibold tracking-[-0.02em]">{o.city}</p>
                    <p>
                      {o.street}
                      <br />
                      {o.postalCode}
                    </p>
                    <a
                      href={mapUrl(o.street, o.postalCode)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm underline underline-offset-4"
                    >
                      Vis på kart →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {people.length > 0 && (
            <div className="rounded-card bg-fog p-7">
              <h3 className="mb-4 text-title">De du snakker med</h3>
              <ul className="space-y-4">
                {people.map((p) => (
                  <li key={p._id} className="flex items-center gap-4">
                    {p.photo?.asset ? (
                      <Image
                        src={urlFor(p.photo).width(120).height(120).url()}
                        alt=""
                        width={56}
                        height={56}
                        className="size-14 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-lime font-display font-semibold tracking-[-0.04em] text-lime-ink"
                      >
                        {initials(p.name ?? "")}
                      </span>
                    )}
                    <span>
                      <span className="block font-display font-semibold tracking-[-0.02em]">{p.name}</span>
                      <span className="block text-sm text-ink/70">{p.role}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

// Teamet: ekte ansikter, rolle, kort presentasjon og direkte kontaktinfo.
function TeamSection({ s }: { s: Of<"teamSection"> }) {
  const people = s.people ?? [];
  if (!people.length) return null;
  return (
    <section className="wrap py-12 md:py-20">
      <Heading heading={s.heading} intro={s.intro} />
      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => {
          const email = p.email ? stegaClean(p.email) : undefined;
          const phone = p.phone ? stegaClean(p.phone) : undefined;
          return (
            <li key={p._id} className="flex flex-col">
              {p.photo?.asset ? (
                <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-card bg-fog">
                  <Image
                    src={urlFor(p.photo).width(800).height(1000).url()}
                    alt={p.photo.alt ?? `Portrett av ${p.name}`}
                    fill
                    sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <h3 className="text-title">{p.name}</h3>
              <p className="mt-1 text-lime-ink">{p.role}</p>
              {p.bio && <p className="mt-3 max-w-[52ch] text-ink/85">{p.bio}</p>}
              {s.showContact !== false && (email || phone) && (
                <p className="mt-4 space-y-1 text-sm">
                  {phone && (
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="block underline underline-offset-4 hover:text-lime-ink">
                      {phone}
                    </a>
                  )}
                  {email && (
                    <a href={`mailto:${email}`} className="block underline underline-offset-4 hover:text-lime-ink">
                      {email}
                    </a>
                  )}
                </p>
              )}
            </li>
          );
        })}
        {s.image?.asset && (
          <li className="relative aspect-[4/5] overflow-hidden rounded-card bg-fog sm:aspect-auto sm:min-h-[22rem]">
            <Image
              src={urlFor(s.image).width(800).height(1000).url()}
              alt={s.image.alt ?? ""}
              fill
              sizes="(min-width: 1024px) 28vw, (min-width: 640px) 90vw, 100vw"
              className="object-cover object-bottom"
            />
          </li>
        )}
      </ul>
    </section>
  );
}

// I Draft Mode har tekstfeltene usynlige stega-tegn (for klikk-for-å-redigere),
// så streng-literaler som `tone` er typet som StegaString. Alle sammenligninger
// i komponentene renses med stegaClean, så vi kan trygt bruke de vanlige typene.
export type SectionsInput = Section[] | null;

export async function Sections({ sections }: { sections: SectionsInput }) {
  if (!sections?.length) return null;
  return (
    <>
      {sections.map((s) => {
        switch (s._type) {
          case "textSection":
            return <TextSection key={s._key} s={s} />;
          case "serviceCardsSection":
            return <ServiceCardsSection key={s._key} s={s} />;
          case "statsSection":
            return <StatsSection key={s._key} s={s} />;
          case "packagesSection":
            return <PackagesSection key={s._key} s={s} />;
          case "stepsSection":
            return <StepsSection key={s._key} s={s} />;
          case "phasesSection":
            return <PhasesSection key={s._key} s={s} />;
          case "timelineSection":
            return <TimelineSection key={s._key} s={s} />;
          case "principlesSection":
            return <PrinciplesSection key={s._key} s={s} />;
          case "testimonialsSection":
            return <TestimonialsSection key={s._key} s={s} />;
          case "casesSection":
            return <CasesSection key={s._key} s={s} />;
          case "teamSection":
            return <TeamSection key={s._key} s={s} />;
          case "clientsSection":
            return <ClientsSection key={s._key} s={s} />;
          case "faqSection":
            return <FaqSection key={s._key} s={s} />;
          case "contactSection":
            return <ContactSection key={s._key} s={s} />;
          case "contactFormSection":
            return <ContactFormSection key={s._key} s={s} />;
          case "splitSection":
            return <SplitSection key={s._key} s={s} />;
          case "benefitsSection":
            return <BenefitsSection key={s._key} s={s} />;
          case "highlightsSection":
            return <HighlightsSection key={s._key} s={s} />;
          case "compareSection":
            return <CompareSection key={s._key} s={s} />;
          case "statementSection":
            return <StatementSection key={s._key} s={s} />;
          case "ctaSection":
            return (
              <CtaBand
                key={s._key}
                heading={s.heading}
                text={s.intro}
                label={s.buttonLabel}
                href={s.buttonHref}
                tone={s.tone}
                checklist={s.checklist}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
