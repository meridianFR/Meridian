import Link from "next/link";
import type { Metadata } from "next";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { ResetPasswordForm } from "./reset-form";

export const metadata: Metadata = {
  title: "Nouveau mot de passe",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function ReinitialiserPage() {
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
          <h1 className="h-title text-3xl md:text-4xl mt-5">Nouveau mot de passe</h1>
          <p className="text-ink-mute text-sm mt-3">Choisis un nouveau mot de passe pour ton compte.</p>
        </div>

        <ResetPasswordForm />
      </div>
    </main>
  );
}
