import { Placeholder } from "@/components/placeholder";

export const metadata = { title: "Meridian Audit — Audit de 100 trades" };

export default function Page() {
  return (
    <Placeholder
      sectionNum="04 / 05"
      sectionLabel="Outil · Free · Lead gen"
      title="Meridian"
      shimmer="Audit."
      subtitle="Upload ton historique. L'outil identifie tes heures profitables, tes patterns d'erreur, ta variance. Audit unique gratuit."
      status="soon"
      backHref="/outils"
      backLabel="Tous les outils"
    />
  );
}
