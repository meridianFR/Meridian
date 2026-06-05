"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { createAccountAction } from "@/lib/journal/actions";

/** Première utilisation : création du premier compte de trading. */
export function FirstAccount({ email }: { email: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !name.trim()) return;
    setBusy(true);
    setError("");
    const res = await createAccountAction(name.trim());
    if (!res.ok) {
      setBusy(false);
      setError(res.error);
      return;
    }
    router.push(`/app?account=${res.data.id}`);
    router.refresh();
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-28">
      <AmbientOrbs />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint">° Meridian Journal</div>
          <h1 className="h-title text-3xl md:text-4xl mt-5">Crée ton premier compte</h1>
          <p className="text-ink-mute text-sm mt-3">Un compte = un environnement de trading (ex. ta prop firm, ton compte perso). Tu pourras en ajouter d&apos;autres.</p>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-border bg-[#070707] p-8">
          <label htmlFor="acc" className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
            Nom du compte
          </label>
          <input
            id="acc"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="FTMO 50K · Compte perso…"
            autoFocus
            className="mt-3 w-full rounded-lg border border-border bg-black px-4 py-3 text-ink outline-none transition-colors focus:border-ink-faint"
          />
          {error && <p className="mt-3 text-sm text-risk">{error}</p>}
          <button type="submit" disabled={busy || !name.trim()} className="btn btn-primary mt-5 w-full justify-center disabled:opacity-50">
            {busy ? "Création…" : "Créer mon journal"}
          </button>
        </form>

        <div className="flex items-center justify-center gap-4 mt-6 mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
          <span className="truncate max-w-[180px]">{email}</span>
          <span>·</span>
          <form method="post" action="/auth/signout">
            <button type="submit" className="hover:text-ink-mute transition-colors">
              Déconnexion
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
