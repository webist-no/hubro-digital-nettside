import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // Permanente omdirigeringer fra adressene på den gamle nettsiden (WordPress) til de nye.
  // Uten disse mister vi Google-plasseringene og gamle lenker havner på 404.
  async redirects() {
    // Gamle adresser endte på «/». Next fjerner den først (308) og sender så videre hit.
    const to = (source: string, destination: string) => ({ source, destination, permanent: true });
    return [
      to("/vare-tjenester", "/tjenester"),
      to("/sokemotormarkedsforing-sem", "/tjenester/betalt-synlighet"),
      to("/sokemotoroptimalisering-seo", "/tjenester/sokesynlighet"),
      to("/nettsider", "/tjenester/nettsider"),
      to("/analyse-og-innsikt", "/tjenester/maling-og-konvertering"),
      to("/ga4-gtm-og-cmp", "/tjenester/maling-og-konvertering"),
      to("/konverteringsoptimalisering-cro", "/tjenester/maling-og-konvertering"),
      to("/innholdsmarkedsforing", "/tjenester/innholdsmarkedsforing"),
      to("/some", "/tjenester/some"),
      to("/markedsstrategi", "/tjenester/markedsstrategi"),
      to("/digital-helsesjekk", "/tjenester/digital-helsesjekk"),
      to("/om-hubro", "/om-oss"),
      to("/kontakt", "/snakk-med-oss"),
    ];
  },
  // Ekstra sikring mot indeksering (gjelder også filer og bilder) til ALLOW_INDEXING=true.
  async headers() {
    if (process.env.ALLOW_INDEXING === "true") return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
