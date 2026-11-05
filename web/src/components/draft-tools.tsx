import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/sanity/live";
import { DisableDraftMode } from "./disable-draft-mode";

// Alt som avhenger av Draft Mode samles her, slik at resten av layouten kan
// forbli statisk. Rendres i en Suspense-grense i layout.tsx.
export async function DraftTools() {
  const { isEnabled } = await draftMode();

  return (
    <>
      <SanityLive includeDrafts={isEnabled} />
      {isEnabled && (
        <>
          <VisualEditing />
          <DisableDraftMode />
        </>
      )}
    </>
  );
}
