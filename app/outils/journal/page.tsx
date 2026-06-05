import { Placeholder } from "@/components/placeholder";

export const metadata = { title: "Meridian Journal — Le SaaS" };

export default function Page() {
  return (
    <Placeholder
      sectionNum="05 / 05"
      sectionLabel="Outil · Payant · Produit phare"
      title="Meridian"
      shimmer="Journal."
      subtitle="Le système d'exploitation du trader sérieux. Journal automatisé, edge mesuré, Weekly Behavioral Report chaque dimanche."
      status="soon"
      backHref="/outils"
      backLabel="Tous les outils"
    />
  );
}
