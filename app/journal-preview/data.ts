// Données fictives pour la preview du Meridian Journal.
// Tout est en R (multiple de risque). Aucun montant en €. Déterministe (pas de random) pour éviter les mismatch SSR.

export type Flag = "conforme" | "partiel" | "horsplan";

export interface Trade {
  id: number;
  date: string;
  time: string;
  instrument: string;
  direction: "long" | "short";
  r: number;
  duration: string;
  setup: string;
  flag: Flag;
  entry: number;
  exit: number;
  size: number;
  tags: string[];
  emotion: number;
  note: string;
}

export const ACCOUNTS = ["FTMO Live · 50K", "FTMO Demo", "Compte perso"];

// Les 12 tags comportement officiels V1 (voir docs/journal/02-tags-comportement.md)
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
];

export const SETUP_OPTIONS = [
  "Breakout NY open",
  "Breakout euro open",
  "Trend pullback",
  "Mean reversion",
  "Fade NY high",
];

export const INSTRUMENT_OPTIONS = ["US30", "GER40", "XAUUSD", "EURUSD", "NAS100"];

// 12 trades écrits à la main (les plus récents, avec notes soignées)
const BASE_TRADES: Trade[] = [
  { id: 1847, date: "28/05", time: "14:32", instrument: "US30", direction: "long", r: 0.8, duration: "18 min", setup: "Breakout NY open", flag: "conforme", entry: 42318.5, exit: 42358.2, size: 0.5, tags: [], emotion: 3, note: "Setup propre, breakout sur volume. Sorti au TP." },
  { id: 1846, date: "28/05", time: "11:08", instrument: "XAUUSD", direction: "short", r: -1.0, duration: "6 min", setup: "Mean reversion", flag: "partiel", entry: 2334.1, exit: 2338.0, size: 0.2, tags: ["FOMO"], emotion: 4, note: "Entré avant confirmation. Stop touché." },
  { id: 1845, date: "28/05", time: "09:47", instrument: "GER40", direction: "long", r: 1.4, duration: "42 min", setup: "Breakout euro open", flag: "conforme", entry: 18412, exit: 18468, size: 1.0, tags: [], emotion: 2, note: "" },
  { id: 1844, date: "27/05", time: "16:14", instrument: "US30", direction: "short", r: -0.9, duration: "24 min", setup: "Fade NY high", flag: "horsplan", entry: 42501, exit: 42546, size: 0.5, tags: ["Revenge", "Hors plan"], emotion: 5, note: "Revenge après la perte de 11h. Pas dans le plan." },
  { id: 1843, date: "27/05", time: "10:22", instrument: "EURUSD", direction: "long", r: 2.1, duration: "1h12", setup: "Trend pullback", flag: "conforme", entry: 1.0842, exit: 1.0871, size: 1.0, tags: [], emotion: 2, note: "Patience récompensée." },
  { id: 1842, date: "27/05", time: "09:31", instrument: "GER40", direction: "long", r: 0.6, duration: "33 min", setup: "Breakout euro open", flag: "conforme", entry: 18380, exit: 18404, size: 1.0, tags: ["Sortie prématurée"], emotion: 3, note: "Sorti trop tôt, le TP a été touché ensuite." },
  { id: 1841, date: "26/05", time: "15:48", instrument: "US30", direction: "short", r: -1.0, duration: "11 min", setup: "Mean reversion", flag: "partiel", entry: 42210, exit: 42255, size: 0.5, tags: [], emotion: 4, note: "" },
  { id: 1840, date: "26/05", time: "10:05", instrument: "XAUUSD", direction: "long", r: 1.8, duration: "54 min", setup: "Trend pullback", flag: "conforme", entry: 2318.4, exit: 2329.1, size: 0.3, tags: [], emotion: 2, note: "" },
  { id: 1839, date: "26/05", time: "09:52", instrument: "GER40", direction: "short", r: 0.3, duration: "21 min", setup: "Breakout euro open", flag: "conforme", entry: 18440, exit: 18428, size: 1.0, tags: ["Sortie prématurée"], emotion: 3, note: "" },
  { id: 1838, date: "23/05", time: "14:11", instrument: "US30", direction: "long", r: 1.2, duration: "38 min", setup: "Breakout NY open", flag: "conforme", entry: 42050, exit: 42098, size: 0.5, tags: [], emotion: 2, note: "" },
  { id: 1837, date: "23/05", time: "11:40", instrument: "EURUSD", direction: "short", r: -1.0, duration: "9 min", setup: "Fade NY high", flag: "horsplan", entry: 1.082, exit: 1.0834, size: 1.0, tags: ["Hors plan"], emotion: 4, note: "" },
  { id: 1836, date: "23/05", time: "09:48", instrument: "GER40", direction: "long", r: 2.4, duration: "1h28", setup: "Trend pullback", flag: "conforme", entry: 18290, exit: 18356, size: 1.0, tags: [], emotion: 1, note: "Meilleur trade de la semaine." },
];

// Générateur déterministe pour étoffer l'historique (filtres + pagination crédibles).
function frac(seed: number): number {
  const x = Math.sin(seed) * 43758.5453;
  return x - Math.floor(x);
}

function tradingDaysBack(start: Date, count: number): string[] {
  const days: string[] = [];
  const d = new Date(start);
  while (days.length < count) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      days.push(`${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
    d.setDate(d.getDate() - 1);
  }
  return days;
}

// ~135 trades générés sur ~3 mois de jours ouvrés (1 à 4 trades / jour) pour
// alimenter des analytics crédibles (séries, distribution, perf par dimension).
const TARGET_GENERATED = 135;

function generatedTrades(): Trade[] {
  const days = tradingDaysBack(new Date(2026, 4, 22), 70);
  const out: Trade[] = [];
  let id = 1835;
  let k = 0;
  for (let d = 0; d < days.length && out.length < TARGET_GENERATED; d++) {
    const date = days[d];
    const perDay = 1 + Math.floor(frac(d * 3.7 + 2) * 4); // 1 à 4 trades dans la journée
    for (let j = 0; j < perDay && out.length < TARGET_GENERATED; j++, k++) {
      const instrument = INSTRUMENT_OPTIONS[Math.floor(frac(k * 12.9 + 1) * INSTRUMENT_OPTIONS.length)];
      const setup = SETUP_OPTIONS[Math.floor(frac(k * 7.7 + 3) * SETUP_OPTIONS.length)];
      const direction = frac(k * 3.3 + 5) > 0.5 ? "long" : "short";
      // Léger edge positif ; ~15% des trades sont des "runners" (gros gain ou grosse perte).
      const baseR = (frac(k * 5.1 + 9) - 0.44) * 4;
      const runner = frac(k * 1.3 + 7) > 0.85 ? 1.8 : 1;
      const r = Number((baseR * runner).toFixed(1));

      const fr = frac(k * 2.1 + 11);
      const flag: Flag = fr < 0.62 ? "conforme" : fr < 0.82 ? "partiel" : "horsplan";

      const tr = frac(k * 1.7 + 13);
      const tags: string[] = [];
      if (flag === "horsplan") tags.push("Hors plan");
      if (r <= -1.0 && tr < 0.4) tags.push("Revenge");
      else if (r >= 0.3 && r <= 1.0 && tr >= 0.4 && tr < 0.7) tags.push("Sortie prématurée");
      else if (r <= -1.3 && tr >= 0.7) tags.push("Position traînée");

      const hh = 9 + Math.floor(frac(k * 4.2 + 17) * 8);
      const mm = Math.floor(frac(k * 6.4 + 19) * 60);
      const time = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;

      const base = instrument === "EURUSD" ? 1.084 : instrument === "XAUUSD" ? 2320 : instrument === "GER40" ? 18400 : instrument === "NAS100" ? 19800 : 42000;
      const entry = instrument === "EURUSD" ? Number((base + frac(k * 2.6 + 29) * 0.01).toFixed(4)) : Math.round(base + frac(k * 2.6 + 29) * 200);
      const tick = instrument === "EURUSD" ? 0.0005 : 12;
      const exit = instrument === "EURUSD"
        ? Number((entry + (direction === "long" ? 1 : -1) * r * tick).toFixed(4))
        : Math.round(entry + (direction === "long" ? 1 : -1) * r * tick);
      const size = [0.2, 0.3, 0.5, 1.0][Math.floor(frac(k * 9.1 + 31) * 4)];
      const emotion = 1 + Math.floor(frac(k * 5.5 + 37) * 5);
      const durMin = 6 + Math.floor(frac(k * 7.2 + 41) * 84);
      const duration = durMin >= 60 ? `${Math.floor(durMin / 60)}h${String(durMin % 60).padStart(2, "0")}` : `${durMin} min`;

      out.push({ id: id--, date, time, instrument, direction, r, duration, setup, flag, entry, exit, size, tags, emotion, note: "" });
    }
  }
  return out;
}

export const TRADES: Trade[] = [...BASE_TRADES, ...generatedTrades()];

export const KPI_JOUR = {
  trades: 4,
  long: 2,
  short: 2,
  rRealise: 1.2,
  conformite: 75,
  conformesCount: 3,
  tempsEcran: "2h14",
};

// Statut qualitatif d'un setup — calculé dans stats.ts (espérance + taille d'échantillon).
export type SetupStatus = "PRIORITAIRE" | "SOLIDE" | "OK" | "MARGINAL" | "À RETIRER";

export interface ErreurRecurrente {
  rank: number;
  tag: string;
  count: number;
  avg: number;
  cumul: number;
  context: string;
  manqueAGagner?: boolean;
}

export const ERREURS: ErreurRecurrente[] = [
  { rank: 1, tag: "Revenge", count: 8, avg: -1.4, cumul: -11.2, context: "Survient dans les 30 min après une perte." },
  { rank: 2, tag: "Sortie prématurée", count: 14, avg: 0.8, cumul: 11.2, context: "Concerne surtout Trend pullback. Manque à gagner.", manqueAGagner: true },
  { rank: 3, tag: "Position traînée", count: 5, avg: -2.1, cumul: -10.5, context: "Trade au-delà du SL initial, espoir de retournement." },
];

// Heures profitables / destructrices : r = null => pas tradé
export const HEURES: { h: string; r: number | null }[] = [
  { h: "09h", r: 2.1 },
  { h: "10h", r: 1.8 },
  { h: "11h", r: 0.4 },
  { h: "12h", r: null },
  { h: "13h", r: null },
  { h: "14h", r: 0.2 },
  { h: "15h", r: -0.6 },
  { h: "16h", r: -1.2 },
  { h: "17h", r: -1.7 },
];

export const INSIGHTS: string[] = [
  "Tes jours non journalisés (4 sur 22) ont une perf -40% vs journalisés.",
  "Conformité au plan en condition de stress (après 2 pertes consécutives) : 38%.",
  "Setup Breakout NY open a chuté à 41% winrate ce mois (vs 61% historique). Surveille.",
  "Lundi est ton meilleur jour (+0.51R). Mercredi est ton pire (-0.12R).",
];

// Heatmap conformité : 70 jours (10 semaines), valeurs 0=pas tradé 1=hors plan 2=partiel 3=conforme
export const HEATMAP: number[] = Array.from({ length: 70 }, (_, i) => {
  const dow = i % 7;
  if (dow === 5 || dow === 6) return 0; // week-end : pas tradé
  const seed = Math.sin(i * 7.13) * 1000;
  const frac2 = seed - Math.floor(seed);
  if (frac2 < 0.12) return 0;
  if (frac2 < 0.27) return 1;
  if (frac2 < 0.45) return 2;
  return 3;
});

// Scatter émotion (1-5) x R réalisé. Points déterministes.
export const SCATTER: { emotion: number; r: number }[] = [
  { emotion: 1, r: 2.4 }, { emotion: 1, r: 1.8 }, { emotion: 2, r: 2.1 }, { emotion: 2, r: 1.4 },
  { emotion: 2, r: 0.8 }, { emotion: 2, r: -0.9 }, { emotion: 3, r: 1.2 }, { emotion: 3, r: 0.6 },
  { emotion: 3, r: -0.4 }, { emotion: 3, r: 0.9 }, { emotion: 4, r: -1.0 }, { emotion: 4, r: 0.3 },
  { emotion: 4, r: -1.4 }, { emotion: 4, r: -0.6 }, { emotion: 5, r: -1.7 }, { emotion: 5, r: -0.9 },
  { emotion: 5, r: -2.1 }, { emotion: 5, r: 0.4 },
];

// Weekly Behavioral Report — structure 5 mouvements (voir docs/journal/03-weekly-report.md)
export interface WeeklyReport {
  week: string;
  period: string;
  rcumul: number;
  conf: number;
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

export const REPORTS: WeeklyReport[] = [
  {
    week: "S21",
    period: "20–26 mai 2026",
    rcumul: 4.2,
    conf: 78,
    status: "Reçu · ouvert",
    subject: "Ta semaine 21 — +4.2R, et une question sur tes sorties",
    movements: {
      passe: "18 trades. +4.2R cumulés. Winrate 56%. Conformité au plan : 78%, ton meilleur score depuis cinq semaines.",
      marche: "Ton setup Breakout NY open. 6 trades, 5 gagnants, +3.8R à lui seul — soit l'essentiel de ta performance de la semaine. Tu l'as joué dans la zone d'entrée, sans chasser le prix.",
      pasMarche: "Tes sorties prématurées. Quatre trades taggés « Sortie prématurée » cette semaine. Sur ces quatre, le TP a été touché ensuite trois fois. Manque à gagner estimé : +2.4R. Tu coupes tes gagnants tôt — pas tes perdants.",
      hypothese: "Tu sembles sortir quand le trade est déjà confortablement en profit, comme pour sécuriser. C'est le réflexe inverse de celui qui te fait parfois tenir un perdant. Les deux viennent peut-être du même endroit : l'inconfort face à l'incertitude.",
      question: "Que se passerait-il si tu laissais tes trois prochains Breakout NY open aller jusqu'au TP sans intervenir ? Note ce que tu ressens à chaque fois. On en reparle dimanche.",
    },
  },
  {
    week: "S20",
    period: "13–19 mai 2026",
    rcumul: 1.1,
    conf: 71,
    status: "Reçu · ouvert",
    subject: "Ta semaine 20 — +1.1R, et ce qui se joue le mercredi",
    movements: {
      passe: "14 trades. +1.1R cumulés. Winrate 50%. Conformité au plan : 71%.",
      marche: "Ta discipline en ouverture. Sur les 6 premiers trades de la semaine, zéro entrée hors plan. Tu as attendu tes setups au lieu de les forcer.",
      pasMarche: "Le mercredi. 4 trades ce jour-là, -2.1R cumulés, et 3 d'entre eux pris après 15h. C'est ton creux récurrent depuis un mois.",
      hypothese: "L'énergie semble retomber en milieu de semaine. Tes trades de fin d'après-midi le mercredi ressemblent moins à des setups qu'à de l'occupation.",
      question: "Et si le mercredi après 15h devenait une fenêtre sans trade, juste de l'observation ? Une semaine d'essai, puis on compare.",
    },
  },
  {
    week: "S19",
    period: "06–12 mai 2026",
    rcumul: -2.3,
    conf: 54,
    status: "Reçu · ouvert",
    subject: "Ta semaine 19 — -2.3R, et où ça a basculé",
    movements: {
      passe: "16 trades. -2.3R cumulés. Winrate 44%. Conformité au plan : 54%, en baisse de 17 points sur la semaine précédente.",
      marche: "Peu de choses, et c'est honnête de le dire. Le seul point tenu : tu as coupé tes pertes à -1R sans les laisser filer. Aucune position traînée cette semaine.",
      pasMarche: "Le revenge trading. 3 trades taggés « Revenge », tous pris dans l'heure suivant une perte, -3.4R cumulés à eux seuls. Sans eux, ta semaine était à l'équilibre.",
      hypothese: "Les pertes semblent déclencher une volonté de te refaire vite, sur des setups que tu n'aurais pas pris à froid. Le déclencheur paraît être la perte elle-même, pas le marché.",
      question: "La prochaine fois qu'un stop saute, que se passerait-il si tu fermais la plateforme 30 minutes avant de regarder à nouveau ? Teste, et note ce que ça change.",
    },
  },
  {
    week: "S18",
    period: "29 avr–05 mai 2026",
    rcumul: 6.8,
    conf: 85,
    status: "Reçu",
    subject: "Ta semaine 18 — +6.8R, ta meilleure série de conformité",
    movements: {
      passe: "19 trades. +6.8R cumulés. Winrate 63%. Conformité au plan : 85%, ton plus haut niveau enregistré.",
      marche: "Tout, ou presque. Trend pullback en tête : 7 trades, +4.1R. Tu as laissé courir tes gagnants jusqu'au TP sur 5 d'entre eux.",
      pasMarche: "Une seule ombre : 2 entrées taggées « FOMO » en fin de semaine, -1.2R. Elles arrivent quand tu es déjà en profit sur la semaine, comme si la prudence baissait.",
      hypothese: "Le confort d'une bonne semaine semble relâcher ta sélectivité sur les derniers trades. La performance acquise paraît t'autoriser des prises plus lâches.",
      question: "Que se passerait-il si tu t'imposais le même filtre d'entrée le vendredi que le lundi, indépendamment de ton résultat de la semaine ?",
    },
  },
  {
    week: "S17",
    period: "22–28 avril 2026",
    rcumul: 0.4,
    conf: 62,
    status: "Reçu",
    subject: "Ta semaine 17 — +0.4R, une semaine à plat à lire",
    movements: {
      passe: "13 trades. +0.4R cumulés. Winrate 54%. Conformité au plan : 62%.",
      marche: "La stabilité. Aucune perte supérieure à -1R, aucun écart majeur au plan sur tes setups cœur. Une semaine sans dégât.",
      pasMarche: "L'absence de tranchant. 5 trades taggés « Sortie prématurée », +1.6R de manque à gagner. Tu sécurises avant le TP de façon quasi systématique.",
      hypothese: "Tu sembles trader pour ne pas perdre plutôt que pour laisser tes gains se développer. La semaine est propre, mais bridée.",
      question: "Sur tes 3 prochains trades en profit, que se passerait-il si tu déplaçais ton stop à break-even au lieu de fermer ? Compare le résultat.",
    },
  },
];

// Brouillon du Weekly Report de la semaine en cours (S22), affiché en aperçu côté Revue.
export const REPORT_DRAFT_PREVIEW =
  "Ton report de la semaine 22 sera généré dimanche 02 juin à 20h, à partir de tes trades et de ta revue hebdo.";

// Lignes brutes simulant un export broker (preview du flow d'import CSV)
export interface ImportRow {
  date: string;
  time: string;
  instrument: string;
  direction: "long" | "short";
  r: number;
  setup: string;
  flag: Flag;
  aConfirmer: boolean;
}

export const IMPORT_PREVIEW: ImportRow[] = [
  { date: "29/05", time: "09:41", instrument: "US30", direction: "long", r: 1.1, setup: "Breakout NY open", flag: "conforme", aConfirmer: false },
  { date: "29/05", time: "10:18", instrument: "GER40", direction: "short", r: -1.0, setup: "Mean reversion", flag: "partiel", aConfirmer: true },
  { date: "29/05", time: "11:02", instrument: "EURUSD", direction: "long", r: 0.4, setup: "—", flag: "conforme", aConfirmer: true },
  { date: "29/05", time: "14:27", instrument: "XAUUSD", direction: "long", r: 2.3, setup: "Trend pullback", flag: "conforme", aConfirmer: false },
  { date: "29/05", time: "15:54", instrument: "US30", direction: "short", r: -0.8, setup: "—", flag: "horsplan", aConfirmer: true },
];
