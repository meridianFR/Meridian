import Link from "next/link";

export const metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Meridian °.",
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
          Mentions <span className="shimmer">légales.</span>
        </h1>

        <p className="text-ink-mute text-base leading-relaxed mb-16">
          Dernière mise à jour : 2026
        </p>

        <div className="space-y-12 text-ink leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">Éditeur du site</h2>
            <p className="text-ink-mute">
              Meridian ° — informations d'éditeur à compléter (raison sociale, forme juridique,
              capital, RCS, siège social, numéro de TVA intracommunautaire, directeur de
              publication).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">Hébergement</h2>
            <p className="text-ink-mute">
              Site hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA —{" "}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline-offset-4 underline decoration-ink-faint hover:decoration-white"
              >
                vercel.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">
              Propriété intellectuelle
            </h2>
            <p className="text-ink-mute">
              L'ensemble du site — design, code, textes, illustrations, vidéos, marques,
              logo, nomenclature « Meridian », noms d'outils et de stratégies — est protégé
              par le droit d'auteur et le droit des marques. Toute reproduction, représentation
              ou exploitation, totale ou partielle, sans autorisation écrite préalable est
              interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">Données personnelles</h2>
            <p className="text-ink-mute">
              Conformément au RGPD et à la loi Informatique et Libertés, vous disposez
              d'un droit d'accès, de rectification, d'effacement et de portabilité de vos
              données. Pour toute demande, contactez l'éditeur via l'adresse indiquée
              ci-dessus.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">Cookies</h2>
            <p className="text-ink-mute">
              Le site utilise des cookies strictement nécessaires à son fonctionnement et,
              le cas échéant, des cookies de mesure d'audience anonymisés. Aucun cookie
              publicitaire tiers n'est déposé.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight mb-4">Contact</h2>
            <p className="text-ink-mute">
              Adresse de contact à publier — contact@meridian.app (placeholder).
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
