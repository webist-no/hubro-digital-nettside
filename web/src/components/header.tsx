import Link from "next/link";
import { casesEnabled } from "@/config/features";
import { ButtonLink } from "./button-link";

const links = [
  { href: "/tjenester", label: "Tjenester" },
  { href: "/pakker", label: "Pakker" },
  { href: "/prosess", label: "Prosess" },
  { href: "/resultater", label: "Resultater" },
  { href: "/fagartikler", label: "Fagartikler" },
  { href: "/om-oss", label: "Om oss" },
].filter((l) => casesEnabled || l.href !== "/resultater");

export function Header() {
  return (
    <header className="relative bg-paper">
      <div className="wrap flex h-[62px] items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Hubro Digital, til forsiden"
          className="shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG-logo trenger ingen optimalisering */}
          <img src="/logos/hubro/hubro-digital-ink.svg" alt="Hubro Digital" width={190} height={35} className="h-6 w-auto sm:h-7" />
        </Link>

        <nav aria-label="Hovedmeny" className="flex items-center gap-4 lg:gap-8">
          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="underline-offset-4 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink
            href="/snakk-med-oss"
            className="whitespace-nowrap !px-5 !py-2 !text-base max-sm:hidden"
          >
            Book 30 minutter
          </ButtonLink>

          {/* Mobilmeny uten JavaScript */}
          <details className="group lg:hidden">
            <summary className="cursor-pointer list-none rounded-full border border-ink/40 px-4 py-1.5 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink [&::-webkit-details-marker]:hidden">
              Meny
            </summary>
            <ul className="absolute inset-x-0 top-[62px] z-10 space-y-1 border-t border-ink/15 bg-paper px-5 pb-5 pt-3 shadow-none">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block py-2 text-lg">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-3">
                <ButtonLink href="/snakk-med-oss" className="whitespace-nowrap">
                  Book 30 minutter
                </ButtonLink>
              </li>
            </ul>
          </details>
        </nav>
      </div>
    </header>
  );
}
