import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";

type ServiceCardData = {
  _id: string;
  title: string | null;
  slug: string | null;
  summary: string | null;
  bullets: string[] | null;
  image: { asset: { _ref: string } | null; alt: string | null } | null;
};

// Tjenestekort: bilde med flat mørk toning (ingen gradient), tittel i lime, tekst nederst.
export function ServiceCards({ services }: { services: ServiceCardData[] }) {
  if (!services.length) {
    return <p className="text-lead">Ingen tjenester er publisert ennå.</p>;
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <li key={service._id}>
          <Link
            href={`/tjenester/${service.slug}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-ink text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {service.image?.asset && (
              <Image
                src={urlFor(service.image).width(900).height(1125).url()}
                alt={service.image.alt ?? ""}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.03]"
              />
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-ink/55" />
            <div className="relative flex h-full flex-col justify-between p-6">
              <h3 className="text-title text-lime">{service.title}</h3>
              <div>
                <p className="line-clamp-3">{service.summary}</p>
                {service.bullets && service.bullets.length > 0 && (
                  <ul className="mt-4 space-y-1 border-t border-white/30 pt-4 text-sm text-white/90">
                    {service.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
