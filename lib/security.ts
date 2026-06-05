/**
 * Garde-fous de sécurité réutilisables côté serveur.
 */

/**
 * Vérifie que la requête provient bien de notre propre origine (anti-CSRF).
 * Les navigateurs envoient l'en-tête `Origin` sur les requêtes POST ; on le
 * compare à l'hôte de la requête. Absence d'Origin ⇒ refus (fail closed).
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Empêche les open-redirects : seul un chemin interne (`/...`, hors `//`) est
 * accepté comme destination `next`. Toute valeur suspecte retombe sur `/app`.
 */
export function sanitizeNextPath(next: string | null | undefined, fallback = "/app"): string {
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
