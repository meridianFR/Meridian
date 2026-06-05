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
