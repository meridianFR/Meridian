import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { isActive } from "@/lib/subscription";
import { getReconciledSubscription } from "@/lib/subscription-sync";
import { PLANS, isPlanId } from "@/lib/env";

export const dynamic = "force-dynamic";

const DATE_LOCALES: Record<string, string> = {
  fr: "fr-FR",
  en: "en-US",
  pt: "pt-PT",
};

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Dashboard" });

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
    ? new Date(sub.current_period_end).toLocaleDateString(
        DATE_LOCALES[locale] ?? "fr-FR",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      )
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
                  {t("manageSub")}
                </button>
              </form>
            )}
            <form method="post" action="/auth/signout">
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-full text-ink-mute hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                {t("signout")}
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-wrap mx-auto px-5 sm:px-10 py-12 md:py-16">
        <span className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint">
          {t("eyebrow")}
        </span>
        <h1 className="h-title text-[34px] sm:text-[44px] mt-4 text-white">
          {t("greeting", { name: firstName })}
        </h1>
        <p className="mt-4 max-w-xl text-[15px] text-ink-mute leading-relaxed">
          {t("intro")}
        </p>

        {sp.error === "portal" && (
          <div className="mt-6 rounded-lg border border-risk/40 bg-[#0a0a0a] px-4 py-3 text-sm text-risk max-w-xl">
            {t("portalError")}
          </div>
        )}

        {/* Tes produits */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-5">
            <span className="h-eyebrow">{t("yourProducts")}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {/* Journal */}
            <div className="bg-black p-7 lg:p-9 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <span className="mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">01</span>
                {journalActive ? (
                  <span className="pill pill-green">{t("active")}</span>
                ) : (
                  <span className="pill">{t("inactive")}</span>
                )}
              </div>
              <h2 className="text-[22px] lg:text-[26px] text-white font-semibold tracking-tight">
                Meridian Journal
              </h2>
              <p className="mt-3 text-[14px] text-ink-mute leading-relaxed flex-1">
                {journalActive
                  ? t("journalDescActive")
                  : t("journalDescInactive")}
              </p>

              {journalActive && (planName || periodEnd) && (
                <div className="mono text-[11px] text-ink-faint mt-5">
                  {t("subLabel", { plan: planName ? planName.toLowerCase() : "" })}
                  {periodEnd
                    ? sub?.cancel_at_period_end
                      ? ` · ${t("endsOn", { date: periodEnd })}`
                      : ` · ${t("renewsOn", { date: periodEnd })}`
                    : ""}
                </div>
              )}

              <div className="mt-6">
                {journalActive ? (
                  <Link href="/app/journal" className="btn btn-primary !py-2 !px-4 text-[13px]">
                    {t("openJournal")}
                    <span aria-hidden className="ml-1.5 text-black/50">→</span>
                  </Link>
                ) : (
                  <Link href="/abonnement" className="btn btn-primary !py-2 !px-4 text-[13px]">
                    {t("subscribeCta")}
                    <span aria-hidden className="ml-1.5 text-black/50">→</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Formation */}
            <div className="bg-black p-7 lg:p-9 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <span className="mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">02</span>
                <span className="pill">{t("soon")}</span>
              </div>
              <h2 className="text-[22px] lg:text-[26px] text-white font-semibold tracking-tight">
                {t("formationTitle")}
              </h2>
              <p className="mt-3 text-[14px] text-ink-mute leading-relaxed flex-1">
                {t("formationDesc")}
              </p>
              <div className="mt-6">
                <Link
                  href="/formation"
                  className="btn btn-ghost !py-2 !px-4 text-[13px]"
                >
                  {t("discoverProgram")}
                  <span aria-hidden className="ml-1.5 text-ink-faint">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Tes outils */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-5">
            <span className="h-eyebrow">{t("yourTools")}</span>
            <Link
              href="/outils"
              className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint hover:text-white transition-colors"
            >
              {t("allTools")}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            <Link
              href="/outils/calculateur-position"
              className="bg-black p-6 lg:p-7 group hover:bg-[#070707] transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="pill pill-green">{t("live")}</span>
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  {t("free")}
                </span>
              </div>
              <h3 className="text-[17px] text-white font-semibold tracking-tight">
                {t("calcTitle")}
              </h3>
              <p className="mt-2 text-[13px] text-ink-mute leading-relaxed">
                {t("calcDesc")}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-white/80 group-hover:text-white transition-colors">
                {t("useTool")}
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>

            <Link
              href="/strategies"
              className="bg-black p-6 lg:p-7 group hover:bg-[#070707] transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  {t("reading")}
                </span>
              </div>
              <h3 className="text-[17px] text-white font-semibold tracking-tight">
                {t("strategiesTitle")}
              </h3>
              <p className="mt-2 text-[13px] text-ink-mute leading-relaxed">
                {t("strategiesDesc")}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-white/80 group-hover:text-white transition-colors">
                {t("explore")}
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
