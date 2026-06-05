import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/env";

/**
 * Rafraîchit la session dans le middleware et renvoie l'utilisateur courant.
 * Le middleware est le SEUL endroit qui peut réécrire les cookies de session
 * rafraîchis — d'où ce helper dédié.
 *
 * Renvoie également le client `supabase` (lié à la requête) pour permettre une
 * requête immédiate sur l'abonnement, et `response` qui PORTE les cookies mis
 * à jour : tout `NextResponse.redirect` du middleware doit recopier ces cookies.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, response, user };
}
