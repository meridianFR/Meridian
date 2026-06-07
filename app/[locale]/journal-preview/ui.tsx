"use client";

import { useState } from "react";
import { HEATMAP, HEURES, SCATTER, type Flag, type SetupStatus } from "./data";

/* ------------------------------------------------------------------ primitives */

export function Rval({ v, suffix = "R", approx = false }: { v: number; suffix?: string; approx?: boolean }) {
  const color = v > 0 ? "text-edge" : v < 0 ? "text-risk" : "text-ink-muted";
  const sign = v > 0 ? "+" : "";
  return (
    <span className={`mono ${color}`}>
      {approx ? "~" : ""}
      {sign}
      {v.toFixed(1)}
      {suffix}
    </span>
  );
}

export function FlagPill({ flag }: { flag: Flag }) {
  if (flag === "conforme") return <span className="pill pill-green">Conforme</span>;
  if (flag === "partiel") return <span className="pill">Partiel</span>;
  return <span className="pill pill-red">Hors plan</span>;
}

export function StatusPill({ status }: { status: SetupStatus }) {
  const cls =
    status === "PRIORITAIRE"
      ? "pill-green"
      : status === "À RETIRER"
        ? "pill-red"
        : status === "SOLIDE"
          ? "pill-white"
          : "";
  return <span className={`pill ${cls}`}>{status}</span>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="h-eyebrow mb-4">{children}</div>;
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`card rounded-2xl ${className}`}>{children}</div>;
}

/** Petit label mono majuscule utilisé en tête de carte / section. */
export function CardLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mono text-[10px] uppercase tracking-[0.25em] text-ink-faint ${className}`}>{children}</div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-2">{children}</div>;
}

/** Groupe de boutons-segments (Long/Short, Conforme/Partiel/Hors plan, etc.). */
export function SegGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly (readonly [T, string])[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`flex-1 py-2.5 rounded-lg text-sm border transition ${
            value === v ? "border-border-2 bg-white/5 text-white" : "border-border text-ink-muted hover:text-ink-mute"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/** Section repliable avec compteur optionnel, pour le drawer de saisie. */
export function Collapsible({
  title,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((x) => !x)}
        className="w-full flex items-center justify-between py-3 text-sm text-ink-mute hover:text-white transition"
      >
        <span className="flex items-center gap-2">
          {title}
          {badge && <span className="mono text-[10px] text-ink-faint">{badge}</span>}
        </span>
        <span className="mono text-ink-faint text-base leading-none">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ drawer shell */

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/70 z-[60] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full bg-panel border-l border-border z-[70] transition-transform duration-300 flex flex-col ${
          wide ? "sm:w-[620px]" : "sm:w-[480px]"
        } ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="px-6 h-16 flex items-center justify-between border-b border-border shrink-0">
          <span className="mono text-[11px] uppercase tracking-[0.3em] text-ink-muted truncate pr-4">{title}</span>
          <button
            onClick={onClose}
            className="mono text-[11px] text-ink-muted hover:text-white transition shrink-0"
          >
            ESC ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="p-4 border-t border-border flex justify-end gap-3 shrink-0">{footer}</div>}
      </aside>
    </>
  );
}

/* ------------------------------------------------------------------ charts */

export function EquityCurve({ data }: { data: number[] }) {
  const w = 820;
  const h = 200;
  const pad = 12;
  if (data.length < 2) {
    return (
      <div style={{ height: 200 }} className="flex items-center justify-center text-xs text-ink-faint">
        Pas encore assez de trades pour tracer la courbe.
      </div>
    );
  }
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - 2 * pad);
    const y = h - pad - ((v - min) / (max - min || 1)) * (h - 2 * pad);
    return [x, y] as const;
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${path} L${pts[pts.length - 1][0].toFixed(1)},${h} L${pts[0][0].toFixed(1)},${h} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 200 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(245,245,245,0.10)" />
          <stop offset="100%" stopColor="rgba(245,245,245,0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#equityFill)" stroke="none" />
      <path d={path} fill="none" stroke="#f5f5f5" strokeWidth={1.5} strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={3} fill="#fff" />
    </svg>
  );
}

export function DistribBars({ data }: { data: { bin: string; count: number; positive: boolean }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div>
      <div className="flex items-end gap-2" style={{ height: 150 }}>
        {data.map((d) => (
          <div
            key={d.bin}
            className="flex-1 rounded-t-sm transition-all"
            style={{
              height: `${(d.count / max) * 100}%`,
              minHeight: 2,
              background: d.positive ? "#22c55e" : d.bin === "0" ? "#3f3f3f" : "#ef4444",
              opacity: d.positive || d.bin !== "0" ? 0.8 : 1,
            }}
            title={`${d.bin}R : ${d.count} trades`}
          />
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        {data.map((d) => (
          <div key={d.bin} className="flex-1 text-center mono text-[10px] text-ink-faint">
            {d.bin}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Heatmap() {
  const colorOf = (v: number) =>
    v === 0 ? "#151515" : v === 1 ? "rgba(239,68,68,0.5)" : v === 2 ? "#525252" : "rgba(34,197,94,0.6)";
  const labelOf = (v: number) => (v === 0 ? "Pas tradé" : v === 1 ? "Hors plan" : v === 2 ? "Partiel" : "Conforme");
  const weeks = Array.from({ length: 10 }, (_, wk) => HEATMAP.slice(wk * 7, wk * 7 + 7));
  return (
    <div className="flex gap-[3px]">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((v, di) => (
            <div
              key={di}
              className="w-3.5 h-3.5 rounded-[2px]"
              style={{ background: colorOf(v) }}
              title={labelOf(v)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function HeatmapLegend() {
  const items: [string, string][] = [
    ["#151515", "Pas tradé"],
    ["rgba(239,68,68,0.5)", "Hors plan"],
    ["#525252", "Partiel"],
    ["rgba(34,197,94,0.6)", "Conforme"],
  ];
  return (
    <>
      {items.map(([bg, label]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[2px] inline-block" style={{ background: bg }} /> {label}
        </span>
      ))}
    </>
  );
}

export function HoursBars() {
  const maxAbs = Math.max(...HEURES.map((h) => Math.abs(h.r ?? 0)));
  return (
    <div className="space-y-2.5">
      {HEURES.map((h) => (
        <div key={h.h} className="flex items-center gap-3">
          <span className="mono text-[11px] text-ink-muted w-9">{h.h}</span>
          <div className="flex-1 h-3 bg-[#0e0e0e] rounded-sm overflow-hidden border border-border">
            {h.r !== null && (
              <div
                className="h-full rounded-sm"
                style={{
                  width: `${(Math.abs(h.r) / maxAbs) * 100}%`,
                  background: h.r >= 0 ? "#22c55e" : "#ef4444",
                  opacity: 0.7,
                }}
              />
            )}
          </div>
          <span className="mono text-[11px] w-12 text-right">
            {h.r === null ? <span className="text-ink-faint">—</span> : <Rval v={h.r} />}
          </span>
        </div>
      ))}
    </div>
  );
}

export function EmotionScatter() {
  const w = 320;
  const h = 200;
  const pad = 28;
  const xOf = (e: number) => pad + ((e - 1) / 4) * (w - 2 * pad);
  const yOf = (r: number) => h / 2 - (r / 3) * (h / 2 - pad);
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: 200 }}>
      <line x1={pad} y1={h / 2} x2={w - pad} y2={h / 2} stroke="#262626" strokeDasharray="2 3" />
      {[1, 2, 3, 4, 5].map((e) => (
        <text key={e} x={xOf(e)} y={h - 6} fontSize={9} fill="#8a8a8a" textAnchor="middle" className="mono">
          {e}
        </text>
      ))}
      {SCATTER.map((p, i) => (
        <circle key={i} cx={xOf(p.emotion)} cy={yOf(p.r)} r={4} fill={p.r >= 0 ? "#22c55e" : "#ef4444"} opacity={0.7} />
      ))}
    </svg>
  );
}

/** Barre de proportion gagnants / break-even / perdants. */
export function WinLossBar({ wins, losses, scratches = 0 }: { wins: number; losses: number; scratches?: number }) {
  const total = wins + losses + scratches || 1;
  const segs: { v: number; bg: string; fg: string; label: string }[] = [
    { v: wins, bg: "#22c55e", fg: "#000", label: "Gagnants" },
    { v: scratches, bg: "#525252", fg: "#fff", label: "Break-even" },
    { v: losses, bg: "#ef4444", fg: "#000", label: "Perdants" },
  ];
  return (
    <div className="flex h-9 w-full rounded-lg overflow-hidden border border-border">
      {segs.map((s) =>
        s.v > 0 ? (
          <div
            key={s.label}
            style={{ width: `${(s.v / total) * 100}%`, background: s.bg, color: s.fg, opacity: 0.88 }}
            className="flex items-center justify-center mono text-[11px] font-semibold min-w-0"
            title={`${s.label} : ${s.v}`}
          >
            <span className="truncate px-1">{s.v}</span>
          </div>
        ) : null,
      )}
    </div>
  );
}

/** Petits carrés colorés matérialisant la longueur d'une série. */
export function StreakDots({ count, kind }: { count: number; kind: "win" | "loss" }) {
  if (count <= 0) return <span className="text-ink-faint text-sm">—</span>;
  const bg = kind === "win" ? "#22c55e" : "#ef4444";
  return (
    <div className="flex gap-1 flex-wrap">
      {Array.from({ length: Math.min(count, 14) }).map((_, i) => (
        <span key={i} className="w-3 h-3 rounded-[3px]" style={{ background: bg, opacity: 0.85 }} />
      ))}
    </div>
  );
}

/** Barre horizontale de magnitude (gain/perte moyen), proportionnelle à un max. */
export function MagnitudeBar({ frac, positive }: { frac: number; positive: boolean }) {
  return (
    <div className="h-2.5 flex-1 bg-[#0e0e0e] rounded-sm overflow-hidden border border-border">
      <div
        className="h-full rounded-sm"
        style={{ width: `${Math.max(3, Math.min(1, frac) * 100)}%`, background: positive ? "#22c55e" : "#ef4444", opacity: 0.8 }}
      />
    </div>
  );
}
