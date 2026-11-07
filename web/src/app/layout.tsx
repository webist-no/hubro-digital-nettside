import type { Metadata } from "next";
import { allowIndexing, siteUrl } from "@/config/features";
import { DM_Sans, Schibsted_Grotesk } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { DraftTools } from "@/components/draft-tools";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SiteJsonLd } from "@/components/site-json-ld";

// Brødtekst: DM Sans (som Vivamedia). Overskrifter: Schibsted Grotesk som
// åpen erstatning for den kommersielle Neue Faktum.
const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Schibsted_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  // Grunnadressen for alle kanoniske lenker og delingsbilder.
  metadataBase: new URL(siteUrl),
  // «noindex» til ALLOW_INDEXING=true er satt (se config/features.ts).
  robots: allowIndexing ? undefined : { index: false, follow: false, nocache: true },
  title: { default: "Hubro Digital", template: "%s | Hubro Digital" },
  description:
    "Digitalt markedsføringsbyrå i Drammen og Oslo. Vi hjelper norske bedrifter å få mer igjen for markedsføringsbudsjettet.",
  openGraph: { type: "website", locale: "nb_NO", siteName: "Hubro Digital" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nb"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        <Suspense fallback={null}>
          <SiteJsonLd />
        </Suspense>
        <Suspense fallback={null}>
          <DraftTools />
        </Suspense>
      </body>
    </html>
  );
}
