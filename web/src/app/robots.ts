import type { MetadataRoute } from "next";
import { allowIndexing } from "@/config/features";

// Stenger alle søkemotorer ute til ALLOW_INDEXING=true er satt.
export default function robots(): MetadataRoute.Robots {
  return allowIndexing
    ? { rules: { userAgent: "*", allow: "/" } }
    : { rules: { userAgent: "*", disallow: "/" } };
}
