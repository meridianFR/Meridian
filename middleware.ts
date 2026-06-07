import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import { getSubscription, isActive } from "@/lib/subscription";
import { isSupabaseConfigured } from "@/lib/env";

/**
 * Middleware combiné : routage multilingue (next-intl) + barrière d'accès aux
 * zones privées.
 *
 * Routage des langues
 * - Le français (langue par défaut) garde les URLs sans préfixe (`/app`,
 *   `/strategies`…). next-intl réécrit en interne vers le segment `[locale]`.
 * - L'anglais/portugais sont préfixés (`/en/app`, `/pt/strategies`…).
 *
 * Barrière d'accès (inchangée fonctionnellement, mais désormais « locale-aware »)
 * - `/app/journal*` : connecté ET abonnement actif.
 * - `/app/*`, `/abonnement*` : connecté.
 * - « Fail closed » : sans config auth ou sans session → redirection /connexion.
 *
 * Les pages publiques ne reçoivent QUE le routage des langues (aucune requête
 * Supabase) — comme avant, le site marketing n'est pas ralenti.
 */
const intlMiddleware = createMiddleware(routing);

// Retire le préfixe de langue d'un chemin (`/en/app` → `/app`). Le français
// n'est jamais préfixé (localePrefix: "as-needed").
function stripLocale(pathname: string): string {
  for (const loc of routing.locales) {
    if (loc === routing.defaultLocale) continue;
    if (pathname === `/${loc}`) return "/";
    if (pathname.startsWith(`/${loc}/`)) return pathname.slice(loc.length + 1);
  }
  return pathname;
}

// Renvoie le préfixe de langue présent dans le chemin (`/en/app` → `/en`),
// pour préserver la langue lors des redirections d'accès.
function localePrefix(pathname: string): string {
  for (const loc of routing.locales) {
    if (loc === routing.defaultLocale) continue;
    if (pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)) return `/${loc}`;
  }
  return "";
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const bare = stripLocale(pathname);
  const prefix = localePrefix(pathname);

  const isProtected =
    bare === "/app" ||
    bare.startsWith("/app/") ||
    bare === "/abonnement" ||
    bare.startsWith("/abonnement/");

  // Pages publiques : uniquement le routage des langues.
  if (!isProtected) {
    return intlMiddleware(request);
  }

  // Construit une URL de redirection en conservant la langue courante.
  const buildUrl = (path: string, params?: Record<string, string>) => {
    const url = request.nextUrl.clone();
    url.pathname = prefix + path;
    url.search = "";
    if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    return url;
  };

  // Tant que l'auth n'est pas configurée, on bloque (écran clair).
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(buildUrl("/connexion", { error: "config", next: pathname }));
  }

  const { response: authResponse, supabase, user } = await updateSession(request);

  if (!user) {
    const res = NextResponse.redirect(buildUrl("/connexion", { next: pathname + search }));
    authResponse.cookies.getAll().forEach((cookie) => res.cookies.set(cookie));
    return res;
  }

  // /app/journal* : abonnement actif obligatoire.
  if (bare.startsWith("/app/journal")) {
    const sub = await getSubscription(supabase, user.id);
    if (!isActive(sub)) {
      // Filet post-paiement : au retour de Stripe (`?checkout=success`), le webhook
      // peut ne pas avoir encore convergé. On laisse passer pour que le layout
      // journal réconcilie l'abonnement depuis Stripe (il reste « fail closed »).
      const justCheckedOut = request.nextUrl.searchParams.get("checkout") === "success";
      if (!justCheckedOut) {
        const res = NextResponse.redirect(buildUrl("/abonnement"));
        authResponse.cookies.getAll().forEach((cookie) => res.cookies.set(cookie));
        return res;
      }
    }
  }

  // Accès autorisé : on applique le routage des langues (réécriture vers le
  // segment [locale]) en reportant les cookies de session rafraîchis.
  const intlResponse = intlMiddleware(request);
  authResponse.cookies.getAll().forEach((cookie) => intlResponse.cookies.set(cookie));
  return intlResponse;
}

export const config = {
  // Toutes les pages, SAUF : routes API, callbacks auth, internes Next, et les
  // fichiers (avec extension : robots.txt, sitemap.xml, icônes, OG image…).
  matcher: ["/((?!api|auth|_next|_vercel|.*\\..*).*)"],
};
