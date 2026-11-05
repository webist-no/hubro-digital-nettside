import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArticleBody, tableOfContents } from "@/components/article-body";
import { ArticleCard, formatDate } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowLink, ButtonLink } from "@/components/button-link";
import { CtaBand } from "@/components/cta-band";
import { toCard } from "@/sanity/articles";
import { urlFor } from "@/sanity/image";
import { cachedSanity, getDynamicFetchOptions, published } from "@/sanity/live";
import { ARTICLE_QUERY } from "@/sanity/queries";

export async function generateMetadata(props: PageProps<"/fagartikler/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { data } = await cachedSanity({ query: ARTICLE_QUERY, params: { slug }, ...published });
  if (!data) return {};
  const image = data.heroImage?.asset ? urlFor(data.heroImage).width(1200).height(630).url() : undefined;
  return {
    title: data.seoTitle ?? data.title,
    description: data.seoDescription ?? data.excerpt,
    openGraph: {
      type: "article",
      title: data.seoTitle ?? data.title ?? undefined,
      description: data.seoDescription ?? data.excerpt ?? undefined,
      publishedTime: data.publishedAt ?? undefined,
      images: image ? [image] : undefined,
    },
  };
}

export default function ArticlePage(props: PageProps<"/fagartikler/[slug]">) {
  return (
    <main>
      <Suspense fallback={<div className="wrap py-24">Laster …</div>}>
        <Article params={props.params} />
      </Suspense>
    </main>
  );
}

async function Article({ params }: { params: PageProps<"/fagartikler/[slug]">["params"] }) {
  const { slug } = await params;
  const options = await getDynamicFetchOptions();
  const { data: a } = await cachedSanity({ query: ARTICLE_QUERY, params: { slug }, ...options });
  if (!a) notFound();

  const toc = tableOfContents(a.body);
  const date = formatDate(a.publishedAt);
  const minutes = Math.max(1, Math.round(a.readingMinutes ?? 0));
  const topics: string[] = (a.topics ?? []).filter(Boolean);
  const keyPoints: string[] = (a.keyPoints ?? []).filter(Boolean);
  const heroUrl = a.heroImage?.asset ? urlFor(a.heroImage).width(1800).height(1000).url() : null;
  const authorPhoto = a.author?.photo?.asset ? urlFor(a.author.photo).width(160).height(160).url() : null;
  const related = (a.related ?? []).map(toCard);

  // Strukturerte data hjelper Google og AI-søk å forstå hvem som har skrevet hva og når.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.publishedAt,
    author: a.author?.name ? { "@type": "Person", name: a.author.name } : undefined,
    publisher: { "@type": "Organization", name: "Hubro Digital" },
    image: heroUrl ?? undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article className="bg-fog">
        <header className="wrap pb-12 pt-10 md:pb-16">
          <Breadcrumbs items={[{ label: "Fagartikler", href: "/fagartikler" }, { label: a.title ?? "" }]} />

          {topics.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2">
              {topics.map((t) => (
                <li key={t} className="rounded-full border border-ink/60 px-3 py-0.5 text-sm">
                  {t}
                </li>
              ))}
            </ul>
          )}
          <h1 className="mt-6 max-w-[22ch] text-display">{a.title}</h1>

          <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[1.4fr_1fr] md:gap-16">
            <p className="max-w-[48ch] text-lead">{a.excerpt}</p>
            <div className="flex items-center gap-4 md:justify-self-end">
              {authorPhoto && (
                <Image
                  src={authorPhoto}
                  alt=""
                  width={64}
                  height={64}
                  className="size-16 shrink-0 rounded-full object-cover"
                />
              )}
              <div>
                {a.author?.name && <p className="font-display text-lg font-semibold tracking-[-0.04em]">{a.author.name}</p>}
                <p className="text-ink/70">
                  {[date, `${minutes} min lesing`].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </header>

        {heroUrl && (
          <div className="wrap">
            <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-mist md:aspect-[2/1]">
              <Image
                src={heroUrl}
                alt={a.heroImage?.alt ?? ""}
                fill
                priority
                sizes="(min-width: 1400px) 1284px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="wrap grid gap-12 py-14 md:py-20 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            {toc.length > 1 && (
              <nav aria-label="Innhold i artikkelen">
                <p className="mb-4 border-t border-ink/60 pt-4 font-display text-lg font-semibold tracking-[-0.04em]">
                  I denne artikkelen
                </p>
                <ol className="space-y-3 text-[0.95rem]">
                  {toc.map((h, i) => (
                    <li key={h.id} className="flex gap-3">
                      <span aria-hidden="true" className="text-lime-ink">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <a href={`#${h.id}`} className="underline-offset-4 hover:underline">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </aside>

          <div className="max-w-[44rem]">
            {keyPoints.length > 0 && (
              <section aria-label="Kort fortalt" className="mb-14 rounded-card bg-lime p-7 text-lime-ink md:p-9">
                <h2 className="mb-5 text-title">Kort fortalt</h2>
                <ul className="space-y-3 text-lg">
                  {keyPoints.map((k) => (
                    <li key={k} className="flex gap-3">
                      <span aria-hidden="true" className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-paper text-sm">
                        ✓
                      </span>
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <ArticleBody value={a.body} />

            {a.author?.name && (
              <aside className="mt-16 flex flex-col gap-6 rounded-card bg-paper p-7 sm:flex-row md:p-9">
                {authorPhoto && (
                  <Image src={authorPhoto} alt="" width={96} height={96} className="size-24 shrink-0 rounded-full object-cover" />
                )}
                <div>
                  <p className="text-sm text-ink/70">Skrevet av</p>
                  <p className="font-display text-xl font-semibold tracking-[-0.04em]">{a.author.name}</p>
                  {a.author.role && <p className="text-ink/70">{a.author.role}</p>}
                  {a.author.bio && <p className="mt-3 max-w-[52ch]">{a.author.bio}</p>}
                  <div className="mt-5">
                    <ButtonLink href="/snakk-med-oss">Book 30 minutter</ButtonLink>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>

        {a.services && a.services.length > 0 && (
          <section className="wrap pb-16 md:pb-24" aria-label="Relaterte tjenester">
            <h2 className="mb-6 text-title">Hvordan vi kan hjelpe</h2>
            <ul className="grid gap-5 md:grid-cols-3">
              {a.services.map((s) => (
                <li key={s._id} className="rounded-card bg-paper p-7">
                  <h3 className="text-title">{s.title}</h3>
                  {s.summary && <p className="mt-3 text-ink/80">{s.summary}</p>}
                  <div className="mt-5">
                    <ArrowLink href={`/tjenester/${s.slug}`}>Les mer</ArrowLink>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className="wrap pb-20 md:pb-28" aria-label="Les også">
            <div className="mb-8 flex items-end justify-between gap-6">
              <h2 className="text-subhead">Les også</h2>
              <ArrowLink href="/fagartikler">Alle fagartikler</ArrowLink>
            </div>
            <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r._id}>
                  <ArticleCard a={r} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <CtaBand
        tone="lime"
        heading="Vil du ha hjelp med dette?"
        text="Fortell oss hva du sliter med, så gir vi deg en ærlig vurdering. Helt uforpliktende."
        checklist={["30 minutter, uten binding", "Konkrete råd, uansett om vi jobber sammen", "Svar innen én virkedag"]}
        label="Book 30 minutter"
      />
    </>
  );
}
