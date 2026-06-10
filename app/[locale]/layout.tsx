import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { inter, jetbrainsMono } from "@/lib/fonts";
import { CursorGlow } from "@/components/cursor-glow";
import { SiteChrome } from "@/components/site-chrome";
import "../globals.css";

const OG_LOCALE: Record<string, string> = { fr: "fr_FR", en: "en_US", pt: "pt_PT" };
const IN_LANG: Record<string, string> = { fr: "fr-FR", en: "en-US", pt: "pt-PT" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: {
      default: t("defaultTitle"),
      template: "%s · Meridian °",
    },
    description: t("description"),
    metadataBase: new URL("https://meridiandata.fr"),
    openGraph: {
      title: t("defaultTitle"),
      description: t("ogDescription"),
      url: "https://meridiandata.fr",
      siteName: "Meridian °",
      locale: OG_LOCALE[locale] ?? "fr_FR",
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

function buildJsonLd(locale: string, orgDescription: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://meridiandata.fr/#organization",
        name: "Meridian",
        url: "https://meridiandata.fr",
        logo: "https://meridiandata.fr/apple-icon",
        description: orgDescription,
      },
      {
        "@type": "WebSite",
        "@id": "https://meridiandata.fr/#website",
        name: "Meridian",
        url: "https://meridiandata.fr",
        inLanguage: IN_LANG[locale] ?? "fr-FR",
        publisher: { "@id": "https://meridiandata.fr/#organization" },
      },
    ],
  };
}

// Pré-rend les trois langues à la compilation (rendu statique).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Langue inconnue → 404 (sécurité de routage).
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Active le rendu statique pour cette langue.
  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "Meta" });
  const jsonLd = buildJsonLd(locale, t("ogDescription"));

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CursorGlow />
          <SiteChrome>{children}</SiteChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
