import type { Metadata } from "next";
import { allowIndexing } from "@/config/features";
import { urlFor } from "@/sanity/image";

type ImageSource = { asset?: { _ref?: string } | null } | null | undefined;

type SeoInput = {
  /** Sidetittel uten «| Hubro Digital» (malen i layout.tsx legger den til). */
  title?: string | null;
  /** Bruk true for forsiden, som skal ha tittelen helt uten mal. */
  absoluteTitle?: boolean;
  description?: string | null;
  /** Adressen på nettstedet, f.eks. «/tjenester/nettsider». */
  path: string;
  /** Delingsbilde fra Sanity (egen SEO-bilde, ellers sidens bilde). */
  image?: ImageSource;
  fallbackImage?: ImageSource;
  noIndex?: boolean | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
};

// Én felles funksjon gir alle sider samme oppsett: tittel, beskrivelse, kanonisk adresse,
// Open Graph (LinkedIn/Facebook) og Twitter-kort. Uten eget bilde brukes
// standardbildet fra opengraph-image.tsx.
export function seoMetadata({
  title,
  absoluteTitle,
  description,
  path,
  image,
  fallbackImage,
  noIndex,
  type = "website",
  publishedTime,
  modifiedTime,
}: SeoInput): Metadata {
  const source = image?.asset ? image : fallbackImage?.asset ? fallbackImage : null;
  // Uten eget bilde brukes standardbildet. Når en side setter egen openGraph, erstatter den
  // filbaserte bildet fra opengraph-image.tsx, så adressen må oppgis eksplisitt her.
  const ogImage = [
    source
      ? { url: urlFor(source as Parameters<typeof urlFor>[0]).width(1200).height(630).fit("crop").url(), width: 1200, height: 630 }
      : { url: "/opengraph-image", width: 1200, height: 630, alt: "Hubro Digital" },
  ];

  return {
    title: absoluteTitle && title ? { absolute: title } : (title ?? undefined),
    description: description ?? undefined,
    alternates: { canonical: path },
    // «Skjul for søkemotorer» i Studio gir noindex også når nettstedet ellers er åpent.
    ...(noIndex && allowIndexing ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type,
      locale: "nb_NO",
      siteName: "Hubro Digital",
      url: path,
      title: title ?? undefined,
      description: description ?? undefined,
      images: ogImage,
      ...(type === "article"
        ? { publishedTime: publishedTime ?? undefined, modifiedTime: modifiedTime ?? undefined }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? undefined,
      description: description ?? undefined,
      images: ogImage.map((i) => i.url),
    },
  };
}

// Skriver JSON-LD trygt inn i en <script>-tagg (hindrer at «</script>» i teksten bryter siden).
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
