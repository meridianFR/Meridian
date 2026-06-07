"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-black px-4 py-3 text-ink outline-none transition-colors focus:border-ink-faint";
const labelClass = "mono text-[10px] uppercase tracking-[0.3em] text-ink-faint";

type Status = "idle" | "loading" | "error";

export function ResetPasswordForm() {
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
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setMessage("Lien expiré ou invalide. Redemande un lien de réinitialisation.");
      return;
    }
    window.location.assign("/app");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-[#070707] p-8">
      <label htmlFor="password" className={labelClass}>Nouveau mot de passe</label>
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

      {status === "error" && (
        <div className="mt-3 text-sm text-risk">
          {message}{" "}
          <Link href="/mot-de-passe-oublie" className="link-underline">Redemander un lien</Link>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-primary mt-6 w-full justify-center disabled:opacity-60"
      >
        {status === "loading" ? "Enregistrement…" : "Enregistrer le mot de passe"}
      </button>
    </form>
  );
}
