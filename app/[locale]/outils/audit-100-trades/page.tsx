import { getTranslations, setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/placeholder";

export const metadata = { title: "Meridian Audit — Audit de 100 trades" };

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ToolAudit");
  return (
    <Placeholder
      sectionNum="04 / 05"
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
