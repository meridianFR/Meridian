import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { LockIcon, StripeMark, VisaMark, MastercardMark } from "@/components/journal-logos";
import { createClient } from "@/lib/supabase/server";
import { getSubscription, isActive } from "@/lib/subscription";
import { PLANS, isPlanId, isSupabaseConfigured, type PlanId } from "@/lib/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Subscribe" });
  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

export const dynamic = "force-dynamic";

export default async function AbonnementPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ plan?: string; canceled?: string; error?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const plan: PlanId = isPlanId(sp.plan) ? sp.plan : "monthly";
  const price = PLANS[plan].price;
  const other: PlanId = plan === "monthly" ? "annual" : "monthly";

  // Si l'auth n'est pas configurée, on n'essaie pas d'appeler Supabase.
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect({ href: `/connexion?next=${encodeURIComponent(`/abonnement?plan=${plan}`)}`, locale });
    }
    const sub = await getSubscription(supabase, user!.id);
    if (isActive(sub)) redirect({ href: "/app", locale });
  }

  const t = await getTranslations("Subscribe");
  const tp = await getTranslations("Plans");
  const period = tp(`${plan}.period`);
  const sub = tp(`${plan}.sub`);
  const perks = tp.raw(`${plan}.perks`) as string[];

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-28">
      <AmbientOrbs />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/journal#tarifs"
            className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint hover:text-ink-mute transition-colors"
          >
            {t("eyebrow")}
          </Link>
          <h1 className="h-title text-3xl md:text-4xl mt-5">{t("heading")}</h1>
        </div>

        {sp.canceled && (
          <div className="rounded-lg border border-border-2 bg-[#0a0a0a] px-4 py-3 mb-5 text-sm text-ink-mute">
            {t("canceled")}
          </div>
        )}
        {sp.error === "config" && (
          <div className="rounded-lg border border-border-2 bg-[#0a0a0a] px-4 py-3 mb-5 text-sm text-ink-mute">
            {t("errConfig")}
          </div>
        )}
        {sp.error === "stripe" && (
          <div className="rounded-lg border border-risk/40 bg-[#0a0a0a] px-4 py-3 mb-5 text-sm text-risk">
            {t("errStripe")}
          </div>
        )}

        <div className="rounded-2xl border border-border bg-[#070707] p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
              {t("offerLabel", { name: tp(`${plan}.name`) })}
            </span>
            {plan === "annual" && <span className="pill pill-green">{t("twoMonthsFree")}</span>}
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tracking-tight">{price}</span>
            <span className="text-ink-mute text-sm">{period}</span>
          </div>
          <div className="mono text-[11px] text-ink-faint mt-2 mb-7">{sub}</div>

          <ul className="space-y-3 mb-8">
            {perks.map((f) => (
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
              {t("pay", { price, period })}
            </button>
          </form>

          <Link
            href={`/abonnement?plan=${other}`}
            className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint hover:text-ink-mute transition-colors block text-center mt-5"
          >
            {t("switchTo", { name: tp(`${other}.name`).toLowerCase() })}
          </Link>
        </div>

        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="inline-flex items-center gap-2 text-ink-mute">
            <LockIcon className="text-edge" />
            <span className="text-[13px]">{t("securePayment")}</span>
          </div>
          <div className="flex items-center gap-4">
            <VisaMark />
            <MastercardMark />
            <StripeMark />
          </div>
          <p className="text-ink-mute text-xs text-center">{t("noCommitment")}</p>
        </div>
      </div>
    </main>
  );
}
