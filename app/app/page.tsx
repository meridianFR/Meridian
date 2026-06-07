import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isActive } from "@/lib/subscription";
import { getReconciledSubscription } from "@/lib/subscription-sync";
import { PLANS, isPlanId } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?next=/app"); // (le layout gate déjà, ceinture + bretelles)

  const sub = await getReconciledSubscription(supabase, user.id);
  const journalActive = isActive(sub);
  const planName = sub?.plan && isPlanId(sub.plan) ? PLANS[sub.plan].name : null;
  const periodEnd = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const firstName = (user.email ?? "").split("@")[0];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="nav-blur sticky top-0 z-50 border-b border-border">
        <div className="max-w-wrap mx-auto px-5 sm:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="group text-[15px] font-semibold tracking-[-0.02em] text-white">
            Meridian
            <span className="text-ink-muted ml-0.5 inline-block transition-transform duration-500 group-hover:rotate-180">
              °
            </span>
          </Link>

          <div className="flex items-center gap-2 text-[13px]">
            <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint hidden sm:inline truncate max-w-[180px]">
              {user.email}
            </span>
            {journalActive && (
              <form method="post" action="/api/billing-portal">
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-full text-ink-mute hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  Gérer l&apos;abonnement
                </button>
              </form>
            )}
            <form method="post" action="/auth/signout">
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-full text-ink-mute hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-wrap mx-auto px-5 sm:px-10 py-12 md:py-16">
        <span className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint">
          Espace client
        </span>
        <h1 className="h-title text-[34px] sm:text-[44px] mt-4 text-white">
          Bonjour {firstName}.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] text-ink-mute leading-relaxed">
          Retrouve ici tes produits Meridian et tes outils. Tout ce que tu utilises,
          au même endroit.
        </p>

        {sp.error === "portal" && (
          <div className="mt-6 rounded-lg border border-risk/40 bg-[#0a0a0a] px-4 py-3 text-sm text-risk max-w-xl">
            Le portail de facturation est momentanément indisponible. Réessaie.
          </div>
        )}

        {/* Tes produits */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-5">
            <span className="h-eyebrow">Tes produits</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {/* Journal */}
            <div className="bg-black p-7 lg:p-9 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <span className="mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">01</span>
                {journalActive ? (
                  <span className="pill pill-green">ACTIF</span>
                ) : (
                  <span className="pill">NON ACTIF</span>
                )}
              </div>
              <h2 className="text-[22px] lg:text-[26px] text-white font-semibold tracking-tight">
                Meridian Journal
              </h2>
              <p className="mt-3 text-[14px] text-ink-mute leading-relaxed flex-1">
                {journalActive
                  ? "Ton journal de trading : import broker, dashboard stats, Weekly Report. Tout est prêt."
                  : "Journal de trading automatisé. Import broker CSV, dashboard stats, Weekly Behavioral Report chaque dimanche."}
              </p>

              {journalActive && (planName || periodEnd) && (
                <div className="mono text-[11px] text-ink-faint mt-5">
                  {planName ? `Abonnement ${planName.toLowerCase()}` : "Abonnement"}
                  {periodEnd
                    ? sub?.cancel_at_period_end
                      ? ` · se termine le ${periodEnd}`
                      : ` · renouvellement le ${periodEnd}`
                    : ""}
                </div>
              )}

              <div className="mt-6">
                {journalActive ? (
                  <Link href="/app/journal" className="btn btn-primary !py-2 !px-4 text-[13px]">
                    Ouvrir le Journal
                    <span aria-hidden className="ml-1.5 text-black/50">→</span>
                  </Link>
                ) : (
                  <Link href="/abonnement" className="btn btn-primary !py-2 !px-4 text-[13px]">
                    S&apos;abonner — 19 € / mois
                    <span aria-hidden className="ml-1.5 text-black/50">→</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Formation */}
            <div className="bg-black p-7 lg:p-9 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <span className="mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">02</span>
                <span className="pill">À VENIR</span>
              </div>
              <h2 className="text-[22px] lg:text-[26px] text-white font-semibold tracking-tight">
                Formation
              </h2>
              <p className="mt-3 text-[14px] text-ink-mute leading-relaxed flex-1">
                Modules pour comprendre ce que tu trades et structurer ton approche.
                En construction.
              </p>
              <div className="mt-6">
                <Link
                  href="/formation"
                  className="btn btn-ghost !py-2 !px-4 text-[13px]"
                >
                  Découvrir le programme
                  <span aria-hidden className="ml-1.5 text-ink-faint">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Tes outils */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-5">
            <span className="h-eyebrow">Tes outils</span>
            <Link
              href="/outils"
              className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint hover:text-white transition-colors"
            >
              Tous les outils →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            <Link
              href="/outils/calculateur-position"
              className="bg-black p-6 lg:p-7 group hover:bg-[#070707] transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="pill pill-green">LIVE</span>
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  Gratuit
                </span>
              </div>
              <h3 className="text-[17px] text-white font-semibold tracking-tight">
                Calculateur de position
              </h3>
              <p className="mt-2 text-[13px] text-ink-mute leading-relaxed">
                Capital, risque, taille de position, drawdown projeté.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-white/80 group-hover:text-white transition-colors">
                Utiliser l&apos;outil
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>

            <Link
              href="/strategies"
              className="bg-black p-6 lg:p-7 group hover:bg-[#070707] transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  Lecture
                </span>
              </div>
              <h3 className="text-[17px] text-white font-semibold tracking-tight">
                Stratégies
              </h3>
              <p className="mt-2 text-[13px] text-ink-mute leading-relaxed">
                Les approches Meridian, détaillées et documentées.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-white/80 group-hover:text-white transition-colors">
                Explorer
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
