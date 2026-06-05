// Gabarit d'une page article de l'Académie Meridian.
// Compose : fil d'Ariane → en-tête → corps (children) → pont produit → FAQ →
// disclaimer → « À lire ensuite ». Injecte le JSON-LD Article + Breadcrumb + FAQ.

import Link from "next/link";
import type { ReactNode } from "react";
import {
  BASE_URL,
  INTENT_LABEL,
  getPillar,
  relatedArticles,
  type Article,
} from "@/lib/resources";
import { Breadcrumb, Disclaimer, Faq, ProductBridge, RelatedArticles } from "./blocks";

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function articleHref(a: Article): string {
  return `/ressources/${a.pillarSlug}/${a.slug}`;
}

function buildJsonLd(article: Article) {
  const pillar = getPillar(article.pillarSlug);
  const url = `${BASE_URL}${articleHref(article)}`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: article.metaTitle ?? article.title,
      description: article.description,
      inLanguage: "fr-FR",
      datePublished: article.updated,
      dateModified: article.updated,
      mainEntityOfPage: url,
      author: { "@id": `${BASE_URL}/#organization` },
      publisher: { "@id": `${BASE_URL}/#organization` },
      ...(article.keyword ? { about: article.keyword } : {}),
      ...(pillar ? { articleSection: pillar.title } : {}),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ressources", item: `${BASE_URL}/ressources` },
        ...(pillar
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: pillar.title,
                item: `${BASE_URL}/ressources/${pillar.slug}`,
              },
            ]
          : []),
        { "@type": "ListItem", position: pillar ? 3 : 2, name: article.title, item: url },
      ],
    },
  ];

  if (article.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: article.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export function ArticleShell({ article, children }: { article: Article; children: ReactNode }) {
  const pillar = getPillar(article.pillarSlug);
  const related = relatedArticles(article).map((a) => ({
    href: articleHref(a),
    title: a.title,
    description: a.description,
    pillar: getPillar(a.pillarSlug)?.title ?? "Ressources",
  }));

  return (
    <main className="relative pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(article)) }}
      />

      <article>
        {/* En-tête */}
        <header className="max-w-wrap mx-auto px-6 sm:px-10 mb-14">
          <div className="max-w-[44rem] mx-auto">
            <Breadcrumb
              items={[
                { href: "/ressources", label: "Ressources" },
                ...(pillar ? [{ href: `/ressources/${pillar.slug}`, label: pillar.title }] : []),
                { label: article.title },
              ]}
            />

            {pillar && (
              <Link
                href={`/ressources/${pillar.slug}`}
                className="h-eyebrow link-underline inline-block mb-5"
              >
                ° {pillar.title}
              </Link>
            )}

            <h1 className="h-title text-4xl md:text-5xl lg:text-[56px] mb-6">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
              <span>{article.readingMinutes} min de lecture</span>
              <span aria-hidden className="text-border-2">·</span>
              <span>Mis à jour le {formatDate(article.updated)}</span>
              <span aria-hidden className="text-border-2">·</span>
              <span className="pill">{INTENT_LABEL[article.intent]}</span>
            </div>
          </div>
        </header>

        {/* Corps */}
        <div className="max-w-wrap mx-auto px-6 sm:px-10">{children}</div>

        {/* Clôture : pont produit + FAQ + disclaimer */}
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          {article.product && <ProductBridge product={article.product} />}
          {article.faq && <Faq items={article.faq} />}
          <Disclaimer />
        </div>
      </article>

      {/* Maillage */}
      <RelatedArticles items={related} />

      {/* Retour pilier */}
      {pillar && (
        <div className="max-w-wrap mx-auto px-6 sm:px-10 mt-8">
          <Link
            href={`/ressources/${pillar.slug}`}
            className="mono text-[11px] uppercase tracking-widest text-ink-mute hover:text-white transition"
          >
            ← Retour au guide : {pillar.title}
          </Link>
        </div>
      )}
    </main>
  );
}
