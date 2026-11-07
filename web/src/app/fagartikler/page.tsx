import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { ArticleGrid } from "@/components/article-grid";
import { CtaBand } from "@/components/cta-band";
import { seoMetadata } from "@/lib/seo";
import { cachedSanity, getDynamicFetchOptions } from "@/sanity/live";
import { toCard } from "@/sanity/articles";
import { ARTICLES_QUERY } from "@/sanity/queries";

export const metadata: Metadata = seoMetadata({
  title: "Fagartikler om digital markedsføring",
  description:
    "Fagartikler om annonsering, SEO, sporing og nettsider, skrevet på vanlig norsk av rådgiverne i Hubro Digital.",
  path: "/fagartikler",
});

// Rendres ved forespørsel, slik at nye artikler dukker opp med en gang de publiseres.
async function Articles() {
  await connection();
  const options = await getDynamicFetchOptions();
  const { data } = await cachedSanity({ query: ARTICLES_QUERY, ...options });
  const cards = (data ?? []).map(toCard);

  if (cards.length === 0) {
    return <p className="text-lead text-ink/80">Vi jobber med de første artiklene. Kom tilbake snart.</p>;
  }
  return <ArticleGrid articles={cards} />;
}

export default function FagartiklerPage() {
  return (
    <main>
      <div className="bg-fog">
        <div className="wrap pb-20 pt-14 md:pb-28 md:pt-20">
          <h1 className="text-display">Fagartikler</h1>
          <p className="mt-6 max-w-[52ch] text-lead">
            Det vi lærer i hverdagen, forklart på vanlig norsk. Praktiske råd om annonsering, SEO, sporing og
            nettsider, uten fagsnakk.
          </p>
          <div className="mt-12 md:mt-16">
            <Suspense fallback={<p className="text-ink/70">Laster artikler …</p>}>
              <Articles />
            </Suspense>
          </div>
        </div>
      </div>
      <CtaBand
        tone="lime"
        heading="Lurer du på noe konkret?"
        text="Fortell oss hva du sliter med, så gir vi deg en ærlig vurdering. Helt uforpliktende."
        label="Book 30 minutter"
      />
    </main>
  );
}
