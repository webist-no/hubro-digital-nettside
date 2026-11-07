import type { Metadata } from "next";
import { ArrowLink, ButtonLink } from "@/components/button-link";

export const metadata: Metadata = {
  title: "Siden finnes ikke",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="wrap py-24 md:py-36">
      <p className="mb-6 text-lime-ink">404</p>
      <h1 className="max-w-[18ch] text-display">Vi finner ikke siden du leter etter.</h1>
      <p className="mt-8 max-w-[48ch] text-lead">
        Den kan være flyttet eller slettet. Gå til forsiden, se hva vi tilbyr, eller ta kontakt så hjelper vi deg.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <ButtonLink href="/">Til forsiden</ButtonLink>
        <ArrowLink href="/tjenester">Se tjenestene våre</ArrowLink>
        <ArrowLink href="/snakk-med-oss">Snakk med oss</ArrowLink>
      </div>
    </main>
  );
}
