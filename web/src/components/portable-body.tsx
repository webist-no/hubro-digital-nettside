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
