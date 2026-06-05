import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, supabaseServiceRoleKey } from "@/lib/env";

/**
 * Client Supabase « service role » — POUVOIR ADMIN, bypass RLS.
 *
 * ⚠️ Strictement côté serveur (import "server-only" garantit l'erreur de build
 * si ce module est tiré dans un bundle client). Utilisé uniquement par le
 * webhook Stripe et les helpers de synchronisation d'abonnement, pour écrire
 * dans les tables protégées par RLS.
 */
export function createAdminClient() {
  const key = supabaseServiceRoleKey();
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY manquant");
  return createClient(SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
