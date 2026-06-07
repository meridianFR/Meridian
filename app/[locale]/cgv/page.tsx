import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Cgv" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === "fr" ? "/cgv" : `/${locale}/cgv`,
      languages: { fr: "/cgv", en: "/en/cgv", pt: "/pt/cgv" },
    },
  };
}

const SECTIONS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"] as const;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Cgv");

  const richTags = {
    dlink: (chunks: React.ReactNode) => (
      <Link
        href="/disclaimer-financier"
        className="text-white underline-offset-4 underline decoration-ink-faint hover:decoration-white"
      >
        {chunks}
      </Link>
    ),
  };

  return (
    <main className="relative pt-40 pb-32">
      <div className="max-w-3xl mx-auto px-6 sm:px-10">
        <Link
          href="/legal"
          className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint hover:text-white transition-colors"
        >
          ← {t("back")}
        </Link>

        <h1 className="h-title text-5xl md:text-6xl mt-8 mb-6">
          {t("title")}
          <span className="shimmer">{t("titleEmph")}</span>
        </h1>

        <p className="text-ink-mute text-base leading-relaxed mb-16">{t("updated")}</p>

        <div className="space-y-12 text-ink leading-relaxed">
          {SECTIONS.map((s) => (
            <section key={s}>
              <h2 className="text-xl font-semibold tracking-tight mb-4">{t(`${s}h`)}</h2>
              <p className="text-ink-mute">{t.rich(`${s}p`, richTags)}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
