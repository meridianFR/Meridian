/**
 * Import de relevés broker (CSV) → brouillons de trades.
 * PUR et testable. Gère deux familles de format :
 *   1. Le format Meridian (colonnes claires : date, instrument, direction, r, …).
 *   2. Les exports MetaTrader MT4/MT5 (open time, symbol, type, volume, price,
 *      s/l, close time, profit…), avec recalcul du R à partir du stop loss.
 *
 * Le R n'est PAS inventé : s'il ne peut être ni lu ni recalculé, la ligne est
 * marquée « à confirmer » (l'utilisateur complétera après import).
 */

import type { Direction, Flag, TradeInput } from "./types";

export interface ImportDraft extends TradeInput {
  aConfirmer: boolean;
  issues: string[];
}

export interface ImportResult {
  rows: ImportDraft[];
  detected: number;
  ready: number;
  toConfirm: number;
  errors: string[];
}

/* ------------------------------------------------------------------ parsing CSV bas niveau */

/** Détecte le séparateur le plus probable sur la première ligne non vide. */
function detectDelimiter(text: string): string {
  const line = text.split(/\r?\n/).find((l) => l.trim().length) ?? "";
  const counts: Record<string, number> = { ",": 0, ";": 0, "\t": 0 };
  let inQ = false;
  for (const ch of line) {
    if (ch === '"') inQ = !inQ;
    else if (!inQ && ch in counts) counts[ch]++;
  }
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] as string) || ",";
}

/** Parse un CSV (guillemets + "" échappés) en lignes de cellules. */
export function parseDelimited(text: string, delimiter?: string): string[][] {
  const delim = delimiter ?? detectDelimiter(text);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQ = false;
  const src = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQ) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else inQ = false;
      } else cell += ch;
    } else if (ch === '"') {
      inQ = true;
    } else if (ch === delim) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      if (row.some((c) => c.trim().length)) rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim().length)) rows.push(row);
  return rows;
}

/* ------------------------------------------------------------------ mapping colonnes */

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// Alias d'en-têtes → champ logique. (ordre = priorité)
const HEADER_ALIASES: Record<string, string[]> = {
  date: ["date", "opentime", "time", "heure", "dateouverture", "datetime", "openingtime"],
  closeTime: ["closetime", "closingtime", "datecloture", "heurecloture"],
  instrument: ["symbol", "instrument", "item", "paire", "actif", "ticker", "marche"],
  direction: ["type", "direction", "sens", "side", "ordertype"],
  size: ["volume", "size", "lots", "taille", "qty", "quantity", "lot"],
  entry: ["openprice", "priceopen", "prixouverture", "entree", "entry", "prix", "price"],
  exit: ["closeprice", "priceclose", "prixcloture", "sortie", "exit"],
  sl: ["sl", "stoploss", "stop", "stoplosss", "stoplevel"],
  r: ["r", "rmultiple", "rr", "rmultiples"],
  setup: ["setup", "strategie", "strategy", "systeme", "system"],
  flag: ["flag", "conformite", "conformity", "plan"],
  profit: ["profit", "pnl", "pl", "gain", "resultat", "netprofit"],
  note: ["note", "comment", "commentaire", "comments", "remarque"],
};

function buildColumnMap(header: string[]): Record<string, number> {
  const normalized = header.map(norm);
  const map: Record<string, number> = {};
  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    for (const alias of aliases) {
      const idx = normalized.indexOf(alias);
      if (idx !== -1 && !(field in map)) {
        map[field] = idx;
        break;
      }
    }
  }
  return map;
}

/* ------------------------------------------------------------------ parsing valeurs */

/** Nombre tolérant : gère "1 234,56", "1,234.56", espaces, vide → null. */
function num(raw: string | undefined): number | null {
  if (raw == null) return null;
  let s = raw.trim().replace(/\s/g, "");
  if (!s) return null;
  // Si virgule décimale (pas de point), convertir.
  if (s.includes(",") && !s.includes(".")) s = s.replace(/,/g, ".");
  else s = s.replace(/,/g, ""); // séparateurs de milliers
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Direction tolérante. */
function dir(raw: string | undefined): Direction | null {
  const s = norm(raw ?? "");
  if (!s) return null;
  if (s.startsWith("buy") || s.startsWith("long") || s.startsWith("achat") || s === "b") return "long";
  if (s.startsWith("sell") || s.startsWith("short") || s.startsWith("vente") || s === "s") return "short";
  return null;
}

const FLAG_MAP: Record<string, Flag> = {
  conforme: "conforme",
  conform: "conforme",
  ok: "conforme",
  partiel: "partiel",
  partial: "partiel",
  horsplan: "horsplan",
  offplan: "horsplan",
  hp: "horsplan",
};

/**
 * Parse une date+heure broker → ISO local naïf "YYYY-MM-DDTHH:MM:SS" (sans
 * fuseau : on conserve l'heure « horloge » du broker). Gère :
 *   2026.05.28 14:32:00 · 2026-05-28 14:32 · 28/05/2026 14:32 · 28.05.26 · ISO.
 */
export function parseDateTime(dateRaw: string | undefined, timeRaw?: string | undefined): string | null {
  if (!dateRaw) return null;
  let d = dateRaw.trim();
  let t = (timeRaw ?? "").trim();
  // Date et heure dans la même cellule ?
  const sp = d.match(/^(.+?)[ T]+(\d{1,2}:\d{2}(:\d{2})?)$/);
  if (sp) {
    d = sp[1].trim();
    if (!t) t = sp[2];
  }

  let y: number, mo: number, da: number;
  let m: RegExpMatchArray | null;
  if ((m = d.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})$/))) {
    // YYYY-MM-DD
    y = +m[1];
    mo = +m[2];
    da = +m[3];
  } else if ((m = d.match(/^(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2,4})$/))) {
    // DD-MM-YYYY (européen)
    da = +m[1];
    mo = +m[2];
    y = +m[3];
    if (y < 100) y += 2000;
  } else {
    return null;
  }
  if (mo < 1 || mo > 12 || da < 1 || da > 31) return null;

  let hh = 0,
    mi = 0,
    ss = 0;
  const tm = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (tm) {
    hh = +tm[1];
    mi = +tm[2];
    ss = tm[3] ? +tm[3] : 0;
  }
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${p(y, 4)}-${p(mo)}-${p(da)}T${p(hh)}:${p(mi)}:${p(ss)}`;
}

/** R signé à partir de entrée / sortie / stop loss. null si non calculable. */
export function computeR(direction: Direction, entry: number | null, exit: number | null, sl: number | null): number | null {
  if (entry == null || exit == null || sl == null) return null;
  const risk = Math.abs(entry - sl);
  if (risk < 1e-12) return null;
  const raw = direction === "long" ? exit - entry : entry - exit;
  return Number((raw / risk).toFixed(1));
}

function durationMin(open: string | null, close: string | null): number | null {
  if (!open || !close) return null;
  const a = new Date(open).getTime();
  const b = new Date(close).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) return null;
  return Math.round((b - a) / 60000);
}

/* ------------------------------------------------------------------ mapping principal */

export function parseTradesCsv(text: string): ImportResult {
  const errors: string[] = [];
  const grid = parseDelimited(text);
  if (grid.length < 2) {
    return { rows: [], detected: 0, ready: 0, toConfirm: 0, errors: ["Fichier vide ou sans lignes de données."] };
  }
  const col = buildColumnMap(grid[0]);
  if (col.instrument == null || col.date == null) {
    return {
      rows: [],
      detected: 0,
      ready: 0,
      toConfirm: 0,
      errors: ["Colonnes non reconnues. Minimum requis : une date et un instrument (symbol)."],
    };
  }

  const rows: ImportDraft[] = [];
  for (let i = 1; i < grid.length; i++) {
    const cells = grid[i];
    const get = (f: string) => (col[f] != null ? cells[col[f]] : undefined);

    const at = parseDateTime(get("date"), undefined);
    const instrument = (get("instrument") ?? "").trim().toUpperCase();
    if (!at || !instrument) continue; // ligne non exploitable (souvent totaux/sous-totaux)

    const direction = dir(get("direction")) ?? "long";
    const entry = num(get("entry"));
    const exit = num(get("exit"));
    const sl = num(get("sl"));
    const size = num(get("size")) ?? 0;
    const closeAt = parseDateTime(get("closeTime"), undefined);

    const issues: string[] = [];

    // R : colonne explicite, sinon recalcul via SL, sinon à confirmer.
    let r = num(get("r"));
    if (r == null) r = computeR(direction, entry, exit, sl);
    if (r == null) issues.push("R non calculable (stop loss absent)");

    // Setup
    const setupRaw = (get("setup") ?? "").trim();
    if (!setupRaw) issues.push("setup à déduire");

    // Flag
    const flagRaw = norm(get("flag") ?? "");
    const flag: Flag = FLAG_MAP[flagRaw] ?? "conforme";
    if (!flagRaw) issues.push("conformité à valider");

    const aConfirmer = issues.length > 0;

    rows.push({
      at,
      instrument,
      direction,
      r: r ?? 0,
      setup: setupRaw,
      flag,
      entry: entry ?? 0,
      exit: exit ?? 0,
      size,
      tags: [],
      emotion: 3,
      note: (get("note") ?? "").trim(),
      durationMin: durationMin(at, closeAt),
      aConfirmer,
      issues,
    });
  }

  if (!rows.length) errors.push("Aucune ligne de trade exploitable trouvée.");
  return {
    rows,
    detected: rows.length,
    ready: rows.filter((r) => !r.aConfirmer).length,
    toConfirm: rows.filter((r) => r.aConfirmer).length,
    errors,
  };
}
