import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { LockIcon } from "@/components/journal-logos";
import { LoginForm } from "@/app/connexion/login-form";
import { getStripe, provisionAccountFromSession } from "@/lib/stripe";
import { isStripeConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Paiement reçu",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Écran de retour après un paiement direct (Stripe Checkout anonyme).
 * Provisionne le compte à partir de la session payée (idempotent — le webhook
 * fait la même chose en parallèle), puis propose le lien d'accès magique vers
 * l'email utilisé au paiement.
 */
export default async function BienvenuePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id || !isStripeConfigured()) redirect("/journal#tarifs");

  let email: string | null = null;
  let paid = false;
  try {
    const session = await getStripe().checkout.sessions.retrieve(session_id);
    paid = session.payment_status === "paid" || session.status === "complete";
    if (paid) {
      email = await provisionAccountFromSession(session);
    } else {
      email = session.customer_details?.email ?? null;
    }
  } catch {
    redirect("/journal#tarifs");
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-28">
      <AmbientOrbs />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="mono text-[10px] uppercase tracking-[0.4em] text-edge">
            ° Paiement reçu
          </span>
          <h1 className="h-title text-3xl md:text-4xl mt-5">Bienvenue dans Meridian Journal</h1>
          <p className="text-ink-mute text-sm leading-relaxed mt-4">
            {paid
              ? "Ton abonnement est actif. Dernière étape : reçois ton lien d'accès par email pour ouvrir ton Journal."
              : "On finalise ton paiement. Reçois ton lien d'accès par email pour ouvrir ton Journal."}
          </p>
        </div>

        <LoginForm next="/app" defaultEmail={email ?? ""} />

        <div className="flex items-center justify-center gap-2 text-ink-mute mt-8">
          <LockIcon className="text-edge" />
          <span className="text-[13px]">Lien d'accès sécurisé · sans mot de passe</span>
        </div>
      </div>
    </main>
  );
}
