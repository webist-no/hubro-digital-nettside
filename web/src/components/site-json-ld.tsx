import { siteUrl } from "@/config/features";
import { jsonLd } from "@/lib/seo";
import { getSettings } from "@/sanity/data";

// Strukturerte data om selskapet. Hjelper Google (og AI-søk) å knytte nettstedet til
// riktig virksomhet, adresser og kontaktinfo. Står på alle sider.
export async function SiteJsonLd() {
  const settings = await getSettings();

  const locations = (settings?.offices ?? []).map((o) => ({
    "@type": "Place",
    name: `Hubro Digital ${o.city ?? ""}`.trim(),
    address: {
      "@type": "PostalAddress",
      streetAddress: o.street ?? undefined,
      postalCode: o.postalCode?.match(/\d{4}/)?.[0],
      addressLocality: o.city ?? undefined,
      addressCountry: "NO",
    },
  }));

  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#organisasjon`,
    name: "Hubro Digital",
    url: siteUrl,
    logo: `${siteUrl}/logos/hubro/Logo-Kompakt-Hvit.svg`,
    description:
      "Digitalt markedsføringsbyrå i Drammen og Oslo. Annonsering, SEO, nettsider og sporing som gir flere henvendelser.",
    telephone: settings?.phone ?? undefined,
    email: settings?.email ?? undefined,
    areaServed: { "@type": "Country", name: "Norge" },
    location: locations.length > 0 ? locations : undefined,
    sameAs: [settings?.linkedin, settings?.facebook].filter(Boolean),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}
