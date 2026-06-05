import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { Calculator } from "./Calculator";

export const metadata: Metadata = {
  alternates: { canonical: "/outils/calculateur-position" },
  title: "Calculateur Meridian — Taille de position et risque",
  description:
    "Capital, risque, taille de position, drawdown projeté. Sans publicité, sans inscription, sans affiliation broker. Trois secondes avant chaque trade.",
  openGraph: {
    title: "Calculateur Meridian — Taille de position et risque",
    description:
      "Capital, risque, taille de position, drawdown projeté. Trois secondes. Sans inscription.",
    type: "website",
  },
};

const METHOD = [
  {
    num: "01",
    title: "Ce que font les autres calculateurs.",
    body: "Ils traitent le risque comme une formule isolée. Tu remplis huit champs, tu cliques Calculer, tu obtiens un chiffre déconnecté du reste. Le drawdown n'apparaît jamais. La pip value est cachée. La page se charge avec trois bannières publicitaires et un lien d'affiliation broker.",
  },
  {
    num: "02",
    title: "Ce que fait le Calculateur Meridian.",
    body: "Il traite le risque comme un système. Risque, taille de position, R-multiple, drawdown projeté sur quinze pertes consécutives — un seul écran. Sans bouton Calculer : chaque valeur que tu changes met à jour le résultat instantanément.",
  },
  {
    num: "03",
    title: "Ce que tu ne trouveras pas.",
    body: "Pas de publicité. Pas d'affiliation broker. Pas d'inscription forcée. Pas de capture email agressive. Pas de signal d'achat ou de vente. Pas de promesse de gain. Aucun montant en euros associé à une stratégie nommée.",
  },
  {
    num: "04",
    title: "Ce que tu trouveras à la place.",
    body: "Un instrument que tu utilises trois secondes avant chaque trade. Une mémoire locale de tes préférences. Une URL partageable qui encode tout ton calcul. Une méthode liée au framework de gestion du risque, gratuit, sans email demandé.",
  },
];

const FAQ = [
  {
    q: "Pourquoi pas de bouton « Calculer » ?",
    a: "Le calcul est instantané. Chaque valeur que tu changes met à jour le résultat sans clic. Le bouton Calculer est un héritage des formulaires bancaires des années 2010. Tu n'en as pas besoin.",
  },
  {
    q: "Comment Meridian connaît la pip value de mon instrument ?",
    a: "L'outil utilise les spécifications standard de chaque instrument (taille de contrat, pip size) combinées au prix d'entrée que tu saisis. Pour convertir vers la devise de ton compte, des taux indicatifs sont appliqués — ils peuvent être affinés en mode avancé dans une prochaine version.",
  },
  {
    q: "Pourquoi 1 % comme valeur par défaut ?",
    a: "1 % est une référence pédagogique répandue, pas une vérité. La bonne valeur dépend de ton edge mesuré, de ton drawdown tolérable et de ton horizon. Le framework Gestion du risque détaille pourquoi 1 % est arbitraire.",
  },
  {
    q: "Que veut dire « drawdown projeté » ?",
    a: "C'est la perte cumulée si tu enchaînes N pertes consécutives à ton risque actuel. À 1 % par trade, dix pertes consécutives effacent 9,56 % du capital. La maths est géométrique, pas linéaire. Aucun calculateur classique ne l'affiche.",
  },
  {
    q: "Mes données sont-elles stockées quelque part ?",
    a: "Capital, devise et instruments favoris sont stockés dans le navigateur local (localStorage). Rien n'est envoyé à un serveur Meridian. Tu peux tout effacer en vidant le stockage du site.",
  },
  {
    q: "Pourquoi Meridian n'affiche pas mon broker ?",
    a: "Meridian ne fait aucune affiliation broker. Les calculateurs qui en font perdent leur neutralité : le résultat est subtilement orienté pour t'inciter à ouvrir un compte. Ici, le résultat est juste le calcul.",
  },
  {
    q: "Et si je veux logger mes trades ?",
    a: "Meridian Journal arrive plus tard cette année. Cet outil est l'avant-poste : ce que tu calcules avant le trade, le Journal le mesure après.",
  },
  {
    q: "L'outil fonctionne-t-il sur mobile ?",
    a: "Oui. Conçu mobile-first : les inputs ont une hauteur tactile confortable, les chiffres restent lisibles sans zoom, et le clavier numérique se déclenche automatiquement sur les champs de prix.",
  },
];

export default function Page() {
  return (
    <main className="relative">
      <div className="radial-glow absolute inset-x-0 top-0 h-[600px] pointer-events-none" />

      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <Link
              href="/outils"
              className="mono text-[11px] uppercase tracking-[0.3em] text-ink-faint hover:text-white transition-colors inline-flex items-center gap-2"
            >
              <span>←</span> Tous les outils
            </Link>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <Reveal delay={80}>
                <span className="h-eyebrow">01 / 02 · Outil · Free</span>
              </Reveal>
              <Reveal delay={140}>
                <h1 className="h-title text-[44px] sm:text-[56px] lg:text-[72px] mt-4 text-white">
                  Calculateur Meridian.
                  <br />
                  <span className="shimmer">Avant d&apos;entrer.</span>
                </h1>
              </Reveal>
              <Reveal delay={220}>
                <p className="mt-6 max-w-xl text-[16px] lg:text-[17px] text-ink-mute leading-relaxed">
                  Capital, risque, taille de position, drawdown projeté.
                  Trois secondes. Sans inscription, sans publicité, sans affiliation broker.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-4">
              <Reveal delay={300}>
                <div className="grid grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
                  <Kpi label="Instruments" value="23" />
                  <Kpi label="Devises" value="4" />
                  <Kpi label="Inscription" value="—" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="relative" aria-label="Calculateur">
        <div className="max-w-wrap mx-auto px-6 sm:px-10 pb-20">
          <Reveal>
            <Calculator />
          </Reveal>
        </div>
      </section>

      <section id="methode" className="relative py-20 lg:py-28 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4">
              <Reveal>
                <span className="h-eyebrow">Méthode</span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="h-title text-[32px] lg:text-[44px] mt-4 text-white">
                  Pourquoi cet outil <span className="shimmer">est différent.</span>
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-5 text-[15px] text-ink-mute leading-relaxed">
                  Cinq points qui séparent un calculateur jetable d&apos;un instrument
                  que tu utilises à chaque trade.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8 space-y-3">
              {METHOD.map((m, i) => (
                <Reveal key={m.num} delay={i * 80}>
                  <article className="card rounded-2xl p-6 lg:p-7">
                    <div className="flex items-start gap-6">
                      <span className="mono text-[12px] uppercase tracking-[0.25em] text-ink-faint shrink-0 mt-1">
                        {m.num}
                      </span>
                      <div>
                        <h3 className="text-[18px] lg:text-[20px] text-white font-semibold tracking-tight">
                          {m.title}
                        </h3>
                        <p className="mt-3 text-[14px] lg:text-[15px] text-ink-mute leading-relaxed">
                          {m.body}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-28 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4">
              <Reveal>
                <span className="h-eyebrow">Questions</span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="h-title text-[32px] lg:text-[44px] mt-4 text-white">
                  Ce que <span className="shimmer">tu te demandes.</span>
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-5 text-[15px] text-ink-mute leading-relaxed">
                  Huit réponses courtes. Si une question manque, écris-nous : on l&apos;ajoute.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8 space-y-2">
              {FAQ.map((item, i) => (
                <Reveal key={i} delay={i * 50}>
                  <details className="card rounded-2xl p-5 lg:p-6 group">
                    <summary className="cursor-pointer flex items-center justify-between gap-4 text-[15px] lg:text-[16px] text-white list-none">
                      <span className="font-medium tracking-tight">{item.q}</span>
                      <span className="mono text-[20px] text-ink-faint group-open:rotate-45 transition-transform shrink-0">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 text-[14px] lg:text-[15px] text-ink-mute leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 lg:py-28 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="h-eyebrow">Suite logique</span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="h-title text-[28px] lg:text-[36px] mt-4 text-white">
                  Le calcul, c&apos;est avant.
                  <br />
                  <span className="shimmer">La mesure, c&apos;est après.</span>
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-5 text-[15px] text-ink-mute leading-relaxed max-w-xl">
                  Ce que tu calcules ici, Meridian Journal le mesure après le trade.
                  Heures profitables, instruments rentables, patterns d&apos;erreur récurrents.
                  Disponible plus tard cette année.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5 flex lg:items-end lg:justify-end">
              <Reveal delay={220}>
                <div className="flex flex-wrap gap-3">
                  <Link href="/journal" className="btn btn-primary">
                    Découvrir Journal
                  </Link>
                  <Link href="/strategies" className="btn btn-ghost">
                    Voir les stratégies
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-20">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="rounded-xl border border-border bg-panel p-5 lg:p-6">
            <p className="mono text-[10px] uppercase tracking-[0.15em] text-ink-faint leading-relaxed">
              Outil pédagogique. Les calculs reposent sur les paramètres que tu saisis et sur
              des taux de conversion indicatifs. Le trading de produits à effet de levier
              comporte un risque élevé de perte en capital. Meridian ne fournit aucun conseil
              en investissement ni recommandation personnalisée (AMF, Position DOC-2008-23).
              Les performances passées ne préjugent pas des performances futures.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-panel px-4 py-4 lg:px-5 lg:py-5">
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        {label}
      </div>
      <div className="mono text-[22px] lg:text-[26px] tabular-nums tracking-tight text-white mt-1.5 leading-none">
        {value}
      </div>
    </div>
  );
}
