import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLink, ButtonLink, Pill } from "@/components/button-link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CtaBand } from "@/components/cta-band";
import { PortableBody } from "@/components/portable-body";
import { Sections, type SectionsInput } from "@/components/sections";
import { ServiceList } from "@/components/service-list";
import {
  cachedSanity,
  getDynamicFetchOptions,
  published,
} from "@/sanity/live";
import { SERVICE_QUERY } from "@/sanity/queries";

export async function generateMetadata(
  props: PageProps<"/tjenester/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const { data } = await cachedSanity({
    query: SERVICE_QUERY,
    params: { slug },
    ...published,
  });
  if (!data) return {};
  return {
    title: data.seoTitle ?? data.title,
    description: data.seoDescription ?? data.summary,
  };
}

export default function ServicePage(props: PageProps<"/tjenester/[slug]">) {
  return (
    <main>
      <Suspense fallback={<div className="wrap py-24">Laster …</div>}>
        <Service params={props.params} />
      </Suspense>
    </main>
  );
}

async function Service({
  params,
}: {
  params: PageProps<"/tjenester/[slug]">["params"];
}) {
  const { slug } = await params;
  const options = await getDynamicFetchOptions();
  const { data: service } = await cachedSanity({
    query: SERVICE_QUERY,
    params: { slug },
    ...options,
  });

  if (!service) notFound();

  const hasBody = Array.isArray(service.body) && service.body.length > 0;
  const hasSections = Boolean(service.sections?.length);
  const endsWithCta = service.sections?.at(-1)?._type === "ctaSection";

  return (
    <>
      <section className="bg-fog">
        <div className="wrap pb-16 pt-10 md:pb-20">
          <Breadcrumbs
            items={[
              { label: "Tjenester", href: "/tjenester" },
              { label: service.title ?? "" },
            ]}
          />
          <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <Pill>Tjeneste</Pill>
              <h1 className="mt-5 text-display">{service.title}</h1>
            </div>
            <div className="md:pt-12">
              <p className="text-lead">{service.summary}</p>
              {service.bullets && service.bullets.length > 0 && (
                <ul className="mt-8 space-y-3">
                  {service.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-lime text-sm text-lime-ink"
                      >
                        ✓
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              <ButtonLink href="/snakk-med-oss" className="mt-8">
                Snakk med oss
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {hasBody && (
        <div className="wrap py-16">
          <div className="max-w-[60ch] text-lg">
            <PortableBody value={service.body!} />
          </div>
        </div>
      )}

      {hasSections && <Sections sections={service.sections as SectionsInput} />}

      <section className="wrap py-20 md:py-28">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="text-headline">Andre tjenester</h2>
          <ArrowLink href="/tjenester">Alle tjenester</ArrowLink>
        </div>
        <Suspense fallback={<p>Laster tjenester …</p>}>
          <ServiceList limit={3} excludeSlug={slug} />
        </Suspense>
      </section>

      {!endsWithCta && <CtaBand />}
    </>
  );
}
