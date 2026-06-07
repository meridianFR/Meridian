import Link from "next/link";
import {
  ARTICLES,
  PILLARS,
  PLANNED_PILLARS,
  getPillar,
  latestArticles,
} from "@/lib/resources";

export const metadata = {
  title: "Académie Meridian — Ressources trading",
  description:
    "L'Académie Meridian : des guides evergreen sur la gestion du risque, le journal de trading, la psychologie et les statistiques. Aucune promesse, aucun signal — de la méthode.",
  alternates: { canonical: "/ressources" },
  openGraph: {
    title: "Académie Meridian — Ressources trading",
    description:
      "Des guides evergreen pour traders qui veulent durer. Méthode, pas hype.",
    url: "/ressources",
    type: "website",
  },
};

export default function RessourcesPage() {
  const latest = latestArticles(4);

  return (
    <>
      <header className="relative pt-32 pb-16 overflow-hidden radial-glow">
        <div
          className="blob bg-white"
          style={{ width: "440px", height: "440px", top: "-90px", left: "-80px", opacity: 0.08 }}
        />
        <div
          className="blob bg-white"
          style={{ width: "320px", height: "320px", top: "120px", right: "-60px", opacity: 0.05 }}
        />

        <div className="max-w-wrap mx-auto px-6 sm:px-10 relative">
          <div className="pill mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>Académie Meridian</span>
          </div>

          <h1 className="h-title text-5xl md:text-7xl lg:text-[80px] max-w-4xl mb-7">
            Apprendre à <span className="shimmer">trader proprement</span>.
          </h1>

          <p className="text-ink-mute text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            Des guides qui ne périment pas, sur ce qui compte vraiment : maîtriser ton risque,
            mesurer ce que tu fais, comprendre tes biais. Pas de signaux, pas de promesses — de la
            méthode que tu peux vérifier.
          </p>

          <div className="grid grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border max-w-lg">
            <div className="bg-black p-5">
              <div className="h-eyebrow">Guides</div>
              <div className="text-2xl font-bold mt-1.5 tnum">{String(PILLARS.length).padStart(2, "0")}</div>
            </div>
            <div className="bg-black p-5">
              <div className="h-eyebrow">Articles</div>
              <div className="text-2xl font-bold mt-1.5 tnum">{String(ARTICLES.length).padStart(2, "0")}</div>
            </div>
            <div className="bg-black p-5">
              <div className="h-eyebrow">Promesses de gain</div>
              <div className="text-2xl font-bold mt-1.5 tnum">00</div>
            </div>
          </div>
        </div>
      </header>

      {/* Piliers */}
      <section className="py-20">
        <div className="max-w-wrap mx-auto px-6 sm:px-10 mb-12">
          <div className="h-eyebrow mb-3">Les guides piliers</div>
          <h2 className="h-title text-4xl md:text-5xl mb-4">Par où commencer.</h2>
          <p className="text-ink-mute max-w-2xl leading-relaxed">
            Chaque pilier est un guide complet, prolongé par des articles qui creusent un point
            précis. Commence par le sujet qui te coûte le plus aujourd'hui.
          </p>
        </div>

        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {PILLARS.map((p) => (
              <Link
                key={p.slug}
                href={`/ressources/${p.slug}`}
                className="card pillar-card rounded-2xl p-8 group block"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="h-eyebrow">Pilier {String(p.num).padStart(2, "0")}</span>
                  <span className="mono text-[10px] text-ink-faint">
                    {ARTICLES.filter((a) => a.pillarSlug === p.slug).length} article(s)
                  </span>
                </div>
                <h3 className="font-bold text-3xl tracking-tight mb-4 group-hover:text-white transition">
                  {p.title}
                </h3>
                <p className="text-ink-mute leading-relaxed mb-6 max-w-md">{p.lede}</p>
                <span className="mono text-[11px] uppercase tracking-widest text-ink-mute group-hover:text-white transition">
                  Ouvrir le guide →
                </span>
              </Link>
            ))}
          </div>

          {/* Piliers à venir */}
          <div className="mt-10">
            <div className="h-eyebrow mb-4">Bientôt dans l'Académie</div>
            <div className="flex flex-wrap gap-2.5">
              {PLANNED_PILLARS.map((p) => (
                <span
                  key={p.title}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.015] px-4 py-2 text-sm text-ink-faint"
                >
                  <span aria-hidden className="h-1 w-1 rounded-full bg-border-2" />
                  {p.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Derniers articles */}
      <section className="py-20">
        <div className="max-w-wrap mx-auto px-6 sm:px-10 mb-12">
          <div className="h-eyebrow mb-3">Derniers articles</div>
          <h2 className="h-title text-4xl md:text-5xl">À lire en ce moment.</h2>
        </div>

        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {latest.map((a) => (
              <Link
                key={a.slug}
                href={`/ressources/${a.pillarSlug}/${a.slug}`}
                className="card rounded-2xl p-6 group block"
              >
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-3">
                  {getPillar(a.pillarSlug)?.title ?? "Ressources"}
                </div>
                <h3 className="font-semibold text-xl text-white mb-2 tracking-tight">{a.title}</h3>
                <p className="text-sm text-ink-mute leading-relaxed line-clamp-2 mb-4">
                  {a.description}
                </p>
                <span className="mono text-[11px] uppercase tracking-widest text-ink-mute group-hover:text-white transition">
                  {a.readingMinutes} min · Lire →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Capture newsletter */}
      <section className="py-20 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="glow-border rounded-3xl p-8 md:p-12 text-center">
            <div className="h-eyebrow mb-4">Newsletter</div>
            <h2 className="h-title text-3xl md:text-4xl mb-4">
              Une édition par semaine. <span className="shimmer">Une seule.</span>
            </h2>
            <p className="text-ink-mute max-w-xl mx-auto mb-8 leading-relaxed">
              Un insight data et un repère méthodologique, sans bruit ni pitch. Tu peux te
              désinscrire en un clic.
            </p>
            <Link href="/formation" className="btn btn-primary">
              Rejoindre la liste →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
