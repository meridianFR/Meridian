import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { Reveal } from "@/components/reveal";
import { FaqAccordion, type FaqItem } from "@/components/faq-accordion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FormationPremium" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

type Module = { n: string; title: string; meta: string; desc: string; lessons: string[] };
type Included = { t: string; d: string };

/* ------------------------------------------------------------------ primitives */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint">{children}</div>;
}

/* ------------------------------------------------------------------ page */

export default async function Page() {
  const t = await getTranslations("FormationPremium");

  const modules = t.raw("modules") as Module[];
  const outcomes = t.raw("outcomes") as string[];
  const included = t.raw("included") as Included[];
  const notThis = t.raw("notThis") as string[];
  const butThis = t.raw("butThis") as string[];
  const priceIncludes = t.raw("priceIncludes") as string[];
  const faq = t.raw("faq") as FaqItem[];

  const stats = [
    { k: t("statModules"), v: "6" },
    { k: t("statLessons"), v: "42" },
    { k: t("statDuration"), v: "≈13h" },
    { k: t("statLevel"), v: t("statLevelValue") },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ============================================ HERO */}
      <section className="relative pt-32 md:pt-44 pb-24 md:pb-32 overflow-hidden">
        <AmbientOrbs />
        <div
          className="absolute inset-x-0 top-0 h-[620px] pointer-events-none -z-10"
          style={{ background: "radial-gradient(ellipse 55% 50% at 50% 0%, rgba(255,255,255,0.07), transparent 70%)" }}
        />

        <div className="max-w-wrap mx-auto px-6 sm:px-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-9 fade-in">
                <Eyebrow>{t("heroEyebrow")}</Eyebrow>
                <span className="pill pill-green">{t("heroBadge")}</span>
              </div>

              <h1 className="h-title text-[44px] sm:text-[60px] md:text-[76px] fade-in-up">
                {t("heroTitle1")}
                <br />
                <span className="shimmer">{t("heroTitle2")}</span>
              </h1>

              <p className="text-ink-mute text-base md:text-lg max-w-xl mt-9 leading-relaxed fade-in-up-2">
                {t("heroIntro")}
              </p>

              <div className="flex flex-wrap gap-3 mt-11 fade-in-up-3">
                <Link href="#inscription" className="btn btn-primary">
                  {t("joinCta")}
                </Link>
                <Link href="#programme" className="btn btn-ghost">
                  {t("exploreCta")}
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border fade-in-up-3">
                {stats.map((s) => (
                  <div key={s.k} className="bg-black px-5 py-4">
                    <div className="mono text-[9px] uppercase tracking-[0.3em] text-ink-faint">{s.k}</div>
                    <div className="text-lg font-semibold mt-1">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte programme — objet premium */}
            <div className="lg:col-span-5 fade-in-up-2">
              <div className="glow-border rounded-2xl bg-black/40 backdrop-blur-sm p-5 md:p-6">
                <div className="flex items-center justify-between mb-5">
                  <span className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">{t("cardProgram")}</span>
                  <span className="mono text-[10px] text-ink-faint">{t("cardModulesCount")}</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-border divide-y divide-border">
                  {modules.slice(0, 5).map((m) => (
                    <div key={m.n} className="flex items-center gap-4 px-4 py-3 bg-black/60">
                      <span className="mono text-[11px] text-ink-faint w-6 shrink-0">{m.n}</span>
                      <span className="text-[13px] text-ink flex-1 truncate">{m.title}</span>
                      <span className="mono text-[10px] text-ink-faint shrink-0">{m.meta.split(" · ")[1]}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 px-4 py-3 bg-white/[0.03]">
                    <span className="mono text-[11px] text-ink-faint w-6 shrink-0">06</span>
                    <span className="text-[13px] text-ink-mute flex-1">{t("cardModule6")}</span>
                    <span className="mono text-[10px] text-ink-faint shrink-0">{t("cardModule6Duration")}</span>
                  </div>
                </div>

                <div className="flex items-end justify-between mt-6 pt-5 border-t border-border">
                  <div>
                    <div className="mono text-[9px] uppercase tracking-[0.3em] text-ink-faint mb-1.5">{t("cardFullAccess")}</div>
                    <div className="text-3xl font-semibold tracking-tight">
                      390 €<span className="text-ink-faint text-base font-normal"> </span>
                    </div>
                    <div className="mono text-[10px] text-ink-faint mt-1">{t("cardPriceNote")}</div>
                  </div>
                  <span className="pill pill-white">{t("cardGuarantee")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ PHILOSOPHIE */}
      <section className="relative py-24 md:py-36 border-t border-border overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 25% 40%, rgba(255,255,255,0.04), transparent 70%)" }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <Reveal as="div" className="lg:col-span-5">
              <Eyebrow>{t("philoEyebrow")}</Eyebrow>
              <h2 className="h-title text-4xl md:text-5xl mt-5">
                {t("philoTitle1")}
                <br />
                <span className="shimmer">{t("philoTitle2")}</span>
              </h2>
              <p className="text-ink-mute text-sm leading-relaxed mt-6 max-w-sm">
                {t("philoText")}
              </p>
            </Reveal>

            <Reveal as="div" className="lg:col-span-7" delay={120}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="card rounded-2xl p-7">
                  <div className="mono text-[10px] uppercase tracking-[0.3em] text-risk/80 mb-5">{t("notThisLabel")}</div>
                  <ul className="space-y-3.5">
                    {notThis.map((x) => (
                      <li key={x} className="flex items-start gap-3 text-sm text-ink-mute">
                        <span className="text-risk mt-0.5 shrink-0">✕</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card rounded-2xl p-7">
                  <div className="mono text-[10px] uppercase tracking-[0.3em] text-edge/80 mb-5">{t("butThisLabel")}</div>
                  <ul className="space-y-3.5">
                    {butThis.map((x) => (
                      <li key={x} className="flex items-start gap-3 text-sm text-ink">
                        <span className="text-edge mt-0.5 shrink-0">✓</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================ PROGRAMME */}
      <section id="programme" className="relative py-24 md:py-36 border-t border-border scroll-mt-24 overflow-hidden">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-16">
              <div>
                <Eyebrow>{t("programEyebrow")}</Eyebrow>
                <h2 className="h-title text-4xl md:text-5xl mt-5 max-w-2xl">
                  {t("programTitle1")}
                  <br />
                  <span className="shimmer">{t("programTitle2")}</span>
                </h2>
              </div>
              <p className="text-ink-mute max-w-sm text-sm leading-relaxed">
                {t("programIntro")}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5">
            {modules.map((m, i) => (
              <Reveal key={m.n} delay={i * 80}>
                <div className="card rounded-2xl p-7 md:p-9 group">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                    <div className="md:col-span-4 flex items-start gap-5">
                      <span className="mono text-3xl md:text-4xl text-ink-faint/60 group-hover:text-ink-mute transition-colors leading-none">
                        {m.n}
                      </span>
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{m.title}</h3>
                        <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mt-2">{m.meta}</div>
                      </div>
                    </div>

                    <p className="md:col-span-4 text-ink-mute text-sm leading-relaxed">{m.desc}</p>

                    <div className="md:col-span-4 flex flex-wrap gap-2 md:justify-end">
                      {m.lessons.map((l) => (
                        <span key={l} className="pill">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ OUTCOMES */}
      <section className="relative py-24 md:py-36 border-t border-border overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 75% 40%, rgba(255,255,255,0.04), transparent 70%)" }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <Eyebrow>{t("outcomesEyebrow")}</Eyebrow>
              <h2 className="h-title text-4xl md:text-5xl mt-5">
                {t("outcomesTitle1")}
                <br />
                <span className="shimmer">{t("outcomesTitle2")}</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {outcomes.map((o, i) => (
              <Reveal key={o} as="div" delay={(i % 2) * 80}>
                <div className="bg-black p-7 flex items-start gap-4 h-full hover:bg-[#070707] transition-colors">
                  <span className="mono text-[11px] text-ink-faint mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-[15px] leading-relaxed text-ink">{o}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ INCLUS */}
      <section className="relative py-24 md:py-36 border-t border-border overflow-hidden">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div>
                <Eyebrow>{t("includedEyebrow")}</Eyebrow>
                <h2 className="h-title text-4xl md:text-5xl mt-5 max-w-2xl">
                  {t("includedTitle1")}<span className="shimmer">{t("includedTitle2")}</span>
                </h2>
              </div>
              <p className="text-ink-mute max-w-sm text-sm leading-relaxed">
                {t("includedIntro")}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {included.map((it, i) => (
              <Reveal key={it.t} delay={(i % 3) * 90}>
                <div className="card rounded-2xl p-7 h-full">
                  <span className="text-edge text-sm">✓</span>
                  <div className="text-lg font-semibold tracking-tight mt-4 mb-2">{it.t}</div>
                  <p className="text-ink-mute text-sm leading-relaxed">{it.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ INSCRIPTION / PRICING */}
      <section id="inscription" className="relative py-24 md:py-36 border-t border-border scroll-mt-24 overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 50% 60% at 50% 30%, rgba(255,255,255,0.06), transparent 70%)" }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Eyebrow>{t("signupEyebrow")}</Eyebrow>
              <h2 className="h-title text-4xl md:text-5xl mt-5">
                {t("signupTitle1")}<span className="shimmer">{t("signupTitle2")}</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="glow-border glow-border-live rounded-3xl bg-black/50 backdrop-blur-sm p-8 md:p-12 max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="pill pill-white">{t("priceBadge")}</span>
                  <div className="mt-6 flex items-end gap-3">
                    <span className="text-6xl font-semibold tracking-tighter">390 €</span>
                    <span className="text-ink-faint text-sm mb-2 line-through">590 €</span>
                  </div>
                  <p className="mono text-[11px] text-ink-faint mt-3">{t("priceNote")}</p>

                  <div className="mt-8 flex flex-col gap-3">
                    <Link href="#" className="btn btn-primary justify-center text-[15px] py-3.5">
                      {t("joinCta")}
                    </Link>
                    <p className="text-center mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                      {t("priceGuarantee")}
                    </p>
                  </div>
                </div>

                <div className="md:border-l md:border-border md:pl-10">
                  <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-5">{t("priceIncludesLabel")}</div>
                  <ul className="space-y-3.5">
                    {priceIncludes.map((x) => (
                      <li key={x} className="flex items-start gap-3 text-sm text-ink">
                        <span className="text-edge mt-0.5 shrink-0">✓</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <p className="text-center text-ink-faint text-xs mt-8 max-w-xl mx-auto leading-relaxed">
            {t("signupDisclaimer")}
          </p>
        </div>
      </section>

      {/* ============================================ FAQ */}
      <section className="relative py-24 md:py-36 border-t border-border overflow-hidden">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <Reveal as="div" className="lg:col-span-4">
              <Eyebrow>{t("faqEyebrow")}</Eyebrow>
              <h2 className="h-title text-4xl md:text-5xl mt-5">
                {t("faqTitle1")}
                <br />
                <span className="shimmer">{t("faqTitle2")}</span>
              </h2>
            </Reveal>
            <Reveal as="div" className="lg:col-span-8" delay={120}>
              <FaqAccordion items={faq} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================ CTA FINAL */}
      <section className="relative py-28 md:py-40 border-t border-border overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,255,255,0.05), transparent 70%)" }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10 text-center">
          <Reveal>
            <h2 className="h-title text-4xl md:text-6xl max-w-3xl mx-auto">
              {t("finalTitle1")}<span className="shimmer">{t("finalTitle2")}</span>
            </h2>
            <p className="text-ink-mute max-w-xl mx-auto mt-6 leading-relaxed">
              {t("finalText")}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <Link href="#inscription" className="btn btn-primary">
                {t("joinCta")}
              </Link>
              <Link href="/strategies" className="btn btn-ghost">
                {t("seeStrategies")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
