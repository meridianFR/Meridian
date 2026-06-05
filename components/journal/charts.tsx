"use client";

import { Rval } from "@/app/journal-preview/ui";
import type { HourPerf, ScatterPoint } from "@/lib/journal/analytics";

/**
 * Graphiques comportement, pilotés par les données réelles (versions
 * data-driven des graphiques de la démo).
 */

/* ------------------------------------------------------------------ heatmap conformité */

const heatColor = (v: number) =>
  v === 0 ? "#151515" : v === 1 ? "rgba(239,68,68,0.5)" : v === 2 ? "#525252" : "rgba(34,197,94,0.6)";
const heatLabel = (v: number) => (v === 0 ? "Pas tradé" : v === 1 ? "Hors plan" : v === 2 ? "Partiel" : "Conforme");

export function Heatmap({ data }: { data: number[] }) {
  const weeksCount = Math.ceil(data.length / 7);
  const weeks = Array.from({ length: weeksCount }, (_, wk) => data.slice(wk * 7, wk * 7 + 7));
  return (
    <div className="flex gap-[3px] overflow-x-auto no-scrollbar">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-[3px]">
          {week.map((v, di) => (
            <div key={di} className="w-3.5 h-3.5 rounded-[2px] shrink-0" style={{ background: heatColor(v) }} title={heatLabel(v)} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function HeatmapLegend() {
  const items: [number, string][] = [
    [0, "Pas tradé"],
    [1, "Hors plan"],
    [2, "Partiel"],
    [3, "Conforme"],
  ];
  return (
    <>
      {items.map(([v, label]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[2px] inline-block" style={{ background: heatColor(v) }} /> {label}
        </span>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ heures profitables / destructrices */

export function HoursBars({ data }: { data: HourPerf[] }) {
  const maxAbs = Math.max(1, ...data.map((h) => Math.abs(h.r ?? 0)));
  if (!data.length) return <div className="text-xs text-ink-faint py-4">Pas encore de données horaires.</div>;
  return (
    <div className="space-y-2.5">
      {data.map((h) => (
        <div key={h.h} className="flex items-center gap-3">
          <span className="mono text-[11px] text-ink-muted w-9">{h.h}</span>
          <div className="flex-1 h-3 bg-[#0e0e0e] rounded-sm overflow-hidden border border-border">
            {h.r !== null && (
              <div
                className="h-full rounded-sm"
                style={{ width: `${(Math.abs(h.r) / maxAbs) * 100}%`, background: h.r >= 0 ? "#22c55e" : "#ef4444", opacity: 0.7 }}
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

/* ------------------------------------------------------------------ émotion × R */

export function EmotionScatter({ data }: { data: ScatterPoint[] }) {
  const w = 320;
  const h = 200;
  const pad = 28;
  if (!data.length) return <div className="text-xs text-ink-faint py-4">Pas encore de données émotionnelles.</div>;
  const maxAbsR = Math.max(3, ...data.map((p) => Math.abs(p.r)));
  const xOf = (e: number) => pad + ((e - 1) / 4) * (w - 2 * pad);
  const yOf = (r: number) => h / 2 - (r / maxAbsR) * (h / 2 - pad);
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxHeight: 200 }}>
      <line x1={pad} y1={h / 2} x2={w - pad} y2={h / 2} stroke="#262626" strokeDasharray="2 3" />
      {[1, 2, 3, 4, 5].map((e) => (
        <text key={e} x={xOf(e)} y={h - 6} fontSize={9} fill="#8a8a8a" textAnchor="middle" className="mono">
          {e}
        </text>
      ))}
      {data.map((p, i) => (
        <circle key={i} cx={xOf(p.emotion)} cy={yOf(p.r)} r={4} fill={p.r >= 0 ? "#22c55e" : "#ef4444"} opacity={0.7} />
      ))}
    </svg>
  );
}
