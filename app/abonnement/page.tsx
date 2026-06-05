import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { LockIcon, StripeMark, VisaMark, MastercardMark } from "@/components/journal-logos";
import { createClient } from "@/lib/supabase/server";
import { getSubscription, isActive } from "@/lib/subscription";
import { PLANS, isPlanId, isSupabaseConfigured, type PlanId } from "@/lib/env";

export const metadata: Metadata = {
  title: "Finaliser ton abonnement",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AbonnementPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; canceled?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const plan: PlanId = isPlanId(sp.plan) ? sp.plan : "monthly";
  const info = PLANS[plan];
  const other: PlanId = plan === "monthly" ? "annual" : "monthly";

  // Si l'auth n'est pas configurée, on n'essaie pas d'appeler Supabase.
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect(`/connexion?next=${encodeURIComponent(`/abonnement?plan=${plan}`)}`);
    }
    const sub = await getSubscription(supabase, user.id);
    if (isActive(sub)) redirect("/app");
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-28">
      <AmbientOrbs />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/journal#tarifs"
            className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint hover:text-ink-mute transition-colors"
          >
            ° Meridian Journal
          </Link>
          <h1 className="h-title text-3xl md:text-4xl mt-5">Finaliser ton abonnement</h1>
        </div>

        {sp.canceled && (
          <div className="rounded-lg border border-border-2 bg-[#0a0a0a] px-4 py-3 mb-5 text-sm text-ink-mute">
            Paiement annulé — rien ne t'a été débité.
          </div>
        )}
        {sp.error === "config" && (
          <div className="rounded-lg border border-border-2 bg-[#0a0a0a] px-4 py-3 mb-5 text-sm text-ink-mute">
            Le paiement n'est pas encore activé. Réessaie un peu plus tard.
          </div>
        )}
        {sp.error === "stripe" && (
          <div className="rounded-lg border border-risk/40 bg-[#0a0a0a] px-4 py-3 mb-5 text-sm text-risk">
            Une erreur est survenue côté paiement. Réessaie.
          </div>
        )}

        <div className="rounded-2xl border border-border bg-[#070707] p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
              Offre {info.name}
            </span>
            {plan === "annual" && <span className="pill pill-green">Deux mois offerts</span>}
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tracking-tight">{info.price}</span>
            <span className="text-ink-mute text-sm">{info.period}</span>
          </div>
          <div className="mono text-[11px] text-ink-faint mt-2 mb-7">{info.sub}</div>

          <ul className="space-y-3 mb-8">
            {info.perks.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-ink">
                <span className="text-edge mono mt-0.5 shrink-0">+</span>
                {f}
              </li>
            ))}
          </ul>

          {/* Action de paiement : form POST (anti-CSRF même-origine côté API). */}
          <form method="post" action="/api/checkout">
            <input type="hidden" name="plan" value={plan} />
            <button type="submit" className="btn btn-primary w-full justify-center">
              Payer {info.price} {info.period}
            </button>
          </form>

          <Link
            href={`/abonnement?plan=${other}`}
            className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint hover:text-ink-mute transition-colors block text-center mt-5"
          >
            Passer à l'offre {PLANS[other].name.toLowerCase()}
          </Link>
        </div>

        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="inline-flex items-center gap-2 text-ink-mute">
            <LockIcon className="text-edge" />
            <span className="text-[13px]">Paiement sécurisé via Stripe</span>
          </div>
          <div className="flex items-center gap-4">
            <VisaMark />
            <MastercardMark />
            <StripeMark />
          </div>
          <p className="text-ink-mute text-xs text-center">
            Sans engagement · résiliable en un clic.
          </p>
        </div>
      </div>
    </main>
  );
}
