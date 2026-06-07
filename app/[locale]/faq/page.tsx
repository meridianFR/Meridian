import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Faq" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === "fr" ? "/faq" : `/${locale}/faq`,
      languages: { fr: "/faq", en: "/en/faq", pt: "/pt/faq" },
    },
  };
}

type FaqItem = { q: string; a: string };

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <main className="relative pt-40 pb-32">
      <div className="max-w-wrap mx-auto px-6 sm:px-10">
        <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-10">
          {t("eyebrow")}
        </div>

        <h1 className="h-title text-5xl md:text-7xl max-w-3xl mb-8">
          {t("titleLine1")}
          <br />
          <span className="shimmer">{t("titleEmph")}</span>
        </h1>

        <p className="text-ink-mute text-lg max-w-2xl leading-relaxed mb-20">
          {t("lead")}
        </p>

        <div className="max-w-3xl divide-y divide-border border-y border-border">
          {items.map((item, i) => (
            <details key={i} className="faq-item group py-6">
              <summary className="cursor-pointer list-none flex items-start justify-between gap-6">
                <span className="text-lg md:text-xl font-medium tracking-tight text-ink group-hover:text-white group-open:text-white transition-colors">
                  {item.q}
                </span>
                <span className="mono text-ink-faint text-lg leading-none mt-1 transition-transform duration-300 group-open:rotate-45 group-open:text-white">
                  +
                </span>
              </summary>
              <p className="faq-answer text-ink-mute text-base leading-relaxed mt-4 max-w-2xl">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-20 max-w-2xl">
          <p className="text-ink-mute text-sm leading-relaxed">
            {t("contactPrefix")}
            <Link
              href="/legal"
              className="text-white underline-offset-4 underline decoration-ink-faint hover:decoration-white"
            >
              {t("contactLink")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
