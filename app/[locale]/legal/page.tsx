import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === "fr" ? "/legal" : `/${locale}/legal`,
      languages: { fr: "/legal", en: "/en/legal", pt: "/pt/legal" },
    },
  };
}

const HREFS = ["/mentions-legales", "/cgv", "/disclaimer-financier"];

type Section = { eyebrow: string; title: string; desc: string };

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Legal");
  const sections = t.raw("sections") as Section[];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden">
          {sections.map((s, i) => (
            <Link
              key={HREFS[i]}
              href={HREFS[i]}
              className="bg-black p-8 md:p-10 hover:bg-[#070707] transition-colors group"
            >
              <div className="mono text-[10px] uppercase tracking-[0.35em] text-ink-faint mb-5">
                {s.eyebrow}
              </div>
              <div className="text-xl font-semibold tracking-tight mb-3">{s.title}</div>
              <p className="text-ink-mute text-sm leading-relaxed mb-6">{s.desc}</p>
              <span className="text-[13px] text-white/70 group-hover:text-white transition-colors">
                {t("read")}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-20 border-t border-border pt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint leading-relaxed max-w-3xl">
            {t("footer")}
          </p>
        </div>
      </div>
    </main>
  );
}
