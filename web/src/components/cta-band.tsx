import { stegaClean } from "next-sanity";
import { ButtonLink } from "./button-link";

// Avslutningsfelt. «dark»: mørkt felt (Vivamedias nyhetsbrevband).
// «lime»: limefarget felt med dyp grønn tekst, sjekkliste og mørk knapp
// (Vivamedias «Vi vill gärna höra ifrån dig»).
export function CtaBand({
  heading = "Vil du finne ut hva som faktisk fungerer?",
  text,
  label = "Snakk med oss",
  href = "/snakk-med-oss",
  tone = "dark",
  checklist,
}: {
  heading?: string | null;
  text?: string | null;
  label?: string | null;
  href?: string | null;
  tone?: string | null;
  checklist?: string[] | null;
}) {
  const lime = stegaClean(tone) === "lime";
  const target = href ?? "/snakk-med-oss";
  const buttonLabel = label ?? "Snakk med oss";

  if (lime) {
    return (
      <section className="bg-lime text-lime-ink">
        <div className="wrap grid gap-10 py-16 md:grid-cols-[1.3fr_1fr] md:gap-16 md:py-24">
          <div>
            <h2 className="max-w-[18ch] text-headline">{heading}</h2>
            {text && <p className="mt-6 max-w-[48ch] text-lead">{text}</p>}
          </div>
          <div className="flex flex-col items-start justify-between gap-8">
            {checklist && checklist.length > 0 && (
              <ul className="space-y-4">
                {checklist.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-paper text-sm"
                    >
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            <ButtonLink href={target} variant="dark">
              {buttonLabel}
            </ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-ink text-white">
      <div className="wrap grid gap-8 py-16 md:grid-cols-[1.6fr_1fr] md:items-end md:py-24">
        <div>
          <h2 className="max-w-[20ch] text-headline">{heading}</h2>
          {text && <p className="mt-6 max-w-[48ch] text-lead text-white/85">{text}</p>}
        </div>
        <div className="md:justify-self-end">
          <ButtonLink href={target}>{buttonLabel}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
