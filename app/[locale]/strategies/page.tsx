import Link from "next/link";
import { CandleChart } from "@/components/candle-chart";
import { STRATEGIES, MARKET_TYPE_LABELS, type MarketType } from "@/lib/strategies";

export const metadata = {
  title: "Stratégies",
  alternates: { canonical: "/strategies" },
};

const MARKET_TYPE_TAG: Record<MarketType, string> = {
  tendance: "tag-tendance",
  range: "tag-range",
  breakout: "tag-breakout",
  volatilite: "tag-vol",
};

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

export default function StrategiesPage() {
  return (
    <>
      <header className="relative pt-32 pb-16 overflow-hidden radial-glow">
        <div
          className="blob bg-white"
          style={{ width: "420px", height: "420px", top: "-80px", left: "-80px", opacity: 0.08 }}
        />
        <div
          className="blob bg-white"
          style={{ width: "320px", height: "320px", top: "120px", right: "-60px", opacity: 0.05 }}
        />

        <div className="max-w-wrap mx-auto px-5 sm:px-8 relative">
          <div className="pill mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>Stratégies · {STRATEGIES.length} configurations</span>
          </div>

          <h1 className="h-title text-5xl md:text-7xl lg:text-[80px] max-w-4xl mb-7">
            Trois configurations.<br />
            Un seul objectif&nbsp;: <span className="shimmer">lire le marché</span>.
          </h1>

          <p className="text-ink-mute text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            Une bibliothèque visuelle de concepts de trading manuel. Chaque module explique
            le schéma de prix, la logique d'opportunité, la checklist d'exécution et la méthode de
            vérification — sans une seule statistique inventée.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border max-w-2xl">
            <div className="bg-black p-5">
              <div className="h-eyebrow">Modules</div>
              <div className="text-2xl font-bold mt-1.5">{String(STRATEGIES.length).padStart(2, "0")}</div>
            </div>
            <div className="bg-black p-5">
              <div className="h-eyebrow">Régimes</div>
              <div className="text-2xl font-bold mt-1.5">{String(new Set(STRATEGIES.map((s) => s.marketType)).size).padStart(2, "0")}</div>
            </div>
            <div className="bg-black p-5">
              <div className="h-eyebrow">Items checklist</div>
              <div className="text-2xl font-bold mt-1.5">{String(STRATEGIES.reduce((n, s) => n + s.checklist.length, 0)).padStart(2, "0")}</div>
            </div>
            <div className="bg-black p-5">
              <div className="h-eyebrow">Stats inventées</div>
              <div className="text-2xl font-bold mt-1.5">00</div>
            </div>
          </div>
        </div>
      </header>

      <section className="border-y border-border bg-panel">
        <div className="max-w-wrap mx-auto px-5 sm:px-8 py-6 flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full border border-risk/40 text-risk flex items-center justify-center font-bold text-sm">
            !
          </div>
          <p className="text-sm text-ink-mute leading-relaxed">
            <strong className="text-white">
              Aucune statistique de performance n'est affichée dans ce document.
            </strong>{" "}
            Les configurations présentées sont des modèles théoriques décrits dans la littérature
            de trading. Aucune n'est validée empiriquement ici — chaque concept doit être{" "}
            <strong className="text-white">backtesté manuellement</strong> avant toute utilisation
            en capital réel. Ce document ne constitue pas un conseil en investissement.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-wrap mx-auto px-5 sm:px-8 mb-12">
          <div className="h-eyebrow mb-3">Curriculum · {STRATEGIES.length} modules</div>
          <h2 className="h-title text-4xl md:text-5xl mb-4">Le programme complet.</h2>
          <p className="text-ink-mute max-w-2xl leading-relaxed">
            Chaque module présente une configuration de prix observable, sa logique d'entrée, son
            invalidation, et la méthode pour vérifier sa pertinence sur ton marché et ton timeframe.
          </p>
        </div>

        <div className="max-w-wrap mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {STRATEGIES.map((s) => (
              <Link
                key={s.id}
                href={`/strategies/${s.slug}`}
                className="card rounded-2xl overflow-hidden block group"
              >
                <div className="p-6 border-b border-border flex items-start justify-between gap-4">
                  <div>
                    <div className="h-eyebrow mb-2">
                      Module {String(s.id).padStart(2, "0")} / {String(STRATEGIES.length).padStart(2, "0")}
                    </div>
                    <h3 className="font-bold text-2xl tracking-tight mb-3 group-hover:text-white transition">
                      {s.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className={`pill ${MARKET_TYPE_TAG[s.marketType]}`}>
                        {MARKET_TYPE_LABELS[s.marketType]}
                      </span>
                      <span className="pill">{s.timeframe}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="h-eyebrow mb-2">Complexité</div>
                    {difficultyDots(s.complexity)}
                  </div>
                </div>

                <div className="p-4 bg-black/40 border-b border-border">
                  <CandleChart config={s.chart} id={`lab-${s.id}`} />
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <div className="h-eyebrow mb-2">Conditions idéales</div>
                    <p className="text-sm text-ink-mute leading-relaxed line-clamp-3">
                      {s.conditions}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                    <div className="flex gap-4 text-ink-muted font-mono">
                      <span>
                        Fréq. <strong className="text-white">{s.frequency}</strong>
                      </span>
                      <span>
                        Psy. <strong className="text-white">{s.psychDifficulty}/5</strong>
                      </span>
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-ink-mute group-hover:text-white transition">
                      {s.hasDeepDive ? "Anatomie complète →" : "Développer →"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="py-24">
        <div className="max-w-wrap mx-auto px-5 sm:px-8 mb-12">
          <div className="h-eyebrow mb-3">Synthèse · Tableau comparatif</div>
          <h2 className="h-title text-4xl md:text-5xl mb-4">
            Choisir le bon module<br />selon ton profil.
          </h2>
          <p className="text-ink-mute max-w-2xl leading-relaxed">
            Croise régime de marché, complexité d'exécution, fréquence et exigence psychologique
            pour identifier la configuration adaptée à ton style.
          </p>
        </div>

        <div className="max-w-wrap mx-auto px-5 sm:px-8 overflow-x-auto">
          <table className="w-full border border-border rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-panel">
                <th className="text-left p-4 h-eyebrow font-mono">Configuration</th>
                <th className="text-left p-4 h-eyebrow font-mono">Marché</th>
                <th className="text-left p-4 h-eyebrow font-mono">Complexité</th>
                <th className="text-left p-4 h-eyebrow font-mono">Fréquence</th>
                <th className="text-left p-4 h-eyebrow font-mono hidden md:table-cell">
                  Conditions optimales
                </th>
                <th className="text-left p-4 h-eyebrow font-mono">Psy.</th>
              </tr>
            </thead>
            <tbody>
              {STRATEGIES.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-border hover:bg-white/[0.02] transition"
                >
                  <td className="p-4">
                    <Link
                      href={`/strategies/${s.slug}`}
                      className="flex items-center gap-3 group"
                    >
                      <span className="font-mono text-[11px] text-ink-faint">
                        {String(s.id).padStart(2, "0")}
                      </span>
                      <span className="font-semibold group-hover:text-white transition">
                        {s.name}
                      </span>
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className={`pill ${MARKET_TYPE_TAG[s.marketType]}`}>
                      {MARKET_TYPE_LABELS[s.marketType]}
                    </span>
                  </td>
                  <td className="p-4">{difficultyDots(s.complexity)}</td>
                  <td className="p-4">
                    <span className="font-mono text-xs uppercase text-ink-mute">
                      {s.frequency}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell text-sm text-ink-mute max-w-xs">
                    {s.optimalConditions}
                  </td>
                  <td className="p-4">{difficultyDots(s.psychDifficulty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
