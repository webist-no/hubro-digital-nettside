import Image from "next/image";
import { PortableText, stegaClean, type PortableTextBlock } from "next-sanity";
import type { ReactNode } from "react";

// Brødtekst for fagartikler. Egne stiler for overskrifter (med ankere til innholdslisten),
// sitat, bilde med bildetekst og utheving (tips/advarsel).

type Block = { _type: string; style?: string; children?: { text?: string }[] };

const textOf = (b: Block) => (b.children ?? []).map((c) => c.text ?? "").join("");

export function headingId(text: string) {
  return stegaClean(text)
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Innholdsliste: alle h2-overskriftene, med unike ankre.
export function tableOfContents(body: unknown): { id: string; text: string }[] {
  if (!Array.isArray(body)) return [];
  const seen = new Map<string, number>();
  return (body as Block[])
    .filter((b) => b._type === "block" && b.style === "h2")
    .map((b) => {
      const text = stegaClean(textOf(b));
      const base = headingId(text) || "avsnitt";
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      return { id: n ? `${base}-${n + 1}` : base, text };
    })
    .filter((h) => h.text);
}

const calloutStyle: Record<string, { label: string; box: string }> = {
  tip: { label: "Tips", box: "bg-lime text-lime-ink" },
  warning: { label: "Pass opp", box: "bg-ink text-white" },
  note: { label: "Merk deg", box: "bg-paper text-ink" },
};

export function ArticleBody({ value }: { value: unknown }) {
  const toc = tableOfContents(value);
  let h2Index = 0;

  return (
    <div className="text-lg leading-relaxed">
      <PortableText
        value={value as PortableTextBlock[]}
        components={{
          block: {
            normal: ({ children }) => <p className="mb-6">{children}</p>,
            h2: ({ children }: { children?: ReactNode }) => {
              const id = toc[h2Index++]?.id;
              return (
                <h2 id={id} className="mb-5 mt-14 scroll-mt-8 text-subhead first:mt-0">
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => <h3 className="mb-3 mt-9 text-title">{children}</h3>,
            blockquote: ({ children }) => (
              <blockquote className="my-10 border-l-4 border-lime-ink pl-6 font-display text-2xl leading-snug tracking-[-0.03em] md:text-3xl">
                {children}
              </blockquote>
            ),
          },
          list: {
            bullet: ({ children }) => <ul className="mb-6 list-disc space-y-2 pl-6 marker:text-lime-ink">{children}</ul>,
            number: ({ children }) => <ol className="mb-6 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-lime-ink">{children}</ol>,
          },
          marks: {
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            link: ({ value: v, children }) => {
              const href = stegaClean(v?.href ?? "#");
              const external = /^https?:\/\//.test(href);
              return (
                <a
                  href={href}
                  className="underline decoration-lime-ink decoration-2 underline-offset-4 hover:bg-lime"
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {children}
                </a>
              );
            },
          },
          types: {
            bodyImage: ({ value: v }) =>
              v?.url ? (
                <figure className="my-10">
                  <div className="overflow-hidden rounded-card bg-mist">
                    <Image
                      src={v.url}
                      alt={v.alt ?? ""}
                      width={v.dimensions?.width ?? 1600}
                      height={v.dimensions?.height ?? 900}
                      sizes="(min-width: 1024px) 800px, 100vw"
                      className="h-auto w-full"
                    />
                  </div>
                  {v.caption && <figcaption className="mt-3 text-sm text-ink/70">{v.caption}</figcaption>}
                </figure>
              ) : null,
            callout: ({ value: v }) => {
              const tone = calloutStyle[stegaClean(v?.tone ?? "tip")] ?? calloutStyle.tip;
              return (
                <aside className={`my-10 rounded-card p-6 md:p-8 ${tone.box}`}>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em]">{v?.title || tone.label}</p>
                  {v?.text && <p className="text-lg">{v.text}</p>}
                </aside>
              );
            },
          },
        }}
      />
    </div>
  );
}
