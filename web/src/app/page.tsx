import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { PageView, pageMetadata } from "@/components/page-view";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("forside");
}

// Forsiden rendres ved forespørsel (ikke ved bygging), slik at den alltid får ferskt
// innhold fra Sanity. Ved bygging kan Sanity-CDN-en levere utdaterte svar.
async function Forside() {
  await connection();
  return <PageView slug="forside" />;
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <Forside />
    </Suspense>
  );
}
