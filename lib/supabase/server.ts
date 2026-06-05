import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/env";

/**
 * Client Supabase pour Server Components et Route Handlers.
 * Lié aux cookies de la requête (session par cookie httpOnly).
 *
 * Note : depuis un Server Component, l'écriture de cookies n'est pas permise —
 * le `setAll` est alors ignoré (try/catch) et c'est le middleware qui rafraîchit
 * la session. C'est le comportement recommandé par @supabase/ssr.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Appelé depuis un Server Component : ignorable.
        }
      },
    },
  });
}
