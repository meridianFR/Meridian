import Link from "next/link";

export const metadata = {
  title: "Formation",
  alternates: { canonical: "/formation" },
  description:
    "Modules de formation Meridian — comprendre, mesurer, structurer son approche de trading.",
};

const MODULES = [
  {
    eyebrow: "Module 01",
    title: "Fondamentaux",
    desc: "Lecture de marché, structure, contexte. Construire une grille d'analyse.",
  },
  {
    eyebrow: "Module 02",
    title: "Risque & taille de position",
    desc: "Sizing, stop, drawdown. Ce qui sépare le trader qui dure.",
  },
  {
    eyebrow: "Module 03",
    title: "Journal & audit",
    desc: "Mesurer ce qu'on fait. Identifier son edge. Corriger ses biais.",
  },
];

export default function Page() {
  return (
    <main className="relative pt-40 pb-32">
      <div className="max-w-wrap mx-auto px-6 sm:px-10">
        <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-10">
          ° Formation
        </div>

        <h1 className="h-title text-5xl md:text-7xl max-w-3xl mb-8">
          Apprendre
          <br />
          <span className="shimmer">proprement.</span>
        </h1>

        <p className="text-ink-mute text-lg max-w-2xl leading-relaxed mb-20">
          Une pédagogie sans hype. Pas de promesse de revenus, pas de recette magique.
          Les briques qui permettent de comprendre ce qu'on trade et de mesurer ce qu'on fait.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
          {MODULES.map((m) => (
            <div key={m.title} className="bg-black p-8 md:p-10">
              <div className="mono text-[10px] uppercase tracking-[0.35em] text-ink-faint mb-5">
                {m.eyebrow}
              </div>
              <div className="text-xl font-semibold tracking-tight mb-3">{m.title}</div>
              <p className="text-ink-mute text-sm leading-relaxed mb-6">{m.desc}</p>
              <span className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                Bientôt
              </span>
            </div>
          ))}
        </div>

        <div className="mt-20 max-w-2xl">
          <p className="text-ink-mute text-sm leading-relaxed">
            La formation Meridian est en construction.{" "}
            <Link
              href="/strategies"
              className="text-white underline-offset-4 underline decoration-ink-faint hover:decoration-white"
            >
              En attendant, explore les stratégies →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
