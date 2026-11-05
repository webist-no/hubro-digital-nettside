import Link from "next/link";
import { stegaClean } from "next-sanity";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  // «dark» brukes på limefarget bakgrunn (som Vivamedias «Kontakta oss idag»).
  variant?: "lime" | "dark";
};

const variants = {
  lime: "bg-lime text-lime-ink hover:bg-ink hover:text-lime focus-visible:outline-ink",
  dark: "bg-ink text-white hover:bg-lime-ink focus-visible:outline-ink",
};

// Pille-knapp i lime med dyp grønn tekst (som Vivamedias «Kontakt» / «Låt oss snacka»).
export function ButtonLink({ href, children, className = "", variant = "lime" }: Props) {
  return (
    <Link
      href={stegaClean(href)}
      className={`inline-flex items-center rounded-full px-7 py-3.5 text-lg motion-safe:transition-colors motion-safe:duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

// Understreket tekstlenke med pil, brukt til «Alle tjenester →».
export function ArrowLink({ href, children, className = "" }: Props) {
  return (
    <Link
      href={stegaClean(href)}
      className={`inline-flex items-center gap-2 underline underline-offset-4 ${className}`}
    >
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

// Liten pille med tynn kontur, brukt som tagg (Vivamedias «Analys», «Strategi»).
export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-ink/60 px-3 py-0.5 text-xs">
      {children}
    </span>
  );
}
