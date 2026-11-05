import Image from "next/image";
import Link from "next/link";

// Kort i oversikten og under «Les også». Etter Vivamedias blogg: bilde, liten etikett,
// stor tittel og emner som små piller. Bildet er ferdig beregnet på serveren.
export type ArticleCardData = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  topics: string[];
  publishedAt?: string | null;
  readingMinutes: number;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

const fmt = new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "long", year: "numeric" });

export function formatDate(iso?: string | null) {
  return iso ? fmt.format(new Date(iso)) : null;
}

export function ArticleCard({ a, priority = false }: { a: ArticleCardData; priority?: boolean }) {
  const date = formatDate(a.publishedAt);
  return (
    <article className="group relative">
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-mist">
        {a.imageUrl && (
          <Image
            src={a.imageUrl}
            alt={a.imageAlt ?? ""}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <p className="mt-4 text-ink/70">
        Fagartikkel{date ? ` · ${date}` : ""}
        {a.readingMinutes ? ` · ${a.readingMinutes} min` : ""}
      </p>
      <h3 className="mt-1 text-title">
        {/* Hele kortet er klikkbart via lenken, men bare tittelen leses opp. */}
        <Link
          href={`/fagartikler/${a.slug}`}
          className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        >
          {a.title}
        </Link>
      </h3>
      {a.topics.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {a.topics.map((t) => (
            <li key={t} className="rounded-full border border-ink/60 px-3 py-0.5 text-sm">
              {t}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
