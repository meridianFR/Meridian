import "server-only";
import Stripe from "stripe";
import type { User } from "@supabase/supabase-js";
import { stripeSecretKey, stripePriceId, type PlanId } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Cœur Stripe — strictement côté serveur.
 * Coordonne Stripe (paiement) et Supabase admin (persistance du statut).
 */

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = stripeSecretKey();
    if (!key) throw new Error("STRIPE_SECRET_KEY manquant");
    // On laisse le SDK épingler sa version d'API par défaut.
    _stripe = new Stripe(key);
  }
  return _stripe;
}

/**
 * Renvoie l'ID client Stripe de l'utilisateur, en le créant au besoin.
 * Le client est rattaché à l'utilisateur Supabase (metadata) — jamais déduit
 * d'une donnée envoyée par le navigateur.
 */
export async function getOrCreateCustomer(user: User): Promise<string> {
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.stripe_customer_id) return profile.stripe_customer_id as string;

  const customer = await getStripe().customers.create({
    email: user.email ?? undefined,
    metadata: { supabase_user_id: user.id },
  });

  await admin
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", user.id);

  return customer.id;
}

/** Récupère la fin de période, quelle que soit sa position selon la version d'API. */
function readPeriodEnd(sub: Stripe.Subscription): string | null {
  type WithPeriodEnd = { current_period_end?: number | null };
  const item = sub.items?.data?.[0] as unknown as WithPeriodEnd | undefined;
  const unix =
    item?.current_period_end ??
    (sub as unknown as WithPeriodEnd).current_period_end ??
    null;
  return unix ? new Date(unix * 1000).toISOString() : null;
}

function planFromPriceId(priceId: string | null): PlanId | null {
  if (!priceId) return null;
  if (priceId === stripePriceId("annual")) return "annual";
  if (priceId === stripePriceId("monthly")) return "monthly";
  return null;
}

/**
 * Source de vérité : relit l'abonnement courant du client depuis Stripe et le
 * réécrit dans Supabase. Convergent ⇒ naturellement idempotent (le webhook peut
 * être rejoué sans effet de bord). Réutilisé par le webhook ET le filet de
 * sécurité post-paiement du layout /app.
 */
export async function syncSubscriptionForCustomer(customerId: string): Promise<void> {
  const stripe = getStripe();
  const admin = createAdminClient();

  // Relie le client Stripe à l'utilisateur Supabase.
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (!profile) return; // client inconnu côté Supabase : on ignore.
  const userId = profile.id as string;

  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 1,
  });

  // Plus d'abonnement (ou tout supprimé) : on retire l'accès.
  if (subs.data.length === 0) {
    await admin.from("subscriptions").delete().eq("user_id", userId);
    return;
  }

  const sub = subs.data[0];
  const priceId = sub.items.data[0]?.price?.id ?? null;

  await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: sub.id,
      stripe_customer_id: customerId,
      status: sub.status,
      price_id: priceId,
      plan: planFromPriceId(priceId),
      current_period_end: readPeriodEnd(sub),
      cancel_at_period_end: sub.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}
