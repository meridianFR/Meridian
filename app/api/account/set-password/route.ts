import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSameOrigin } from "@/lib/security";
import { isStripeConfigured } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Définit le mot de passe d'un compte abonné juste après paiement.
 * Sécurité : POST même-origine ; preuve d'autorisation = une session Checkout
 * Stripe PAYÉE (le secret cs_… n'est connu que de l'acheteur). On retrouve le
 * compte via l'email de la session et on pose le mot de passe (admin).
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origine invalide." }, { status: 403 });
  }
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Indisponible." }, { status: 503 });
  }

  let body: { sessionId?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!sessionId.startsWith("cs_") || password.length < 8) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const paid =
      session.payment_status === "paid" || session.status === "complete";
    const email = (session.customer_details?.email ?? session.customer_email ?? "")
      .trim()
      .toLowerCase();
    if (!paid || !email) {
      return NextResponse.json({ error: "Paiement non confirmé." }, { status: 403 });
    }

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    const userId = profile?.id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: "Compte introuvable." }, { status: 404 });
    }

    const { error } = await admin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    });
    if (error) {
      console.error("[set-password] updateUser", error);
      return NextResponse.json({ error: "Échec de l'enregistrement." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[set-password]", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
