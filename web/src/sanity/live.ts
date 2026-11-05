import { cookies, draftMode } from "next/headers";
import {
  defineLive,
  resolvePerspectiveFromCookies,
  type LivePerspective,
  type StrictDefinedFetchType,
} from "next-sanity/live";
import { client } from "./client";

// Lesetoken fra Sanity (manage.sanity.io → API → Tokens, rolle «Viewer»).
// Brukes bare i Draft Mode, slik at redaktører kan forhåndsvise utkast.
// Uten token fungerer nettsiden som før, men uten visuell redigering.
const token = process.env.SANITY_API_READ_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
});

// The app's one shared 'use cache' boundary. `sanityFetch` calls
// cacheTag/cacheLife internally but doesn't create the boundary itself, so
// every fetch goes through this wrapper instead of calling sanityFetch directly.
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  "use cache";
  return sanityFetch(options);
};

// Options for public, published-content fetches. Brukes av metadata og delt
// innhold (header/footer), som alltid viser publisert versjon.
export const published = { perspective: "published", stega: false } as const;

export interface DynamicFetchOptions {
  perspective: LivePerspective;
  // `boolean` (ikke literal) fordi stega er på i Draft Mode.
  stega: boolean;
}

// Velger publisert eller utkast per forespørsel. Må kalles utenfor 'use cache':
// resultatet sendes som argumenter til cachedSanity, så publiserte og
// utkast-svar får hver sin cache-nøkkel.
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const { isEnabled: isDraftMode } = await draftMode();
  if (!isDraftMode) return { ...published };

  const perspective = await resolvePerspectiveFromCookies({
    cookies: await cookies(),
  });
  return { perspective: perspective ?? "drafts", stega: true };
}
