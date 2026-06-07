import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Formation" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: locale === "fr" ? "/formation" : `/${locale}/formation`,
      languages: { fr: "/formation", en: "/en/formation", pt: "/pt/formation" },
    },
  };
}

type Module = { eyebrow: string; title: string; desc: string };

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Formation");
  const modules = t.raw("modules") as Module[];

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
          {modules.map((m) => (
            <div key={m.title} className="bg-black p-8 md:p-10">
              <div className="mono text-[10px] uppercase tracking-[0.35em] text-ink-faint mb-5">
                {m.eyebrow}
              </div>
              <div className="text-xl font-semibold tracking-tight mb-3">{m.title}</div>
              <p className="text-ink-mute text-sm leading-relaxed mb-6">{m.desc}</p>
              <span className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                {t("soon")}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-20 max-w-2xl">
          <p className="text-ink-mute text-sm leading-relaxed">
            {t("footerPrefix")}
            <Link
              href="/strategies"
              className="text-white underline-offset-4 underline decoration-ink-faint hover:decoration-white"
            >
              {t("footerLink")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
