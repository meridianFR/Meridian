import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isActive } from "@/lib/subscription";
import { getReconciledSubscription } from "@/lib/subscription-sync";

export const metadata: Metadata = {
  title: "Meridian Journal",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Verrou du produit Journal : connecté ET abonnement actif. La réconciliation
 * Stripe rattrape le cas « retour de paiement, webhook pas encore converti ».
 * « Fail closed » : sans abonnement actif ⇒ /abonnement.
 */
export default async function JournalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/connexion?next=/app/journal");
  }

  const sub = await getReconciledSubscription(supabase, user.id);
  if (!isActive(sub)) {
    redirect("/abonnement");
  }

  return <>{children}</>;
}
