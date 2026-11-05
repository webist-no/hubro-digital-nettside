import { getServices } from "@/sanity/data";
import { ServiceCards } from "./service-cards";

// «Andre tjenester»: henter alle tjenester og utelater den som vises nå.
export async function ServiceList({
  limit,
  excludeSlug,
}: {
  limit?: number;
  excludeSlug?: string;
}) {
  const all = await getServices();
  const filtered = excludeSlug ? all.filter((s) => s.slug !== excludeSlug) : all;
  return <ServiceCards services={limit ? filtered.slice(0, limit) : filtered} />;
}
