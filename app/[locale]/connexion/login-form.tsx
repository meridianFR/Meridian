"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { sanitizeNextPath } from "@/lib/security";

type Mode = "password" | "magic";
type Status = "idle" | "loading" | "sent" | "error";

const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-black px-4 py-3 text-ink outline-none transition-colors focus:border-ink-faint";
const labelClass = "mono text-[10px] uppercase tracking-[0.3em] text-ink-faint";

export function LoginForm({ next }: { next: string }) {
  const t = useTranslations("Auth");
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
      setMessage(t("errCredentials"));
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
      setMessage(t("errMagic"));
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-border bg-[#070707] p-8 text-center">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-edge mb-4">{t("loginSentEyebrow")}</div>
        <p className="text-ink text-lg font-medium mb-2">{t("loginSentTitle")}</p>
        <p className="text-ink-mute text-sm leading-relaxed">
          {t.rich("loginSentText", {
            email,
            hl: (chunks) => <span className="text-ink">{chunks}</span>,
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-[#070707] p-8">
      {mode === "password" ? (
        <form onSubmit={onPassword}>
          <label htmlFor="email" className={labelClass}>{t("emailLabel")}</label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className={inputClass}
          />

          <div className="mt-5 flex items-center justify-between">
            <label htmlFor="password" className={labelClass}>{t("passwordLabel")}</label>
            <Link
              href="/mot-de-passe-oublie"
              className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint hover:text-ink-mute transition-colors"
            >
              {t("forgot")}
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
            {status === "loading" ? t("loginLoading") : t("loginSubmit")}
          </button>

          <button
            type="button"
            onClick={() => switchMode("magic")}
            className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint hover:text-ink-mute transition-colors mt-5 w-full text-center"
          >
            {t("toMagic")}
          </button>
        </form>
      ) : (
        <form onSubmit={onMagic}>
          <label htmlFor="email-magic" className={labelClass}>{t("emailLabel")}</label>
          <input
            id="email-magic"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className={inputClass}
          />

          {status === "error" && <p className="mt-3 text-sm text-risk">{message}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn btn-primary mt-6 w-full justify-center disabled:opacity-60"
          >
            {status === "loading" ? t("magicLoading") : t("magicSubmit")}
          </button>

          <button
            type="button"
            onClick={() => switchMode("password")}
            className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint hover:text-ink-mute transition-colors mt-5 w-full text-center"
          >
            {t("toPassword")}
          </button>
        </form>
      )}

      <div className="mt-6 pt-5 border-t border-border text-center">
        <span className="text-ink-mute text-sm">{t("noAccount")}</span>
        <Link href="/inscription" className="link-underline text-sm text-ink">{t("createAccount")}</Link>
      </div>
    </div>
  );
}
