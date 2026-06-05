import Link from "next/link";

export const metadata = {
  title: "FAQ",
  alternates: { canonical: "/faq" },
  description: "Questions fréquentes sur Meridian, ses outils et ses stratégies.",
};

const FAQ = [
  {
    q: "Meridian donne-t-il des signaux de trading ?",
    a: "Non. Aucun signal, aucune alerte, aucune recommandation d'achat ou de vente. Meridian propose des outils méthodologiques et des stratégies génériques pour structurer son approche.",
  },
  {
    q: "Est-ce du conseil en investissement ?",
    a: "Non. Meridian n'est pas un Conseiller en Investissements Financiers. Tous les contenus sont pédagogiques et restent dans le périmètre de la recommandation générale (Position AMF DOC-2008-23).",
  },
  {
    q: "À qui s'adresse Meridian ?",
    a: "Aux traders qui ont déjà passé la phase « apprendre à appuyer sur les boutons » et qui veulent structurer une approche durable : journal, gestion du risque, méthode, audit.",
  },
  {
    q: "Quels marchés sont couverts ?",
    a: "Les outils et stratégies Meridian sont génériques. Ils s'appliquent à la plupart des marchés liquides : forex, indices, actions, futures, crypto. Les exemples sont volontairement neutres.",
  },
  {
    q: "Qu'est-ce qui est gratuit, qu'est-ce qui est payant ?",
    a: "Les stratégies documentées et certains outils de base sont gratuits. Les outils premium (journal complet, audit avancé, modules de formation) seront payants au fur et à mesure de leur publication.",
  },
  {
    q: "Y a-t-il un Discord, une communauté ?",
    a: "Pas pour le moment. Meridian est une suite d'outils et de contenus, pas une communauté. L'objectif est l'autonomie, pas la dépendance à un groupe.",
  },
  {
    q: "Peut-on espérer des résultats garantis ?",
    a: "Non. Aucun outil, aucune méthode, aucune stratégie ne garantit de résultat. Le trading comporte un risque de perte en capital. Voir le disclaimer financier.",
  },
];

export default function Page() {
  return (
    <main className="relative pt-40 pb-32">
      <div className="max-w-wrap mx-auto px-6 sm:px-10">
        <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-10">
          ° FAQ
        </div>

        <h1 className="h-title text-5xl md:text-7xl max-w-3xl mb-8">
          Questions
          <br />
          <span className="shimmer">fréquentes.</span>
        </h1>

        <p className="text-ink-mute text-lg max-w-2xl leading-relaxed mb-20">
          Les questions qui reviennent. Réponses courtes, sans détour.
        </p>

        <div className="max-w-3xl divide-y divide-border border-y border-border">
          {FAQ.map((item, i) => (
            <details key={i} className="faq-item group py-6">
              <summary className="cursor-pointer list-none flex items-start justify-between gap-6">
                <span className="text-lg md:text-xl font-medium tracking-tight text-ink group-hover:text-white group-open:text-white transition-colors">
                  {item.q}
                </span>
                <span className="mono text-ink-faint text-lg leading-none mt-1 transition-transform duration-300 group-open:rotate-45 group-open:text-white">
                  +
                </span>
              </summary>
              <p className="faq-answer text-ink-mute text-base leading-relaxed mt-4 max-w-2xl">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-20 max-w-2xl">
          <p className="text-ink-mute text-sm leading-relaxed">
            Une question qui n'est pas listée ?{" "}
            <Link
              href="/legal"
              className="text-white underline-offset-4 underline decoration-ink-faint hover:decoration-white"
            >
              Consulte d'abord le cadre légal →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
