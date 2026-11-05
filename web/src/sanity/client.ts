import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-11-05", // keep hard-coded
  useCdn: true, // fast, cached reads of published content
  perspective: "published",
  // Trengs for klikk-for-å-redigere: markeringene i forhåndsvisningen lenker
  // tilbake til Studio. Sett NEXT_PUBLIC_SANITY_STUDIO_URL til Studio-adressen
  // når den ligger på nett (f.eks. https://hubro.sanity.studio).
  stega: {
    studioUrl:
      process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "http://localhost:3333",
  },
});
