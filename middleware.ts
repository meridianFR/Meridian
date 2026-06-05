import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { getSubscription, isActive } from "@/lib/subscription";
import { isSupabaseConfigured } from "@/lib/env";

/**
 * Barrière d'accès aux zones privées (première ligne ; le layout /app revérifie).
 *
 * - `/app/*`        : utilisateur connecté ET abonnement actif.
 * - `/abonnement*`  : utilisateur connecté (le paiement se fait sur la page).
 *
 * « Fail closed » : sans configuration auth, ou sans session, l'accès est refusé.
 * Le site marketing public n'est PAS concerné (cf. `matcher`).
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const buildUrl = (path: string, params?: Record<string, string>) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    return url;
  };

  // Tant que l'auth n'est pas configurée, on bloque (redirige vers un écran clair).
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(buildUrl("/connexion", { error: "config", next: pathname }));
  }

  const { response, supabase, user } = await updateSession(request);

  if (!user) {
    return NextResponse.redirect(buildUrl("/connexion", { next: pathname + search }));
  }

  // /abonnement : être connecté suffit.
  if (pathname.startsWith("/abonnement")) {
    return response;
  }

  // /app/* : abonnement actif obligatoire.
  const sub = await getSubscription(supabase, user.id);
  if (!isActive(sub)) {
    // Filet post-paiement : au retour de Stripe (`?checkout=success`), le webhook
    // peut ne pas avoir encore convergé (et n'arrive jamais en local). On laisse
    // alors passer pour que le layout /app réconcilie l'abonnement depuis Stripe.
    // La sécurité tient : le layout reste « fail closed » et redirige vers
    // /abonnement si, après réconciliation, l'accès n'est toujours pas actif.
    const justCheckedOut = request.nextUrl.searchParams.get("checkout") === "success";
    if (!justCheckedOut) {
      const res = NextResponse.redirect(buildUrl("/abonnement"));
      // Préserver les cookies de session rafraîchis par updateSession.
      response.cookies.getAll().forEach((cookie) => res.cookies.set(cookie));
      return res;
    }
  }

  return response;
}

export const config = {
  matcher: ["/app/:path*", "/abonnement", "/abonnement/:path*"],
};
