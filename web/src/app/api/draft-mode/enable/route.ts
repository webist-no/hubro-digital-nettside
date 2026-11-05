import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/client";

// Kalles av Presentation-verktøyet i Studio for å slå på forhåndsvisning av utkast.
// Krever SANITY_API_READ_TOKEN (se .env.local).
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});
