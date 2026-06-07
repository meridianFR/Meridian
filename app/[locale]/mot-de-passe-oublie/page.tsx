import Link from "next/link";
import type { Metadata } from "next";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { ForgotPasswordForm } from "./forgot-form";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function MotDePasseOubliePage() {
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
          <h1 className="h-title text-3xl md:text-4xl mt-5">Mot de passe oublié</h1>
          <p className="text-ink-mute text-sm mt-3">
            Entre ton email, on t'envoie un lien pour le réinitialiser.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </main>
  );
}
