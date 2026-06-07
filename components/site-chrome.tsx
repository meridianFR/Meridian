"use client";

import { usePathname } from "@/i18n/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";

/**
 * Affiche la nav + footer marketing sur tout le site,
 * SAUF sur les routes "app shell" (preview + espace abonné + parcours connexion/
 * paiement) qui ont leur propre chrome ou un layout focalisé.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppShell =
    pathname === "/app" ||
    pathname?.startsWith("/app/") ||
    pathname?.startsWith("/journal-preview") ||
    pathname?.startsWith("/connexion") ||
    pathname?.startsWith("/abonnement");

  if (isAppShell) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollProgress />
      <Nav />
      <div className="relative z-10">{children}</div>
      <Footer />
    </>
  );
}
