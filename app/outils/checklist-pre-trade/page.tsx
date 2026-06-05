import { Placeholder } from "@/components/placeholder";

export const metadata = { title: "Meridian Checklist — Checklist pré-trade" };

export default function Page() {
  return (
    <Placeholder
      sectionNum="03 / 05"
      sectionLabel="Outil · Free"
      title="Meridian"
      shimmer="Checklist."
      subtitle="Dix questions à se poser avant chaque entrée. Format interactif, sauvegarde locale, export PDF imprimable."
      status="soon"
      backHref="/outils"
      backLabel="Tous les outils"
    />
  );
}
