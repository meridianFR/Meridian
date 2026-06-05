import type { Strategy } from "./strategies";

// Stratégies en backlog — à développer plus tard (anatomie complète + validation).
// Volontairement NON rendues : aucune page n'importe ce tableau, rien ne s'affiche.
// Pour en réactiver une : déplacer son objet dans STRATEGIES (./strategies.ts),
// renuméroter les `id` si besoin, et lui ajouter une anatomie le cas échéant.
export const STRATEGIES_BACKLOG: Strategy[] = [
  {
    id: 3,
    slug: "failed-breakout-liquidity-grab",
    name: "Failed Breakout / Liquidity Grab",
    market: "Tous marchés liquides",
    timeframe: "5m → 1H",
    marketType: "volatilite",
    conditions:
      "Cassure d'un niveau clé (high/low récent, equal highs) suivie d'un retour rapide à l'intérieur. La liquidité au-delà du niveau a été prise.",
    chart: {
      candles: [
        { o: 50, h: 56, l: 48, c: 54 },
        { o: 54, h: 60, l: 52, c: 58 },
        { o: 58, h: 64, l: 56, c: 62 },
        { o: 62, h: 68, l: 60, c: 66 },
        { o: 66, h: 70, l: 64, c: 68 },
        { o: 68, h: 84, l: 66, c: 67, highlight: true },
        { o: 67, h: 70, l: 56, c: 58, highlight: true },
        { o: 58, h: 60, l: 48, c: 50 },
        { o: 50, h: 52, l: 40, c: 42 },
        { o: 42, h: 44, l: 32, c: 34 },
      ],
      levels: [{ y: 70, color: "bear", label: "LIQUIDITÉ" }],
      markers: [
        { x: 6, y: 58, type: "entry", label: "ENTRY", dir: "right" },
        { x: 6, y: 86, type: "sl", label: "SL", dir: "right" },
        { x: 9, y: 32, type: "tp", label: "TP", dir: "right" },
      ],
    },
    patternDesc:
      "Longue mèche perforant le niveau (chasse aux stops), puis bougie de rejet revenant fortement dans le range avec corps marqué dans la direction opposée.",
    opportunity: {
      contexte:
        "Niveau évident où la liquidité s'accumule : high/low de session, equal highs/lows, nombres ronds.",
      declencheur:
        "Mèche perçant le niveau puis clôture revenue dans le range, idéalement sur volume anormal.",
      entree:
        "À la clôture de la bougie de retour. Variante : cassure du high/low opposé de cette bougie.",
      invalidation:
        "Nouvelle cassure du niveau dans la direction initiale dans les 2-3 bougies suivantes.",
      stopLoss:
        "Au-delà de l'extrémité de la mèche de fausse cassure (haut/bas atteint pendant le sweep).",
      takeProfit: "Niveau opposé du range, ou liquidité opposée la plus proche sur le LTF.",
      gestion:
        "Trade rapide à court horizon. Prises de profit à l'objectif, pas de scaling sur ce setup.",
      pieges:
        "Vrai breakout interprété comme failed, entrée avant clôture confirmée, contexte HTF ignoré.",
    },
    checklist: [
      "Niveau visible sur HTF et significatif ?",
      "Mèche claire au-delà du niveau (sweep visible) ?",
      "Clôture revenue franchement dans le range ?",
      "Volume du retour > volume de la cassure ?",
      "Contexte HTF favorable au retournement ?",
      "Stop < 1.5× ATR sur le timeframe ?",
    ],
    backtest:
      "Sur historique récent, marquer les cassures de high/low de session et de pivots majeurs. Distinguer cassures qui tiennent vs failed breakouts. Mesurer RR moyen et taux de réussite par contexte.",
    evidenceState: ["Non vérifié", "Backtest requis"],
    complexity: 3,
    frequency: "moyenne",
    optimalConditions: "Pré-news, sessions de chasse aux stops (NY open, London close)",
    psychDifficulty: 4,
  },
  {
    id: 4,
    slug: "mean-reversion-rsi",
    name: "Mean Reversion sur Extrêmes RSI",
    market: "Indices / Actions / Crypto en range",
    timeframe: "1H → 4H",
    marketType: "range",
    conditions:
      "Marché en range identifié sur HTF. RSI au-dessus de 70 ou sous 30. Idéalement avec divergence prix/RSI sur 2-3 oscillations.",
    chart: {
      candles: [
        { o: 30, h: 36, l: 28, c: 34 },
        { o: 34, h: 44, l: 32, c: 42 },
        { o: 42, h: 52, l: 40, c: 50 },
        { o: 50, h: 60, l: 48, c: 58 },
        { o: 58, h: 70, l: 56, c: 68 },
        { o: 68, h: 82, l: 66, c: 80 },
        { o: 80, h: 92, l: 78, c: 82, highlight: true },
        { o: 82, h: 84, l: 68, c: 70, highlight: true },
        { o: 70, h: 72, l: 56, c: 58 },
        { o: 58, h: 60, l: 44, c: 46 },
      ],
      zones: [{ y1: 92, y2: 80, color: "bear", label: "Zone Surachat" }],
      levels: [{ y: 82, color: "bear", label: "EXTREME" }],
      markers: [
        { x: 7, y: 70, type: "entry", label: "ENTRY", dir: "right" },
        { x: 7, y: 92, type: "sl", label: "SL", dir: "right" },
        { x: 9, y: 44, type: "tp", label: "TP", dir: "right" },
      ],
    },
    patternDesc:
      "Extension prolongée dans une direction avec RSI en zone extrême, puis bougie de retournement nette (engulfing, pin bar) signalant l'épuisement.",
    opportunity: {
      contexte:
        "Marché en range latéral sur le HTF, pas de tendance forte établie. Range identifié et borné.",
      declencheur:
        "RSI > 70 (short) ou < 30 (long) avec divergence régulière prix/oscillateur sur 2-3 swings.",
      entree:
        "Après bougie de retournement nette à la borne du range. Pas de couteau qui tombe.",
      invalidation:
        "Cassure du range dans la direction du momentum (rejet du contexte range).",
      stopLoss:
        "Au-delà de la mèche extrême de la bougie de retournement. ATR-based en alternative.",
      takeProfit: "Médiane du range pour TP1, borne opposée pour TP2. RR cible 1.5-2.",
      gestion:
        "Sortir si le marché passe en tendance. Sortie discrétionnaire si momentum s'essouffle.",
      pieges:
        "Sortie de range confondue avec reversion, RSI extrême en tendance forte, manque de patience.",
    },
    checklist: [
      "Marché bien en range sur HTF ?",
      "RSI en zone extrême (> 70 ou < 30) ?",
      "Divergence régulière ou cachée présente ?",
      "Borne testée historiquement (niveau structurel) ?",
      "Bougie de retournement nette confirmée ?",
      "RR ≥ 1.5 vers la médiane du range ?",
    ],
    backtest:
      "Sélectionner périodes clairement en range. Lister extensions RSI extrêmes. Mesurer fréquence du retournement et RR moyen. Comparer avec/sans filtre de divergence.",
    evidenceState: ["Non vérifié", "Backtest requis"],
    complexity: 3,
    frequency: "moyenne",
    optimalConditions: "Régime de faible volatilité, pas de catalyseur news, ranges visibles",
    psychDifficulty: 4,
  },
  {
    id: 5,
    slug: "order-block-smart-money",
    name: "Order Block (Smart Money)",
    market: "Forex / Crypto / Indices",
    timeframe: "15m → 4H",
    marketType: "tendance",
    conditions:
      "Dernière bougie de consolidation avant un mouvement impulsif (Break of Structure). Le prix revient tester cette zone après le BOS.",
    chart: {
      candles: [
        { o: 60, h: 64, l: 56, c: 58 },
        { o: 58, h: 60, l: 50, c: 52, highlight: true },
        { o: 52, h: 78, l: 50, c: 76 },
        { o: 76, h: 88, l: 74, c: 86 },
        { o: 86, h: 92, l: 84, c: 90 },
        { o: 90, h: 92, l: 78, c: 80 },
        { o: 80, h: 82, l: 64, c: 66 },
        { o: 66, h: 68, l: 54, c: 60, highlight: true },
        { o: 60, h: 78, l: 58, c: 76 },
        { o: 76, h: 92, l: 74, c: 90 },
      ],
      zones: [{ y1: 60, y2: 50, color: "bull", label: "Order Block" }],
      lines: [{ x1: 4, x2: 9, y1: 90, y2: 90, color: "info", style: "dashed" }],
      markers: [
        { x: 7, y: 60, type: "entry", label: "ENTRY", dir: "right" },
        { x: 7, y: 50, type: "sl", label: "SL", dir: "right" },
        { x: 9, y: 92, type: "tp", label: "TP", dir: "right" },
      ],
    },
    patternDesc:
      "Bougie d'origine (souvent opposée à la direction finale) suivie d'une impulsion forte. Retest ultérieur de la zone d'origine avec rejet.",
    opportunity: {
      contexte:
        "Mouvement impulsif récent (BOS ou CHoCH) précédé d'une bougie d'origine identifiable.",
      declencheur:
        "Retour du prix dans la zone OB accompagné d'une réaction (rejet, bougie de continuation).",
      entree:
        "À l'intérieur de la zone OB sur réaction. Limit order acceptable si zone étroite et confluence présente.",
      invalidation: "Clôture franche au-delà de la zone OB dans la direction opposée au trade.",
      stopLoss: "Au-delà de l'extrémité de l'order block.",
      takeProfit:
        "Précédent swing dans la direction du mouvement initial. Pool de liquidité au-delà.",
      gestion: "Trade aligné avec le BOS/CHoCH. Sortir si la structure casse.",
      pieges:
        "Identifier OB hors contexte structurel, trop de candidats sans hiérarchie, forcer le concept partout.",
    },
    checklist: [
      "Break of Structure clair en amont ?",
      "Zone OB visuellement identifiable et étroite ?",
      "Retest avec réaction nette (pas traversé) ?",
      "HTF aligné avec la direction du trade ?",
      "Confluence présente (FVG, niveau, fibo) ?",
      "RR ≥ 2 vers le prochain pool de liquidité ?",
    ],
    backtest:
      "Sur instrument liquide, marquer tous les BOS sur 6-12 mois. Identifier l'OB associé. Mesurer taux de retest et de réaction. Distinguer OB en confluence vs OB isolés.",
    evidenceState: ["Non vérifié", "Backtest requis", "Données insuffisantes"],
    complexity: 5,
    frequency: "moyenne",
    optimalConditions: "Marchés institutionnels (FX majeurs, indices), structure HTF lisible",
    psychDifficulty: 4,
  },
  {
    id: 6,
    slug: "fair-value-gap",
    name: "Fair Value Gap (FVG)",
    market: "Tous marchés liquides",
    timeframe: "1m → 1H",
    marketType: "volatilite",
    conditions:
      "Trois bougies consécutives où la mèche basse de la bougie 3 ne touche pas la mèche haute de la bougie 1 (FVG haussier), ou inversement.",
    chart: {
      candles: [
        { o: 30, h: 38, l: 28, c: 36 },
        { o: 36, h: 44, l: 34, c: 42 },
        { o: 42, h: 48, l: 40, c: 46, highlight: true },
        { o: 46, h: 76, l: 45, c: 74, highlight: true },
        { o: 74, h: 84, l: 70, c: 82, highlight: true },
        { o: 82, h: 90, l: 80, c: 88 },
        { o: 88, h: 90, l: 72, c: 74 },
        { o: 74, h: 76, l: 60, c: 62 },
        { o: 62, h: 64, l: 56, c: 60 },
        { o: 60, h: 86, l: 58, c: 84 },
      ],
      zones: [{ y1: 70, y2: 48, color: "info", label: "FVG" }],
      markers: [
        { x: 8, y: 60, type: "entry", label: "ENTRY", dir: "right" },
        { x: 8, y: 48, type: "sl", label: "SL", dir: "right" },
        { x: 9, y: 90, type: "tp", label: "TP", dir: "right" },
      ],
    },
    patternDesc:
      "Gap d'inefficience entre la mèche haute de la bougie 1 et la mèche basse de la bougie 3. Le marché tend à revenir combler ce déséquilibre.",
    opportunity: {
      contexte:
        "Mouvement impulsif créant un FVG. Le marché est susceptible de revenir tester cette zone.",
      declencheur:
        "Retour du prix dans la zone du FVG, avec réaction sur la moitié ou l'extrémité du gap.",
      entree:
        "À l'entrée du FVG (50% du gap = point optimal). Limit order acceptable sur retests propres.",
      invalidation: "Clôture franche au-delà du FVG dans le sens opposé du trade.",
      stopLoss: "Au-delà de l'extrémité opposée du FVG (full fill + buffer ATR).",
      takeProfit:
        "Précédent high/low de la jambe impulsive, ou liquidité externe identifiable.",
      gestion: "Sur LTF : sortie rapide. Sur 1H+ : possibilité de tenir vers extension.",
      pieges:
        "FVG dans contexte trendless, FVG trop ancien (perdu sa pertinence), confondre avec gap d'ouverture.",
    },
    checklist: [
      "FVG clairement identifiable (3 bougies) ?",
      "Contexte HTF favorable au trade ?",
      "FVG récent (< 50 bougies) ?",
      "BOS associé au FVG en amont ?",
      "Confluence présente (OB, niveau pivot) ?",
      "RR potentiel ≥ 1.5 ?",
    ],
    backtest:
      "Identifier 50+ FVG dans l'historique d'un instrument. Mesurer taux de fill (partiel/total), délai moyen, réaction du prix à l'entrée. Filtrer par contexte structurel.",
    evidenceState: ["Non vérifié", "Backtest requis"],
    complexity: 4,
    frequency: "forte",
    optimalConditions: "Marchés impulsifs (crypto, indices sur ouverture), structure claire",
    psychDifficulty: 3,
  },
  {
    id: 7,
    slug: "liquidity-sweep-reversal",
    name: "Liquidity Sweep + Reversal",
    market: "Forex / Crypto",
    timeframe: "5m → 1H",
    marketType: "volatilite",
    conditions:
      "Prix prend la liquidité au-delà d'un swing high/low majeur ou d'equal highs/lows, puis retourne immédiatement.",
    chart: {
      candles: [
        { o: 40, h: 56, l: 38, c: 54 },
        { o: 54, h: 70, l: 52, c: 68 },
        { o: 68, h: 78, l: 66, c: 76 },
        { o: 76, h: 80, l: 70, c: 72 },
        { o: 72, h: 78, l: 64, c: 66 },
        { o: 66, h: 80, l: 64, c: 78 },
        { o: 78, h: 92, l: 76, c: 78, highlight: true },
        { o: 78, h: 80, l: 60, c: 62, highlight: true },
        { o: 62, h: 64, l: 50, c: 52 },
        { o: 52, h: 54, l: 38, c: 40 },
      ],
      levels: [{ y: 80, color: "bear", label: "EQ.HIGH" }],
      markers: [
        { x: 7, y: 62, type: "entry", label: "ENTRY", dir: "right" },
        { x: 7, y: 94, type: "sl", label: "SL", dir: "right" },
        { x: 9, y: 38, type: "tp", label: "TP", dir: "right" },
      ],
    },
    patternDesc:
      "Mouvement rapide pour chasser les stops au-delà du niveau, puis retournement net avec bougie impulsive opposée et clôture revenue dans le range.",
    opportunity: {
      contexte:
        "Zone où la liquidité est évidente : equal highs/lows, sommets/creux de session, niveaux ronds.",
      declencheur:
        "Sweep visible (mèche ou cassure brève) suivi d'une bougie de réversion forte sur le LTF.",
      entree:
        "À la clôture de la bougie de réversion, ou sur micro-pullback dans le sens du retournement.",
      invalidation: "Continuation de la cassure (nouvelle clôture au-delà du niveau swept).",
      stopLoss: "Au-delà de l'extrémité du sweep (haut/bas atteint pendant le grab).",
      takeProfit: "Pool de liquidité opposé, niveau structurel suivant.",
      gestion:
        "Setup court horizon. Sortie rapide si momentum ne se développe pas dans les 2-3 bougies.",
      pieges:
        "Trade contre vraie tendance, sweep sans reversal (vrai breakout), pool mal identifié.",
    },
    checklist: [
      "Pool de liquidité ciblé évident sur HTF ?",
      "Sweep effectué (mèche ou cassure brève) ?",
      "Bougie de réversion impulsive et nette ?",
      "Contexte HTF favorable au retournement ?",
      "Setup confluent (OB, FVG, niveau) ?",
      "RR ≥ 2 vers le pool opposé ?",
    ],
    backtest:
      "Sur 3 mois, identifier tous les equal highs/lows et swings majeurs. Marquer sweeps. Distinguer sweep+reversal vs sweep+continuation. Mesurer taux de réussite et RR moyen.",
    evidenceState: ["Non vérifié", "Backtest requis"],
    complexity: 5,
    frequency: "moyenne",
    optimalConditions: "Sessions à forte volatilité (London/NY open), avant ou après news macro",
    psychDifficulty: 5,
  },
  {
    id: 8,
    slug: "engulfing-support-resistance",
    name: "Engulfing sur Support / Résistance",
    market: "Tous marchés",
    timeframe: "4H → Daily",
    marketType: "range",
    conditions:
      "Niveau historique testé plusieurs fois. Bougie englobant intégralement la précédente sur le test, avec corps significatif.",
    chart: {
      candles: [
        { o: 78, h: 84, l: 74, c: 80 },
        { o: 80, h: 84, l: 70, c: 72 },
        { o: 72, h: 76, l: 60, c: 62 },
        { o: 62, h: 66, l: 48, c: 50 },
        { o: 50, h: 54, l: 42, c: 44 },
        { o: 44, h: 48, l: 38, c: 42 },
        { o: 42, h: 46, l: 38, c: 40, highlight: true },
        { o: 40, h: 62, l: 38, c: 60, highlight: true },
        { o: 60, h: 76, l: 58, c: 74 },
        { o: 74, h: 88, l: 72, c: 86 },
      ],
      levels: [{ y: 42, color: "bull", label: "SUPPORT" }],
      markers: [
        { x: 7, y: 60, type: "entry", label: "ENTRY", dir: "right" },
        { x: 7, y: 38, type: "sl", label: "SL", dir: "right" },
        { x: 9, y: 88, type: "tp", label: "TP", dir: "right" },
      ],
    },
    patternDesc:
      "Test d'un niveau historique majeur avec une bougie verte (longue) englobant intégralement le corps d'une bougie rouge précédente.",
    opportunity: {
      contexte:
        "Niveau identifié sur HTF avec ≥ 2 tests historiques significatifs. Prix revient sur ce niveau.",
      declencheur:
        "Bougie englobante avec corps significatif sur le niveau. Volume idéalement supérieur à la moyenne.",
      entree:
        "À la clôture de la bougie englobante, ou sur cassure du high/low pour confirmation.",
      invalidation: "Clôture suivante au-delà du niveau dans le sens opposé au trade.",
      stopLoss: "Au-delà de la mèche de la bougie englobante. Alternative : 1.5× ATR.",
      takeProfit: "Niveau opposé du range ou objectif RR fixe 2:1.",
      gestion: "Trade swing, garder ouvert plusieurs jours. Trailing stop sur swings inférieurs.",
      pieges:
        "Engulfing en contexte de tendance forte (continuation > retournement), niveau pas assez testé.",
    },
    checklist: [
      "Niveau testé ≥ 2 fois précédemment ?",
      "Bougie englobante clairement définie ?",
      "Corps > 60% du range total de la bougie ?",
      "Volume confirme (supérieur à la moyenne) ?",
      "HTF favorable au retournement ?",
      "RR projeté ≥ 2 vers la cible ?",
    ],
    backtest:
      "Sur 24-36 mois D1, marquer manuellement les engulfings sur supports/résistances majeurs. Mesurer taux de réussite, RR moyen, durée moyenne de tenue.",
    evidenceState: ["Non vérifié", "Backtest requis"],
    complexity: 2,
    frequency: "faible",
    optimalConditions: "Niveaux HTF majeurs, fin de mouvement étendu, contexte range",
    psychDifficulty: 2,
  },
  {
    id: 9,
    slug: "opening-range-breakout",
    name: "Opening Range Breakout (ORB)",
    market: "Indices US / Actions / Futures",
    timeframe: "5m → 15m",
    marketType: "breakout",
    conditions:
      "Range défini sur les 15 ou 30 premières minutes après l'ouverture officielle. Cassure de ce range avec momentum et volume.",
    chart: {
      candles: [
        { o: 60, h: 70, l: 56, c: 66 },
        { o: 66, h: 72, l: 58, c: 60 },
        { o: 60, h: 68, l: 56, c: 64 },
        { o: 64, h: 70, l: 58, c: 62 },
        { o: 62, h: 70, l: 58, c: 68 },
        { o: 68, h: 70, l: 60, c: 62 },
        { o: 62, h: 84, l: 60, c: 82, highlight: true },
        { o: 82, h: 90, l: 78, c: 88 },
        { o: 88, h: 96, l: 84, c: 94 },
        { o: 94, h: 102, l: 90, c: 100 },
      ],
      zones: [{ y1: 72, y2: 56, color: "neutral", label: "Opening Range" }],
      levels: [
        { y: 72, color: "bear", label: "ORH" },
        { y: 56, color: "bull", label: "ORL" },
      ],
      markers: [
        { x: 6, y: 82, type: "entry", label: "ENTRY", dir: "right" },
        { x: 6, y: 56, type: "sl", label: "SL", dir: "right" },
        { x: 9, y: 102, type: "tp", label: "TP", dir: "right" },
      ],
    },
    patternDesc:
      "Range établi sur l'open (15 ou 30 min) puis cassure impulsive de la borne haute avec clôture nette et volume marqué.",
    opportunity: {
      contexte:
        "Ouverture de session (cash open 9:30 par exemple). Range établi sur 15 ou 30 premières minutes.",
      declencheur:
        "Première clôture franche d'une bougie au-delà du high (long) ou low (short) du range d'ouverture.",
      entree:
        "À la clôture de la bougie de cassure. Pullback acceptable sur la borne cassée si volume favorable.",
      invalidation:
        "Retour à l'intérieur du range immédiat, ou cassure de la borne opposée.",
      stopLoss: "Sous la borne opposée du range d'ouverture. Alternative : milieu du range.",
      takeProfit:
        "Projection = 1× ou 2× la hauteur du range au-delà du point de cassure.",
      gestion:
        "Setup intraday : clôturer avant fin de session. Trailing possible si momentum continue.",
      pieges:
        "Cassure suivie d'un retour rapide, range trop large rendant le RR défavorable, news intraday inattendue.",
    },
    checklist: [
      "Range d'ouverture clairement délimité ?",
      "Volatilité normale (pas de news majeure) ?",
      "Volume confirme la cassure ?",
      "Bougie de cassure : corps net ?",
      "Contexte HTF aligné ?",
      "RR ≥ 1.5 sur la projection théorique ?",
    ],
    backtest:
      "Sur 3-6 mois d'historique 5m, marquer le high/low du range 15min/30min après l'open. Lister cassures, succès, échecs. Mesurer expectancy par jour de la semaine.",
    evidenceState: ["Non vérifié", "Backtest requis"],
    complexity: 2,
    frequency: "forte",
    optimalConditions: "Indices US au cash open, jours sans news macro majeure",
    psychDifficulty: 3,
  },
  {
    id: 10,
    slug: "triple-top-bottom",
    name: "Triple Top / Triple Bottom",
    market: "Tous marchés",
    timeframe: "1H → Daily",
    marketType: "range",
    conditions:
      "Trois touches successives d'un niveau identique sans cassure. Bonus si divergence RSI à la 3e touche et volume décroissant.",
    chart: {
      candles: [
        { o: 50, h: 60, l: 48, c: 58 },
        { o: 58, h: 82, l: 56, c: 80 },
        { o: 80, h: 84, l: 70, c: 72 },
        { o: 72, h: 76, l: 60, c: 62 },
        { o: 62, h: 80, l: 60, c: 78 },
        { o: 78, h: 84, l: 70, c: 72 },
        { o: 72, h: 76, l: 60, c: 62 },
        { o: 62, h: 82, l: 60, c: 80 },
        { o: 80, h: 82, l: 58, c: 60, highlight: true },
        { o: 60, h: 62, l: 38, c: 40 },
      ],
      levels: [
        { y: 82, color: "bear", label: "RÉSIST." },
        { y: 60, color: "premium", label: "NECKLINE" },
      ],
      annotations: [
        { x: 1, y: 78, label: "①" },
        { x: 4, y: 78, label: "②" },
        { x: 7, y: 78, label: "③" },
      ],
      markers: [
        { x: 8, y: 58, type: "entry", label: "ENTRY", dir: "right" },
        { x: 8, y: 84, type: "sl", label: "SL", dir: "right" },
        { x: 9, y: 38, type: "tp", label: "TP", dir: "right" },
      ],
    },
    patternDesc:
      "Trois sommets sensiblement au même niveau, prix incapable de casser, puis cassure du support intermédiaire (neckline) avec momentum.",
    opportunity: {
      contexte:
        "Sur HTF, prix tente 3 fois un même niveau sans le casser. Forme de range avec borne plate.",
      declencheur:
        "Cassure du neckline (support intermédiaire pour triple top, résistance pour triple bottom).",
      entree:
        "À la clôture de la bougie cassant le neckline. Pullback sur le neckline acceptable.",
      invalidation: "Retour franc du prix au-dessus/sous le neckline cassé.",
      stopLoss: "Au-dessus/sous le dernier pic du triple top/bottom.",
      takeProfit:
        "Projection = hauteur de la formation (du sommet au neckline) reportée depuis la cassure.",
      gestion:
        "Pattern long terme : tenir plusieurs jours/semaines selon le TF. Trailing si extension.",
      pieges:
        "Patterns trop comprimés, sommets non alignés, marché en tendance forte rendant le pattern peu fiable.",
    },
    checklist: [
      "3 touches sensiblement au même niveau ?",
      "Neckline clairement identifiable ?",
      "Divergence RSI sur la 3e touche ?",
      "Volume diminue sur la formation ?",
      "HTF neutre ou aligné avec retournement ?",
      "RR ≥ 1.5 sur projection théorique ?",
    ],
    backtest:
      "Identifier sur historique D1/H4 tous les triples tops/bottoms valides. Mesurer fréquence d'aboutissement vs faux signaux. Calculer RR moyen sur projection théorique.",
    evidenceState: ["Non vérifié", "Backtest requis"],
    complexity: 3,
    frequency: "faible",
    optimalConditions: "Fin de cycles, marchés matures avec niveaux historiques majeurs respectés",
    psychDifficulty: 3,
  },
];
