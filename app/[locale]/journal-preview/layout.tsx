import type { Metadata } from "next";

// Démo interactive à données fictives — hors index (doublé par robots.ts)
export const metadata: Metadata = {
  title: "Aperçu du Journal",
  robots: { index: false, follow: false },
};

export default function JournalPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
