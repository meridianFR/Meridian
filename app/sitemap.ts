import type { MetadataRoute } from "next";
import { STRATEGIES } from "@/lib/strategies";
import { getArticles, getPillars } from "@/lib/resources";

const BASE = "https://meridiandata.fr";
const LOCALES = ["fr", "en", "pt"] as const;
type Loc = (typeof LOCALES)[number];

/** URL localisée : le FR n'a pas de préfixe (localePrefix "as-needed"). */
function localized(locale: Loc, path: string): string {
  return locale === "fr" ? `${BASE}${path}` : `${BASE}/${locale}${path}`;
}

/** Carte hreflang pour une route donnée (fr + en + pt + x-default). */
function languagesFor(path: string): Record<string, string> {
  return {
    fr: localized("fr", path),
    en: localized("en", path),
    pt: localized("pt", path),
    "x-default": localized("fr", path),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Pages statiques publiques TRADUITES (on exclut /journal-preview = démo,
  // /formation-premium = pilote). Chaque route émet ses 3 variantes de langue
  // avec les alternances hreflang.
  const translatedRoutes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, freq: "weekly" },
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

  // Académie Meridian — piliers + articles (slugs identiques dans les 3 langues)
  for (const p of getPillars("fr")) {
    translatedRoutes.push({ path: `/ressources/${p.slug}`, priority: 0.8, freq: "monthly" });
  }
  for (const a of getArticles("fr")) {
    translatedRoutes.push({ path: `/ressources/${a.pillarSlug}/${a.slug}`, priority: 0.7, freq: "monthly" });
  }

  for (const r of translatedRoutes) {
    const languages = languagesFor(r.path);
    for (const locale of LOCALES) {
      entries.push({
        url: localized(locale, r.path),
        lastModified: now,
        changeFrequency: r.freq,
        priority: r.priority,
        alternates: { languages },
      });
    }
  }

  // Stratégies : refonte à venir, non traduites → FR uniquement (pas d'alternance).
  entries.push({
    url: `${BASE}/strategies`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  });
  for (const s of STRATEGIES) {
    entries.push({
      url: `${BASE}/strategies/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
    if (s.hasDeepDive) {
      entries.push({
        url: `${BASE}/strategies/${s.slug}/anatomie`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
