import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { getSubscription } from "@/lib/subscription";
import { isSameOrigin } from "@/lib/security";
import { SITE_URL, isStripeConfigured } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Ouvre le portail de facturation Stripe (gérer / résilier l'abonnement,
 * mettre à jour la carte) — conforme à la promesse « résiliable en un clic ».
 * Sécurité : POST même-origine, auth requise, portail limité au client de
 * l'utilisateur connecté.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origine invalide." }, { status: 403 });
  }

  if (!isStripeConfigured()) {
    return NextResponse.redirect(new URL("/app?error=config", SITE_URL), 303);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/connexion?next=/app", SITE_URL), 303);
  }

  const sub = await getSubscription(supabase, user.id);
  if (!sub?.stripe_customer_id) {
    return NextResponse.redirect(new URL("/abonnement", SITE_URL), 303);
  }

  // « flow=cancel » : ouvre directement le parcours de résiliation Stripe.
  const form = await request.formData().catch(() => null);
  const wantsCancel = form?.get("flow") === "cancel";

  const stripe = getStripe();
  const customer = sub.stripe_customer_id;
  const returnUrl = `${SITE_URL}/app/journal`;

  try {
    // Lien direct vers la résiliation si demandé et si un abonnement existe.
    if (wantsCancel) {
      const subs = await stripe.subscriptions.list({ customer, status: "all", limit: 1 });
      const subId = subs.data[0]?.id;
      if (subId) {
        try {
          const portal = await stripe.billingPortal.sessions.create({
            customer,
            return_url: returnUrl,
            flow_data: {
              type: "subscription_cancel",
              subscription_cancel: { subscription: subId },
            },
          });
          return NextResponse.redirect(portal.url, 303);
        } catch (e) {
          // Le parcours « cancel » n'est peut-être pas activé dans la config du
          // portail : on retombe sur le portail générique (résiliation possible
          // s'il est activé), plutôt que d'échouer.
          console.error("[billing-portal] flow cancel indisponible, repli portail générique", e);
        }
      }
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer,
      return_url: returnUrl,
    });
    return NextResponse.redirect(portal.url, 303);
  } catch (e) {
    console.error("[billing-portal]", e);
    return NextResponse.redirect(new URL("/app?error=portal", SITE_URL), 303);
  }
}
