"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { sanitizeNextPath } from "@/lib/security";

type Status = "idle" | "loading" | "sent" | "error";

export function LoginForm({ next, defaultEmail = "" }: { next: string; defaultEmail?: string }) {
  const [email, setEmail] = useState(defaultEmail);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    const safeNext = sanitizeNextPath(next);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage("Envoi impossible. Vérifie l'adresse et réessaie.");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-border bg-[#070707] p-8 text-center">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-edge mb-4">
          Lien envoyé
        </div>
        <p className="text-ink text-lg font-medium mb-2">Vérifie ta boîte mail</p>
        <p className="text-ink-mute text-sm leading-relaxed">
          On vient d'envoyer un lien de connexion à <span className="text-ink">{email}</span>.
          Clique dessus pour accéder à ton espace. Le lien expire dans une heure.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-[#070707] p-8">
      <label htmlFor="email" className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
        Adresse email
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="toi@email.com"
        className="mt-3 w-full rounded-lg border border-border bg-black px-4 py-3 text-ink outline-none transition-colors focus:border-ink-faint"
      />

      {status === "error" && (
        <p className="mt-3 text-sm text-risk">{message}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-primary mt-5 w-full justify-center disabled:opacity-60"
      >
        {status === "loading" ? "Envoi…" : "Recevoir le lien de connexion"}
      </button>

      <p className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mt-5 text-center">
        Sans mot de passe · lien sécurisé par email
      </p>
    </form>
  );
}
