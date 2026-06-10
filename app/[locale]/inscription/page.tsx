import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { SignupForm } from "./signup-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });
  return {
    title: t("signupMetaTitle"),
    description: t("signupMetaDescription"),
    robots: { index: false, follow: false },
  };
}

export const dynamic = "force-dynamic";

export default async function InscriptionPage() {
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
          <h1 className="h-title text-3xl md:text-4xl mt-5">{t("signupHeading")}</h1>
          <p className="text-ink-mute text-sm mt-3">{t("signupSub")}</p>
        </div>

        <SignupForm />

        <p className="text-ink-faint text-xs text-center mt-6 leading-relaxed">
          {t.rich("signupConsent", {
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
