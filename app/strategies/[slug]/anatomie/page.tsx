import { notFound } from "next/navigation";
import { BreakoutRangeAnatomy } from "@/components/anatomies/breakout-range";
import { PullbackEMA200Anatomy } from "@/components/anatomies/pullback-ema200";
import { SwingConvergenceMTFAnatomy } from "@/components/anatomies/swing-convergence-mtf";
import { getStrategyBySlug } from "@/lib/strategies";
import type { ReactElement } from "react";

const ANATOMIES: Record<string, () => ReactElement> = {
  "breakout-range": BreakoutRangeAnatomy,
  "pullback-ema200": PullbackEMA200Anatomy,
  "swing-convergence-mtf": SwingConvergenceMTFAnatomy,
};

export function generateStaticParams() {
  return Object.keys(ANATOMIES).map((slug) => ({ slug }));
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = getStrategyBySlug(slug);
  if (!s) return { title: "Anatomie introuvable" };
  return {
    title: `${s.name} — Anatomie complète`,
    description: `Anatomie complète de ${s.name} : structure, déclencheurs, invalidation et gestion du risque, décortiquée pas à pas.`,
    alternates: { canonical: `/strategies/${slug}/anatomie` },
  };
}

export default async function AnatomyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const Component = ANATOMIES[slug];
  if (!Component) notFound();
  return <Component />;
}
