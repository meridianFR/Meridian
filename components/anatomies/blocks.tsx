import type { ReactNode } from "react";
import { CandleChart } from "@/components/candle-chart";
import type { ChartConfig } from "@/lib/strategies";

/* ===== Figure : graphique annoté + légende explicative ===== */
export function Figure({
  config,
  id,
  caption,
}: {
  config: ChartConfig;
  id: string | number;
  caption: ReactNode;
}) {
  return (
    <figure className="my-8">
      <div className="card rounded-xl p-4 sm:p-7">
        <CandleChart config={config} id={id} />
      </div>
      <figcaption className="mt-3.5 flex gap-2.5 text-sm text-ink-mute leading-relaxed">
        <span className="font-mono text-[10px] tracking-widest text-ink-faint mt-1 flex-shrink-0">
          FIG
        </span>
        <span className="max-w-2xl">{caption}</span>
      </figcaption>
    </figure>
  );
}

/* ===== Grille de scénarios : 3 mini-graphiques légendés ===== */
type ScenarioTone = "good" | "warn" | "danger";

const SCENARIO_TONE: Record<ScenarioTone, string> = {
  good: "text-edge",
  warn: "text-amber-400",
  danger: "text-risk",
};

export function ScenarioGrid({
  scenarios,
}: {
  scenarios: Array<{
    tag: string;
    tone: ScenarioTone;
    config: ChartConfig;
    id: string | number;
    title: ReactNode;
    desc: string;
  }>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
      {scenarios.map((s) => (
        <figure key={s.id} className="card rounded-xl p-4 flex flex-col">
          <div className="rounded-lg overflow-hidden bg-black/40 mb-4">
            <CandleChart config={s.config} id={s.id} />
          </div>
          <div
            className={`font-mono text-[10px] font-semibold uppercase tracking-[0.3em] mb-2 ${SCENARIO_TONE[s.tone]}`}
          >
            {s.tag}
          </div>
          <div className="font-semibold text-sm text-white mb-1.5">{s.title}</div>
          <div className="text-sm text-ink-mute leading-relaxed">{s.desc}</div>
        </figure>
      ))}
    </div>
  );
}

/* ===== Chapter header ===== */
export function ChapterHeader({
  num,
  id,
  title,
  lead,
}: {
  num: string;
  id: string;
  title: string;
  lead: string;
}) {
  return (
    <div className="mb-10" id={id}>
      <div className="h-eyebrow mb-3">Chapitre {num}</div>
      <h2 className="h-title text-3xl md:text-4xl mb-4">{title}</h2>
      <p className="text-ink-mute leading-relaxed max-w-3xl">{lead}</p>
    </div>
  );
}

/* ===== Sub-title ===== */
export function SubTitle({ children }: { children: ReactNode }) {
  return <h3 className="font-bold text-xl mt-8 mb-4">{children}</h3>;
}

export function MiniTitle({ children }: { children: ReactNode }) {
  return (
    <h4 className="font-mono text-[11px] uppercase tracking-widest text-white mb-2 mt-6">
      {children}
    </h4>
  );
}

/* ===== Prose paragraph ===== */
export function P({ children }: { children: ReactNode }) {
  return <p className="text-ink-mute leading-relaxed mb-4">{children}</p>;
}

export function Muted({ children }: { children: ReactNode }) {
  return <p className="text-ink-mute text-sm leading-relaxed mb-4">{children}</p>;
}

/* ===== Lists ===== */
export function List({ items, ordered = false }: { items: ReactNode[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={`space-y-3 my-6 pl-6 ${ordered ? "list-decimal" : "list-disc"} marker:text-ink-faint`}
    >
      {items.map((item, i) => (
        <li key={i} className="text-ink-mute leading-relaxed pl-2">
          {item}
        </li>
      ))}
    </Tag>
  );
}

/* ===== Boxes ===== */
type BoxVariant = "note" | "warn" | "danger" | "good";

const BOX_STYLES: Record<BoxVariant, { border: string; bg: string; label: string }> = {
  note: {
    border: "border-white/20",
    bg: "bg-white/[0.03]",
    label: "text-white",
  },
  warn: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/[0.05]",
    label: "text-amber-400",
  },
  danger: {
    border: "border-risk/30",
    bg: "bg-risk/[0.06]",
    label: "text-risk",
  },
  good: {
    border: "border-edge/30",
    bg: "bg-edge/[0.06]",
    label: "text-edge",
  },
};

export function Box({
  variant,
  label,
  children,
}: {
  variant: BoxVariant;
  label: string;
  children: ReactNode;
}) {
  const s = BOX_STYLES[variant];
  return (
    <div className={`my-6 rounded-xl border ${s.border} ${s.bg} p-5`}>
      <div className={`h-eyebrow mb-2 ${s.label}`}>{label}</div>
      <div className="text-sm text-ink-mute leading-relaxed">{children}</div>
    </div>
  );
}

/* ===== Criteria comparison ===== */
export function Criteria({
  good,
  bad,
  goodTitle = "À privilégier",
  badTitle = "À éviter",
}: {
  good: string[];
  bad: string[];
  goodTitle?: string;
  badTitle?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
      <div className="card rounded-xl p-6 border-edge/20">
        <div className="h-eyebrow text-edge mb-4">{goodTitle}</div>
        <ul className="space-y-2.5">
          {good.map((item, i) => (
            <li key={i} className="text-sm text-ink-mute leading-relaxed flex gap-3">
              <span className="text-edge flex-shrink-0">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card rounded-xl p-6 border-risk/20">
        <div className="h-eyebrow text-risk mb-4">{badTitle}</div>
        <ul className="space-y-2.5">
          {bad.map((item, i) => (
            <li key={i} className="text-sm text-ink-mute leading-relaxed flex gap-3">
              <span className="text-risk flex-shrink-0">✗</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ===== Phases ===== */
export function Phases({
  phases,
}: {
  phases: Array<{ num: string; name: string; desc: string }>;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-8">
      {phases.map((p) => (
        <div key={p.num} className="card rounded-xl p-5">
          <div className="font-mono text-[11px] text-ink-faint mb-2">{p.num}</div>
          <div className="font-bold text-lg mb-2">{p.name}</div>
          <div className="text-sm text-ink-mute leading-relaxed">{p.desc}</div>
        </div>
      ))}
    </div>
  );
}

/* ===== Trade management table ===== */
export type TradeRow = {
  etape: string;
  action: string;
  critere: string;
  niveau: string;
  niveauColor?: "bull" | "bear" | "info" | "gold";
};

const NIVEAU_COLOR: Record<NonNullable<TradeRow["niveauColor"]>, string> = {
  bull: "text-edge",
  bear: "text-risk",
  info: "text-[#e5e7eb]",
  gold: "text-[#c9a96e]",
};

export function TradeTable({ rows }: { rows: TradeRow[] }) {
  return (
    <div className="my-8 overflow-x-auto border border-border rounded-xl">
      <table className="w-full text-sm">
        <thead className="bg-panel">
          <tr>
            <th className="text-left p-3 h-eyebrow">Étape</th>
            <th className="text-left p-3 h-eyebrow">Action</th>
            <th className="text-left p-3 h-eyebrow hidden md:table-cell">Critère</th>
            <th className="text-left p-3 h-eyebrow">Niveau</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border hover:bg-white/[0.02] transition">
              <td className="p-3 font-mono text-[11px] uppercase tracking-wider text-white whitespace-nowrap">
                {row.etape}
              </td>
              <td className="p-3 text-ink-mute leading-relaxed">{row.action}</td>
              <td className="p-3 text-ink-muted leading-relaxed hidden md:table-cell">
                {row.critere}
              </td>
              <td
                className={`p-3 font-mono text-xs whitespace-nowrap ${
                  row.niveauColor ? NIVEAU_COLOR[row.niveauColor] : "text-ink-mute"
                }`}
              >
                {row.niveau}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ===== Checklist détaillée ===== */
export type ChecklistItem = { q: string; d: string };

export function ChecklistDetailed({ items }: { items: ChecklistItem[] }) {
  return (
    <div className="space-y-3 my-6">
      {items.map((item, i) => (
        <div key={i} className="card rounded-xl p-5 flex gap-4">
          <div className="flex-shrink-0 font-mono text-[11px] text-ink-faint mt-0.5">
            {String(i + 1).padStart(2, "0")}
          </div>
          <div>
            <div className="font-semibold text-sm text-white mb-1.5">{item.q}</div>
            <div className="text-sm text-ink-mute leading-relaxed">{item.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== Journal template ===== */
export function JournalGrid({
  cells,
}: {
  cells: Array<{ key: string; placeholder: string }>;
}) {
  return (
    <div className="my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-xl overflow-hidden">
      {cells.map((c, i) => (
        <div key={i} className="bg-black p-4">
          <div className="h-eyebrow mb-1.5">{c.key}</div>
          <div className="font-mono text-sm text-ink-faint">{c.placeholder}</div>
        </div>
      ))}
    </div>
  );
}

/* ===== Position tracker (early/mid/late) ===== */
export function PositionTracker({
  cells,
}: {
  cells: Array<{ tag: string; title: ReactNode; desc: string }>;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-8">
      {cells.map((c, i) => (
        <div key={i} className="card rounded-xl p-5">
          <div className="pill mb-3">{c.tag}</div>
          <div className="font-bold text-lg mb-2">{c.title}</div>
          <div className="text-sm text-ink-mute leading-relaxed">{c.desc}</div>
        </div>
      ))}
    </div>
  );
}

/* ===== Pattern card (for bougie de rejet) ===== */
export function PatternGrid({
  patterns,
}: {
  patterns: Array<{ name: string; desc: ReactNode }>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-8">
      {patterns.map((p, i) => (
        <div key={i} className="card rounded-xl p-5">
          <div className="font-bold mb-2">{p.name}</div>
          <div className="text-sm text-ink-mute leading-relaxed">{p.desc}</div>
        </div>
      ))}
    </div>
  );
}

/* ===== Chapter wrapper ===== */
export function Chapter({ children }: { children: ReactNode }) {
  return <section className="py-12 border-t border-border">{children}</section>;
}

/* ===== TOC ===== */
export function AnatomyTOC({
  items,
}: {
  items: Array<{ num: string; id: string; label: string }>;
}) {
  return (
    <nav className="sticky top-20 border-y border-border bg-black/80 backdrop-blur-md z-30 -mx-5 sm:-mx-8">
      <div className="max-w-wrap mx-auto px-5 sm:px-8 py-4 flex items-center gap-3 overflow-x-auto">
        <span className="h-eyebrow flex-shrink-0">Sommaire</span>
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-2 hover:border-white/40 hover:bg-white/[0.04] transition flex-shrink-0"
          >
            <span className="font-mono text-[10px] text-ink-faint">{item.num}</span>
            <span className="text-xs text-ink-mute whitespace-nowrap">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ===== Anatomy hero ===== */
export function AnatomyHero({
  module,
  title,
  em,
  lead,
  meta,
}: {
  module: number;
  title: string;
  em: string;
  lead: string;
  meta: Array<{ value: string; label: string }>;
}) {
  return (
    <header className="relative pt-32 pb-12 overflow-hidden radial-glow">
      <div
        className="blob bg-white"
        style={{ width: "380px", height: "380px", top: "-80px", left: "-80px", opacity: 0.06 }}
      />
      <div className="max-w-wrap mx-auto px-5 sm:px-8 relative">
        <div className="pill mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          <span>
            Module {String(module).padStart(2, "0")} · Anatomie complète · 10 chapitres
          </span>
        </div>

        <h1 className="h-title text-5xl md:text-7xl max-w-4xl mb-7">
          {title} <span className="shimmer">{em}</span>
        </h1>

        <p className="text-ink-mute text-lg max-w-3xl leading-relaxed mb-10">{lead}</p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {meta.map((m, i) => (
            <div key={i} className="bg-black p-5">
              <div className="font-bold text-sm leading-tight mb-1.5">{m.value}</div>
              <div className="h-eyebrow">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
