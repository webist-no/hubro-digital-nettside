import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  cachedSanity,
  getDynamicFetchOptions,
  published,
} from "@/sanity/live";
import { seoMetadata } from "@/lib/seo";
import { PAGE_QUERY } from "@/sanity/queries";
import { Hero } from "./hero";
import { Sections, type SectionsInput } from "./sections";

// Metadata viser alltid publisert versjon, og uten stega-tegn i <head>.
function getPublishedPage(slug: string) {
  return cachedSanity({ query: PAGE_QUERY, params: { slug }, ...published });
}

export async function pageMetadata(slug: string): Promise<Metadata> {
  const { data } = await getPublishedPage(slug);
  if (!data) return {};
  const title = data.seoTitle ?? data.title ?? undefined;
  const isHome = slug === "forside";
  return seoMetadata({
    title: isHome ? (title ?? "Hubro Digital") : title,
    // «Forside» skal bruke standardtittelen, ikke «Forside | Hubro Digital».
    absoluteTitle: isHome,
    description: data.seoDescription ?? data.intro,
    path: isHome ? "/" : `/${slug}`,
    image: data.seoImage,
    fallbackImage: data.heroImage,
    noIndex: data.noIndex,
  });
}

// Rendrer en Side fra Sanity: toppseksjon + seksjoner i den rekkefølgen redaktøren har satt dem.
export async function PageView({ slug }: { slug: string }) {
  // Publisert innhold for besøkende, utkast med klikk-for-å-redigere i Draft Mode.
  const options = await getDynamicFetchOptions();
  const { data: page } = await cachedSanity({
    query: PAGE_QUERY,
    params: { slug },
    ...options,
  });
  if (!page) notFound();

  return (
    <main>
      <Hero
        eyebrow={page.eyebrow}
        heading={page.heading ?? page.title}
        headingAccent={page.headingAccent}
        intro={page.intro}
        badges={page.badges}
        primaryCta={page.primaryCta}
        secondaryCta={page.secondaryCta}
        heroImage={page.heroImage}
      />
      <Sections sections={page.sections as SectionsInput} />
    </main>
  );
}
