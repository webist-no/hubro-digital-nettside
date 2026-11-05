import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

// Slår av forhåndsvisning og sender brukeren tilbake til forsiden.
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  return NextResponse.redirect(new URL("/", request.url));
}
