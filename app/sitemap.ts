import type { MetadataRoute } from "next";
import { STRATEGIES } from "@/lib/strategies";
import { PILLARS, ARTICLES } from "@/lib/resources";

const BASE = "https://meridiandata.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Pages statiques publiques (on exclut /journal-preview = démo, et /formation-premium = pilote)
  const staticRoutes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, freq: "weekly" },
    { path: "/strategies", priority: 0.9, freq: "weekly" },
    { path: "/ressources", priority: 0.9, freq: "weekly" },
    { path: "/outils", priority: 0.9, freq: "weekly" },
    { path: "/journal", priority: 0.8, freq: "monthly" },
    { path: "/formation", priority: 0.8, freq: "monthly" },
    { path: "/outils/calculateur-position", priority: 0.7, freq: "monthly" },
    { path: "/outils/calculateur-de-risque", priority: 0.7, freq: "monthly" },
    { path: "/outils/checklist-pre-trade", priority: 0.6, freq: "monthly" },
    { path: "/outils/audit-100-trades", priority: 0.6, freq: "monthly" },
    { path: "/outils/journal", priority: 0.6, freq: "monthly" },
    { path: "/faq", priority: 0.6, freq: "monthly" },
    { path: "/a-propos", priority: 0.5, freq: "yearly" },
    { path: "/ecosysteme", priority: 0.4, freq: "yearly" },
    { path: "/legal", priority: 0.3, freq: "yearly" },
    { path: "/mentions-legales", priority: 0.3, freq: "yearly" },
    { path: "/cgv", priority: 0.3, freq: "yearly" },
    { path: "/disclaimer-financier", priority: 0.3, freq: "yearly" },
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  for (const s of STRATEGIES) {
    entries.push({
      url: `${BASE}/strategies/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
    // Pages anatomie : uniquement celles qui existent (hasDeepDive)
    if (s.hasDeepDive) {
      entries.push({
        url: `${BASE}/strategies/${s.slug}/anatomie`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  // Académie Meridian — piliers (catégories) + articles
  for (const p of PILLARS) {
    entries.push({
      url: `${BASE}/ressources/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }
  for (const a of ARTICLES) {
    entries.push({
      url: `${BASE}/ressources/${a.pillarSlug}/${a.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
