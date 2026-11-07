import type { MetadataRoute } from "next";
import { casesEnabled, hiddenPageSlugs, siteUrl } from "@/config/features";
import { cachedSanity, published } from "@/sanity/live";
import { SITEMAP_QUERY } from "@/sanity/queries";

// Sitemap bygges fra Sanity: nye sider og artikler kommer med automatisk, og skjulte sider
// (Resultater/Case mens de er av, og sider merket «Skjul for søkemotorer») holdes utenfor.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await cachedSanity({ query: SITEMAP_QUERY, ...published });

  const entries: MetadataRoute.Sitemap = [];
  let latestArticle: Date | undefined;

  for (const doc of data ?? []) {
    if (!doc.slug) continue;
    const lastModified = doc.updatedAt ? new Date(doc.updatedAt) : undefined;

    switch (doc._type) {
      case "page":
        if (hiddenPageSlugs.includes(doc.slug)) break;
        entries.push({
          url: doc.slug === "forside" ? siteUrl : `${siteUrl}/${doc.slug}`,
          lastModified,
          changeFrequency: "monthly",
          priority: doc.slug === "forside" ? 1 : 0.8,
        });
        break;
      case "service":
        entries.push({ url: `${siteUrl}/tjenester/${doc.slug}`, lastModified, changeFrequency: "monthly", priority: 0.8 });
        break;
      case "article":
        entries.push({ url: `${siteUrl}/fagartikler/${doc.slug}`, lastModified, changeFrequency: "monthly", priority: 0.6 });
        if (lastModified && (!latestArticle || lastModified > latestArticle)) latestArticle = lastModified;
        break;
      case "case":
        if (!casesEnabled) break;
        entries.push({ url: `${siteUrl}/case/${doc.slug}`, lastModified, changeFrequency: "yearly", priority: 0.5 });
        break;
    }
  }

  entries.push({ url: `${siteUrl}/fagartikler`, lastModified: latestArticle, changeFrequency: "weekly", priority: 0.7 });
  return entries;
}
