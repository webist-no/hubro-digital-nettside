import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { casesEnabled } from "@/config/features";
import { ArrowLink, Pill } from "@/components/button-link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CtaBand } from "@/components/cta-band";
import { PortableBody } from "@/components/portable-body";
import {
  cachedSanity,
  getDynamicFetchOptions,
  published,
} from "@/sanity/live";
import { CASE_QUERY } from "@/sanity/queries";

export async function generateMetadata(
  props: PageProps<"/case/[slug]">,
): Promise<Metadata> {
  if (!casesEnabled) return {};
  const { slug } = await props.params;
  const { data } = await cachedSanity({ query: CASE_QUERY, params: { slug }, ...published });
  if (!data) return {};
  return {
    title: data.seoTitle ?? data.title,
    description: data.seoDescription ?? data.summary,
  };
}

export default function CasePage(props: PageProps<"/case/[slug]">) {
  return (
    <main>
      <Suspense fallback={<div className="wrap py-24">Laster …</div>}>
        <Case params={props.params} />
      </Suspense>
      <CtaBand
        heading="Vil du se lignende resultater?"
        text="La oss ta en uforpliktende samtale om hvordan vi kan hjelpe dere å få kontroll og vekst."
      />
    </main>
  );
}

async function Case({ params }: { params: PageProps<"/case/[slug]">["params"] }) {
  if (!casesEnabled) notFound();
  const { slug } = await params;
  const options = await getDynamicFetchOptions();
  const { data: c } = await cachedSanity({ query: CASE_QUERY, params: { slug }, ...options });
  if (!c) notFound();

  const hasBody = Array.isArray(c.body) && c.body.length > 0;

  return (
    <article>
      <div className="wrap pb-16 pt-10">
        <Breadcrumbs
          items={[{ label: "Resultater", href: "/resultater" }, { label: c.client ?? "" }]}
        />
        <div className="mt-14 grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <div>
            <Pill>Kundecase</Pill>
            <h1 className="mt-6 text-display">{c.title}</h1>
          </div>
          <div className="md:pt-12">
            <p className="text-lead">{c.subtitle ?? c.summary}</p>
            {c.tags && c.tags.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <li key={t}>
                    <Pill>{t}</Pill>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {c.metrics && c.metrics.length > 0 && (
        <section className="bg-ink text-white">
          <dl className="wrap grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-4 md:py-20">
            {c.metrics.map((m) => (
              <div key={m._key}>
                <dd className="font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-none tracking-[-0.04em] text-lime">
                  {m.value}
                </dd>
                <dt className="mt-3 text-white/80">{m.label}</dt>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="wrap grid gap-12 py-16 md:grid-cols-[1fr_2fr] md:gap-16 md:py-24">
        <aside>
          {c.facts && c.facts.length > 0 ? (
            <dl className="space-y-5">
              {c.facts.map((f) => (
                <div key={f._key} className="border-t border-ink/25 pt-4">
                  <dt className="text-sm text-ink/70">{f.label}</dt>
                  <dd className="font-display text-lg font-semibold tracking-[-0.04em]">{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="border-t border-ink/25 pt-4">
              <p className="text-sm text-ink/70">Kunde</p>
              <p className="font-display text-lg font-semibold tracking-[-0.04em]">{c.client}</p>
            </div>
          )}
          <div className="mt-8">
            <ArrowLink href="/resultater">Alle case</ArrowLink>
          </div>
        </aside>
        <div className="max-w-[60ch] text-lg">
          {hasBody ? (
            <PortableBody value={c.body!} />
          ) : (
            <p>{c.summary}</p>
          )}
          {c.quote?.text && (
            <figure className="mt-14 rounded-card bg-mist p-8">
              <blockquote className="text-xl leading-snug">{c.quote.text}</blockquote>
              <figcaption className="mt-5">
                <p className="font-display text-lg font-semibold tracking-[-0.04em]">{c.quote.author}</p>
                <p className="text-ink/70">{c.quote.role}</p>
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </article>
  );
}
