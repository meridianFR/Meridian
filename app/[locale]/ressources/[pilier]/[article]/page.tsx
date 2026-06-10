import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternatesFor } from "@/i18n/seo";
import { allArticleParams, getArticle } from "@/lib/resources";
import { ArticleShell } from "@/components/resources/article-shell";
import { getArticleBody } from "@/components/resources/bodies";

export function generateStaticParams() {
  return allArticleParams();
}

type Params = { locale: string; pilier: string; article: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, article } = await params;
  const a = getArticle(locale, article);
  if (!a) {
    const t = await getTranslations({ locale, namespace: "Resources" });
    return { title: t("notFoundArticle") };
  }
  const path = `/ressources/${a.pillarSlug}/${a.slug}`;
  return {
    title: a.metaTitle ?? a.title,
    description: a.description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      title: a.metaTitle ?? a.title,
      description: a.description,
      url: path,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { locale, pilier, article } = await params;
  setRequestLocale(locale);
  const a = getArticle(locale, article);
  // Garde : slug inconnu OU pilier de l'URL incohérent avec l'article → 404.
  if (!a || a.pillarSlug !== pilier) notFound();

  const Body = getArticleBody(locale, a.slug);
  if (!Body) notFound();

  return <ArticleShell article={a}>{Body(a)}</ArticleShell>;
}
