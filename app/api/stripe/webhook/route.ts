import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, syncSubscriptionForCustomer, provisionAccountFromSession } from "@/lib/stripe";
import { stripeWebhookSecret } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook Stripe — source de vérité du statut d'abonnement.
 * Sécurité : signature OBLIGATOIRE, vérifiée sur le corps brut. Toute requête
 * non signée ou mal signée est rejetée. Le traitement est idempotent (la
 * synchro relit l'état réel depuis Stripe), donc rejouable sans risque.
 */
export async function POST(request: Request) {
  const secret = stripeWebhookSecret();
  if (!secret) {
    return NextResponse.json({ error: "Webhook non configuré." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("[webhook] signature invalide", err);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // Paiement direct comme connecté : crée/lie le compte puis synchronise.
        const session = event.data.object as Stripe.Checkout.Session;
        await provisionAccountFromSession(session);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await syncSubscriptionForCustomer(
          typeof sub.customer === "string" ? sub.customer : sub.customer.id,
        );
        break;
      }
      default:
        // Événements ignorés : on accuse réception pour éviter les rejeux.
        break;
    }
  } catch (e) {
    console.error("[webhook] traitement échoué pour", event.type, e);
    return NextResponse.json({ error: "Traitement échoué." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
