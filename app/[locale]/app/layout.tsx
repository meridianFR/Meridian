import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Dashboard" });
  return {
    title: t("eyebrow"),
    robots: { index: false, follow: false },
  };
}

export const dynamic = "force-dynamic";

/**
 * Barrière d'accès à l'espace client — défense en profondeur (en plus du
 * middleware). Ici on exige seulement d'être connecté : le tableau de bord est
 * accessible à tout compte. Le verrou d'abonnement vit sur /app/journal.
 * « Fail closed » : toute incertitude ⇒ redirection.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    redirect("/connexion?error=config&next=/app");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/connexion?next=/app");
  }

  return <>{children}</>;
}
