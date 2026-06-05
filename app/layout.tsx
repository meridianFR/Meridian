import type { Metadata } from "next";
import { inter, jetbrainsMono } from "@/lib/fonts";
import { CursorGlow } from "@/components/cursor-glow";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Meridian ° — Trade ce que tu mesures.",
    template: "%s · Meridian °",
  },
  description:
    "Outils et stratégies pour traders qui veulent durer, pas exploser. Aucune promesse de gain. Aucun signal. Aucun guru.",
  metadataBase: new URL("https://meridian.app"),
  openGraph: {
    title: "Meridian ° — Trade ce que tu mesures.",
    description:
      "Outils et stratégies pour traders qui veulent durer, pas exploser.",
    url: "https://meridian.app",
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
      "@id": "https://meridian.app/#organization",
      name: "Meridian",
      url: "https://meridian.app",
      logo: "https://meridian.app/apple-icon",
      description:
        "Outils et stratégies pour traders qui veulent durer, pas exploser.",
    },
    {
      "@type": "WebSite",
      "@id": "https://meridian.app/#website",
      name: "Meridian",
      url: "https://meridian.app",
      inLanguage: "fr-FR",
      publisher: { "@id": "https://meridian.app/#organization" },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CursorGlow />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
