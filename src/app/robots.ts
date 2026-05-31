import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://misericordiadigello.it";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio/", "/api/"] },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
