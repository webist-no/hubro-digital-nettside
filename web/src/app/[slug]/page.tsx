import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { hiddenPageSlugs } from "@/config/features";
import { PageView, pageMetadata } from "@/components/page-view";

// Generisk side: pakker, prosess, resultater, snakk-med-oss og alle andre sider fra Sanity.
export async function generateMetadata(
  props: PageProps<"/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  if (hiddenPageSlugs.includes(slug)) return {};
  return pageMetadata(slug);
}

export default function Page(props: PageProps<"/[slug]">) {
  return (
    <Suspense fallback={<div className="wrap py-24">Laster …</div>}>
      <Resolved params={props.params} />
    </Suspense>
  );
}

async function Resolved({ params }: { params: PageProps<"/[slug]">["params"] }) {
  const { slug } = await params;
  if (hiddenPageSlugs.includes(slug)) notFound();
  return <PageView slug={slug} />;
}
