"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

// Knapp for å gå ut av forhåndsvisning. Skjules inne i Studio (Presentation),
// der Studio selv styrer forhåndsvisningen. Hooken gir null mens den sjekker.
export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();
  if (isPresentationTool !== false) return null;

  return (
    // Vanlig <a> med vilje: ruten setter en cookie og omdirigerer, så den må lastes som en hel side.
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-50 rounded-full bg-ink px-5 py-2.5 text-sm text-white shadow-lg"
    >
      Avslutt forhåndsvisning
    </a>
  );
}
