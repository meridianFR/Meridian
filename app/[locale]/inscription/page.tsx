import Link from "next/link";
import type { Metadata } from "next";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Crée ton compte Meridian.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function InscriptionPage() {
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
          <h1 className="h-title text-3xl md:text-4xl mt-5">Créer ton compte</h1>
          <p className="text-ink-mute text-sm mt-3">
            Un seul compte pour le Journal, les formations et les outils.
          </p>
        </div>

        <SignupForm />

        <p className="text-ink-faint text-xs text-center mt-6 leading-relaxed">
          En créant un compte, tu acceptes nos{" "}
          <Link href="/cgv" className="link-underline">CGV</Link> et notre{" "}
          <Link href="/legal" className="link-underline">politique de confidentialité</Link>.
        </p>
      </div>
    </main>
  );
}
