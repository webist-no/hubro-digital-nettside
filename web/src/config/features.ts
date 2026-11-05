// Funksjoner som kan skrus av og på uten å slette noe innhold.
//
// Resultater (/resultater) og kundecase (/case/...) er skrudd av inntil vi har gode nok
// referanser. Innholdet ligger fortsatt i Sanity. Slå på igjen ved å sette
// NEXT_PUBLIC_ENABLE_CASES=true (og bygg på nytt).
export const casesEnabled = process.env.NEXT_PUBLIC_ENABLE_CASES === "true";

// Sider fra Sanity som skal gi 404 mens de er skrudd av.
export const hiddenPageSlugs: string[] = casesEnabled ? [] : ["resultater"];

// Indeksering: avslått som standard. Søkemotorer får «noindex» (metadata, robots.txt og
// X-Robots-Tag). Sett ALLOW_INDEXING=true når nettsiden skal bli synlig i Google.
export const allowIndexing = process.env.ALLOW_INDEXING === "true";
