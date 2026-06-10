import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { LoginForm } from "./login-form";
import { isSupabaseConfigured } from "@/lib/env";
import { sanitizeNextPath } from "@/lib/security";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });
  return {
    title: t("loginMetaTitle"),
    description: t("loginMetaDescription"),
    robots: { index: false, follow: false },
  };
}

export const dynamic = "force-dynamic";

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const next = sanitizeNextPath(sp.next);
  const notConfigured = !isSupabaseConfigured() || sp.error === "config";
  const t = await getTranslations("Auth");

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-28">
      <AmbientOrbs />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint hover:text-ink-mute transition-colors"
          >
            ° Meridian
          </Link>
          <h1 className="h-title text-3xl md:text-4xl mt-5">{t("loginHeading")}</h1>
          <p className="text-ink-mute text-sm mt-3">{t("loginSub")}</p>
        </div>

        {notConfigured ? (
          <div className="rounded-2xl border border-border bg-[#070707] p-8 text-center">
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-4">
              {t("notConfiguredEyebrow")}
            </div>
            <p className="text-ink text-base font-medium mb-2">{t("notConfiguredTitle")}</p>
            <p className="text-ink-mute text-sm leading-relaxed">{t("notConfiguredText")}</p>
            <Link href="/journal-preview" className="btn btn-ghost mt-6 w-full justify-center">
              {t("notConfiguredCta")}
            </Link>
          </div>
        ) : (
          <LoginForm next={next} />
        )}

        <p className="text-ink-faint text-xs text-center mt-6 leading-relaxed">
          {t.rich("loginConsent", {
            cgv: (chunks) => (
              <Link href="/cgv" className="link-underline">
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link href="/legal" className="link-underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </main>
  );
}
