/**
 * Générateur de Weekly Report — structure 5 mouvements (cf. docs/journal/03).
 * Les CHIFFRES sont calculés depuis les trades réels de la semaine ; le
 * narratif est templaté sur ces chiffres (jamais inventé). Pur et testable.
 */

import type { Trade } from "./types";
import { computeStats, errorRanking } from "./analytics";

export interface WeeklyReport {
  weekKey: string; // "2026-W21" (clé stable, tri)
  week: string; // "S21" (affichage)
  period: string; // "20–26 mai 2026"
  start: string; // ISO du lundi
  rcumul: number;
  conf: number; // %
  trades: number;
  status: string;
  subject: string;
  movements: {
    passe: string;
    marche: string;
    pasMarche: string;
    hypothese: string;
    question: string;
  };
}

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

const fmtR = (x: number) => `${x >= 0 ? "+" : ""}${x.toFixed(1)}R`;

/** Lundi 00:00 (local) de la semaine contenant `date`. */
export function weekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7; // 0 = lundi
  d.setDate(d.getDate() - dow);
  return d;
}

/** Numéro de semaine ISO 8601. */
export function isoWeek(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // jeudi de la semaine
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round((d.getTime() - weekStart(firstThursday).getTime()) / (7 * 864e5));
  return { year: d.getUTCFullYear(), week };
}

function periodLabel(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const sameMonth = monday.getMonth() === sunday.getMonth();
  const a = sameMonth ? `${monday.getDate()}` : `${monday.getDate()} ${MONTHS[monday.getMonth()]}`;
  const b = `${sunday.getDate()} ${MONTHS[sunday.getMonth()]} ${sunday.getFullYear()}`;
  return `${a}–${b}`;
}

const TAG_HYPOTHESIS: Record<string, string> = {
  Revenge: "Les pertes semblent déclencher une volonté de te refaire vite, sur des setups que tu n'aurais pas pris à froid.",
  "Sortie prématurée": "Tu sembles sécuriser dès que le trade est confortablement en profit — tu coupes tes gagnants, pas tes perdants.",
  "Hors plan": "Certaines entrées sortent de ton plan : à froid, elles ne passeraient probablement pas ton filtre.",
  FOMO: "La peur de rater un mouvement paraît l'emporter sur la sélectivité, surtout après un bon départ.",
  Overtrading: "Le nombre de trades semble grimper au-delà de tes setups réels — comme une occupation plus qu'une décision.",
  "Position traînée": "Tu sembles garder un perdant au-delà du plan, dans l'espoir d'un retournement.",
  Surtaille: "La taille de position paraît augmenter sous le coup de la confiance ou de l'envie de te refaire.",
  Tilt: "L'état émotionnel semble prendre le pas sur le process sur certaines séquences.",
};

const TAG_QUESTION: Record<string, string> = {
  Revenge: "La prochaine fois qu'un stop saute, que se passerait-il si tu fermais la plateforme 30 minutes avant de regarder à nouveau ?",
  "Sortie prématurée": "Sur tes 3 prochains trades en profit, que se passerait-il si tu laissais courir jusqu'au TP sans intervenir ?",
  "Hors plan": "Et si tu t'imposais d'écrire la raison du setup AVANT d'entrer, sur chaque trade de la semaine ?",
  FOMO: "Que se passerait-il si tu t'autorisais à rater les 2 premiers mouvements de la séance, par principe ?",
  Overtrading: "Et si tu te fixais un plafond de trades par jour cette semaine, et que tu notais ce que ça change ?",
  "Position traînée": "Que se passerait-il si ton stop devenait intouchable une fois posé, pour une semaine d'essai ?",
};

/** Trades d'une semaine donnée (lundi → dimanche), triés chrono. */
export function tradesOfWeek(trades: Trade[], anchor: Date): Trade[] {
  const start = weekStart(anchor).getTime();
  const end = start + 7 * 864e5;
  return trades
    .filter((t) => {
      const ts = new Date(t.at).getTime();
      return ts >= start && ts < end;
    })
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

/** Génère le report de la semaine contenant `anchor`. null si aucun trade. */
export function generateWeeklyReport(trades: Trade[], anchor: Date): WeeklyReport | null {
  const week = tradesOfWeek(trades, anchor);
  if (!week.length) return null;

  const monday = weekStart(anchor);
  const { year, week: wk } = isoWeek(monday);
  const s = computeStats(week);
  const conf = Math.round((week.filter((t) => t.flag === "conforme").length / week.length) * 100);

  // Ce qui a marché : meilleur setup positif de la semaine.
  const best = s.bySetup.filter((d) => d.rcumul > 0)[0] ?? null;
  const marche = best
    ? `Ton setup ${best.key}. ${best.n} trade${best.n > 1 ? "s" : ""}, ${Math.round((best.winrate / 100) * best.n)} gagnant${best.n > 1 ? "s" : ""}, ${fmtR(best.rcumul)} — l'essentiel de ta performance de la semaine.`
    : "Peu de choses cette semaine, et c'est honnête de le dire. Garde ton process, le reste suivra.";

  // Ce qui n'a pas marché : pire tag (impact négatif), sinon pire setup négatif.
  const errs = errorRanking(week, 5);
  const worstTag = errs.filter((e) => e.cumul < 0)[0] ?? null;
  const worstSetup = s.bySetup.filter((d) => d.rcumul < 0).slice(-1)[0] ?? null;
  let pasMarche: string;
  let pivot: string | null = null;
  if (worstTag) {
    pivot = worstTag.tag;
    pasMarche = `Tes trades taggés « ${worstTag.tag} ». ${worstTag.count} cette semaine, ${fmtR(worstTag.cumul)} cumulés à eux seuls. Sans eux, ta semaine changeait de visage.`;
  } else if (worstSetup) {
    pivot = null;
    pasMarche = `Ton setup ${worstSetup.key} : ${fmtR(worstSetup.rcumul)} sur ${worstSetup.n} trade${worstSetup.n > 1 ? "s" : ""}. À surveiller la semaine prochaine.`;
  } else {
    pasMarche = "Aucune erreur récurrente marquée cette semaine. Discipline tenue.";
  }

  const hypothese =
    (pivot && TAG_HYPOTHESIS[pivot]) ??
    "Tes écarts de la semaine semblent venir d'un même endroit : l'inconfort face à l'incertitude. À creuser dans ta revue.";
  const question =
    (pivot && TAG_QUESTION[pivot]) ??
    "Quelle est la seule règle qui, tenue chaque jour la semaine prochaine, changerait le plus ton résultat ?";

  const subject =
    s.netR >= 0
      ? `Ta semaine ${wk} — ${fmtR(s.netR)}, et ce qu'il faut en retenir`
      : `Ta semaine ${wk} — ${fmtR(s.netR)}, et où ça a basculé`;

  return {
    weekKey: `${year}-W${String(wk).padStart(2, "0")}`,
    week: `S${wk}`,
    period: periodLabel(monday),
    start: monday.toISOString(),
    rcumul: Number(s.netR.toFixed(1)),
    conf,
    trades: week.length,
    status: "Généré",
    subject,
    movements: {
      passe: `${week.length} trade${week.length > 1 ? "s" : ""}. ${fmtR(s.netR)} cumulés. Winrate ${s.winRate.toFixed(0)}%. Conformité au plan : ${conf}%.`,
      marche,
      pasMarche,
      hypothese,
      question,
    },
  };
}

/** Tous les reports des semaines qui contiennent des trades, du + récent au + ancien. */
export function weeklyReportsFromTrades(trades: Trade[]): WeeklyReport[] {
  if (!trades.length) return [];
  const seen = new Set<string>();
  const reports: WeeklyReport[] = [];
  for (const t of trades) {
    const monday = weekStart(new Date(t.at));
    const key = monday.toISOString();
    if (seen.has(key)) continue;
    seen.add(key);
    const r = generateWeeklyReport(trades, monday);
    if (r) reports.push(r);
  }
  return reports.sort((a, b) => (a.start < b.start ? 1 : -1));
}
