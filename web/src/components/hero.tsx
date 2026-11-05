import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { ArrowLink, ButtonLink, Pill } from "./button-link";

type Cta = { label?: string | null; href?: string | null } | null;

type HeroProps = {
  eyebrow: string | null;
  heading: string | null;
  headingAccent: string | null;
  intro: string | null;
  badges: string[] | null;
  primaryCta: Cta;
  secondaryCta: Cta;
  heroImage: { asset: { _ref: string } | null; alt: string | null } | null;
};

// Typo-hero med asymmetrisk ingress (Vivamedia): stor tittel til venstre,
// ingress, knapp og lenke til høyre.
export function Hero({
  eyebrow,
  heading,
  headingAccent,
  intro,
  badges,
  primaryCta,
  secondaryCta,
  heroImage,
}: HeroProps) {
  return (
    <>
      <section className="wrap grid gap-10 pb-16 pt-14 md:grid-cols-[1.7fr_1fr] md:items-start md:pb-24 md:pt-24">
        <div>
          {eyebrow && <Pill>{eyebrow}</Pill>}
          <h1 className={`text-display ${eyebrow ? "mt-6" : ""}`}>
            {heading}
            {headingAccent && (
              <>
                {" "}
                <span className="text-lime-ink">{headingAccent}</span>
              </>
            )}
          </h1>
        </div>
        <div className="md:pt-4">
          {intro && <p className="text-lead">{intro}</p>}
          {badges && badges.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {badges.map((b) => (
                <li key={b}>
                  <Pill>{b}</Pill>
                </li>
              ))}
            </ul>
          )}
          {(primaryCta?.label || secondaryCta?.label) && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {primaryCta?.label && primaryCta.href && (
                <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
              )}
              {secondaryCta?.label && secondaryCta.href && (
                <ArrowLink href={secondaryCta.href} className="px-4 py-3.5">
                  {secondaryCta.label}
                </ArrowLink>
              )}
            </div>
          )}
        </div>
      </section>

      {heroImage?.asset && (
        <div className="wrap pb-20 md:pb-28">
          <div className="relative aspect-[16/9] overflow-hidden rounded-card md:aspect-[21/9]">
            <Image
              src={urlFor(heroImage).width(2000).height(900).url()}
              alt={heroImage.alt ?? ""}
              fill
              priority
              sizes="(min-width: 1400px) 1284px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      )}
    </>
  );
}
