import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

// Passordbeskyttelse for hele nettsiden (HTTP Basic-innlogging), uavhengig av hvor
// siden hostes. Slås på ved å sette SITE_PASSWORD. Uten den er siden åpen.
// Brukernavnet kan være hva som helst; bare passordet sjekkes.
//
// Forhåndsvisning fra Studio (Draft Mode) slås på via /api/draft-mode, som har sin egen
// signerte sjekk, og slippes derfor igjennom uten passord.

const sha = (v: string) => createHash("sha256").update(v).digest();

function passwordOk(header: string | null, password: string) {
  if (!header?.startsWith("Basic ")) return false;
  try {
    const decoded = atob(header.slice(6));
    const given = decoded.slice(decoded.indexOf(":") + 1);
    return timingSafeEqual(sha(given), sha(password));
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return NextResponse.next();

  if (passwordOk(request.headers.get("authorization"), password)) {
    return NextResponse.next();
  }

  return new NextResponse("Passord kreves.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Hubro Digital", charset="UTF-8"',
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: ["/((?!api/draft-mode).*)"],
};
