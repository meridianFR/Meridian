/**
 * Types canoniques du Journal réel (persisté par utilisateur).
 *
 * La source de vérité temporelle est `at` (ISO timestamp). Les affichages
 * "JJ/MM" et "HH:MM" en sont dérivés (helpers ci-dessous), pour rester correct
 * sur plusieurs années — contrairement à la démo qui figeait l'année.
 *
 * Ce module est PUR (aucune dépendance serveur) : utilisable côté client,
 * côté serveur, et testable en isolation.
 */

export type Flag = "conforme" | "partiel" | "horsplan";
export type Direction = "long" | "short";

export interface Trade {
  id: string;
  accountId: string;
  at: string; // ISO 8601 — moment du trade (source de vérité)
  instrument: string;
  direction: Direction;
  r: number;
  setup: string;
  flag: Flag;
  entry: number;
  exit: number;
  size: number;
  tags: string[];
  emotion: number; // 1 (calme) → 5 (tendu)
  note: string;
  durationMin: number | null; // durée en minutes, null si inconnue
}

export interface Account {
  id: string;
  name: string;
  createdAt: string;
}

/** Brouillon d'un trade (saisie / import) avant attribution d'un id par la DB. */
export type TradeInput = Omit<Trade, "id" | "accountId">;

/** Les 12 tags comportement officiels V1 (cf. docs/journal/02-tags-comportement.md). */
export const TAG_OPTIONS = [
  "FOMO",
  "Revenge",
  "Hors plan",
  "Overtrading",
  "Surtaille",
  "Sortie prématurée",
  "SL déplacé",
  "Position traînée",
  "BE prématuré",
  "News",
  "Tilt",
  "Hésitation",
] as const;

/** Setups proposés par défaut à un nouveau compte (l'utilisateur peut en créer). */
export const DEFAULT_SETUPS = [
  "Breakout NY open",
  "Breakout euro open",
  "Trend pullback",
  "Mean reversion",
] as const;

/* ------------------------------------------------------------------ helpers d'affichage (purs, dérivés de `at`) */

const MONTHS_SHORT = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

function d(at: string): Date {
  return new Date(at);
}

/** "JJ/MM" (ex. "28/05"). */
export function tradeDate(t: Pick<Trade, "at">): string {
  const dt = d(t.at);
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}`;
}

/** "HH:MM" (ex. "14:32"). */
export function tradeTime(t: Pick<Trade, "at">): string {
  const dt = d(t.at);
  return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

/** "28 mai" — date longue courte. */
export function tradeDateLong(at: string): string {
  const dt = d(at);
  return `${dt.getDate()} ${MONTHS_SHORT[dt.getMonth()]}`;
}

/** "42 min" / "1h12" — durée lisible, "—" si inconnue. */
export function tradeDuration(t: Pick<Trade, "durationMin">): string {
  const m = t.durationMin;
  if (m == null) return "—";
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h${String(m % 60).padStart(2, "0")}`;
}
