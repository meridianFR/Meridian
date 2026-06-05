import { notFound } from "next/navigation";
import { allArticleParams, getArticle } from "@/lib/resources";
import { ArticleShell } from "@/components/resources/article-shell";
import { ARTICLE_BODIES } from "@/components/resources/bodies";

export function generateStaticParams() {
  return allArticleParams();
}

type Params = { pilier: string; article: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { article } = await params;
  const a = getArticle(article);
  if (!a) return { title: "Article introuvable" };
  const url = `/ressources/${a.pillarSlug}/${a.slug}`;
  return {
    title: a.metaTitle ?? a.title,
    description: a.description,
    alternates: { canonical: url },
    openGraph: {
      title: a.metaTitle ?? a.title,
      description: a.description,
      url,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { pilier, article } = await params;
  const a = getArticle(article);
  // Garde : slug inconnu OU pilier de l'URL incohérent avec l'article → 404.
  if (!a || a.pillarSlug !== pilier) notFound();

  const Body = ARTICLE_BODIES[a.slug];
  if (!Body) notFound();

  return <ArticleShell article={a}>{Body(a)}</ArticleShell>;
}
