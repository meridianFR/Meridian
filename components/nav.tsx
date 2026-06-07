"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";

const NAV_ITEMS = [
  { href: "/strategies", key: "strategies" },
  { href: "/outils", key: "tools" },
  { href: "/journal", key: "journal" },
] as const;

const MOBILE_SECONDARY = [
  { href: "/faq", key: "faq" },
  { href: "/formation", key: "formation" },
  { href: "/a-propos", key: "about" },
] as const;

export function Nav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermer le menu à chaque changement de route
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Échap pour fermer + blocage du scroll de fond quand le menu est ouvert
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled || menuOpen
          ? "nav-blur"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-wrap mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="group text-[15px] font-semibold tracking-[-0.02em] text-white"
        >
          Meridian
          <span className="text-ink-muted ml-0.5 inline-block transition-transform duration-500 group-hover:rotate-180">
            °
          </span>
        </Link>

        <div className="flex items-center gap-2 text-[13px]">
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3.5 py-1.5 rounded-full transition-colors duration-300 ${
                    active
                      ? "text-white bg-white/[0.06]"
                      : "text-ink-mute hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </div>

          {/* Connexion — espace client (desktop) */}
          <Link
            href="/connexion"
            aria-current={isActive("/connexion") ? "page" : undefined}
            className={`hidden md:inline-flex px-3.5 py-1.5 rounded-full transition-colors duration-300 ${
              isActive("/connexion")
                ? "text-white bg-white/[0.06]"
                : "text-ink-mute hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            {t("login")}
          </Link>

          {/* Sélecteur de langue (desktop) */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* CTA principal — toujours visible */}
          <Link
            href="/formation"
            className="group ml-1.5 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 sm:px-4 py-1.5 font-medium text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_24px_-14px_rgba(255,255,255,0.5)] transition-transform duration-300 hover:-translate-y-px"
          >
            {t("cta")}
            <span
              aria-hidden
              className="hidden sm:inline text-black/50 transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>

          {/* Bouton menu — mobile uniquement */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="md:hidden relative -mr-2 inline-flex h-11 w-11 items-center justify-center text-white"
          >
            <span className="relative block h-3.5 w-5" aria-hidden>
              <span
                className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 ${
                  menuOpen ? "translate-y-[6.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300 ${
                  menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Backdrop pour fermer au clic extérieur */}
      {menuOpen && (
        <button
          type="button"
          aria-label={t("closeMenu")}
          onClick={() => setMenuOpen(false)}
          className="md:hidden fixed inset-x-0 bottom-0 top-16 bg-black/40 cursor-default"
        />
      )}

      {/* Panneau mobile */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute inset-x-0 top-full origin-top transition-[opacity,transform] duration-300 ${
          menuOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        <div className="border-t border-border bg-[#0a0a0a] px-6 py-3 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.95)]">
          <div className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`border-b border-border/60 py-3 text-[15px] transition-colors ${
                    active ? "text-white" : "text-ink-mute hover:text-white"
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
            {MOBILE_SECONDARY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-border/60 py-3 text-[15px] text-ink-mute transition-colors hover:text-white"
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href="/connexion"
              aria-current={isActive("/connexion") ? "page" : undefined}
              className={`border-b border-border/60 py-3 text-[15px] transition-colors ${
                isActive("/connexion") ? "text-white" : "text-ink-mute hover:text-white"
              }`}
            >
              {t("login")}
            </Link>

            {/* Sélecteur de langue (mobile) */}
            <div className="py-4">
              <LanguageSwitcher variant="inline" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
