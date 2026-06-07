import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAccounts, getReviewedWeeks, getSetups, getTrades } from "@/lib/journal/queries";
import { JournalApp } from "@/components/journal/journal-app";
import { FirstAccount } from "@/components/journal/onboarding";
import { isActive } from "@/lib/subscription";
import { getReconciledSubscription } from "@/lib/subscription-sync";
import { PLANS, isPlanId } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function JournalPage({ searchParams }: { searchParams: Promise<{ account?: string }> }) {
  const sp = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?next=/app/journal"); // (le layout gate déjà, ceinture + bretelles)

  const accounts = await getAccounts(supabase, user.id);
  if (accounts.length === 0) {
    return <FirstAccount email={user.email ?? ""} />;
  }

  // Compte courant : celui demandé (s'il appartient à l'utilisateur), sinon le premier.
  const current = accounts.find((a) => a.id === sp.account) ?? accounts[0];

  const [trades, setups, reviewedWeeks, sub] = await Promise.all([
    getTrades(supabase, user.id, current.id),
    getSetups(supabase, user.id),
    getReviewedWeeks(supabase, user.id, current.id),
    getReconciledSubscription(supabase, user.id),
  ]);

  const planName = sub?.plan && isPlanId(sub.plan) ? PLANS[sub.plan].name : null;
  const periodEnd = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <JournalApp
      key={current.id}
      accounts={accounts}
      currentAccountId={current.id}
      initialTrades={trades}
      initialSetups={setups}
      reviewedWeeks={reviewedWeeks}
      userEmail={user.email ?? ""}
      journalActive={isActive(sub)}
      planName={planName}
      periodEnd={periodEnd}
      cancelAtPeriodEnd={Boolean(sub?.cancel_at_period_end)}
    />
  );
}
