"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-black px-4 py-3 text-ink outline-none transition-colors focus:border-ink-faint";
const labelClass = "mono text-[10px] uppercase tracking-[0.3em] text-ink-faint";

type Status = "idle" | "loading" | "sent" | "error";

export function SignupForm() {
  const t = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    if (password.length < 8) {
      setStatus("error");
      setMessage(t("errMin8"));
      return;
    }
    setStatus("loading");
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/app`,
      },
    });
    if (error) {
      setStatus("error");
      setMessage(
        /already|exist/i.test(error.message) ? t("errExists") : t("errSignupGeneric"),
      );
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-border bg-[#070707] p-8 text-center">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-edge mb-4">{t("signupSentEyebrow")}</div>
        <p className="text-ink text-lg font-medium mb-2">{t("signupSentTitle")}</p>
        <p className="text-ink-mute text-sm leading-relaxed">
          {t.rich("signupSentText", {
            email,
            hl: (chunks) => <span className="text-ink">{chunks}</span>,
          })}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-[#070707] p-8">
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

      <label htmlFor="password" className={`${labelClass} block mt-5`}>{t("passwordLabel")}</label>
      <input
        id="password"
        type="password"
        required
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t("min8Placeholder")}
        className={inputClass}
      />

      {status === "error" && <p className="mt-3 text-sm text-risk">{message}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-primary mt-6 w-full justify-center disabled:opacity-60"
      >
        {status === "loading" ? t("signupLoading") : t("signupSubmit")}
      </button>

      <div className="mt-6 pt-5 border-t border-border text-center">
        <span className="text-ink-mute text-sm">{t("haveAccount")}</span>
        <Link href="/connexion" className="link-underline text-sm text-ink">{t("signIn")}</Link>
      </div>
    </form>
  );
}
