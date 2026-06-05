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

/**
 * Provisionne (idempotent) un compte abonné à partir d'une session Checkout
 * payée — y compris en « paiement direct » (sans connexion préalable).
 *
 * Identité : `metadata.supabase_user_id` si présent (flux connecté), sinon
 * l'email collecté par Stripe (flux anonyme). Retrouve ou crée l'utilisateur
 * Supabase, lie le client Stripe à son profil, puis synchronise l'abonnement.
 * Renvoie l'email associé (pour l'écran de bienvenue), ou null.
 */
export async function provisionAccountFromSession(
  session: Stripe.Checkout.Session,
): Promise<string | null> {
  const email =
    (session.customer_details?.email ?? session.customer_email ?? "")
      .trim()
      .toLowerCase() || null;
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;
  if (!customerId) return email;

  const admin = createAdminClient();

  // 1) Identité : metadata (flux connecté) ou email (flux anonyme).
  let userId = session.metadata?.supabase_user_id ?? null;

  if (!userId && email) {
    // Compte déjà existant pour cet email ? (profil créé à l'inscription)
    const { data: existing } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing?.id) {
      userId = existing.id as string;
    } else {
      // Création d'un compte sans mot de passe, email confirmé (le paiement
      // fait foi). L'accès se fera par lien magique depuis l'écran /bienvenue.
      const { data: created } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
      });
      userId = created?.user?.id ?? null;
      if (!userId) {
        // Course possible (créé entre-temps par le webhook) : relecture.
        const { data: again } = await admin
          .from("profiles")
          .select("id")
          .eq("email", email)
          .maybeSingle();
        userId = (again?.id as string) ?? null;
      }
    }
  }

  if (!userId) return email;

  // 2) Lier le client Stripe au profil (clé de la synchro d'abonnement).
  await admin
    .from("profiles")
    .update({ stripe_customer_id: customerId })
    .eq("id", userId);

  // 3) Synchroniser l'abonnement réel depuis Stripe vers Supabase.
  await syncSubscriptionForCustomer(customerId);

  return email;
}
