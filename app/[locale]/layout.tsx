import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { inter, jetbrainsMono } from "@/lib/fonts";
import { CursorGlow } from "@/components/cursor-glow";
import { SiteChrome } from "@/components/site-chrome";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Meridian ° — Trade ce que tu mesures.",
    template: "%s · Meridian °",
  },
  description:
    "Outils et stratégies pour traders qui veulent durer, pas exploser. Aucune promesse de gain. Aucun signal. Aucun guru.",
  metadataBase: new URL("https://meridiandata.fr"),
  openGraph: {
    title: "Meridian ° — Trade ce que tu mesures.",
    description:
      "Outils et stratégies pour traders qui veulent durer, pas exploser.",
    url: "https://meridiandata.fr",
    siteName: "Meridian °",
    locale: "fr_FR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://meridiandata.fr/#organization",
      name: "Meridian",
      url: "https://meridiandata.fr",
      logo: "https://meridiandata.fr/apple-icon",
      description:
        "Outils et stratégies pour traders qui veulent durer, pas exploser.",
    },
    {
      "@type": "WebSite",
      "@id": "https://meridiandata.fr/#website",
      name: "Meridian",
      url: "https://meridiandata.fr",
      inLanguage: "fr-FR",
      publisher: { "@id": "https://meridiandata.fr/#organization" },
    },
  ],
};

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
