import { cachedSanity, published } from "./live";
import { SERVICES_QUERY, SETTINGS_QUERY } from "./queries";

// Delt innhold hentes via cachedSanity (den ene 'use cache'-grensen).
export async function getServices() {
  const { data } = await cachedSanity({ query: SERVICES_QUERY, ...published });
  return data;
}

export async function getSettings() {
  const { data } = await cachedSanity({ query: SETTINGS_QUERY, ...published });
  return data;
}
