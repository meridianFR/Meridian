import Link from "next/link";
import type { Metadata } from "next";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { LoginForm } from "./login-form";
import { isSupabaseConfigured } from "@/lib/env";
import { sanitizeNextPath } from "@/lib/security";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Accède à ton espace Meridian Journal.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const next = sanitizeNextPath(sp.next);
  const notConfigured = !isSupabaseConfigured() || sp.error === "config";

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
          <h1 className="h-title text-3xl md:text-4xl mt-5">Ton espace</h1>
          <p className="text-ink-mute text-sm mt-3">
            Connecte-toi pour accéder au Journal.
          </p>
        </div>

        {notConfigured ? (
          <div className="rounded-2xl border border-border bg-[#070707] p-8 text-center">
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-4">
              Bientôt disponible
            </div>
            <p className="text-ink text-base font-medium mb-2">
              Les comptes ne sont pas encore activés.
            </p>
            <p className="text-ink-mute text-sm leading-relaxed">
              La connexion et le paiement seront ouverts dès la mise en service.
              En attendant, découvre la démo du Journal.
            </p>
            <Link href="/journal-preview" className="btn btn-ghost mt-6 w-full justify-center">
              Voir la démo
            </Link>
          </div>
        ) : (
          <LoginForm next={next} />
        )}

        <p className="text-ink-faint text-xs text-center mt-6 leading-relaxed">
          En te connectant, tu acceptes nos{" "}
          <Link href="/cgv" className="link-underline">CGV</Link> et notre{" "}
          <Link href="/legal" className="link-underline">politique de confidentialité</Link>.
        </p>
      </div>
    </main>
  );
}
