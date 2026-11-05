import Link from "next/link";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Brødsmulesti" className="text-sm">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="text-ink/60 hover:underline">
            Hjem
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-ink/30">
              ·
            </span>
            {item.href ? (
              <Link href={item.href} className="text-ink/60 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
