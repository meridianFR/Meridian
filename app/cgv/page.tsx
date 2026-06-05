import Link from "next/link";

export const metadata = {
  title: "Conditions générales de vente",
  description: "Conditions générales de vente des produits et services Meridian °.",
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
          Conditions <span className="shimmer">générales.</span>
        </h1>

        <p className="text-ink-mute text-base leading-relaxed mb-16">
          Dernière mise à jour : 2026
        </p>

        <div className="space-y-12 text-ink leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">1. Objet</h2>
            <p className="text-ink-mute">
              Les présentes conditions générales encadrent l'utilisation du site Meridian
              et l'achat de produits numériques (outils, frameworks, contenus de formation)
              proposés par l'éditeur. Elles s'appliquent à toute commande passée sur le site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">2. Produits</h2>
            <p className="text-ink-mute">
              Les produits Meridian sont des contenus numériques à vocation pédagogique :
              outils méthodologiques, documentations de stratégies génériques, modules de
              formation. Ils n'incluent ni signaux, ni recommandations personnalisées, ni
              gestion de portefeuille.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">3. Prix et paiement</h2>
            <p className="text-ink-mute">
              Les prix sont indiqués en euros, toutes taxes comprises. La TVA applicable est
              celle du pays du client conformément à la réglementation européenne. Le paiement
              s'effectue en ligne via le prestataire indiqué au moment de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">
              4. Livraison et accès
            </h2>
            <p className="text-ink-mute">
              Les produits numériques sont accessibles immédiatement après confirmation du
              paiement, via un lien d'accès ou un espace membre personnel. Aucun support
              physique n'est livré.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">
              5. Droit de rétractation
            </h2>
            <p className="text-ink-mute">
              Conformément à l'article L221-28 du Code de la consommation, le droit de
              rétractation ne s'applique pas aux contenus numériques fournis sans support
              matériel dont l'exécution a commencé après accord exprès du client et
              renoncement au droit de rétractation. Cet accord est demandé au moment de
              l'achat.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">
              6. Propriété intellectuelle
            </h2>
            <p className="text-ink-mute">
              L'achat d'un produit confère un droit d'usage personnel et non transférable.
              Toute redistribution, revente, copie ou exploitation commerciale du contenu
              est strictement interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">
              7. Responsabilité
            </h2>
            <p className="text-ink-mute">
              Meridian ne saurait être tenu responsable des décisions de trading prises
              par le client. Voir le{" "}
              <Link
                href="/disclaimer-financier"
                className="text-white underline-offset-4 underline decoration-ink-faint hover:decoration-white"
              >
                disclaimer financier
              </Link>{" "}
              pour le cadre détaillé.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">
              8. Droit applicable
            </h2>
            <p className="text-ink-mute">
              Les présentes conditions sont soumises au droit français. Tout litige sera
              porté devant les tribunaux compétents du ressort du siège social de l'éditeur,
              après tentative de résolution amiable.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
