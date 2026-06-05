import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/outils" },
  title: "Outils Meridian — Suite trading",
  description:
    "Calculateur de position, checklist pré-trade, audit 100 trades, journal de trading. Quatre outils gratuits, un produit phare payant. Sans publicité, sans inscription forcée.",
};

type Tool = {
  num: string;
  name: string;
  category: string;
  shortName: string;
  desc: string;
  href: string;
  status: "live" | "soon" | "paid";
  features: string[];
};

const FREE_TOOLS: Tool[] = [
  {
    num: "01",
    name: "Calculateur Meridian",
    shortName: "Calculateur",
    category: "Calcul · Free",
    desc: "Capital, risque, taille de position, drawdown projeté sur 15 pertes consécutives. Sans inscription. Sans publicité.",
    href: "/outils/calculateur-position",
    status: "live",
    features: ["41 instruments", "28 paires forex", "Multi-scénarios", "URL partageable"],
  },
];

const PAID_TOOL: Tool = {
  num: "02",
  name: "Meridian Journal",
  shortName: "Journal",
  category: "Produit phare · Payant",
  desc: "Journal de trading automatisé. Import broker CSV, dashboard stats, Weekly Behavioral Report envoyé chaque dimanche soir.",
  href: "/journal",
  status: "paid",
  features: ["Import MT4/MT5", "Weekly Report auto", "Stats illimitées", "19 € / mois"],
};

const STATUS_LABEL: Record<Tool["status"], { label: string; className: string }> = {
  live: { label: "LIVE", className: "pill-green" },
  soon: { label: "À VENIR", className: "" },
  paid: { label: "PAYANT", className: "pill-white" },
};

export default function Page() {
  return (
    <main className="relative">
      <div className="radial-glow absolute inset-x-0 top-0 h-[560px] pointer-events-none" />

      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <span className="h-eyebrow">00 / 02 · Catalogue Outils</span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="h-title text-[44px] sm:text-[64px] lg:text-[80px] mt-4 max-w-4xl text-white">
              Les outils.
              <br />
              <span className="shimmer">Free et payants.</span>
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-7 max-w-2xl text-[17px] text-ink-mute leading-relaxed">
              Un outil gratuit pour calculer avant le trade.
              Un produit phare payant pour mesurer après. Aucun outil
              n&apos;est conçu pour te faire trader plus — chacun est conçu pour te faire
              trader mieux.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative pb-16">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="flex items-center justify-between mb-6">
              <span className="h-eyebrow">Free · sans inscription</span>
              <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                1 outil
              </span>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {FREE_TOOLS.map((t, i) => (
              <Reveal key={t.href} delay={i * 100}>
                <ToolCard tool={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-20 lg:pb-28">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="flex items-center justify-between mb-6">
              <span className="h-eyebrow">Payant · produit phare</span>
              <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                1 outil
              </span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Link
              href={PAID_TOOL.href}
              className="card rounded-2xl p-7 lg:p-10 block group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-8">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
                      {PAID_TOOL.num}
                    </span>
                    <span className={`pill ${STATUS_LABEL[PAID_TOOL.status].className}`}>
                      {STATUS_LABEL[PAID_TOOL.status].label}
                    </span>
                    <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                      {PAID_TOOL.category}
                    </span>
                  </div>
                  <h2 className="text-[28px] lg:text-[36px] text-white font-semibold tracking-tight">
                    {PAID_TOOL.name}
                  </h2>
                  <p className="mt-4 text-[15px] lg:text-[16px] text-ink-mute leading-relaxed max-w-2xl">
                    {PAID_TOOL.desc}
                  </p>
                </div>
                <div className="lg:col-span-4">
                  <ul className="space-y-2">
                    {PAID_TOOL.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-3 text-[13px] text-ink-mute"
                      >
                        <span className="mono text-ink-faint">·</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-white/80 group-hover:text-white transition-colors">
                    Découvrir
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="relative py-16 lg:py-20 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="h-eyebrow">Règle</span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="h-title text-[28px] lg:text-[36px] mt-4 text-white">
                  Free, c&apos;est le savoir.
                  <br />
                  <span className="shimmer">Payant, c&apos;est l&apos;automatisation.</span>
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={160}>
                <p className="text-[15px] lg:text-[16px] text-ink-mute leading-relaxed">
                  Les outils gratuits couvrent les calculs et les checklists qu&apos;un trader
                  fait à la main avant d&apos;entrer dans une position. Le produit phare payant
                  automatise ce qu&apos;un trader fait à la main après — journaliser, identifier
                  les patterns, mesurer l&apos;edge sur la durée. Aucune feature gratuite n&apos;est
                  bridée pour pousser à l&apos;upgrade.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const status = STATUS_LABEL[tool.status];
  const isLive = tool.status === "live";

  return (
    <Link
      href={tool.href}
      className="pillar-card bg-black p-7 lg:p-10 block group hover:bg-[#070707] h-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
              {tool.num}
            </span>
            <span className={`pill ${status.className}`}>{status.label}</span>
            <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              {tool.category}
            </span>
          </div>

          <h3 className="text-[28px] lg:text-[36px] text-white font-semibold tracking-tight">
            {tool.name}
          </h3>

          <p className="mt-4 text-[15px] lg:text-[16px] text-ink-mute leading-relaxed max-w-2xl">
            {tool.desc}
          </p>
        </div>

        <div className="lg:col-span-4">
          <ul className="space-y-2">
            {tool.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 text-[13px] text-ink-mute"
              >
                <span className="mono text-ink-faint">·</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <span
            className={`mt-6 inline-flex items-center gap-1.5 text-[13px] transition-colors ${
              isLive ? "text-white/90 group-hover:text-white" : "text-ink-mute group-hover:text-white"
            }`}
          >
            {isLive ? "Utiliser l'outil" : "En savoir plus"}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
