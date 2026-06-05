import Link from "next/link";
import { notFound } from "next/navigation";
import { CandleChart } from "@/components/candle-chart";
import {
  STRATEGIES,
  MARKET_TYPE_LABELS,
  OPP_KEYS,
  getStrategyBySlug,
  type MarketType,
} from "@/lib/strategies";

const MARKET_TYPE_TAG: Record<MarketType, string> = {
  tendance: "tag-tendance",
  range: "tag-range",
  breakout: "tag-breakout",
  volatilite: "tag-vol",
};

export function generateStaticParams() {
  return STRATEGIES.map((s) => ({ slug: s.slug }));
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = getStrategyBySlug(slug);
  if (!s) return { title: "Stratégie introuvable" };
  return {
    title: s.name,
    description: `${s.name} : ${s.patternDesc}`,
    alternates: { canonical: `/strategies/${slug}` },
  };
}

function difficultyDots(level: number, max = 5) {
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`inline-block w-1.5 h-1.5 rounded-full ${
            i < level ? "bg-white" : "bg-border-2"
          }`}
        />
      ))}
    </span>
  );
}

export default async function StrategyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = getStrategyBySlug(slug);
  if (!s) notFound();

  return (
    <>
      <header className="relative pt-32 pb-12 overflow-hidden radial-glow">
        <div
          className="blob bg-white"
          style={{ width: "380px", height: "380px", top: "-80px", left: "-80px", opacity: 0.06 }}
        />

        <div className="max-w-wrap mx-auto px-5 sm:px-8 relative">
          <Link
            href="/strategies"
            className="font-mono text-[11px] uppercase tracking-widest text-ink-mute hover:text-white transition inline-block mb-8"
          >
            ← Curriculum complet
          </Link>

          <div className="pill mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>Module {String(s.id).padStart(2, "0")} / {String(STRATEGIES.length).padStart(2, "0")} · Anatomie</span>
          </div>

          <h1 className="h-title text-5xl md:text-7xl max-w-4xl mb-7">
            {s.name}.
          </h1>

          <p className="text-ink-mute text-lg max-w-2xl leading-relaxed mb-10">
            {s.patternDesc}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            <div className="bg-black p-5">
              <div className="h-eyebrow mb-1.5">Timeframe</div>
              <div className="font-bold">{s.timeframe}</div>
            </div>
            <div className="bg-black p-5">
              <div className="h-eyebrow mb-1.5">Marchés</div>
              <div className="font-bold text-sm leading-tight">{s.market}</div>
            </div>
            <div className="bg-black p-5">
              <div className="h-eyebrow mb-1.5">Régime</div>
              <div className="font-bold">{MARKET_TYPE_LABELS[s.marketType]}</div>
            </div>
            <div className="bg-black p-5">
              <div className="h-eyebrow mb-1.5">Complexité</div>
              <div className="mt-1">{difficultyDots(s.complexity)}</div>
            </div>
            <div className="bg-black p-5">
              <div className="h-eyebrow mb-1.5">Fréquence</div>
              <div className="font-bold capitalize">{s.frequency}</div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-16">
        <div className="max-w-wrap mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <div className="card rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <span className="h-eyebrow">Schéma · {s.name}</span>
                  <span className="font-mono text-[10px] text-ink-mute">{s.timeframe}</span>
                </div>
                <CandleChart config={s.chart} id={`detail-${s.id}`} />
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
                  <span className="flex items-center gap-2 text-xs text-ink-mute">
                    <span className="w-2 h-2 rounded-full bg-[#e5e7eb]" />
                    Entry
                  </span>
                  <span className="flex items-center gap-2 text-xs text-ink-mute">
                    <span className="w-2 h-2 rounded-full bg-risk" />
                    Stop Loss
                  </span>
                  <span className="flex items-center gap-2 text-xs text-ink-mute">
                    <span className="w-2 h-2 rounded-full bg-edge" />
                    Take Profit
                  </span>
                  <span className="flex items-center gap-2 text-xs text-ink-mute">
                    <span className="w-3 h-0.5 bg-[#c9a96e]" />
                    Niveau / Structure
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="h-eyebrow mb-3">Conditions idéales</div>
                <p className="text-ink-mute leading-relaxed text-sm">{s.conditions}</p>
              </div>
              <div>
                <div className="h-eyebrow mb-3">Lecture du schéma</div>
                <p className="text-ink-mute leading-relaxed text-sm">{s.patternDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="py-20">
        <div className="max-w-wrap mx-auto px-5 sm:px-8">
          <div className="h-eyebrow mb-3">Schéma d'opportunité</div>
          <h2 className="h-title text-3xl md:text-4xl mb-10">
            Décomposition de la <span className="shimmer">configuration</span>.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OPP_KEYS.map(([key, label]) => (
              <div key={key} className="card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="h-eyebrow">{label}</span>
                </div>
                <p className="text-ink-mute leading-relaxed text-sm">{s.opportunity[key]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="py-20">
        <div className="max-w-wrap mx-auto px-5 sm:px-8">
          <div className="h-eyebrow mb-3">Checklist opérationnelle</div>
          <h2 className="h-title text-3xl md:text-4xl mb-10">
            Six questions <span className="shimmer">avant l'entrée</span>.
          </h2>

          <div className="space-y-3 max-w-3xl">
            {s.checklist.map((q, i) => (
              <div
                key={i}
                className="card rounded-xl p-4 flex items-start gap-4"
              >
                <span className="font-mono text-[11px] text-ink-faint flex-shrink-0 mt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-ink-mute leading-relaxed">{q}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="py-20">
        <div className="max-w-wrap mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="h-eyebrow mb-3">Comment backtester</div>
              <h2 className="h-title text-3xl mb-6">Vérifier sur tes données.</h2>
              <div className="glow-border rounded-2xl p-6">
                <p className="text-ink-mute leading-relaxed text-sm">{s.backtest}</p>
              </div>
            </div>
            <div>
              <div className="h-eyebrow mb-3">État des preuves</div>
              <h2 className="h-title text-3xl mb-6">Aucune statistique avancée.</h2>
              <div className="space-y-2">
                {s.evidenceState.map((state, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 border border-risk/30 bg-risk/[0.06] rounded-xl"
                  >
                    <span className="text-risk font-bold">⚠</span>
                    <span className="text-sm text-ink-mute">{state}</span>
                  </div>
                ))}
                <p className="text-xs text-ink-faint mt-4 leading-relaxed">
                  Chaque concept doit être backtesté manuellement avant toute utilisation en
                  capital réel. Ce document ne constitue pas un conseil en investissement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {s.hasDeepDive && (
        <section className="py-20 border-t border-border bg-panel/30">
          <div className="max-w-wrap mx-auto px-5 sm:px-8 text-center">
            <div className="h-eyebrow mb-3">Anatomie complète disponible</div>
            <h2 className="h-title text-3xl md:text-4xl mb-4">
              Dix chapitres pour <span className="shimmer">décortiquer</span>.
            </h2>
            <p className="text-ink-mute max-w-2xl mx-auto mb-8 leading-relaxed">
              Définition, phases, qualification, bougie de cassure, scénarios, gestion, filtres,
              pièges, checklist exhaustive et méthodologie de backtest.
            </p>
            <Link href={`/strategies/${s.slug}/anatomie`} className="btn btn-primary">
              Ouvrir l'anatomie complète →
            </Link>
          </div>
        </section>
      )}

      <section className="py-16 border-t border-border">
        <div className="max-w-wrap mx-auto px-5 sm:px-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/strategies"
            className="font-mono text-[11px] uppercase tracking-widest text-ink-mute hover:text-white transition"
          >
            ← Retour au curriculum
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            Module {String(s.id).padStart(2, "0")} / {String(STRATEGIES.length).padStart(2, "0")}
          </span>
        </div>
      </section>
    </>
  );
}
