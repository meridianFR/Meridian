import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { LockIcon } from "@/components/journal-logos";
import { LoginForm } from "@/app/connexion/login-form";
import { SetPasswordForm } from "./set-password-form";
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
 * fait la même chose en parallèle), puis laisse le client définir son mot de
 * passe pour accéder à son espace et s'y reconnecter ensuite.
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

  const canSetPassword = paid && !!email;

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-28">
      <AmbientOrbs />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="mono text-[10px] uppercase tracking-[0.4em] text-edge">° Paiement reçu</span>
          <h1 className="h-title text-3xl md:text-4xl mt-5">Bienvenue dans Meridian Journal</h1>
          <p className="text-ink-mute text-sm leading-relaxed mt-4">
            {canSetPassword
              ? "Ton abonnement est actif. Choisis un mot de passe pour ouvrir ton Journal et t'y reconnecter quand tu veux."
              : "Ton abonnement est actif. Reçois ton lien d'accès par email pour ouvrir ton Journal."}
          </p>
        </div>

        {canSetPassword ? (
          <SetPasswordForm sessionId={session_id} email={email as string} />
        ) : (
          <LoginForm next="/app" />
        )}

        <div className="flex items-center justify-center gap-2 text-ink-mute mt-8">
          <LockIcon className="text-edge" />
          <span className="text-[13px]">Accès sécurisé · paiement via Stripe</span>
        </div>
      </div>
    </main>
  );
}
