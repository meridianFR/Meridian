// Moteur d'analyse du Meridian Journal — toutes les métriques sont calculées
// automatiquement à partir des trades (aucune valeur statique). Tout en R.

import type { SetupStatus, Trade } from "./data";

const DAY_NAMES = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const DAY_ORDER = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

// Les dates des trades sont au format "JJ/MM" (année courante = 2026).
function partsOf(date: string): [number, number] {
  const [dd, mm] = date.split("/").map(Number);
  return [dd || 1, mm || 1];
}
function tsOf(t: Trade): number {
  const [dd, mm] = partsOf(t.date);
  const [hh, mi] = t.time.split(":").map(Number);
  return new Date(2026, mm - 1, dd, hh || 0, mi || 0).getTime();
}
function weekdayOf(t: Trade): string {
  const [dd, mm] = partsOf(t.date);
  return DAY_NAMES[new Date(2026, mm - 1, dd).getDay()];
}
function fmtDate(date: string): string {
  const [dd, mm] = partsOf(date);
  return `${dd} ${MONTHS[mm - 1]}`;
}

export interface DimRow {
  key: string;
  n: number;
  winrate: number; // %
  exp: number; // R moyen
  rcumul: number; // R cumulé
  status?: SetupStatus;
}

export interface JournalStats {
  n: number;
  wins: number;
  losses: number;
  scratches: number;
  winRate: number; // %
  profitFactor: number; // Infinity si aucune perte
  expectancy: number; // espérance, R moyen / trade
  netR: number; // R cumulé total
  avgWin: number; // gain moyen (R, ≥ 0)
  avgLoss: number; // perte moyenne (R, ≤ 0)
  payoff: number; // ratio gain/perte = avgWin / |avgLoss|
  maxWinStreak: number;
  maxLossStreak: number;
  maxDD: number; // drawdown max sur la courbe d'equity (R, ≤ 0)
  bySetup: DimRow[];
  byInstrument: DimRow[];
  byDay: DimRow[];
  byHour: DimRow[];
  bestSetup: DimRow | null;
  worstSetup: DimRow | null;
  bestDay: DimRow | null;
  bestHour: DimRow | null;
  bestInstrument: DimRow | null;
  equity: number[]; // R cumulé chronologique, démarre à 0
  distrib: { bin: string; count: number; positive: boolean }[];
  periodStart: string;
  periodEnd: string;
}

// Statut d'un setup dérivé de son espérance et de sa taille d'échantillon.
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
    const row: DimRow = {
      key,
      n: e.n,
      winrate: decided ? (e.wins / decided) * 100 : 0,
      exp,
      rcumul: e.sum,
    };
    if (withStatus) row.status = statusOf(exp, e.n);
    return row;
  });
}

function extremum(rows: DimRow[], dir: "max" | "min"): DimRow | null {
  if (!rows.length) return null;
  return rows.reduce((best, r) =>
    dir === "max" ? (r.rcumul > best.rcumul ? r : best) : r.rcumul < best.rcumul ? r : best,
  );
}

export type Horizon = "semaine" | "mois" | "annee";

export const HORIZONS: readonly (readonly [Horizon, string])[] = [
  ["semaine", "Semaine"],
  ["mois", "Mois"],
  ["annee", "Année"],
];

// Restreint les trades à un horizon glissant. L'ancre est le trade le plus
// récent du jeu (et non l'horloge système) afin de rester déterministe — c'est
// la même contrainte anti-mismatch SSR que pour les données.
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

export interface EquitySeries {
  equity: number[]; // R cumulé chronologique, démarre à 0
  netR: number; // R cumulé sur la période
  maxDD: number; // drawdown max sur la courbe (R, ≤ 0)
  n: number;
  periodStart: string;
  periodEnd: string;
}

// Courbe d'equity (R cumulé), drawdown max et bornes de période sur n'importe
// quel sous-ensemble de trades. Partagé par computeStats et par le sélecteur
// d'horizon de la courbe.
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
    periodStart: chrono.length ? fmtDate(chrono[0].date) : "—",
    periodEnd: chrono.length ? fmtDate(chrono[chrono.length - 1].date) : "—",
  };
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

  // Séries max (parcours chronologique). Un scratch (R = 0) remet les compteurs à zéro.
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

  // Courbe d'equity, drawdown max et bornes de période (cf. equitySeries).
  const eq = equitySeries(trades);

  // Distribution des R, bins entiers calés sur l'amplitude réelle.
  const rounded = trades.map((t) => Math.round(t.r));
  const lo = Math.min(-1, ...rounded);
  const hi = Math.max(1, ...rounded);
  const distrib: JournalStats["distrib"] = [];
  for (let b = lo; b <= hi; b++) {
    distrib.push({
      bin: b > 0 ? `+${b}` : `${b}`,
      count: rounded.filter((r) => r === b).length,
      positive: b > 0,
    });
  }

  const bySetup = aggregate(trades, (t) => t.setup, true).sort((a, b) => b.rcumul - a.rcumul);
  const byInstrument = aggregate(trades, (t) => t.instrument).sort((a, b) => b.rcumul - a.rcumul);
  const byDay = aggregate(trades, weekdayOf).sort((a, b) => DAY_ORDER.indexOf(a.key) - DAY_ORDER.indexOf(b.key));
  const byHour = aggregate(trades, (t) => `${t.time.split(":")[0]}h`).sort((a, b) => a.key.localeCompare(b.key));

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
