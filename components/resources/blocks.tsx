// Blocs de prose réutilisables pour l'Académie Meridian (/ressources).
// Composants serveur, présentationnels, aux tokens Kairos. Aucun "use client" :
// la FAQ utilise <details> natif (animation gérée par globals.css .faq-item).

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { FaqItem, LeadMagnet, Ref, TocItem } from "@/lib/resources";

const READ_WIDTH = "max-w-[44rem]";

/* ————— Fil d'Ariane ————— */
export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  const t = useTranslations("Resources");
  return (
    <nav aria-label={t("breadcrumbAria")} className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {it.href ? (
              <Link href={it.href} className="link-underline">
                {it.label}
              </Link>
            ) : (
              <span className="text-ink-mute">{it.label}</span>
            )}
            {i < items.length - 1 && <span aria-hidden className="text-border-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ————— Sommaire (TOC) ————— */
export function Toc({ items }: { items: TocItem[] }) {
  const t = useTranslations("Resources");
  if (!items.length) return null;
  return (
    <aside className={`${READ_WIDTH} mx-auto card rounded-2xl p-6 mb-14`}>
      <div className="h-eyebrow mb-4">{t("toc")}</div>
      <ol className="space-y-2.5">
        {items.map((it, i) => (
          <li key={it.id} className="flex items-baseline gap-3">
            <span className="mono text-[11px] text-ink-faint flex-shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <a href={`#${it.id}`} className="link-underline text-sm text-ink-mute">
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}

/* ————— Section ancrée ————— */
export function ArticleSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${READ_WIDTH} mx-auto scroll-mt-28 mb-14`}>
      <h2 className="h-title text-2xl md:text-3xl mb-6">{title}</h2>
      {children}
    </section>
  );
}

/* ————— Prose primitives ————— */
export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className={`${READ_WIDTH} mx-auto text-lg md:text-xl text-ink-mute leading-relaxed mb-12`}>
      {children}
    </p>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-ink-mute leading-relaxed mb-5 text-[15px] md:text-base [&_strong]:text-white">
      {children}
    </p>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-white font-semibold text-lg mt-9 mb-4 tracking-tight">{children}</h3>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc pl-5 space-y-2.5 mb-6 marker:text-ink-faint">{children}</ul>;
}

export function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="list-decimal pl-5 space-y-2.5 mb-6 marker:text-ink-faint marker:font-mono marker:text-sm">
      {children}
    </ol>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="pl-1.5 text-ink-mute leading-relaxed text-[15px] md:text-base [&_strong]:text-white">
      {children}
    </li>
  );
}

/** Lien de prose interne, soulignement animé. */
export function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="link-underline text-white">
      {children}
    </Link>
  );
}

/* ————— Encarts ————— */
type CalloutVariant = "note" | "warn" | "key";

const CALLOUT_STYLE: Record<CalloutVariant, { box: string; mark: string; label: string }> = {
  note: { box: "border-border-2 bg-white/[0.02]", mark: "bg-white", label: "text-ink-mute" },
  warn: { box: "border-risk/30 bg-risk/[0.06]", mark: "bg-risk", label: "text-risk" },
  key: { box: "border-edge/30 bg-edge/[0.05]", mark: "bg-edge", label: "text-edge" },
};

export function Callout({
  variant = "note",
  title,
  children,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}) {
  const s = CALLOUT_STYLE[variant];
  return (
    <div className={`${READ_WIDTH} mx-auto my-8`}>
      <div className={`rounded-2xl border ${s.box} p-6`}>
        {title && (
          <div className="flex items-center gap-2 mb-3">
            <span className={`h-1.5 w-1.5 rounded-full ${s.mark}`} />
            <span className={`mono text-[11px] uppercase tracking-[0.2em] ${s.label}`}>{title}</span>
          </div>
        )}
        <div className="text-sm text-ink-mute leading-relaxed [&_strong]:text-white">{children}</div>
      </div>
    </div>
  );
}

/** « À retenir » — synthèse en fin de section, liseré vivant. */
export function KeyTakeaway({ children }: { children: ReactNode }) {
  const t = useTranslations("Resources");
  return (
    <div className={`${READ_WIDTH} mx-auto my-10`}>
      <div className="glow-border rounded-2xl p-6">
        <div className="h-eyebrow mb-3">{t("keyTakeaway")}</div>
        <div className="text-ink-mute leading-relaxed text-[15px] [&_strong]:text-white">{children}</div>
      </div>
    </div>
  );
}

/* ————— CTA stack ————— */

/** Outil en contexte. */
export function ToolCTA({ tool }: { tool: Ref }) {
  const t = useTranslations("Resources");
  return (
    <div className={`${READ_WIDTH} mx-auto my-8`}>
      <Link href={tool.href} className="card rounded-2xl p-6 flex items-center gap-5 group">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-border-2 bg-white/[0.03] mono text-ink-mute">
          ƒx
        </span>
        <span className="flex-1">
          <span className="h-eyebrow block mb-1.5">{t("freeTool")}</span>
          <span className="block font-semibold text-white">{tool.label}</span>
          {tool.desc && <span className="block text-sm text-ink-mute mt-1 leading-relaxed">{tool.desc}</span>}
        </span>
        <span aria-hidden className="mono text-ink-mute group-hover:text-white transition-colors">→</span>
      </Link>
    </div>
  );
}

/** Aimant à email (content-upgrade). Pointe vers /formation en attendant Beehiiv. */
export function LeadMagnetCTA({ magnet }: { magnet: LeadMagnet }) {
  const t = useTranslations("Resources");
  return (
    <div className={`${READ_WIDTH} mx-auto my-10`}>
      <div className="glow-border rounded-2xl p-7 sm:p-8">
        <div className="h-eyebrow mb-3">{t("freeResource")}</div>
        <h3 className="h-title text-xl md:text-2xl mb-2">{magnet.title}</h3>
        <p className="text-ink-mute text-sm leading-relaxed mb-6 max-w-md">{magnet.desc}</p>
        <Link href={magnet.href} className="btn btn-primary">
          {magnet.cta} →
        </Link>
      </div>
    </div>
  );
}

/** Pont produit soft (jamais une promesse de gain). */
export function ProductBridge({ product }: { product: Ref }) {
  const t = useTranslations("Resources");
  return (
    <div className={`${READ_WIDTH} mx-auto my-12`}>
      <div className="rounded-2xl border border-border bg-panel/40 p-7 sm:p-8">
        <div className="h-eyebrow mb-3">{t("forFurther")}</div>
        <p className="text-ink-mute leading-relaxed mb-6 [&_strong]:text-white">
          {product.desc}
        </p>
        <Link
          href={product.href}
          className="mono text-[11px] uppercase tracking-[0.2em] text-white link-underline"
        >
          {t("discoverProduct", { label: product.label })}
        </Link>
      </div>
    </div>
  );
}

/* ————— FAQ (FAQPage + accordéon natif) ————— */
export function Faq({ items }: { items: FaqItem[] }) {
  const t = useTranslations("Resources");
  if (!items.length) return null;
  return (
    <section className={`${READ_WIDTH} mx-auto my-16`}>
      <div className="h-eyebrow mb-6">{t("faqTitle")}</div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <details key={i} className="faq-item card rounded-xl p-5">
            <summary className="flex cursor-pointer items-start justify-between gap-4 text-white font-medium">
              <span>{it.q}</span>
              <span aria-hidden className="mono text-ink-mute flex-shrink-0">+</span>
            </summary>
            <p className="faq-answer text-sm text-ink-mute leading-relaxed mt-4">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ————— Maillage « À lire ensuite » ————— */
export function RelatedArticles({
  items,
}: {
  items: { href: string; title: string; description: string; pillar: string }[];
}) {
  const t = useTranslations("Resources");
  if (!items.length) return null;
  return (
    <section className="max-w-wrap mx-auto px-6 sm:px-10 my-20">
      <div className="h-eyebrow mb-6">{t("readNext")}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="card rounded-2xl p-6 group block">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-3">
              {it.pillar}
            </div>
            <h3 className="font-semibold text-lg text-white mb-2 group-hover:text-white transition">
              {it.title}
            </h3>
            <p className="text-sm text-ink-mute leading-relaxed line-clamp-2">{it.description}</p>
            <span className="mono text-[11px] uppercase tracking-widest text-ink-mute group-hover:text-white transition mt-4 inline-block">
              {t("read")}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ————— Disclaimer AMF (réutilisé tel quel) ————— */
export function Disclaimer() {
  const t = useTranslations("Resources");
  return (
    <div className={`${READ_WIDTH} mx-auto my-12`}>
      <p className="mono text-[10px] uppercase tracking-[0.15em] text-ink-faint leading-relaxed border-t border-border pt-6">
        {t("disclaimer")}
      </p>
    </div>
  );
}
