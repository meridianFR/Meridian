import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Lecture + évaluation du statut d'abonnement.
 * Utilisé par le middleware et le layout /app (lectures respectant la RLS :
 * l'utilisateur ne voit que SA ligne).
 */

export type SubscriptionRow = {
  status: string;
  current_period_end: string | null;
  plan: string | null;
  cancel_at_period_end: boolean | null;
  stripe_customer_id: string | null;
};

/** Statuts Stripe considérés comme donnant accès. */
const ACTIVE_STATUSES = new Set(["active", "trialing"]);

export async function getSubscription(
  supabase: SupabaseClient,
  userId: string,
): Promise<SubscriptionRow | null> {
  const { data } = await supabase
    .from("subscriptions")
    .select("status, current_period_end, plan, cancel_at_period_end, stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as SubscriptionRow | null) ?? null;
}

/**
 * Accès accordé si le statut est actif/trial ET, le cas échéant, si la fin de
 * période n'est pas dépassée. Toute incertitude ⇒ false (fail closed).
 */
export function isActive(sub: SubscriptionRow | null): boolean {
  if (!sub) return false;
  if (!ACTIVE_STATUSES.has(sub.status)) return false;
  if (sub.current_period_end) {
    return new Date(sub.current_period_end).getTime() > Date.now();
  }
  return true;
}
