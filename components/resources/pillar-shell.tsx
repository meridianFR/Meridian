// Gabarit d'une page pilier de l'Académie Meridian.
// Hero → bandeau AMF → guide long-form (children) → liste du cluster (articles
// live + « à venir ») → ponts outils & produit. JSON-LD CollectionPage + Breadcrumb.

import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { BASE_URL, articlesForPillar, type Pillar } from "@/lib/resources";

const INLANG: Record<string, string> = { fr: "fr-FR", en: "en-US", pt: "pt-PT" };

function buildJsonLd(pillar: Pillar, locale: string, resourcesLabel: string) {
  const url = `${BASE_URL}/ressources/${pillar.slug}`;
  const articles = articlesForPillar(locale, pillar.slug);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        name: pillar.metaTitle ?? pillar.title,
        description: pillar.description,
        inLanguage: INLANG[locale] ?? "fr-FR",
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
          { "@type": "ListItem", position: 1, name: resourcesLabel, item: `${BASE_URL}/ressources` },
          { "@type": "ListItem", position: 2, name: pillar.title, item: url },
        ],
      },
    ],
  };
}

export function PillarShell({ pillar, children }: { pillar: Pillar; children: ReactNode }) {
  const t = useTranslations("Resources");
  const locale = useLocale();
  const articles = articlesForPillar(locale, pillar.slug);
  const num = String(pillar.num).padStart(2, "0");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(pillar, locale, t("resourcesFallback"))),
        }}
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
            {t("backToAcademy")}
          </Link>

          <div className="pill mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{t("pillarGuideBadge", { num })}</span>
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
            {t("amfIntro")}
            <strong className="text-white">{t("amfStrong")}</strong>
            {t("amfEnd")}
          </p>
        </div>
      </section>

      {/* Guide long-form */}
      <div className="py-16">{children}</div>

      <div className="divider" />

      {/* Cluster : articles */}
      <section className="py-20">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="h-eyebrow mb-3">{t("inThisGuide")}</div>
          <h2 className="h-title text-3xl md:text-4xl mb-10">
            {t.rich("deepenTitle", { em: (chunks) => <span className="shimmer">{chunks}</span> })}
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
                    <span className="h-eyebrow">{t("articleBadge")}</span>
                    <span className="mono text-[10px] text-ink-faint">
                      {t("minLabel", { min: a.readingMinutes })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-xl text-white mb-2 tracking-tight">{a.title}</h3>
                  <p className="text-sm text-ink-mute leading-relaxed line-clamp-2 mb-4">
                    {a.description}
                  </p>
                  <span className="mono text-[11px] uppercase tracking-widest text-ink-mute group-hover:text-white transition">
                    {t("readArticle")}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {pillar.upcoming.length > 0 && (
            <div>
              <div className="h-eyebrow mb-4">{t("upcomingCluster")}</div>
              <div className="flex flex-wrap gap-2.5">
                {pillar.upcoming.map((title) => (
                  <span
                    key={title}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.015] px-4 py-2 text-sm text-ink-faint"
                  >
                    <span aria-hidden className="h-1 w-1 rounded-full bg-border-2" />
                    {title}
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
              <div className="h-eyebrow mb-3">{t("toPractice")}</div>
              <h2 className="h-title text-3xl md:text-4xl mb-10">
                {t.rich("toolsTitle", { em: (chunks) => <span className="shimmer">{chunks}</span> })}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pillar.tools.map((tool) => (
                  <Link key={tool.href} href={tool.href} className="card rounded-2xl p-6 group block">
                    <div className="h-eyebrow mb-3">{t("freeTool")}</div>
                    <h3 className="font-semibold text-lg text-white mb-2">{tool.label}</h3>
                    {tool.desc && (
                      <p className="text-sm text-ink-mute leading-relaxed mb-4">{tool.desc}</p>
                    )}
                    <span className="mono text-[11px] uppercase tracking-widest text-ink-mute group-hover:text-white transition">
                      {t("openTool")}
                    </span>
                  </Link>
                ))}

                {pillar.product && (
                  <Link
                    href={pillar.product.href}
                    className="glow-border rounded-2xl p-6 group block"
                  >
                    <div className="h-eyebrow mb-3">{t("productBadge")}</div>
                    <h3 className="font-semibold text-lg text-white mb-2">{pillar.product.label}</h3>
                    {pillar.product.desc && (
                      <p className="text-sm text-ink-mute leading-relaxed mb-4">
                        {pillar.product.desc}
                      </p>
                    )}
                    <span className="mono text-[11px] uppercase tracking-widest text-white link-underline">
                      {t("discover")}
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
            {t("allGuides")}
          </Link>
        </div>
      </section>
    </>
  );
}
