import type { SupabaseClient } from "@supabase/supabase-js";
import { getSubscription, isActive, type SubscriptionRow } from "@/lib/subscription";
import { syncSubscriptionForCustomer } from "@/lib/stripe";

/**
 * Lit l'abonnement et, s'il n'est pas actif, tente une réconciliation depuis
 * Stripe (utile juste après un paiement, quand le webhook n'a pas encore
 * convergé — et n'arrive jamais en local). À n'utiliser que côté serveur
 * (pages/layouts en Node), jamais dans le middleware Edge.
 */
export async function getReconciledSubscription(
  supabase: SupabaseClient,
  userId: string,
): Promise<SubscriptionRow | null> {
  let sub = await getSubscription(supabase, userId);
  if (isActive(sub)) return sub;

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .maybeSingle();
  const customerId = profile?.stripe_customer_id as string | undefined;
  if (customerId) {
    try {
      await syncSubscriptionForCustomer(customerId);
      sub = await getSubscription(supabase, userId);
    } catch {
      // Stripe indisponible : on renvoie l'état connu (fail closed côté appelant).
    }
  }
  return sub;
}
