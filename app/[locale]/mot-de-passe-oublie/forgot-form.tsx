"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-black px-4 py-3 text-ink outline-none transition-colors focus:border-ink-faint";
const labelClass = "mono text-[10px] uppercase tracking-[0.3em] text-ink-faint";

type Status = "idle" | "loading" | "sent" | "error";

export function ForgotPasswordForm() {
  const t = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reinitialiser`,
    });
    // On affiche toujours le même message (anti-énumération d'emails).
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-border bg-[#070707] p-8 text-center">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-edge mb-4">{t("forgotSentEyebrow")}</div>
        <p className="text-ink text-lg font-medium mb-2">{t("forgotSentTitle")}</p>
        <p className="text-ink-mute text-sm leading-relaxed">
          {t.rich("forgotSentText", {
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

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-primary mt-6 w-full justify-center disabled:opacity-60"
      >
        {status === "loading" ? t("forgotLoading") : t("forgotSubmit")}
      </button>

      <div className="mt-6 pt-5 border-t border-border text-center">
        <Link href="/connexion" className="link-underline text-sm text-ink">{t("backToLogin")}</Link>
      </div>
    </form>
  );
}
