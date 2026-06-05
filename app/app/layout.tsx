import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSubscription, isActive } from "@/lib/subscription";
import { isSupabaseConfigured } from "@/lib/env";
import { syncSubscriptionForCustomer } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Espace abonné",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Barrière d'accès — défense en profondeur (en plus du middleware).
 * « Fail closed » : toute incertitude ⇒ redirection. La chrome de l'app
 * (header, comptes, onglets) est portée par le JournalApp / l'onboarding.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    redirect("/connexion?error=config&next=/app");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/connexion?next=/app");
  }

  let sub = await getSubscription(supabase, user.id);

  // Filet post-paiement : réconciliation si le webhook n'a pas encore convergé.
  if (!isActive(sub)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();
    const customerId = profile?.stripe_customer_id as string | undefined;
    if (customerId) {
      try {
        await syncSubscriptionForCustomer(customerId);
        sub = await getSubscription(supabase, user.id);
      } catch {
        // Stripe indisponible : on reste « fail closed ».
      }
    }
  }

  if (!isActive(sub)) {
    redirect("/abonnement");
  }

  return <>{children}</>;
}
