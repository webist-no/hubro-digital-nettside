"use client";

import { useState } from "react";
import { ArticleCard, type ArticleCardData } from "./article-card";

// Emnefilter og kortgrid. Alle artikler rendres fra serveren, så siden fungerer
// (og indekseres) uten JavaScript. Filteret skjuler bare kort.
export function ArticleGrid({ articles }: { articles: ArticleCardData[] }) {
  const topics = [...new Set(articles.flatMap((a) => a.topics))].sort((a, b) => a.localeCompare(b, "nb"));
  const [active, setActive] = useState<string | null>(null);

  const pill =
    "rounded-full border px-4 py-1.5 text-base motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

  return (
    <>
      {topics.length > 0 && (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrer på emne">
          <span className="mr-1 text-ink/70">Emne:</span>
          <button
            type="button"
            aria-pressed={active === null}
            onClick={() => setActive(null)}
            className={`${pill} ${active === null ? "border-ink bg-ink text-white" : "border-ink/60 hover:bg-paper"}`}
          >
            Alle
          </button>
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={active === t}
              onClick={() => setActive(active === t ? null : t)}
              className={`${pill} ${active === t ? "border-ink bg-ink text-white" : "border-ink/60 hover:bg-paper"}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <ul className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {articles.map((a, i) => (
          <li key={a._id} hidden={active !== null && !a.topics.includes(active)}>
            <ArticleCard a={a} priority={i < 3} />
          </li>
        ))}
      </ul>
    </>
  );
}
