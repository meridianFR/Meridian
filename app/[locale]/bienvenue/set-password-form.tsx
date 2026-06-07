"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-black px-4 py-3 text-ink outline-none transition-colors focus:border-ink-faint";
const labelClass = "mono text-[10px] uppercase tracking-[0.3em] text-ink-faint";

type Status = "idle" | "loading" | "error";

export function SetPasswordForm({ sessionId, email }: { sessionId: string; email: string }) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    if (password.length < 8) {
      setStatus("error");
      setMessage("Le mot de passe doit faire au moins 8 caractères.");
      return;
    }
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/account/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, password }),
    });
    if (!res.ok) {
      setStatus("error");
      setMessage("Impossible de définir le mot de passe. Réessaie dans un instant.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("error");
      setMessage("Mot de passe enregistré. Connecte-toi depuis la page de connexion.");
      return;
    }
    window.location.assign("/app");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-[#070707] p-8">
      <label htmlFor="email" className={labelClass}>Ton compte</label>
      <input
        id="email"
        type="email"
        value={email}
        readOnly
        className={`${inputClass} text-ink-mute`}
      />

      <label htmlFor="password" className={`${labelClass} block mt-5`}>Choisis un mot de passe</label>
      <input
        id="password"
        type="password"
        required
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="8 caractères minimum"
        className={inputClass}
      />

      {status === "error" && <p className="mt-3 text-sm text-risk">{message}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-primary mt-6 w-full justify-center disabled:opacity-60"
      >
        {status === "loading" ? "Création…" : "Accéder à mon espace"}
      </button>
    </form>
  );
}
