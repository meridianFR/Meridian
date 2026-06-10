"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "mt-2 w-full rounded-lg border border-border bg-black px-4 py-3 text-ink outline-none transition-colors focus:border-ink-faint";
const labelClass = "mono text-[10px] uppercase tracking-[0.3em] text-ink-faint";

type Status = "idle" | "loading" | "error";

export function ResetPasswordForm() {
  const t = useTranslations("Auth");
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
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setMessage(t("errResetInvalid"));
      return;
    }
    window.location.assign("/app");
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-[#070707] p-8">
      <label htmlFor="password" className={labelClass}>{t("newPasswordLabel")}</label>
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

      {status === "error" && (
        <div className="mt-3 text-sm text-risk">
          {message}{" "}
          <Link href="/mot-de-passe-oublie" className="link-underline">{t("requestNew")}</Link>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-primary mt-6 w-full justify-center disabled:opacity-60"
      >
        {status === "loading" ? t("resetLoading") : t("resetSubmit")}
      </button>
    </form>
  );
}
