import type { ARTICLES_QUERY_RESULT } from "../../sanity.types";
import type { ArticleCardData } from "@/components/article-card";
import { urlFor } from "./image";

// Gjør et artikkelkort fra Sanity om til det kortkomponenten trenger (inkl. ferdig bilde-URL).
type CardSource = ARTICLES_QUERY_RESULT[number];

export function toCard(a: CardSource): ArticleCardData {
  return {
    _id: a._id,
    title: a.title ?? "",
    slug: a.slug ?? "",
    excerpt: a.excerpt,
    topics: (a.topics ?? []).filter((t): t is string => Boolean(t)),
    publishedAt: a.publishedAt,
    readingMinutes: Math.max(1, Math.round(a.readingMinutes ?? 0)),
    imageUrl: a.heroImage?.asset ? urlFor(a.heroImage).width(900).height(675).url() : null,
    imageAlt: a.heroImage?.alt ?? null,
  };
}
