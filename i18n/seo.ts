// Helpers SEO i18n. localePrefix "as-needed" → le FR n'a pas de préfixe.
// `metadataBase` (https://meridiandata.fr, dans le layout racine) résout ces
// chemins relatifs en URLs absolues.

const LOCALES = ["fr", "en", "pt"] as const;

/** Chemin canonique localisé : FR sans préfixe, EN/PT préfixés. */
export function canonicalPath(locale: string, path: string): string {
  return locale === "fr" ? path : `/${locale}${path}`;
}

/** Carte hreflang (fr + en + pt + x-default→fr) pour une route. */
export function languageAlternates(path: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of LOCALES) map[l] = canonicalPath(l, path);
  map["x-default"] = canonicalPath("fr", path);
  return map;
}

/** Bloc `alternates` complet (canonical + languages) pour generateMetadata. */
export function alternatesFor(locale: string, path: string) {
  return {
    canonical: canonicalPath(locale, path),
    languages: languageAlternates(path),
  };
}
