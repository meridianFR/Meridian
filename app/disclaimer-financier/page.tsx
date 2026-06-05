import Link from "next/link";

export const metadata = {
  title: "Disclaimer financier",
  description:
    "Aucun conseil en investissement. Le trading comporte un risque de perte en capital. Les performances passées ne garantissent pas les performances futures.",
};

export default function Page() {
  return (
    <main className="relative pt-40 pb-32">
      <div className="max-w-3xl mx-auto px-6 sm:px-10">
        <Link
          href="/legal"
          className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint hover:text-white transition-colors"
        >
          ← Légal
        </Link>

        <h1 className="h-title text-5xl md:text-6xl mt-8 mb-6">
          Disclaimer <span className="shimmer">financier.</span>
        </h1>

        <p className="text-ink-mute text-base leading-relaxed mb-16">
          Dernière mise à jour : 2026
        </p>

        <div className="space-y-12 text-ink leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">
              1. Aucun conseil en investissement
            </h2>
            <p className="text-ink-mute">
              Meridian est un site à vocation pédagogique. Les contenus, outils, stratégies,
              vidéos, articles et autres ressources publiés sur ce site ne constituent
              <span className="text-white">
                {" "}
                en aucun cas un conseil en investissement, une recommandation personnalisée,
                une offre, une sollicitation ou une incitation à acheter ou vendre un instrument
                financier.
              </span>{" "}
              Meridian n'agit pas en qualité de Conseiller en Investissements Financiers (CIF)
              au sens de l'article L.541-1 du Code monétaire et financier.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">
              2. Risque de perte en capital
            </h2>
            <p className="text-ink-mute">
              <span className="text-white">
                Le trading et l'investissement sur les marchés financiers comportent un
                risque élevé de perte en capital pouvant aller jusqu'à la totalité, voire
                au-delà des sommes engagées
              </span>{" "}
              dans le cas des produits à effet de levier (CFD, Forex, futures, options).
              Vous devez évaluer votre situation financière, votre tolérance au risque et,
              si nécessaire, consulter un professionnel agréé avant toute décision.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">
              3. Performances passées
            </h2>
            <p className="text-ink-mute">
              <span className="text-white">
                Les performances passées, simulées ou réelles, ne préjugent en aucun cas
                des performances futures.
              </span>{" "}
              Aucun backtest, aucune statistique historique, aucune anatomie d'opération
              présentée sur ce site ne garantit la reproductibilité des résultats. Les
              marchés évoluent et les conditions qui ont produit un résultat passé peuvent
              ne plus exister.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">
              4. Caractère générique des contenus
            </h2>
            <p className="text-ink-mute">
              Les stratégies et méthodes publiées sont génériques et ne tiennent compte
              ni de votre situation personnelle, ni de vos objectifs, ni de votre horizon
              d'investissement. Elles restent dans le périmètre de la recommandation
              générale tel que défini par la Position AMF DOC-2008-23.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">
              5. Responsabilité
            </h2>
            <p className="text-ink-mute">
              L'utilisateur reste seul responsable de ses décisions d'investissement et
              des conséquences qui en découlent. Meridian, ses fondateurs et collaborateurs
              ne pourront en aucun cas être tenus responsables des pertes financières
              directes ou indirectes liées à l'utilisation des contenus ou outils proposés.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">
              6. Mise en garde AMF
            </h2>
            <p className="text-ink-mute">
              L'Autorité des marchés financiers (AMF) attire régulièrement l'attention du
              public sur les risques liés au trading spéculatif, notamment sur les produits
              à effet de levier. Consultez{" "}
              <a
                href="https://www.amf-france.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline-offset-4 underline decoration-ink-faint hover:decoration-white"
              >
                amf-france.org
              </a>{" "}
              avant tout engagement.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-border">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            En utilisant Meridian, vous reconnaissez avoir lu et accepté ce disclaimer.
          </p>
        </div>
      </div>
    </main>
  );
}
