// Source : strategy_lab.html — adapté pour Meridian
// Décision : on parle de "configurations" et "modèles théoriques", jamais d'instruments nommés.
// Tout est "backtest requis avant capital réel" → conforme Position AMF DOC-2008-23.

export type MarketType = "tendance" | "range" | "breakout" | "volatilite";
export type Frequency = "faible" | "moyenne" | "forte";

export type ChartCandle = {
  o: number;
  h: number;
  l: number;
  c: number;
  highlight?: boolean;
};

export type ChartZone = {
  y1: number;
  y2: number;
  color: "bull" | "bear" | "info" | "neutral";
  label?: string;
};

export type ChartLine = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  color: "bull" | "bear" | "info" | "premium";
  style?: "solid" | "dashed";
};

export type ChartLevel = {
  y: number;
  color: "bull" | "bear" | "info" | "premium";
  label?: string;
};

export type ChartMarker = {
  x: number;
  y: number;
  type: "entry" | "sl" | "tp";
  label?: string;
  dir?: "left" | "right" | "top" | "bottom";
};

export type ChartAnnotation = {
  x: number;
  y: number;
  label: string;
};

export type ChartConfig = {
  candles: ChartCandle[];
  zones?: ChartZone[];
  lines?: ChartLine[];
  levels?: ChartLevel[];
  markers?: ChartMarker[];
  annotations?: ChartAnnotation[];
};

export type Opportunity = {
  contexte: string;
  declencheur: string;
  entree: string;
  invalidation: string;
  stopLoss: string;
  takeProfit: string;
  gestion: string;
  pieges: string;
};

export type Strategy = {
  id: number;
  slug: string;
  name: string;
  market: string;
  timeframe: string;
  marketType: MarketType;
  conditions: string;
  chart: ChartConfig;
  patternDesc: string;
  opportunity: Opportunity;
  checklist: string[];
  backtest: string;
  evidenceState: string[];
  complexity: number; // 1-5
  frequency: Frequency;
  optimalConditions: string;
  psychDifficulty: number; // 1-5
  hasDeepDive?: boolean;
};

export const MARKET_TYPE_LABELS: Record<MarketType, string> = {
  tendance: "Tendance",
  range: "Range",
  breakout: "Breakout",
  volatilite: "Volatilité",
};

export const STRATEGIES: Strategy[] = [
  {
    id: 1,
    slug: "breakout-range",
    name: "Breakout de Range",
    market: "Crypto / Forex / Indices",
    timeframe: "15m → 4H",
    marketType: "breakout",
    conditions:
      "Volatilité contractée, range étroit clairement borné, au moins 4 touches alternées sur les bornes hautes et basses. ATR en baisse sur les dernières bougies.",
    chart: {
      candles: [
        { o: 55, h: 62, l: 52, c: 60 },
        { o: 60, h: 73, l: 58, c: 68 },
        { o: 68, h: 75, l: 65, c: 67 },
        { o: 67, h: 70, l: 55, c: 58 },
        { o: 58, h: 64, l: 52, c: 62 },
        { o: 62, h: 74, l: 60, c: 65 },
        { o: 65, h: 72, l: 56, c: 59 },
        { o: 59, h: 68, l: 56, c: 67 },
        { o: 67, h: 90, l: 66, c: 88, highlight: true },
        { o: 88, h: 96, l: 84, c: 93 },
      ],
      zones: [{ y1: 75, y2: 52, color: "neutral", label: "Range" }],
      levels: [
        { y: 75, color: "bear", label: "RÉSIST." },
        { y: 52, color: "bull", label: "SUPPORT" },
      ],
      markers: [
        { x: 8, y: 88, type: "entry", label: "ENTRY", dir: "right" },
        { x: 8, y: 52, type: "sl", label: "SL", dir: "right" },
        { x: 9, y: 110, type: "tp", label: "TP", dir: "right" },
      ],
    },
    patternDesc:
      "Consolidation horizontale serrée suivie d'une bougie impulsive avec corps marqué cassant la borne supérieure. Volume en expansion à la cassure.",
    opportunity: {
      contexte:
        "Marché compressé, ATR en baisse, range clairement borné par au moins 4 touches sur le timeframe choisi.",
      declencheur:
        "Bougie impulsive avec clôture nette au-delà de la borne du range, volume > 1.5× moyenne mobile 20.",
      entree:
        "À la clôture de la bougie cassante, ou sur premier pullback vers la borne fraîchement cassée.",
      invalidation:
        "Retour du prix à l'intérieur du range dans les 2-3 bougies suivant la cassure.",
      stopLoss:
        "Sous la borne opposée pour les longs, au-dessus pour les shorts. Alternative : 1.5× ATR.",
      takeProfit:
        "Projection = hauteur du range ajoutée à la borne cassée. Objectif RR fixe 2:1 possible.",
      gestion: "Break-even une fois 50% de l'objectif atteint. Aucun pyramiding sur ce setup.",
      pieges:
        "Fausses cassures sur faible volume, cassures pré-news ignorées, range trop large rendant le RR défavorable.",
    },
    checklist: [
      "Range bien défini avec ≥ 4 touches alternées sur les bornes ?",
      "ATR en contraction sur les 5-10 dernières bougies ?",
      "Volume confirme la cassure (≥ 1.5× moyenne 20) ?",
      "Bougie de cassure : corps > 60% du range total ?",
      "Clôture nette au-delà de la borne (pas seulement mèche) ?",
      "RR projeté ≥ 2:1 vers l'objectif théorique ?",
    ],
    backtest:
      "Marquer 30 à 50 cassures sur l'historique. Pour chaque : noter direction, volume, contexte ATR, atteinte TP/SL. Calculer winrate, expectancy et profit factor. Comparer la performance sur 3 régimes de marché distincts.",
    evidenceState: ["Non vérifié", "Backtest requis"],
    complexity: 2,
    frequency: "moyenne",
    optimalConditions: "Compression de volatilité avant ouverture de session active",
    psychDifficulty: 2,
    hasDeepDive: true,
  },
  {
    id: 2,
    slug: "pullback-ema200",
    name: "Pullback EMA200 en Tendance",
    market: "Actions / Indices / Crypto",
    timeframe: "1H → Daily",
    marketType: "tendance",
    conditions:
      "Tendance clairement établie sur le HTF (structure HH/HL ou LH/LL). EMA200 pentée. Le prix s'éloigne puis revient tester la moyenne.",
    chart: {
      candles: [
        { o: 30, h: 36, l: 28, c: 34 },
        { o: 34, h: 42, l: 33, c: 41 },
        { o: 41, h: 50, l: 40, c: 48 },
        { o: 48, h: 58, l: 47, c: 56 },
        { o: 56, h: 64, l: 55, c: 62 },
        { o: 62, h: 68, l: 54, c: 56 },
        { o: 56, h: 58, l: 46, c: 49 },
        { o: 49, h: 52, l: 44, c: 51, highlight: true },
        { o: 51, h: 64, l: 50, c: 62 },
        { o: 62, h: 78, l: 60, c: 76 },
      ],
      lines: [{ x1: 0, x2: 9, y1: 32, y2: 56, color: "premium", style: "dashed" }],
      markers: [
        { x: 7, y: 51, type: "entry", label: "ENTRY", dir: "right" },
        { x: 7, y: 42, type: "sl", label: "SL", dir: "right" },
        { x: 9, y: 80, type: "tp", label: "TP", dir: "right" },
      ],
      annotations: [{ x: 4, y: 35, label: "— EMA200 —" }],
    },
    patternDesc:
      "Tendance haussière établie, correction propre vers l'EMA200, bougie de rejet (mèche basse + corps haussier) confirmant la reprise du momentum.",
    opportunity: {
      contexte:
        "Tendance lisible, EMA200 en pente nette. Le prix est resté du bon côté plusieurs semaines.",
      declencheur:
        "Touche de l'EMA200 suivie d'une bougie de rejet : pin bar, engulfing, ou doji avec longue mèche.",
      entree:
        "À la clôture de la bougie de rejet. Variante : cassure du high de la bougie de rejet pour confirmation.",
      invalidation:
        "Clôture franche de l'autre côté de l'EMA200 (perte de la structure de tendance).",
      stopLoss: "Sous le plus bas de la bougie de rejet, ou EMA200 − 0.5× ATR.",
      takeProfit:
        "Précédent swing high pour TP1. Extension 1.618× de la dernière jambe pour TP2.",
      gestion: "Sortir 50% au TP1, laisser courir le reste avec trailing stop sur swings.",
      pieges:
        "Confondre fin de tendance avec pullback, entrer avant la bougie de rejet, whipsaw autour de l'EMA.",
    },
    checklist: [
      "EMA200 clairement pentée (pas plate) ?",
      "Structure HH/HL ou LH/LL confirmée sur HTF ?",
      "Touche de l'EMA200 accompagnée d'un rejet net ?",
      "Contexte HTF aligné avec la direction du trade ?",
      "RSI montre divergence ou reset hors zone extrême ?",
      "RR ≥ 1.5 vers le prochain swing structural ?",
    ],
    backtest:
      "Sur 12-24 mois d'un instrument tendanciel, lister toutes les touches significatives de l'EMA200. Catégoriser early/mid/late trend. Mesurer winrate du pattern d'entrée et RR moyen atteint.",
    evidenceState: ["Non vérifié", "Backtest requis"],
    complexity: 3,
    frequency: "faible",
    optimalConditions: "Tendance forte, EMA200 pentée, corrections nettes vers la moyenne",
    psychDifficulty: 3,
    hasDeepDive: true,
  },
  {
    id: 3,
    slug: "swing-convergence-mtf",
    name: "Swing Convergence Multi-Timeframe",
    market: "Forex · Indices · Matières premières",
    timeframe: "M15 → Weekly",
    marketType: "tendance",
    conditions:
      "Tendance lisible et alignée sur Weekly, Daily et H1 (convergence multi-timeframe). Le prix corrige brièvement en M15 vers une zone neutre (moyenne mobile, ancien support), sans fort décalage préalable.",
    chart: {
      candles: [
        { o: 28, h: 36, l: 27, c: 35 },
        { o: 35, h: 44, l: 34, c: 43 },
        { o: 43, h: 54, l: 42, c: 52 },
        { o: 52, h: 54, l: 44, c: 46 },
        { o: 46, h: 48, l: 40, c: 43 },
        { o: 43, h: 49, l: 42, c: 47 },
        { o: 47, h: 48, l: 36, c: 39, highlight: true },
        { o: 39, h: 50, l: 38, c: 49, highlight: true },
        { o: 49, h: 60, l: 48, c: 58 },
        { o: 58, h: 70, l: 57, c: 68 },
      ],
      lines: [{ x1: 0, x2: 9, y1: 30, y2: 54, color: "premium", style: "dashed" }],
      markers: [
        { x: 7, y: 49, type: "entry", label: "ENTRY", dir: "right" },
        { x: 6, y: 34, type: "sl", label: "SL", dir: "right" },
        { x: 9, y: 66, type: "tp", label: "TP", dir: "right" },
      ],
      annotations: [{ x: 3, y: 33, label: "— Zone Neutre —" }],
    },
    patternDesc:
      "Tendance haussière validée sur les unités de temps hautes. Pullback M15 formant un premier point bas, un léger rebond, puis un second point bas (le plus récent) absorbé par les acheteurs. Entrée sur la bougie de confirmation, stop sous ce 2ème point bas.",
    opportunity: {
      contexte:
        "Biais directionnel convergent sur Weekly + Daily + H1. Marché impulsif, pas de fort décalage récent (mouvement < ~3× ATR depuis le dernier creux).",
      declencheur:
        "Pullback M15 sur la zone neutre, structure en deux points bas, puis bougie d'absorption confirmant la reprise (sortie de zone neutre des oscillateurs).",
      entree:
        "À la clôture de la bougie d'absorption du 2ème point bas. Variante : ordre stop sur cassure du haut de cette bougie.",
      invalidation:
        "Cassure franche du 2ème point bas : la dernière tentative de baisse n'est plus absorbée, la structure du pullback est rompue.",
      stopLoss:
        "Sous le 2ème point bas (le plus récent chronologiquement), jamais sous le 1er. Aucun élargissement en cours de trade.",
      takeProfit:
        "TP1 = 1R (sortie 25%), TP2 = 2R (sortie 25%). Le solde (runner) est laissé courir en trailing. TP1 doit valoir ≥ 1R, sinon pas de trade.",
      gestion:
        "Sortie progressive 25 / 25 / trailing. Stop remonté au break-even après TP1, puis à +1R après TP2. Renforcement progressif possible uniquement sur trade gagnant en marché impulsif.",
      pieges:
        "Stop placé sous le 1er point bas au lieu du 2ème, entrée après un fort décalage (FOMO), cassure de zone neutre prise pour un pullback, trade contre l'unité de temps Daily.",
    },
    checklist: [
      "Weekly et Daily alignés dans le sens du trade (convergence) ?",
      "H1 confirme l'impulsion intermédiaire ?",
      "Pas de fort décalage récent (mouvement < ~3× ATR depuis le dernier creux) ?",
      "Pullback M15 sur une zone neutre identifiée (moyenne mobile, ancien support) ?",
      "Structure en 2ème point bas qui tient, stop placé sous ce 2ème PB ?",
      "TP1 atteignable à ≥ 1R, hors heure creuse et hors news < 1h ?",
    ],
    backtest:
      "Sur 12-24 mois d'un instrument tendanciel, lister les pullbacks M15 survenus en convergence Weekly/Daily/H1. Pour chacun : noter le score de convergence, la tenue du 2ème PB, et le R atteint avec la sortie 25/25/trailing. Mesurer l'expectancy par tranche de score, sur 3 régimes de marché distincts.",
    evidenceState: ["Non vérifié", "Backtest requis"],
    complexity: 4,
    frequency: "faible",
    optimalConditions: "Tendance convergente W/D/H1, prime time London/NY, pullback propre sur zone neutre",
    psychDifficulty: 4,
    hasDeepDive: true,
  },
];

export function getStrategyBySlug(slug: string): Strategy | undefined {
  return STRATEGIES.find((s) => s.slug === slug);
}

export const OPP_KEYS: Array<[keyof Opportunity, string]> = [
  ["contexte", "Contexte"],
  ["declencheur", "Déclencheur"],
  ["entree", "Entrée"],
  ["invalidation", "Invalidation"],
  ["stopLoss", "Stop loss"],
  ["takeProfit", "Take profit"],
  ["gestion", "Gestion"],
  ["pieges", "Pièges"],
];
