import { getTranslations, setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/placeholder";

export const metadata = { title: "Manifesto" };

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Manifesto");
  return (
    <Placeholder
      sectionLabel={t("sectionLabel")}
      title={t("title")}
      shimmer={t("shimmer")}
      subtitle={t("subtitle")}
      status="soon"
    />
  );
}
