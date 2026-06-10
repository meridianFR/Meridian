import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternatesFor } from "@/i18n/seo";
import { allPillarParams, getPillar } from "@/lib/resources";
import { PillarShell } from "@/components/resources/pillar-shell";
import { getPillarBody } from "@/components/resources/bodies";

export function generateStaticParams() {
  return allPillarParams();
}

type Params = { locale: string; pilier: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, pilier } = await params;
  const p = getPillar(locale, pilier);
  if (!p) {
    const t = await getTranslations({ locale, namespace: "Resources" });
    return { title: t("notFoundGuide") };
  }
  const path = `/ressources/${p.slug}`;
  return {
    title: p.metaTitle ?? p.title,
    description: p.description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      title: p.metaTitle ?? p.title,
      description: p.description,
      url: path,
      type: "article",
    },
  };
}

export default async function PillarPage({ params }: { params: Promise<Params> }) {
  const { locale, pilier } = await params;
  setRequestLocale(locale);
  const pillar = getPillar(locale, pilier);
  if (!pillar) notFound();

  return <PillarShell pillar={pillar}>{getPillarBody(locale, pillar.slug)}</PillarShell>;
}
