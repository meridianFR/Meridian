import { notFound } from "next/navigation";
import { PILLARS, getPillar } from "@/lib/resources";
import { PillarShell } from "@/components/resources/pillar-shell";
import { PILLAR_BODIES } from "@/components/resources/bodies";

export function generateStaticParams() {
  return PILLARS.map((p) => ({ pilier: p.slug }));
}

type Params = { pilier: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { pilier } = await params;
  const p = getPillar(pilier);
  if (!p) return { title: "Guide introuvable" };
  const url = `/ressources/${p.slug}`;
  return {
    title: p.metaTitle ?? p.title,
    description: p.description,
    alternates: { canonical: url },
    openGraph: {
      title: p.metaTitle ?? p.title,
      description: p.description,
      url,
      type: "article",
    },
  };
}

export default async function PillarPage({ params }: { params: Promise<Params> }) {
  const { pilier } = await params;
  const pillar = getPillar(pilier);
  if (!pillar) notFound();

  return <PillarShell pillar={pillar}>{PILLAR_BODIES[pillar.slug]}</PillarShell>;
}
