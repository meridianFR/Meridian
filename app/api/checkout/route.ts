import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, getOrCreateCustomer } from "@/lib/stripe";
import { getSubscription, isActive } from "@/lib/subscription";
import { isSameOrigin } from "@/lib/security";
import { SITE_URL, isPlanId, isStripeConfigured, stripePriceId } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Démarre un paiement Stripe Checkout pour l'utilisateur connecté.
 * Sécurité : POST même-origine uniquement, auth requise, `plan` validé contre
 * une allowlist (jamais de priceId venant du client), client Stripe rattaché à
 * l'utilisateur authentifié.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origine invalide." }, { status: 403 });
  }

  const form = await request.formData();
  const plan = form.get("plan");
  if (!isPlanId(plan)) {
    return NextResponse.json({ error: "Offre inconnue." }, { status: 400 });
  }

  // Tant que Stripe n'est pas configuré : message clair, pas de crash.
  if (!isStripeConfigured()) {
    return NextResponse.redirect(new URL(`/abonnement?plan=${plan}&error=config`, SITE_URL), 303);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const next = encodeURIComponent(`/abonnement?plan=${plan}`);
    return NextResponse.redirect(new URL(`/connexion?next=${next}`, SITE_URL), 303);
  }

  // Déjà abonné : inutile de repayer.
  const existing = await getSubscription(supabase, user.id);
  if (isActive(existing)) {
    return NextResponse.redirect(new URL("/app", SITE_URL), 303);
  }

  try {
    const customerId = await getOrCreateCustomer(user);
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: stripePriceId(plan), quantity: 1 }],
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      success_url: `${SITE_URL}/app?checkout=success`,
      cancel_url: `${SITE_URL}/abonnement?plan=${plan}&canceled=1`,
      client_reference_id: user.id,
      metadata: { supabase_user_id: user.id, plan },
      subscription_data: { metadata: { supabase_user_id: user.id, plan } },
    });

    if (!session.url) throw new Error("URL de session Checkout manquante");
    return NextResponse.redirect(session.url, 303);
  } catch (e) {
    console.error("[checkout]", e);
    return NextResponse.redirect(new URL(`/abonnement?plan=${plan}&error=stripe`, SITE_URL), 303);
  }
}
