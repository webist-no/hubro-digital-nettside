import Link from "next/link";
import { getPackages, getServices, getSettings } from "@/sanity/data";

const heading =
  "mb-3 font-display text-lg font-semibold tracking-[-0.04em] underline underline-offset-4";

export async function Footer() {
  const [settings, services, packages] = await Promise.all([getSettings(), getServices(), getPackages()]);

  return (
    <footer className="bg-ink text-white">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG-logo trenger ingen optimalisering */}
          <img src="/logos/hubro/hubro-digital-hvit.svg" alt="Hubro Digital" width={220} height={40} className="h-8 w-auto" />
          {settings?.tagline && <p className="mt-4 max-w-[34ch] text-white/80">{settings.tagline}</p>}
        </div>

        <div>
          <p className={heading}>Kontakt</p>
          <ul className="space-y-2">
            {settings?.offices?.map((o) => (
              <li key={o._key}>
                {o.street}
                <br />
                {o.postalCode}
              </li>
            ))}
            {settings?.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-lime">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings?.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-lime">
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className={heading}>Tjenester</p>
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s._id}>
                <Link href={`/tjenester/${s.slug}`} className="hover:text-lime">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={heading}>Pakker</p>
          <ul className="space-y-2">
            {packages.map((p) => (
              <li key={p._id}>
                <Link href="/pakker" className="hover:text-lime">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className={`${heading} mt-8`}>Lær mer</p>
          <ul className="space-y-2">
            <li>
              <Link href="/om-oss" className="hover:text-lime">
                Om oss
              </Link>
            </li>
            <li>
              <Link href="/fagartikler" className="hover:text-lime">
                Fagartikler
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap flex flex-col gap-4 border-t border-line py-6 text-sm text-white/75 sm:flex-row sm:items-center sm:justify-between">
        <p>© Hubro Digital. Alle rettigheter reservert.</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <Link href="/personvern" className="hover:text-lime">
              Personvernerklæring
            </Link>
          </li>
          {settings?.linkedin && (
            <li>
              <a href={settings.linkedin} className="hover:text-lime">
                LinkedIn
              </a>
            </li>
          )}
          {settings?.facebook && (
            <li>
              <a href={settings.facebook} className="hover:text-lime">
                Facebook
              </a>
            </li>
          )}
        </ul>
      </div>
    </footer>
  );
}
