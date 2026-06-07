"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Bouton de changement de langue FR / EN / PT.
 *
 * - Le changement est instantané : navigation client (pas de rechargement),
 *   le contenu se ré-affiche dans la nouvelle langue.
 * - Le choix est mémorisé par next-intl (cookie `NEXT_LOCALE`).
 * - Scalable : la liste vient de `routing.locales` — ajouter une langue suffit.
 *
 * Deux rendus :
 * - `compact` (défaut) : pastille + menu déroulant, pour la barre de nav (desktop).
 * - `inline` : trois boutons côte à côte, pour le menu mobile.
 */
export function LanguageSwitcher({
  variant = "compact",
}: {
  variant?: "compact" | "inline";
}) {
  const t = useTranslations("Language");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function switchTo(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      // Conserve les paramètres dynamiques de route (ex. [slug]).
      router.replace(
        // @ts-expect-error -- pathname générique compatible avec les routes dynamiques
        { pathname, params },
        { locale: next },
      );
    });
  }

  // Fermer le menu au clic extérieur + Échap.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2" role="group" aria-label={t("label")}>
        {routing.locales.map((loc) => {
          const active = loc === locale;
          return (
            <button
              key={loc}
              type="button"
              onClick={() => switchTo(loc)}
              aria-current={active ? "true" : undefined}
              disabled={isPending}
              className={`rounded-full border px-3 py-1.5 text-[13px] uppercase tracking-wide transition-colors ${
                active
                  ? "border-white/20 bg-white/[0.06] text-white"
                  : "border-border text-ink-mute hover:text-white hover:border-white/20"
              }`}
            >
              {loc}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("label")}
        disabled={isPending}
        className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] uppercase tracking-wide text-ink-mute transition-colors duration-300 hover:bg-white/[0.04] hover:text-white"
      >
        <span aria-hidden className="mono text-[11px] text-ink-faint">
          ⌐
        </span>
        {locale}
        <span
          aria-hidden
          className={`text-ink-faint transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("label")}
          className="absolute right-0 top-full z-50 mt-2 min-w-[140px] overflow-hidden rounded-xl border border-border bg-[#0a0a0a] py-1 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.95)]"
        >
          {routing.locales.map((loc) => {
            const active = loc === locale;
            return (
              <li key={loc} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => switchTo(loc)}
                  className={`flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-[13px] transition-colors ${
                    active ? "text-white" : "text-ink-mute hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {t(loc)}
                  <span className="mono text-[10px] uppercase tracking-wide text-ink-faint">
                    {loc}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
