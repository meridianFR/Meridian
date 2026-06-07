import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { STRATEGIES } from "@/lib/strategies";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { HeroChart } from "@/components/hero-chart";
import { Reveal } from "@/components/reveal";
import {
  StrategyVisual,
  ToolsVisual,
  FormationVisual,
} from "@/components/pillar-visuals";
import {
  StrategyShowcase,
  CalculatorShowcase,
  JournalShowcase,
  FormationShowcase,
} from "@/components/showcase-visuals";

export const metadata = {
  alternates: { canonical: "/" },
};

// Piliers : visuel + lien fixes, libellés tirés des traductions.
const PILLARS = [
  {
    eyebrow: "pillarStrategiesEyebrow",
    title: "pillarStrategiesTitle",
    desc: "pillarStrategiesDesc",
    cta: "pillarStrategiesCta",
    href: "/strategies",
    Visual: StrategyVisual,
  },
  {
    eyebrow: "pillarToolsEyebrow",
    title: "pillarToolsTitle",
    desc: "pillarToolsDesc",
    cta: "pillarToolsCta",
    href: "/outils",
    Visual: ToolsVisual,
  },
  {
    eyebrow: "pillarFormationEyebrow",
    title: "pillarFormationTitle",
    desc: "pillarFormationDesc",
    cta: "pillarFormationCta",
    href: "/formation",
    Visual: FormationVisual,
  },
] as const;

const TOOLS = [
  {
    tag: "toolStrategyTag",
    title: "toolStrategyTitle",
    desc: "toolStrategyDesc",
    cta: "toolStrategyCta",
    href: "/strategies",
    Visual: StrategyShowcase,
  },
  {
    tag: "toolCalculatorTag",
    title: "toolCalculatorTitle",
    desc: "toolCalculatorDesc",
    cta: "toolCalculatorCta",
    href: "/outils",
    Visual: CalculatorShowcase,
  },
  {
    tag: "toolJournalTag",
    title: "toolJournalTitle",
    desc: "toolJournalDesc",
    cta: "toolJournalCta",
    href: "/journal",
    Visual: JournalShowcase,
  },
  {
    tag: "toolFormationTag",
    title: "toolFormationTitle",
    desc: "toolFormationDesc",
    cta: "toolFormationCta",
    href: "/formation",
    Visual: FormationShowcase,
  },
] as const;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  // Balises de mise en forme partagées par les titres « rich text ».
  const titleTags = {
    br: () => <br />,
    em: (chunks: React.ReactNode) => <span className="shimmer">{chunks}</span>,
  };

  const marquee = t.raw("marquee") as string[];

  return (
    <main className="relative min-h-screen">
      <section className="relative pt-32 md:pt-44 pb-32 md:pb-44 overflow-hidden">
        <AmbientOrbs />
        <div
          className="absolute inset-x-0 top-0 h-[560px] pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.06), transparent 70%)",
          }}
        />

        <div className="max-w-wrap mx-auto px-6 sm:px-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-10 fade-in">
                {t("heroEyebrow")}
              </div>

              <h1 className="h-title text-[44px] sm:text-[64px] md:text-[80px] lg:text-[92px] fade-in-up">
                {t.rich("heroTitle", titleTags)}
              </h1>

              <p className="text-ink-mute text-base md:text-lg max-w-xl mt-10 leading-relaxed fade-in-up-2">
                {t("heroLead")}
              </p>

              <div className="flex flex-wrap gap-3 mt-12 fade-in-up-3">
                <Link href="/strategies" className="btn btn-primary">
                  {t("heroCtaPrimary")}
                </Link>
                <Link href="/outils" className="btn btn-ghost">
                  {t("heroCtaSecondary")}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 fade-in-up-2">
              <div className="relative glow-border glow-border-live rounded-2xl bg-black/40 backdrop-blur-sm p-5">
                <HeroChart />
              </div>
              <div className="grid grid-cols-3 gap-px mt-3 bg-border rounded-xl overflow-hidden border border-border hairline-top">
                {[
                  { k: t("statTools"), v: "2" },
                  { k: t("statStrategies"), v: String(STRATEGIES.length) },
                  { k: t("statMarket"), v: t("statMarketValue") },
                ].map((s) => (
                  <div key={s.k} className="bg-black px-4 py-3">
                    <div className="mono text-[9px] uppercase tracking-[0.3em] text-ink-faint">
                      {s.k}
                    </div>
                    <div className="text-lg font-semibold mt-0.5 tnum">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-hidden className="relative border-y border-border overflow-hidden py-5 bg-white/[0.012]">
        <div className="marquee-mask overflow-hidden">
          <div className="flex w-max animate-marquee">
            {[...marquee, ...marquee].map((item, i) => (
              <div key={i} className="flex items-center">
                <span className="mono text-[11px] uppercase tracking-[0.25em] text-ink-faint whitespace-nowrap">
                  {item}
                </span>
                <span className="mono text-ink-faint/40 px-9">°</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-28 md:py-40">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">
                  {t("pillarsEyebrow")}
                </div>
                <h2 className="h-title text-4xl md:text-5xl max-w-2xl">
                  {t.rich("pillarsTitle", titleTags)}
                </h2>
              </div>
              <p className="text-ink-mute max-w-sm text-sm leading-relaxed">
                {t("pillarsLead")}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {PILLARS.map((p, i) => {
              const Visual = p.Visual;
              return (
                <Reveal key={p.href} delay={i * 120}>
                  <Link
                    href={p.href}
                    className="pillar-card bg-black p-10 md:p-12 block group hover:bg-[#070707] h-full"
                  >
                    <div className="mono text-[10px] uppercase tracking-[0.35em] text-ink-faint mb-8">
                      {t(p.eyebrow)}
                    </div>
                    <div className="mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Visual />
                    </div>
                    <div className="text-2xl md:text-[26px] font-semibold tracking-tight mb-3">
                      {t(p.title)}
                    </div>
                    <p className="text-ink-mute text-sm leading-relaxed mb-8 max-w-xs">
                      {t(p.desc)}
                    </p>
                    <span className="text-[13px] text-white/70 group-hover:text-white transition-colors inline-flex items-center gap-1.5">
                      {t(p.cta)}
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-28 md:py-40 border-t border-border overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(255,255,255,0.04), transparent 70%)",
          }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <Reveal as="div" className="lg:col-span-4">
              <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">
                {t("approachEyebrow")}
              </div>
              <h2 className="h-title text-4xl md:text-5xl">
                {t.rich("approachTitle", titleTags)}
              </h2>
            </Reveal>

            <Reveal as="div" className="lg:col-span-8" delay={120}>
              <p className="text-2xl md:text-[28px] leading-relaxed tracking-tight font-light text-ink">
                {t("approachBodyLead")}
                <span className="text-ink-muted">{t("approachBodyRest")}</span>
              </p>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
                {[
                  {
                    k: t("approachCard1Key"),
                    v: t("approachCard1Value"),
                    d: t("approachCard1Desc"),
                  },
                  {
                    k: t("approachCard2Key"),
                    v: t("approachCard2Value"),
                    d: t("approachCard2Desc"),
                  },
                  {
                    k: t("approachCard3Key"),
                    v: t("approachCard3Value"),
                    d: t("approachCard3Desc"),
                  },
                ].map((c) => (
                  <div key={c.k} className="bg-black p-6">
                    <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-3">
                      {c.k}
                    </div>
                    <div className="text-lg font-semibold mb-1">{c.v}</div>
                    <div className="text-xs text-ink-mute">{c.d}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative py-28 md:py-40 border-t border-border overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 70% 25%, rgba(255,255,255,0.04), transparent 70%)",
          }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-16">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">
                  {t("ecosystemEyebrow")}
                </div>
                <h2 className="h-title text-4xl md:text-5xl max-w-2xl">
                  {t.rich("ecosystemTitle", titleTags)}
                </h2>
              </div>
              <p className="text-ink-mute max-w-sm text-sm leading-relaxed">
                {t("ecosystemLead")}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {TOOLS.map((tool, i) => {
              const Visual = tool.Visual;
              return (
                <Reveal key={tool.href} delay={i * 100}>
                  <Link
                    href={tool.href}
                    className="card pillar-card rounded-2xl p-6 md:p-8 block group h-full"
                  >
                    <div className="glow-border rounded-xl bg-black/40 p-5 md:p-6 mb-7 overflow-hidden">
                      <Visual />
                    </div>
                    <div className="mono text-[10px] uppercase tracking-[0.35em] text-ink-faint mb-4">
                      {t(tool.tag)}
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-3">
                      {t(tool.title)}
                    </h3>
                    <p className="text-ink-mute text-sm leading-relaxed mb-6 max-w-md">
                      {t(tool.desc)}
                    </p>
                    <span className="text-[13px] text-white/70 group-hover:text-white transition-colors inline-flex items-center gap-1.5">
                      {t(tool.cta)}
                      <span className="transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
