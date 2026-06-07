"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { sanitizeNextPath } from "@/lib/security";

type Mode = "password" | "magic";
type Status = "idle" | "loading" | "sent" | "error";

const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-black px-4 py-3 text-ink outline-none transition-colors focus:border-ink-faint";
const labelClass = "mono text-[10px] uppercase tracking-[0.3em] text-ink-faint";

export function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const safeNext = sanitizeNextPath(next);

  function switchMode(m: Mode) {
    setMode(m);
    setStatus("idle");
    setMessage("");
  }

  async function onPassword(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setStatus("error");
      setMessage("Email ou mot de passe incorrect.");
      return;
    }
    window.location.assign(safeNext);
  }

  async function onMagic(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
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
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-edge mb-4">Lien envoyé</div>
        <p className="text-ink text-lg font-medium mb-2">Vérifie ta boîte mail</p>
        <p className="text-ink-mute text-sm leading-relaxed">
          On vient d'envoyer un lien de connexion à <span className="text-ink">{email}</span>. Clique
          dessus pour accéder à ton espace. Le lien expire dans une heure.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-[#070707] p-8">
      {mode === "password" ? (
        <form onSubmit={onPassword}>
          <label htmlFor="email" className={labelClass}>Adresse email</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="toi@email.com"
            className={inputClass}
          />

          <div className="mt-5 flex items-center justify-between">
            <label htmlFor="password" className={labelClass}>Mot de passe</label>
            <Link
              href="/mot-de-passe-oublie"
              className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint hover:text-ink-mute transition-colors"
            >
              Oublié ?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />

          {status === "error" && <p className="mt-3 text-sm text-risk">{message}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn btn-primary mt-6 w-full justify-center disabled:opacity-60"
          >
            {status === "loading" ? "Connexion…" : "Se connecter"}
          </button>

          <button
            type="button"
            onClick={() => switchMode("magic")}
            className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint hover:text-ink-mute transition-colors mt-5 w-full text-center"
          >
            ou recevoir un lien par email
          </button>
        </form>
      ) : (
        <form onSubmit={onMagic}>
          <label htmlFor="email-magic" className={labelClass}>Adresse email</label>
          <input
            id="email-magic"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="toi@email.com"
            className={inputClass}
          />

          {status === "error" && <p className="mt-3 text-sm text-risk">{message}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn btn-primary mt-6 w-full justify-center disabled:opacity-60"
          >
            {status === "loading" ? "Envoi…" : "Recevoir le lien de connexion"}
          </button>

          <button
            type="button"
            onClick={() => switchMode("password")}
            className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint hover:text-ink-mute transition-colors mt-5 w-full text-center"
          >
            ← connexion par mot de passe
          </button>
        </form>
      )}

      <div className="mt-6 pt-5 border-t border-border text-center">
        <span className="text-ink-mute text-sm">Pas encore de compte ? </span>
        <Link href="/inscription" className="link-underline text-sm text-ink">Créer un compte</Link>
      </div>
    </div>
  );
}
