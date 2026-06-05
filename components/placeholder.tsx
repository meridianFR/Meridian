import Link from "next/link";

type PlaceholderProps = {
  sectionNum?: string;
  sectionLabel?: string;
  title: string;
  shimmer?: string;
  subtitle?: string;
  status?: "draft" | "soon" | "live";
  backHref?: string;
  backLabel?: string;
};

const STATUS_LABEL: Record<NonNullable<PlaceholderProps["status"]>, string> = {
  draft: "EN COURS",
  soon: "À VENIR",
  live: "LIVE",
};

export function Placeholder({
  sectionNum,
  sectionLabel,
  title,
  shimmer,
  subtitle,
  status = "soon",
  backHref,
  backLabel,
}: PlaceholderProps) {
  return (
    <main className="relative pt-32 pb-24 overflow-hidden radial-glow">
      <div
        className="blob bg-white"
        style={{ width: "420px", height: "420px", top: "-80px", left: "-80px", opacity: 0.08 }}
      />
      <div
        className="blob bg-white"
        style={{ width: "320px", height: "320px", top: "220px", right: "-60px", opacity: 0.05 }}
      />

      <div className="max-w-wrap mx-auto px-5 sm:px-8 relative">
        {(sectionNum || sectionLabel) && (
          <div className="pill mb-6">
            {sectionNum && <span className="text-white">{sectionNum}</span>}
            {sectionNum && sectionLabel && <span className="text-ink-faint">·</span>}
            {sectionLabel && <span>{sectionLabel}</span>}
          </div>
        )}

        <h1 className="h-title text-5xl md:text-7xl lg:text-[80px] max-w-4xl mb-7">
          {title}
          {shimmer && (
            <>
              <br />
              <span className="shimmer">{shimmer}</span>
            </>
          )}
        </h1>

        {subtitle && (
          <p className="text-ink-mute text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            {subtitle}
          </p>
        )}

        <div className="glow-border rounded-2xl p-7 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="pill pill-white">{STATUS_LABEL[status]}</span>
            <span className="h-eyebrow">Page en construction</span>
          </div>
          <p className="text-ink-mute text-sm leading-relaxed">
            Le contenu sera publié selon la roadmap Meridian.
          </p>
        </div>

        {backHref && (
          <div className="mt-12">
            <Link
              href={backHref}
              className="font-mono text-[11px] uppercase tracking-widest text-ink-mute hover:text-white transition-colors"
            >
              ← {backLabel ?? "Retour"}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
