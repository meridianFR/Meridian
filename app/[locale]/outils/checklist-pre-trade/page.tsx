import { getTranslations, setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/placeholder";

export const metadata = { title: "Meridian Checklist — Checklist pré-trade" };

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ToolChecklist");
  return (
    <Placeholder
      sectionNum="03 / 05"
      sectionLabel={t("sectionLabel")}
      title="Meridian"
      shimmer={t("shimmer")}
      subtitle={t("subtitle")}
      status="soon"
      backHref="/outils"
      backLabel={t("backLabel")}
    />
  );
}
