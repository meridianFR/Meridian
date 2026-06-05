/**
 * Moteur d'analyse du Journal — 100 % calculé à partir des trades réels.
 * PUR et déterministe (aucune dépendance serveur, aucun random) → testable.
 * Tout est exprimé en R (multiple de risque).
 */

import type { Flag, Trade } from "./types";

const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const DAY_ORDER = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

function tsOf(t: Trade): number {
  return new Date(t.at).getTime();
}
function weekdayOf(t: Trade): string {
  return DAY_NAMES[new Date(t.at).getDay()];
}
function hourOf(t: Trade): number {
  return new Date(t.at).getHours();
}
function fmtDate(at: string): string {
  const dt = new Date(at);
  return `${dt.getDate()} ${MONTHS[dt.getMonth()]}`;
}
/** Clé de jour calendaire locale "YYYY-MM-DD" (pour grouper par jour). */
function dayKey(at: string): string {
  const dt = new Date(at);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ dimensions */

export type SetupStatus = "PRIORITAIRE" | "SOLIDE" | "OK" | "MARGINAL" | "À RETIRER";

export interface DimRow {
  key: string;
  n: number;
  winrate: number; // %
  exp: number; // R moyen
  rcumul: number; // R cumulé
  status?: SetupStatus;
}

function statusOf(exp: number, n: number): SetupStatus {
  if (n < 5) return "MARGINAL";
  if (exp >= 0.45) return "PRIORITAIRE";
  if (exp >= 0.25) return "SOLIDE";
  if (exp >= 0.05) return "OK";
  if (exp >= -0.1) return "MARGINAL";
  return "À RETIRER";
}

function aggregate(trades: Trade[], keyOf: (t: Trade) => string, withStatus = false): DimRow[] {
  const map = new Map<string, { n: number; wins: number; losses: number; sum: number }>();
  for (const t of trades) {
    const k = keyOf(t);
    const e = map.get(k) ?? { n: 0, wins: 0, losses: 0, sum: 0 };
    e.n++;
    if (t.r > 0) e.wins++;
    else if (t.r < 0) e.losses++;
    e.sum += t.r;
    map.set(k, e);
  }
  return [...map.entries()].map(([key, e]) => {
    const decided = e.wins + e.losses;
    const exp = e.n ? e.sum / e.n : 0;
    const row: DimRow = { key, n: e.n, winrate: decided ? (e.wins / decided) * 100 : 0, exp, rcumul: e.sum };
    if (withStatus) row.status = statusOf(exp, e.n);
    return row;
  });
}

function extremum(rows: DimRow[], dir: "max" | "min"): DimRow | null {
  if (!rows.length) return null;
  return rows.reduce((best, r) => (dir === "max" ? (r.rcumul > best.rcumul ? r : best) : r.rcumul < best.rcumul ? r : best));
}

/* ------------------------------------------------------------------ horizon */

export type Horizon = "semaine" | "mois" | "annee";

export const HORIZONS: readonly (readonly [Horizon, string])[] = [
  ["semaine", "Semaine"],
  ["mois", "Mois"],
  ["annee", "Année"],
];

/** Fenêtre glissante ancrée sur le trade le plus récent (robuste aux traders sporadiques). */
export function filterByHorizon(trades: Trade[], horizon: Horizon): Trade[] {
  if (!trades.length) return trades;
  const latest = Math.max(...trades.map(tsOf));
  const cutoff = new Date(latest);
  if (horizon === "semaine") cutoff.setDate(cutoff.getDate() - 7);
  else if (horizon === "mois") cutoff.setMonth(cutoff.getMonth() - 1);
  else cutoff.setFullYear(cutoff.getFullYear() - 1);
  const min = cutoff.getTime();
  return trades.filter((t) => tsOf(t) >= min);
}

/* ------------------------------------------------------------------ equity */

export interface EquitySeries {
  equity: number[];
  netR: number;
  maxDD: number;
  n: number;
  periodStart: string;
  periodEnd: string;
}

export function equitySeries(trades: Trade[]): EquitySeries {
  const chrono = [...trades].sort((a, b) => tsOf(a) - tsOf(b));
  const equity: number[] = [0];
  let acc = 0;
  for (const t of chrono) {
    acc += t.r;
    equity.push(acc);
  }
  let peak = equity[0];
  let maxDD = 0;
  for (const v of equity) {
    if (v > peak) peak = v;
    if (v - peak < maxDD) maxDD = v - peak;
  }
  return {
    equity,
    netR: acc,
    maxDD,
    n: chrono.length,
    periodStart: chrono.length ? fmtDate(chrono[0].at) : "—",
    periodEnd: chrono.length ? fmtDate(chrono[chrono.length - 1].at) : "—",
  };
}

/* ------------------------------------------------------------------ stats globales */

export interface JournalStats {
  n: number;
  wins: number;
  losses: number;
  scratches: number;
  winRate: number;
  profitFactor: number;
  expectancy: number;
  netR: number;
  avgWin: number;
  avgLoss: number;
  payoff: number;
  maxWinStreak: number;
  maxLossStreak: number;
  maxDD: number;
  bySetup: DimRow[];
  byInstrument: DimRow[];
  byDay: DimRow[];
  byHour: DimRow[];
  bestSetup: DimRow | null;
  worstSetup: DimRow | null;
  bestDay: DimRow | null;
  bestHour: DimRow | null;
  bestInstrument: DimRow | null;
  equity: number[];
  distrib: { bin: string; count: number; positive: boolean }[];
  periodStart: string;
  periodEnd: string;
}

export function computeStats(trades: Trade[]): JournalStats {
  const chrono = [...trades].sort((a, b) => tsOf(a) - tsOf(b));
  const n = trades.length;
  const wins = trades.filter((t) => t.r > 0).length;
  const losses = trades.filter((t) => t.r < 0).length;
  const scratches = n - wins - losses;
  const decided = wins + losses;

  const grossProfit = trades.reduce((s, t) => (t.r > 0 ? s + t.r : s), 0);
  const grossLoss = trades.reduce((s, t) => (t.r < 0 ? s + Math.abs(t.r) : s), 0);
  const netR = grossProfit - grossLoss;

  const avgWin = wins ? grossProfit / wins : 0;
  const avgLoss = losses ? -grossLoss / losses : 0;

  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let curWin = 0;
  let curLoss = 0;
  for (const t of chrono) {
    if (t.r > 0) {
      curWin++;
      curLoss = 0;
    } else if (t.r < 0) {
      curLoss++;
      curWin = 0;
    } else {
      curWin = 0;
      curLoss = 0;
    }
    if (curWin > maxWinStreak) maxWinStreak = curWin;
    if (curLoss > maxLossStreak) maxLossStreak = curLoss;
  }

  const eq = equitySeries(trades);

  const rounded = trades.map((t) => Math.round(t.r));
  const lo = Math.min(-1, ...rounded);
  const hi = Math.max(1, ...rounded);
  const distrib: JournalStats["distrib"] = [];
  for (let b = lo; b <= hi; b++) {
    distrib.push({ bin: b > 0 ? `+${b}` : `${b}`, count: rounded.filter((r) => r === b).length, positive: b > 0 });
  }

  const bySetup = aggregate(trades, (t) => t.setup, true).sort((a, b) => b.rcumul - a.rcumul);
  const byInstrument = aggregate(trades, (t) => t.instrument).sort((a, b) => b.rcumul - a.rcumul);
  const byDay = aggregate(trades, weekdayOf).sort((a, b) => DAY_ORDER.indexOf(a.key) - DAY_ORDER.indexOf(b.key));
  const byHour = aggregate(trades, (t) => `${String(hourOf(t)).padStart(2, "0")}h`).sort((a, b) => a.key.localeCompare(b.key));

  return {
    n,
    wins,
    losses,
    scratches,
    winRate: decided ? (wins / decided) * 100 : 0,
    profitFactor: grossLoss === 0 ? (grossProfit > 0 ? Infinity : 0) : grossProfit / grossLoss,
    expectancy: n ? netR / n : 0,
    netR,
    avgWin,
    avgLoss,
    payoff: avgLoss !== 0 ? avgWin / Math.abs(avgLoss) : 0,
    maxWinStreak,
    maxLossStreak,
    maxDD: eq.maxDD,
    bySetup,
    byInstrument,
    byDay,
    byHour,
    bestSetup: extremum(bySetup, "max"),
    worstSetup: extremum(bySetup, "min"),
    bestDay: extremum(byDay, "max"),
    bestHour: extremum(byHour, "max"),
    bestInstrument: extremum(byInstrument, "max"),
    equity: eq.equity,
    distrib,
    periodStart: eq.periodStart,
    periodEnd: eq.periodEnd,
  };
}

/* ------------------------------------------------------------------ comportement : erreurs récurrentes */

export interface ErreurRecurrente {
  rank: number;
  tag: string;
  count: number;
  avg: number; // R moyen des trades portant ce tag
  cumul: number; // R cumulé des trades portant ce tag
  context: string;
  manqueAGagner?: boolean; // true si le cumul est positif (gain manqué plutôt que coût)
}

/**
 * Classe les tags par impact en R (valeur absolue du cumul) — les "erreurs"
 * (coût) comme les "gains manqués" (sortie prématurée à cumul positif).
 */
export function errorRanking(trades: Trade[], top = 3): ErreurRecurrente[] {
  const map = new Map<string, { count: number; sum: number }>();
  for (const t of trades) {
    for (const tag of t.tags) {
      const e = map.get(tag) ?? { count: 0, sum: 0 };
      e.count++;
      e.sum += t.r;
      map.set(tag, e);
    }
  }
  return [...map.entries()]
    .map(([tag, e]) => ({ tag, count: e.count, avg: e.sum / e.count, cumul: e.sum }))
    .sort((a, b) => Math.abs(b.cumul) - Math.abs(a.cumul))
    .slice(0, top)
    .map((e, i) => ({
      rank: i + 1,
      tag: e.tag,
      count: e.count,
      avg: e.avg,
      cumul: e.cumul,
      manqueAGagner: e.cumul > 0,
      context:
        e.cumul > 0
          ? `${e.count} occurrence${e.count > 1 ? "s" : ""} — gain manqué cumulé.`
          : `${e.count} occurrence${e.count > 1 ? "s" : ""} — coût cumulé sur la période.`,
    }));
}

/* ------------------------------------------------------------------ comportement : heures */

export interface HourPerf {
  h: string; // "09h"
  r: number | null; // R cumulé de l'heure, null si jamais tradé
}

/** R cumulé par heure, de la première à la dernière heure tradée. */
export function hoursPerf(trades: Trade[]): HourPerf[] {
  if (!trades.length) return [];
  const sums = new Map<number, number>();
  for (const t of trades) sums.set(hourOf(t), (sums.get(hourOf(t)) ?? 0) + t.r);
  const hours = [...sums.keys()];
  const lo = Math.min(...hours);
  const hi = Math.max(...hours);
  const out: HourPerf[] = [];
  for (let h = lo; h <= hi; h++) {
    out.push({ h: `${String(h).padStart(2, "0")}h`, r: sums.has(h) ? Number(sums.get(h)!.toFixed(1)) : null });
  }
  return out;
}

/* ------------------------------------------------------------------ comportement : émotion × R */

export interface ScatterPoint {
  emotion: number;
  r: number;
}

export function emotionScatter(trades: Trade[]): ScatterPoint[] {
  return trades.filter((t) => t.emotion >= 1 && t.emotion <= 5).map((t) => ({ emotion: t.emotion, r: t.r }));
}

/* ------------------------------------------------------------------ comportement : heatmap conformité */

const flagScore: Record<Flag, number> = { horsplan: 1, partiel: 2, conforme: 3 };

/**
 * Conformité par jour sur les `days` derniers jours (jusqu'au plus récent trade).
 * Valeur par case : 0 = pas tradé, 1 = hors plan, 2 = partiel, 3 = conforme.
 * Score du jour = moyenne arrondie des flags des trades du jour.
 */
export function conformityHeatmap(trades: Trade[], days = 70): number[] {
  if (!trades.length) return Array.from({ length: days }, () => 0);
  const perDay = new Map<string, { sum: number; n: number }>();
  for (const t of trades) {
    const k = dayKey(t.at);
    const e = perDay.get(k) ?? { sum: 0, n: 0 };
    e.sum += flagScore[t.flag];
    e.n++;
    perDay.set(k, e);
  }
  const end = new Date(Math.max(...trades.map(tsOf)));
  end.setHours(0, 0, 0, 0);
  const cells: number[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const e = perDay.get(k);
    cells.push(e ? Math.round(e.sum / e.n) : 0);
  }
  return cells;
}

/** Série de conformité courante et record (jours « conformes » = score 3, en ignorant les jours non tradés). */
export function conformityStreak(trades: Trade[]): { current: number; record: number } {
  if (!trades.length) return { current: 0, record: 0 };
  const perDay = new Map<string, { sum: number; n: number }>();
  for (const t of trades) {
    const k = dayKey(t.at);
    const e = perDay.get(k) ?? { sum: 0, n: 0 };
    e.sum += flagScore[t.flag];
    e.n++;
    perDay.set(k, e);
  }
  const days = [...perDay.keys()].sort(); // chronologique
  let record = 0;
  let run = 0;
  for (const k of days) {
    const e = perDay.get(k)!;
    if (Math.round(e.sum / e.n) === 3) {
      run++;
      if (run > record) record = run;
    } else run = 0;
  }
  return { current: run, record };
}

/* ------------------------------------------------------------------ aujourd'hui */

export interface TodayKpi {
  date: string; // ISO du jour considéré (le plus récent tradé)
  trades: number;
  long: number;
  short: number;
  rRealise: number;
  conformite: number; // %
  conformesCount: number;
}

/** KPI du jour tradé le plus récent (ou null si aucun trade). */
export function lastDayKpi(trades: Trade[]): TodayKpi | null {
  if (!trades.length) return null;
  const latestKey = dayKey(new Date(Math.max(...trades.map(tsOf))).toISOString());
  const dayTrades = trades.filter((t) => dayKey(t.at) === latestKey);
  const conformes = dayTrades.filter((t) => t.flag === "conforme").length;
  return {
    date: dayTrades[0]?.at ?? new Date().toISOString(),
    trades: dayTrades.length,
    long: dayTrades.filter((t) => t.direction === "long").length,
    short: dayTrades.filter((t) => t.direction === "short").length,
    rRealise: Number(dayTrades.reduce((s, t) => s + t.r, 0).toFixed(1)),
    conformite: dayTrades.length ? Math.round((conformes / dayTrades.length) * 100) : 0,
    conformesCount: conformes,
  };
}

/* ------------------------------------------------------------------ insights auto */

/** Quelques constats factuels dérivés des stats (jamais inventés). */
export function insights(trades: Trade[]): string[] {
  if (trades.length < 5) return [];
  const s = computeStats(trades);
  const out: string[] = [];

  const days = [...s.byDay].filter((d) => d.n >= 2);
  if (days.length >= 2) {
    const best = extremum(days, "max")!;
    const worst = extremum(days, "min")!;
    if (best.key !== worst.key) {
      out.push(
        `${best.key} est ton meilleur jour (${best.exp >= 0 ? "+" : ""}${best.exp.toFixed(2)}R/trade). ${worst.key} est ton pire (${worst.exp >= 0 ? "+" : ""}${worst.exp.toFixed(2)}R/trade).`,
      );
    }
  }

  if (s.bestHour && s.bestHour.rcumul > 0) {
    out.push(`Ton heure la plus rentable : ${s.bestHour.key} (${s.bestHour.rcumul >= 0 ? "+" : ""}${s.bestHour.rcumul.toFixed(1)}R cumulés).`);
  }

  const lateHours = s.byHour.filter((h) => Number(h.key.replace("h", "")) >= 15);
  const lateR = lateHours.reduce((a, h) => a + h.rcumul, 0);
  if (lateHours.length && lateR < 0) {
    out.push(`Après 15h, ton R cumulé est négatif (${lateR.toFixed(1)}R). Surveille tes trades de fin de séance.`);
  }

  if (s.worstSetup && s.worstSetup.rcumul < 0 && s.worstSetup.n >= 5) {
    out.push(`Setup le plus coûteux : ${s.worstSetup.key} (${s.worstSetup.rcumul.toFixed(1)}R sur ${s.worstSetup.n} trades).`);
  }

  // Conformité sous stress émotionnel (émotion 4-5).
  const stressed = trades.filter((t) => t.emotion >= 4);
  if (stressed.length >= 5) {
    const conf = Math.round((stressed.filter((t) => t.flag === "conforme").length / stressed.length) * 100);
    out.push(`Quand tu trades tendu (émotion 4-5), ta conformité au plan tombe à ${conf}%.`);
  }

  return out;
}
