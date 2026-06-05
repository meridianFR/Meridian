import type { MetadataRoute } from "next";

const BASE = "https://meridian.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Démo à données fictives — pas d'indexation
        disallow: ["/journal-preview"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
