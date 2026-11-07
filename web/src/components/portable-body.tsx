import { PortableText, type PortableTextBlock } from "next-sanity";
import type { Service } from "../../sanity.types";

// Tekststiler tilpasset designsystemet: tette overskrifter, lesbar brødtekst.
// TypeGen gjør `children` valgfritt; Sanity leverer det alltid på block-typer,
// så typeavviket tas her, ett sted.
export function PortableBody({ value }: { value: NonNullable<Service["body"]> }) {
  return (
    <PortableText
      value={value as PortableTextBlock[]}
      components={{
        block: {
          normal: ({ children }) => <p className="mb-5 last:mb-0">{children}</p>,
          h2: ({ children }) => (
            <h2 className="mb-4 mt-12 text-title first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 mt-8 text-xl first:mt-0">{children}</h3>
          ),
        },
        marks: {
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          link: ({ value, children }) => {
            const href: string = value?.href ?? "#";
            const external = /^https?:\/\//.test(href);
            return (
              <a
                href={href}
                className="underline underline-offset-4 hover:text-lime-ink"
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {children}
              </a>
            );
          },
        },
        list: {
          bullet: ({ children }) => (
            <ul className="mb-5 list-disc space-y-2 pl-6">{children}</ul>
          ),
          number: ({ children }) => (
            <ol className="mb-5 list-decimal space-y-2 pl-6">{children}</ol>
          ),
        },
      }}
    />
  );
}
