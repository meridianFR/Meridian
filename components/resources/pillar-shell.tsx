// Gabarit d'une page pilier de l'Académie Meridian.
// Hero → bandeau AMF → guide long-form (children) → liste du cluster (articles
// live + « à venir ») → ponts outils & produit. JSON-LD CollectionPage + Breadcrumb.

import Link from "next/link";
import type { ReactNode } from "react";
import { BASE_URL, articlesForPillar, type Pillar } from "@/lib/resources";

function buildJsonLd(pillar: Pillar) {
  const url = `${BASE_URL}/ressources/${pillar.slug}`;
  const articles = articlesForPillar(pillar.slug);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        name: pillar.metaTitle ?? pillar.title,
        description: pillar.description,
        inLanguage: "fr-FR",
        about: pillar.keyword,
        isPartOf: { "@id": `${BASE_URL}/#website` },
        hasPart: articles.map((a) => ({
          "@type": "Article",
          headline: a.title,
          url: `${url}/${a.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ressources", item: `${BASE_URL}/ressources` },
          { "@type": "ListItem", position: 2, name: pillar.title, item: url },
        ],
      },
    ],
  };
}

export function PillarShell({ pillar, children }: { pillar: Pillar; children: ReactNode }) {
  const articles = articlesForPillar(pillar.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(pillar)) }}
      />

      {/* Hero */}
      <header className="relative pt-32 pb-16 overflow-hidden radial-glow">
        <div
          className="blob bg-white"
          style={{ width: "420px", height: "420px", top: "-80px", left: "-80px", opacity: 0.07 }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10 relative">
          <Link
            href="/ressources"
            className="mono text-[11px] uppercase tracking-widest text-ink-mute hover:text-white transition inline-block mb-8"
          >
            ← Académie Meridian
          </Link>

          <div className="pill mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>Pilier {String(pillar.num).padStart(2, "0")} · Guide complet</span>
          </div>

          <h1 className="h-title text-5xl md:text-7xl max-w-4xl mb-7">{pillar.title}.</h1>

          <p className="text-ink-mute text-lg md:text-xl max-w-2xl leading-relaxed">{pillar.lede}</p>
        </div>
      </header>

      {/* Bandeau AMF */}
      <section className="border-y border-border bg-panel">
        <div className="max-w-wrap mx-auto px-6 sm:px-10 py-5 flex items-start gap-4">
          <div className="flex-shrink-0 w-7 h-7 rounded-full border border-risk/40 text-risk flex items-center justify-center font-bold text-xs">
            !
          </div>
          <p className="text-sm text-ink-mute leading-relaxed">
            Contenu pédagogique uniquement. <strong className="text-white">Aucune promesse de gain,
            aucun signal, aucune statistique de performance.</strong> Le trading comporte un risque
            de perte en capital.
          </p>
        </div>
      </section>

      {/* Guide long-form */}
      <div className="py-16">{children}</div>

      <div className="divider" />

      {/* Cluster : articles */}
      <section className="py-20">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="h-eyebrow mb-3">Dans ce guide</div>
          <h2 className="h-title text-3xl md:text-4xl mb-10">
            Approfondir <span className="shimmer">point par point</span>.
          </h2>

          {articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/ressources/${pillar.slug}/${a.slug}`}
                  className="card rounded-2xl p-6 group block"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="h-eyebrow">Article</span>
                    <span className="mono text-[10px] text-ink-faint">{a.readingMinutes} min</span>
                  </div>
                  <h3 className="font-semibold text-xl text-white mb-2 tracking-tight">{a.title}</h3>
                  <p className="text-sm text-ink-mute leading-relaxed line-clamp-2 mb-4">
                    {a.description}
                  </p>
                  <span className="mono text-[11px] uppercase tracking-widest text-ink-mute group-hover:text-white transition">
                    Lire l'article →
                  </span>
                </Link>
              ))}
            </div>
          )}

          {pillar.upcoming.length > 0 && (
            <div>
              <div className="h-eyebrow mb-4">À venir dans ce cluster</div>
              <div className="flex flex-wrap gap-2.5">
                {pillar.upcoming.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.015] px-4 py-2 text-sm text-ink-faint"
                  >
                    <span aria-hidden className="h-1 w-1 rounded-full bg-border-2" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Ponts outils & produit */}
      {(pillar.tools.length > 0 || pillar.product) && (
        <>
          <div className="divider" />
          <section className="py-20">
            <div className="max-w-wrap mx-auto px-6 sm:px-10">
              <div className="h-eyebrow mb-3">Passer à la pratique</div>
              <h2 className="h-title text-3xl md:text-4xl mb-10">
                Les outils qui <span className="shimmer">automatisent</span> ce guide.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pillar.tools.map((tool) => (
                  <Link key={tool.href} href={tool.href} className="card rounded-2xl p-6 group block">
                    <div className="h-eyebrow mb-3">Outil gratuit</div>
                    <h3 className="font-semibold text-lg text-white mb-2">{tool.label}</h3>
                    {tool.desc && (
                      <p className="text-sm text-ink-mute leading-relaxed mb-4">{tool.desc}</p>
                    )}
                    <span className="mono text-[11px] uppercase tracking-widest text-ink-mute group-hover:text-white transition">
                      Ouvrir l'outil →
                    </span>
                  </Link>
                ))}

                {pillar.product && (
                  <Link
                    href={pillar.product.href}
                    className="glow-border rounded-2xl p-6 group block"
                  >
                    <div className="h-eyebrow mb-3">Produit</div>
                    <h3 className="font-semibold text-lg text-white mb-2">{pillar.product.label}</h3>
                    {pillar.product.desc && (
                      <p className="text-sm text-ink-mute leading-relaxed mb-4">
                        {pillar.product.desc}
                      </p>
                    )}
                    <span className="mono text-[11px] uppercase tracking-widest text-white link-underline">
                      Découvrir →
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      <section className="py-12 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Link
            href="/ressources"
            className="mono text-[11px] uppercase tracking-widest text-ink-mute hover:text-white transition"
          >
            ← Tous les guides de l'Académie
          </Link>
        </div>
      </section>
    </>
  );
}
