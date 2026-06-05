import Link from "next/link";
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

const MARQUEE = [
  "Stratégies documentées",
  "Calculateur de position",
  "Calculateur de risque",
  "Journal de trading",
  "Checklist pré-trade",
  "Formation méthodique",
];

const PILLARS = [
  {
    eyebrow: "01 — Stratégies",
    title: "Méthodes structurées",
    desc: "Des configurations génériques, documentées, sans promesses. Lisibles, testables, adaptables.",
    cta: "Explorer",
    href: "/strategies",
    Visual: StrategyVisual,
  },
  {
    eyebrow: "02 — Outils",
    title: "Calculateur & Journal",
    desc: "Un calculateur de position et un journal de trading. Calculer avant. Mesurer après.",
    cta: "Voir les outils",
    href: "/outils",
    Visual: ToolsVisual,
  },
  {
    eyebrow: "03 — Formation",
    title: "Apprendre proprement",
    desc: "Une pédagogie sans hype. Comprendre ce qu'on trade, mesurer ce qu'on fait.",
    cta: "Découvrir",
    href: "/formation",
    Visual: FormationVisual,
  },
];

const TOOLS = [
  {
    tag: "Stratégie",
    title: "Des setups que tu peux mesurer",
    desc: "Entrée, stop, objectif : chaque configuration est documentée, générique et testable. Tu sais pourquoi tu entres — et où tu sors.",
    href: "/strategies",
    cta: "Voir les stratégies",
    Visual: StrategyShowcase,
  },
  {
    tag: "Calculatrice",
    title: "La taille de position, sans erreur",
    desc: "Capital, risque, stop : la calculatrice te donne le lot exact à trader. Tu calibres ton risque avant d'appuyer sur le bouton.",
    href: "/outils",
    cta: "Ouvrir la calculatrice",
    Visual: CalculatorShowcase,
  },
  {
    tag: "Journal",
    title: "Mesure ce que tu fais vraiment",
    desc: "Chaque trade enregistré, ta courbe d'équité, tes statistiques. Le journal transforme ton historique en décisions.",
    href: "/journal",
    cta: "Découvrir le journal",
    Visual: JournalShowcase,
  },
  {
    tag: "Formations",
    title: "Apprendre proprement, étape par étape",
    desc: "Des modules progressifs, sans hype : comprendre ce que tu trades avant de risquer un euro. Une pédagogie de discipline.",
    href: "/formation",
    cta: "Suivre les formations",
    Visual: FormationShowcase,
  },
];

export default function Home() {
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
                ° Meridian — 2026
              </div>

              <h1 className="h-title text-[44px] sm:text-[64px] md:text-[80px] lg:text-[92px] fade-in-up">
                Trade ce que
                <br />
                tu <span className="shimmer">mesures.</span>
              </h1>

              <p className="text-ink-mute text-base md:text-lg max-w-xl mt-10 leading-relaxed fade-in-up-2">
                Outils et stratégies pour traders sérieux. Pas de signaux. Pas de promesses.
                Une méthode.
              </p>

              <div className="flex flex-wrap gap-3 mt-12 fade-in-up-3">
                <Link href="/strategies" className="btn btn-primary">
                  Explorer les stratégies
                </Link>
                <Link href="/outils" className="btn btn-ghost">
                  Voir les outils
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 fade-in-up-2">
              <div className="relative glow-border glow-border-live rounded-2xl bg-black/40 backdrop-blur-sm p-5">
                <HeroChart />
              </div>
              <div className="grid grid-cols-3 gap-px mt-3 bg-border rounded-xl overflow-hidden border border-border hairline-top">
                {[
                  { k: "Outils", v: "2" },
                  { k: "Stratégies", v: String(STRATEGIES.length) },
                  { k: "Marché", v: "FR" },
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
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
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
                  ° Trois piliers
                </div>
                <h2 className="h-title text-4xl md:text-5xl max-w-2xl">
                  Trois axes,
                  <br />
                  <span className="shimmer">une méthode.</span>
                </h2>
              </div>
              <p className="text-ink-mute max-w-sm text-sm leading-relaxed">
                Mesurer, structurer, comprendre. Chaque pilier vit indépendamment, mais
                s'assemble dans une approche cohérente.
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
                      {p.eyebrow}
                    </div>
                    <div className="mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Visual />
                    </div>
                    <div className="text-2xl md:text-[26px] font-semibold tracking-tight mb-3">
                      {p.title}
                    </div>
                    <p className="text-ink-mute text-sm leading-relaxed mb-8 max-w-xs">
                      {p.desc}
                    </p>
                    <span className="text-[13px] text-white/70 group-hover:text-white transition-colors inline-flex items-center gap-1.5">
                      {p.cta}
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
                ° Approche
              </div>
              <h2 className="h-title text-4xl md:text-5xl">
                Pas de hype.
                <br />
                <span className="shimmer">Une discipline.</span>
              </h2>
            </Reveal>

            <Reveal as="div" className="lg:col-span-8" delay={120}>
              <p className="text-2xl md:text-[28px] leading-relaxed tracking-tight font-light text-ink">
                Meridian n'est pas un service de signaux ni une école de gourous.
                <span className="text-ink-muted">
                  {" "}
                  Ce sont des outils et des stratégies génériques, pensés pour mesurer,
                  discipliner et durer — au-delà du prochain cycle.
                </span>
              </p>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
                {[
                  { k: "Approche", v: "Méthodique", d: "Pas d'improvisation." },
                  { k: "Posture", v: "Générique", d: "Pas de signaux." },
                  { k: "Horizon", v: "Long terme", d: "Pas de promesse." },
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
                  ° L'écosystème
                </div>
                <h2 className="h-title text-4xl md:text-5xl max-w-2xl">
                  Tout ce que Meridian
                  <br />
                  <span className="shimmer">met entre tes mains.</span>
                </h2>
              </div>
              <p className="text-ink-mute max-w-sm text-sm leading-relaxed">
                Quatre briques, une seule logique : calculer avant, mesurer après,
                et progresser sur des bases mesurables.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {TOOLS.map((t, i) => {
              const Visual = t.Visual;
              return (
                <Reveal key={t.tag} delay={i * 100}>
                  <Link
                    href={t.href}
                    className="card pillar-card rounded-2xl p-6 md:p-8 block group h-full"
                  >
                    <div className="glow-border rounded-xl bg-black/40 p-5 md:p-6 mb-7 overflow-hidden">
                      <Visual />
                    </div>
                    <div className="mono text-[10px] uppercase tracking-[0.35em] text-ink-faint mb-4">
                      {t.tag}
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-3">
                      {t.title}
                    </h3>
                    <p className="text-ink-mute text-sm leading-relaxed mb-6 max-w-md">
                      {t.desc}
                    </p>
                    <span className="text-[13px] text-white/70 group-hover:text-white transition-colors inline-flex items-center gap-1.5">
                      {t.cta}
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
