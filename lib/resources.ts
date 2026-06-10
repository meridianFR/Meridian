// Académie Meridian — data layer du hub /ressources
// Modèle hub & spoke : chaque PILIER (page de catégorie + guide long) agrège des
// ARTICLES satellites. Tout reste evergreen + périmètre recommandation générale
// (Position AMF DOC-2008-23) : aucune statistique de performance, aucun signal.
//
// Multilingue : la donnée structurelle (slug, num, intent, dates, toc ids,
// relatedSlugs) est IDENTIQUE dans les 3 langues ; seuls les champs d'affichage
// sont traduits. On stocke un jeu complet par langue (volume faible) + helpers
// paramétrés par locale. Le CONTENU long-form vit dans components/resources/bodies.tsx
// (registre par locale puis slug). Le « chrome » (libellés UI réutilisables) vit
// dans messages/*.json namespace `Resources`.

export type Intent = "info" | "comm" | "trans";

/** Référence sortante : outil, produit ou page interne. */
export type Ref = { href: string; label: string; desc?: string };

/** Aimant à email (content-upgrade). href pointe vers /formation pour l'instant. */
export type LeadMagnet = {
  title: string;
  desc: string;
  href: string;
  cta: string;
};

export type Pillar = {
  slug: string;
  num: number;
  title: string;
  /** mot-clé tête de requête visé */
  keyword: string;
  /** titre <title> SEO (sinon dérivé) */
  metaTitle?: string;
  /** meta description */
  description: string;
  /** accroche éditoriale (carte hub + sous-titre hero) */
  lede: string;
  /** outils-pont (calculateurs) */
  tools: Ref[];
  /** produit-pont (soft) */
  product?: Ref;
  /** titres d'articles du cluster encore à publier (teasers, sans route) */
  upcoming: string[];
};

export type FaqItem = { q: string; a: string };
export type TocItem = { id: string; label: string };

export type Article = {
  slug: string;
  pillarSlug: string;
  title: string;
  metaTitle?: string;
  keyword: string;
  intent: Intent;
  /** meta description + extrait sur les cartes */
  description: string;
  readingMinutes: number;
  /** ISO date — affichée « Mis à jour le… » (signal de fraîcheur evergreen) */
  updated: string;
  /** sommaire (doit matcher les id des <ArticleSection> du body) */
  toc: TocItem[];
  /** outil contextuel mis en avant dans le corps */
  tool?: Ref;
  /** content-upgrade (capture email) */
  leadMagnet?: LeadMagnet;
  /** pont produit soft en clôture */
  product?: Ref;
  /** FAQ → accordéon + FAQPage JSON-LD */
  faq?: FaqItem[];
  /** maillage explicite (sinon dérivé : autres articles du même pilier) */
  relatedSlugs?: string[];
};

export type Locale = "fr" | "en" | "pt";

function asLocale(locale: string): Locale {
  return locale === "en" || locale === "pt" ? locale : "fr";
}

// ————————————————————————————————————————————————————————————————
// PILIERS LIVE (avec route + guide long). On ne publie PAS de pilier vide :
// une page mince nuit au SEO. Les 4 autres piliers du plan sont en attente.
// ————————————————————————————————————————————————————————————————

const PILLARS_FR: Pillar[] = [
  {
    slug: "gestion-du-risque",
    num: 1,
    title: "Gestion du risque",
    keyword: "gestion du risque trading",
    metaTitle: "Gestion du risque en trading : le guide complet",
    description:
      "Le guide de la gestion du risque en trading : taille de position, ratio risque/rendement, stop loss, règle du 1 %, drawdown. La seule variable que tu contrôles vraiment.",
    lede: "Le risque est la seule variable que tu contrôles vraiment. Avant la stratégie, avant le setup : combien tu peux perdre, et comment tu le bornes.",
    tools: [
      {
        href: "/outils/calculateur-de-risque",
        label: "Calculateur de risque",
        desc: "Risque par trade, ratio risque/rendement, perte maximale.",
      },
      {
        href: "/outils/calculateur-position",
        label: "Calculateur de position",
        desc: "Taille de position exacte à partir de ton risque et de ton stop.",
      },
    ],
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "Mesure ton risque réel trade après trade, sans tableur.",
    },
    upcoming: [
      "La règle des 1 % par trade",
      "Où placer son stop loss",
      "Le R-multiple expliqué",
      "Drawdown : définition et gestion",
      "Combien risquer par trade selon son capital",
      "Position sizing en compte prop firm",
    ],
  },
  {
    slug: "journal-de-trading",
    num: 2,
    title: "Journal de trading",
    keyword: "journal de trading",
    metaTitle: "Journal de trading : le guide complet (méthode + modèle)",
    description:
      "Pourquoi et comment tenir un journal de trading : quoi noter, quelle méthode, quel modèle. Transforme tes trades en données exploitables pour progresser vraiment.",
    lede: "Trade ce que tu mesures. Un journal transforme une série d'intuitions en données exploitables — et tes erreurs en patterns corrigeables.",
    tools: [
      {
        href: "/outils/audit-100-trades",
        label: "Audit 100 trades",
        desc: "Un premier diagnostic gratuit de tes 100 derniers trades.",
      },
    ],
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "Le journal qui calcule tes stats et révèle tes patterns automatiquement.",
    },
    upcoming: [
      "Journal de trading Excel : modèle gratuit",
      "Que noter dans son journal de trading",
      "Importer ses trades MT4 / MT5",
      "Comparatif : meilleurs journaux de trading",
      "Analyser ses trades pour progresser",
    ],
  },
];

const PILLARS_EN: Pillar[] = [
  {
    slug: "gestion-du-risque",
    num: 1,
    title: "Risk management",
    keyword: "risk management trading",
    metaTitle: "Risk management in trading: the complete guide",
    description:
      "The guide to risk management in trading: position sizing, risk/reward ratio, stop loss, the 1% rule, drawdown. The only variable you truly control.",
    lede: "Risk is the only variable you truly control. Before the strategy, before the setup: how much you can lose, and how you cap it.",
    tools: [
      {
        href: "/outils/calculateur-de-risque",
        label: "Risk calculator",
        desc: "Risk per trade, risk/reward ratio, maximum loss.",
      },
      {
        href: "/outils/calculateur-position",
        label: "Position calculator",
        desc: "Exact position size from your risk and your stop.",
      },
    ],
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "Measure your real risk trade after trade, without a spreadsheet.",
    },
    upcoming: [
      "The 1% per trade rule",
      "Where to place your stop loss",
      "The R-multiple explained",
      "Drawdown: definition and management",
      "How much to risk per trade based on your capital",
      "Position sizing on a prop firm account",
    ],
  },
  {
    slug: "journal-de-trading",
    num: 2,
    title: "Trading journal",
    keyword: "trading journal",
    metaTitle: "Trading journal: the complete guide (method + template)",
    description:
      "Why and how to keep a trading journal: what to record, which method, which template. Turn your trades into actionable data to truly improve.",
    lede: "Trade what you measure. A journal turns a string of hunches into actionable data — and your mistakes into fixable patterns.",
    tools: [
      {
        href: "/outils/audit-100-trades",
        label: "100-trade audit",
        desc: "A first free diagnostic of your last 100 trades.",
      },
    ],
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "The journal that computes your stats and reveals your patterns automatically.",
    },
    upcoming: [
      "Trading journal in Excel: free template",
      "What to record in your trading journal",
      "Importing your MT4 / MT5 trades",
      "Comparison: the best trading journals",
      "Analysing your trades to improve",
    ],
  },
];

const PILLARS_PT: Pillar[] = [
  {
    slug: "gestion-du-risque",
    num: 1,
    title: "Gestão de risco",
    keyword: "gestão de risco trading",
    metaTitle: "Gestão de risco em trading: o guia completo",
    description:
      "O guia da gestão de risco em trading: tamanho de posição, rácio risco/retorno, stop loss, regra de 1%, drawdown. A única variável que controlas realmente.",
    lede: "O risco é a única variável que controlas realmente. Antes da estratégia, antes do setup: quanto podes perder, e como o limitas.",
    tools: [
      {
        href: "/outils/calculateur-de-risque",
        label: "Calculadora de risco",
        desc: "Risco por trade, rácio risco/retorno, perda máxima.",
      },
      {
        href: "/outils/calculateur-position",
        label: "Calculadora de posição",
        desc: "Tamanho de posição exato a partir do teu risco e do teu stop.",
      },
    ],
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "Mede o teu risco real trade após trade, sem folha de cálculo.",
    },
    upcoming: [
      "A regra de 1% por trade",
      "Onde colocar o stop loss",
      "O R-múltiplo explicado",
      "Drawdown: definição e gestão",
      "Quanto arriscar por trade consoante o capital",
      "Position sizing em conta prop firm",
    ],
  },
  {
    slug: "journal-de-trading",
    num: 2,
    title: "Diário de trading",
    keyword: "diário de trading",
    metaTitle: "Diário de trading: o guia completo (método + modelo)",
    description:
      "Porquê e como manter um diário de trading: o que registar, que método, que modelo. Transforma os teus trades em dados acionáveis para progredir de verdade.",
    lede: "Faz trading do que medes. Um diário transforma uma série de intuições em dados acionáveis — e os teus erros em padrões corrigíveis.",
    tools: [
      {
        href: "/outils/audit-100-trades",
        label: "Auditoria de 100 trades",
        desc: "Um primeiro diagnóstico gratuito dos teus últimos 100 trades.",
      },
    ],
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "O diário que calcula as tuas estatísticas e revela os teus padrões automaticamente.",
    },
    upcoming: [
      "Diário de trading em Excel: modelo gratuito",
      "O que registar no teu diário de trading",
      "Importar os teus trades MT4 / MT5",
      "Comparativo: os melhores diários de trading",
      "Analisar os teus trades para progredir",
    ],
  },
];

const PILLARS_BY_LOCALE: Record<Locale, Pillar[]> = {
  fr: PILLARS_FR,
  en: PILLARS_EN,
  pt: PILLARS_PT,
};

/** Piliers planifiés (teasers sur le hub, sans route tant qu'ils sont vides). */
const PLANNED_BY_LOCALE: Record<Locale, { title: string; keyword: string }[]> = {
  fr: [
    { title: "Psychologie du trading", keyword: "psychologie du trading" },
    { title: "Plan de trading", keyword: "plan de trading" },
    { title: "Statistiques & performance", keyword: "statistiques trading" },
    { title: "Prop firm", keyword: "prop firm" },
  ],
  en: [
    { title: "Trading psychology", keyword: "trading psychology" },
    { title: "Trading plan", keyword: "trading plan" },
    { title: "Statistics & performance", keyword: "trading statistics" },
    { title: "Prop firm", keyword: "prop firm" },
  ],
  pt: [
    { title: "Psicologia do trading", keyword: "psicologia do trading" },
    { title: "Plano de trading", keyword: "plano de trading" },
    { title: "Estatísticas e desempenho", keyword: "estatísticas trading" },
    { title: "Prop firm", keyword: "prop firm" },
  ],
};

// ————————————————————————————————————————————————————————————————
// ARTICLES LIVE (avec route + contenu). Métadonnées ici, corps dans bodies.tsx.
// ————————————————————————————————————————————————————————————————

const ARTICLES_FR: Article[] = [
  // ——— Pilier : Gestion du risque ———
  {
    slug: "calculer-sa-taille-de-position",
    pillarSlug: "gestion-du-risque",
    title: "Comment calculer sa taille de position en trading",
    metaTitle: "Calculer sa taille de position : la méthode (avec exemples)",
    keyword: "calculer taille de position",
    intent: "trans",
    description:
      "La taille de position se déduit de ton risque, pas de ton intuition. Méthode pas à pas pour la calculer à partir de ton capital, de ton risque par trade et de ton stop loss.",
    readingMinutes: 6,
    updated: "2026-06-04",
    toc: [
      { id: "principe", label: "Le principe : partir du risque, pas du gain" },
      { id: "formule", label: "La formule de la taille de position" },
      { id: "exemple", label: "Un exemple chiffré, étape par étape" },
      { id: "pieges", label: "Les pièges classiques" },
    ],
    tool: {
      href: "/outils/calculateur-position",
      label: "Calculateur de position",
      desc: "Entre ton capital, ton risque et ton stop : la taille exacte s'affiche.",
    },
    leadMagnet: {
      title: "Mémo gestion du risque",
      desc: "Les formules de sizing, de R et de risque par trade sur une page imprimable.",
      href: "/formation",
      cta: "Recevoir le mémo",
    },
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "Vérifie après coup le risque réel pris sur chaque trade — sans tableur.",
    },
    faq: [
      {
        q: "Quelle taille de position pour un compte de 10 000 € ?",
        a: "Il n'y a pas de taille fixe : elle dépend de ton risque par trade et de la distance de ton stop. En risquant 1 % (100 €) avec un stop de 50 points valant 1 €/point, tu prends 2 lots. Change le stop et la taille change.",
      },
      {
        q: "Faut-il calculer sa position avant ou après avoir placé son stop ?",
        a: "Toujours après. Le stop définit le risque par unité ; la taille de position s'en déduit. Faire l'inverse revient à choisir son risque au hasard.",
      },
    ],
    relatedSlugs: ["ratio-risque-rendement"],
  },
  {
    slug: "ratio-risque-rendement",
    pillarSlug: "gestion-du-risque",
    title: "Le ratio risque/rendement (risk reward) expliqué",
    metaTitle: "Ratio risque/rendement : définition, calcul et bon usage",
    keyword: "ratio risque rendement",
    intent: "info",
    description:
      "Le ratio risque/rendement (risk reward) compare ce que tu risques à ce que tu vises. Définition, calcul, et pourquoi il ne veut rien dire sans ton taux de réussite.",
    readingMinutes: 5,
    updated: "2026-06-04",
    toc: [
      { id: "definition", label: "Définition du ratio risque/rendement" },
      { id: "calcul", label: "Comment le calculer" },
      { id: "winrate", label: "Le ratio ne suffit pas : le couple avec le win rate" },
      { id: "usage", label: "Bien l'utiliser dans son plan" },
    ],
    tool: {
      href: "/outils/calculateur-de-risque",
      label: "Calculateur de risque",
      desc: "Calcule ton ratio risque/rendement et ta perte maximale en quelques secondes.",
    },
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "Suis ton ratio risque/rendement moyen réellement atteint, trade après trade.",
    },
    faq: [
      {
        q: "Quel est un bon ratio risque/rendement ?",
        a: "Aucun ratio n'est « bon » dans l'absolu. Un ratio de 1:1 est rentable avec 60 % de réussite ; un ratio de 3:1 peut l'être avec 30 %. C'est le couple ratio × taux de réussite qui décide, pas le ratio seul.",
      },
      {
        q: "Risk reward ou win rate : qu'est-ce qui compte le plus ?",
        a: "Les deux sont indissociables. Augmenter ton ratio fait souvent baisser ton taux de réussite (tu vises plus loin). L'objectif est une espérance de gain positive, pas un ratio élevé affiché.",
      },
    ],
    relatedSlugs: ["calculer-sa-taille-de-position"],
  },

  // ——— Pilier : Journal de trading ———
  {
    slug: "pourquoi-tenir-un-journal-de-trading",
    pillarSlug: "journal-de-trading",
    title: "Pourquoi tenir un journal de trading",
    metaTitle: "Pourquoi tenir un journal de trading (et ce qu'il révèle)",
    keyword: "pourquoi tenir un journal de trading",
    intent: "info",
    description:
      "Sans journal, tu trades à l'aveugle. Voici ce qu'un journal de trading révèle sur tes vraies forces, tes fuites récurrentes et l'edge que tu crois avoir.",
    readingMinutes: 6,
    updated: "2026-06-04",
    toc: [
      { id: "aveugle", label: "Trader sans journal, c'est trader à l'aveugle" },
      { id: "revele", label: "Ce qu'un journal révèle vraiment" },
      { id: "memoire", label: "La mémoire ment, les données non" },
      { id: "commencer", label: "Par où commencer" },
    ],
    leadMagnet: {
      title: "Template Journal — Excel + Notion",
      desc: "Le modèle de journal prêt à l'emploi : colonnes essentielles, calculs de R et de stats déjà câblés.",
      href: "/formation",
      cta: "Recevoir le template",
    },
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "Importe tes trades MT4/MT5 ; tes stats et tes patterns se calculent seuls.",
    },
    faq: [
      {
        q: "Un journal de trading est-il vraiment utile quand on débute ?",
        a: "C'est surtout au début qu'il est décisif : il transforme des dizaines de trades dispersés en quelques leçons claires. Sans lui, on répète les mêmes erreurs sans les voir.",
      },
      {
        q: "Combien de temps faut-il pour qu'un journal serve à quelque chose ?",
        a: "Une trentaine de trades suffisent à faire émerger des tendances (heures, instruments, types d'erreurs). En dessous, l'échantillon est trop petit pour conclure.",
      },
    ],
    relatedSlugs: ["comment-tenir-un-journal-de-trading"],
  },
  {
    slug: "comment-tenir-un-journal-de-trading",
    pillarSlug: "journal-de-trading",
    title: "Comment tenir un journal de trading (méthode)",
    metaTitle: "Comment tenir un journal de trading : méthode pas à pas",
    keyword: "comment tenir un journal de trading",
    intent: "comm",
    description:
      "La méthode pour tenir un journal de trading qui sert vraiment : quoi noter, à quelle fréquence, et comment en tirer une revue exploitable plutôt qu'un tableur mort.",
    readingMinutes: 7,
    updated: "2026-06-04",
    toc: [
      { id: "champs", label: "Les champs à noter (et ceux à oublier)" },
      { id: "rituel", label: "Le rituel : quand et comment journaliser" },
      { id: "revue", label: "La revue : transformer les notes en décisions" },
      { id: "outils", label: "Tableur, Notion ou application dédiée" },
    ],
    tool: {
      href: "/outils/audit-100-trades",
      label: "Audit 100 trades",
      desc: "Pas encore de journal ? Pars de tes 100 derniers trades pour un premier diagnostic.",
    },
    leadMagnet: {
      title: "Template Journal — Excel + Notion",
      desc: "Le modèle prêt à remplir, avec les bons champs et les calculs déjà en place.",
      href: "/formation",
      cta: "Recevoir le template",
    },
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "Quand le tableur devient trop lourd : import broker, stats auto, revue hebdo guidée.",
    },
    faq: [
      {
        q: "Que faut-il noter dans un journal de trading ?",
        a: "Le strict utile : date/heure, instrument, sens, entrée, stop, objectif, taille, résultat en R, et surtout le motif d'entrée et l'émotion ressentie. Le reste est du bruit qui décourage la tenue.",
      },
      {
        q: "À quelle fréquence faire sa revue de trading ?",
        a: "Une note courte juste après chaque trade, et une revue de synthèse une fois par semaine. La revue hebdomadaire est là où naissent les vraies corrections.",
      },
    ],
    relatedSlugs: ["pourquoi-tenir-un-journal-de-trading"],
  },
];

const ARTICLES_EN: Article[] = [
  {
    slug: "calculer-sa-taille-de-position",
    pillarSlug: "gestion-du-risque",
    title: "How to calculate your position size in trading",
    metaTitle: "Calculating your position size: the method (with examples)",
    keyword: "calculate position size",
    intent: "trans",
    description:
      "Position size is derived from your risk, not your intuition. A step-by-step method to calculate it from your capital, your risk per trade and your stop loss.",
    readingMinutes: 6,
    updated: "2026-06-04",
    toc: [
      { id: "principe", label: "The principle: start from risk, not reward" },
      { id: "formule", label: "The position size formula" },
      { id: "exemple", label: "A worked example, step by step" },
      { id: "pieges", label: "Classic pitfalls" },
    ],
    tool: {
      href: "/outils/calculateur-position",
      label: "Position calculator",
      desc: "Enter your capital, your risk and your stop: the exact size appears.",
    },
    leadMagnet: {
      title: "Risk management cheat sheet",
      desc: "The sizing, R and risk-per-trade formulas on one printable page.",
      href: "/formation",
      cta: "Get the cheat sheet",
    },
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "Check afterwards the real risk taken on each trade — without a spreadsheet.",
    },
    faq: [
      {
        q: "What position size for a €10,000 account?",
        a: "There's no fixed size: it depends on your risk per trade and your stop distance. Risking 1% (€100) with a 50-point stop worth €1/point, you take 2 lots. Change the stop and the size changes.",
      },
      {
        q: "Should you size your position before or after placing your stop?",
        a: "Always after. The stop defines the risk per unit; the position size is derived from it. Doing the opposite means choosing your risk at random.",
      },
    ],
    relatedSlugs: ["ratio-risque-rendement"],
  },
  {
    slug: "ratio-risque-rendement",
    pillarSlug: "gestion-du-risque",
    title: "The risk/reward ratio explained",
    metaTitle: "Risk/reward ratio: definition, calculation and proper use",
    keyword: "risk reward ratio",
    intent: "info",
    description:
      "The risk/reward ratio compares what you risk to what you aim for. Definition, calculation, and why it means nothing without your win rate.",
    readingMinutes: 5,
    updated: "2026-06-04",
    toc: [
      { id: "definition", label: "Definition of the risk/reward ratio" },
      { id: "calcul", label: "How to calculate it" },
      { id: "winrate", label: "The ratio isn't enough: the pairing with win rate" },
      { id: "usage", label: "Using it well in your plan" },
    ],
    tool: {
      href: "/outils/calculateur-de-risque",
      label: "Risk calculator",
      desc: "Calculate your risk/reward ratio and your maximum loss in seconds.",
    },
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "Track your average risk/reward ratio actually achieved, trade after trade.",
    },
    faq: [
      {
        q: "What is a good risk/reward ratio?",
        a: "No ratio is “good” in absolute terms. A 1:1 ratio is profitable with a 60% win rate; a 3:1 ratio can be with 30%. It's the ratio × win rate pairing that decides, not the ratio alone.",
      },
      {
        q: "Risk/reward or win rate: which matters most?",
        a: "The two are inseparable. Raising your ratio often lowers your win rate (you aim further). The goal is a positive expectancy, not a high ratio on display.",
      },
    ],
    relatedSlugs: ["calculer-sa-taille-de-position"],
  },
  {
    slug: "pourquoi-tenir-un-journal-de-trading",
    pillarSlug: "journal-de-trading",
    title: "Why keep a trading journal",
    metaTitle: "Why keep a trading journal (and what it reveals)",
    keyword: "why keep a trading journal",
    intent: "info",
    description:
      "Without a journal, you trade blind. Here's what a trading journal reveals about your true strengths, your recurring leaks and the edge you think you have.",
    readingMinutes: 6,
    updated: "2026-06-04",
    toc: [
      { id: "aveugle", label: "Trading without a journal is trading blind" },
      { id: "revele", label: "What a journal really reveals" },
      { id: "memoire", label: "Memory lies, data doesn't" },
      { id: "commencer", label: "Where to start" },
    ],
    leadMagnet: {
      title: "Journal template — Excel + Notion",
      desc: "The ready-to-use journal template: essential columns, R and stats calculations already wired in.",
      href: "/formation",
      cta: "Get the template",
    },
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "Import your MT4/MT5 trades; your stats and patterns compute themselves.",
    },
    faq: [
      {
        q: "Is a trading journal really useful for beginners?",
        a: "It's especially at the start that it's decisive: it turns dozens of scattered trades into a few clear lessons. Without it, you repeat the same mistakes without seeing them.",
      },
      {
        q: "How long before a journal becomes useful?",
        a: "About thirty trades is enough for trends to emerge (hours, instruments, types of mistakes). Below that, the sample is too small to conclude.",
      },
    ],
    relatedSlugs: ["comment-tenir-un-journal-de-trading"],
  },
  {
    slug: "comment-tenir-un-journal-de-trading",
    pillarSlug: "journal-de-trading",
    title: "How to keep a trading journal (method)",
    metaTitle: "How to keep a trading journal: a step-by-step method",
    keyword: "how to keep a trading journal",
    intent: "comm",
    description:
      "The method for keeping a trading journal that actually helps: what to record, how often, and how to turn it into an actionable review rather than a dead spreadsheet.",
    readingMinutes: 7,
    updated: "2026-06-04",
    toc: [
      { id: "champs", label: "The fields to record (and the ones to forget)" },
      { id: "rituel", label: "The ritual: when and how to journal" },
      { id: "revue", label: "The review: turning notes into decisions" },
      { id: "outils", label: "Spreadsheet, Notion or a dedicated app" },
    ],
    tool: {
      href: "/outils/audit-100-trades",
      label: "100-trade audit",
      desc: "No journal yet? Start from your last 100 trades for a first diagnostic.",
    },
    leadMagnet: {
      title: "Journal template — Excel + Notion",
      desc: "The ready-to-fill template, with the right fields and the calculations already in place.",
      href: "/formation",
      cta: "Get the template",
    },
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "When the spreadsheet gets too heavy: broker import, auto stats, guided weekly review.",
    },
    faq: [
      {
        q: "What should you record in a trading journal?",
        a: "The strict essentials: date/time, instrument, direction, entry, stop, target, size, result in R, and above all the entry reason and the emotion felt. The rest is noise that discourages keeping it.",
      },
      {
        q: "How often should you review your trading?",
        a: "A short note right after each trade, and a summary review once a week. The weekly review is where the real corrections are born.",
      },
    ],
    relatedSlugs: ["pourquoi-tenir-un-journal-de-trading"],
  },
];

const ARTICLES_PT: Article[] = [
  {
    slug: "calculer-sa-taille-de-position",
    pillarSlug: "gestion-du-risque",
    title: "Como calcular o tamanho de posição em trading",
    metaTitle: "Calcular o tamanho de posição: o método (com exemplos)",
    keyword: "calcular tamanho de posição",
    intent: "trans",
    description:
      "O tamanho de posição deduz-se do teu risco, não da tua intuição. Método passo a passo para o calcular a partir do teu capital, do teu risco por trade e do teu stop loss.",
    readingMinutes: 6,
    updated: "2026-06-04",
    toc: [
      { id: "principe", label: "O princípio: partir do risco, não do ganho" },
      { id: "formule", label: "A fórmula do tamanho de posição" },
      { id: "exemple", label: "Um exemplo com números, passo a passo" },
      { id: "pieges", label: "As armadilhas clássicas" },
    ],
    tool: {
      href: "/outils/calculateur-position",
      label: "Calculadora de posição",
      desc: "Introduz o teu capital, o teu risco e o teu stop: o tamanho exato aparece.",
    },
    leadMagnet: {
      title: "Memo de gestão de risco",
      desc: "As fórmulas de sizing, de R e de risco por trade numa página imprimível.",
      href: "/formation",
      cta: "Receber o memo",
    },
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "Verifica depois o risco real assumido em cada trade — sem folha de cálculo.",
    },
    faq: [
      {
        q: "Que tamanho de posição para uma conta de 10 000 €?",
        a: "Não há um tamanho fixo: depende do teu risco por trade e da distância do teu stop. Arriscando 1% (100 €) com um stop de 50 pontos valendo 1 €/ponto, ficas com 2 lotes. Muda o stop e o tamanho muda.",
      },
      {
        q: "Deves calcular a posição antes ou depois de colocar o stop?",
        a: "Sempre depois. O stop define o risco por unidade; o tamanho de posição deduz-se daí. Fazer o contrário é escolher o risco ao acaso.",
      },
    ],
    relatedSlugs: ["ratio-risque-rendement"],
  },
  {
    slug: "ratio-risque-rendement",
    pillarSlug: "gestion-du-risque",
    title: "O rácio risco/retorno (risk reward) explicado",
    metaTitle: "Rácio risco/retorno: definição, cálculo e uso correto",
    keyword: "rácio risco retorno",
    intent: "info",
    description:
      "O rácio risco/retorno compara o que arriscas com o que visas. Definição, cálculo, e porque não significa nada sem a tua taxa de acerto.",
    readingMinutes: 5,
    updated: "2026-06-04",
    toc: [
      { id: "definition", label: "Definição do rácio risco/retorno" },
      { id: "calcul", label: "Como o calcular" },
      { id: "winrate", label: "O rácio não basta: o par com a taxa de acerto" },
      { id: "usage", label: "Usá-lo bem no teu plano" },
    ],
    tool: {
      href: "/outils/calculateur-de-risque",
      label: "Calculadora de risco",
      desc: "Calcula o teu rácio risco/retorno e a tua perda máxima em segundos.",
    },
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "Acompanha o teu rácio risco/retorno médio realmente atingido, trade após trade.",
    },
    faq: [
      {
        q: "Qual é um bom rácio risco/retorno?",
        a: "Nenhum rácio é “bom” em absoluto. Um rácio de 1:1 é rentável com 60% de acerto; um rácio de 3:1 pode sê-lo com 30%. É o par rácio × taxa de acerto que decide, não o rácio sozinho.",
      },
      {
        q: "Risk reward ou taxa de acerto: o que conta mais?",
        a: "Os dois são indissociáveis. Aumentar o rácio faz muitas vezes baixar a taxa de acerto (visas mais longe). O objetivo é uma esperança de ganho positiva, não um rácio elevado em exibição.",
      },
    ],
    relatedSlugs: ["calculer-sa-taille-de-position"],
  },
  {
    slug: "pourquoi-tenir-un-journal-de-trading",
    pillarSlug: "journal-de-trading",
    title: "Porquê manter um diário de trading",
    metaTitle: "Porquê manter um diário de trading (e o que revela)",
    keyword: "porquê manter um diário de trading",
    intent: "info",
    description:
      "Sem diário, fazes trading às cegas. Eis o que um diário de trading revela sobre as tuas verdadeiras forças, as tuas fugas recorrentes e a edge que julgas ter.",
    readingMinutes: 6,
    updated: "2026-06-04",
    toc: [
      { id: "aveugle", label: "Fazer trading sem diário é fazer trading às cegas" },
      { id: "revele", label: "O que um diário revela de verdade" },
      { id: "memoire", label: "A memória mente, os dados não" },
      { id: "commencer", label: "Por onde começar" },
    ],
    leadMagnet: {
      title: "Template Diário — Excel + Notion",
      desc: "O modelo de diário pronto a usar: colunas essenciais, cálculos de R e de estatísticas já configurados.",
      href: "/formation",
      cta: "Receber o template",
    },
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "Importa os teus trades MT4/MT5; as tuas estatísticas e os teus padrões calculam-se sozinhos.",
    },
    faq: [
      {
        q: "Um diário de trading é mesmo útil para quem começa?",
        a: "É sobretudo no início que é decisivo: transforma dezenas de trades dispersos em algumas lições claras. Sem ele, repetem-se os mesmos erros sem os ver.",
      },
      {
        q: "Quanto tempo até um diário servir para alguma coisa?",
        a: "Cerca de trinta trades bastam para fazer emergir tendências (horas, instrumentos, tipos de erros). Abaixo disso, a amostra é demasiado pequena para concluir.",
      },
    ],
    relatedSlugs: ["comment-tenir-un-journal-de-trading"],
  },
  {
    slug: "comment-tenir-un-journal-de-trading",
    pillarSlug: "journal-de-trading",
    title: "Como manter um diário de trading (método)",
    metaTitle: "Como manter um diário de trading: método passo a passo",
    keyword: "como manter um diário de trading",
    intent: "comm",
    description:
      "O método para manter um diário de trading que serve mesmo: o que registar, com que frequência, e como tirar daí uma revisão acionável em vez de uma folha de cálculo morta.",
    readingMinutes: 7,
    updated: "2026-06-04",
    toc: [
      { id: "champs", label: "Os campos a registar (e os a esquecer)" },
      { id: "rituel", label: "O ritual: quando e como registar" },
      { id: "revue", label: "A revisão: transformar notas em decisões" },
      { id: "outils", label: "Folha de cálculo, Notion ou aplicação dedicada" },
    ],
    tool: {
      href: "/outils/audit-100-trades",
      label: "Auditoria de 100 trades",
      desc: "Ainda sem diário? Parte dos teus últimos 100 trades para um primeiro diagnóstico.",
    },
    leadMagnet: {
      title: "Template Diário — Excel + Notion",
      desc: "O modelo pronto a preencher, com os campos certos e os cálculos já no lugar.",
      href: "/formation",
      cta: "Receber o template",
    },
    product: {
      href: "/journal",
      label: "Meridian Journal",
      desc: "Quando a folha de cálculo fica pesada demais: import broker, estatísticas automáticas, revisão semanal guiada.",
    },
    faq: [
      {
        q: "O que registar num diário de trading?",
        a: "O estritamente útil: data/hora, instrumento, sentido, entrada, stop, objetivo, tamanho, resultado em R, e sobretudo o motivo de entrada e a emoção sentida. O resto é ruído que desmotiva a manutenção.",
      },
      {
        q: "Com que frequência fazer a revisão de trading?",
        a: "Uma nota curta logo após cada trade, e uma revisão de síntese uma vez por semana. A revisão semanal é onde nascem as verdadeiras correções.",
      },
    ],
    relatedSlugs: ["pourquoi-tenir-un-journal-de-trading"],
  },
];

const ARTICLES_BY_LOCALE: Record<Locale, Article[]> = {
  fr: ARTICLES_FR,
  en: ARTICLES_EN,
  pt: ARTICLES_PT,
};

// ————————————————————————————————————————————————————————————————
// Helpers (paramétrés par locale)
// ————————————————————————————————————————————————————————————————

export function getPillars(locale: string): Pillar[] {
  return PILLARS_BY_LOCALE[asLocale(locale)];
}

export function getPlannedPillars(locale: string): { title: string; keyword: string }[] {
  return PLANNED_BY_LOCALE[asLocale(locale)];
}

export function getArticles(locale: string): Article[] {
  return ARTICLES_BY_LOCALE[asLocale(locale)];
}

export function getPillar(locale: string, slug: string): Pillar | undefined {
  return getPillars(locale).find((p) => p.slug === slug);
}

export function getArticle(locale: string, slug: string): Article | undefined {
  return getArticles(locale).find((a) => a.slug === slug);
}

export function articlesForPillar(locale: string, pillarSlug: string): Article[] {
  return getArticles(locale).filter((a) => a.pillarSlug === pillarSlug);
}

export function relatedArticles(locale: string, article: Article, limit = 2): Article[] {
  const explicit = (article.relatedSlugs ?? [])
    .map((s) => getArticle(locale, s))
    .filter((a): a is Article => Boolean(a));
  if (explicit.length >= limit) return explicit.slice(0, limit);
  const siblings = articlesForPillar(locale, article.pillarSlug).filter(
    (a) => a.slug !== article.slug && !explicit.some((e) => e.slug === a.slug)
  );
  return [...explicit, ...siblings].slice(0, limit);
}

/** Params statiques pour app/[locale]/ressources/[pilier]/[article].
 *  Les slugs sont identiques dans les 3 langues → on dérive du jeu FR. */
export function allArticleParams(): { pilier: string; article: string }[] {
  return ARTICLES_FR.map((a) => ({ pilier: a.pillarSlug, article: a.slug }));
}

/** Params statiques pour app/[locale]/ressources/[pilier]. */
export function allPillarParams(): { pilier: string }[] {
  return PILLARS_FR.map((p) => ({ pilier: p.slug }));
}

/** Articles les plus récents (pour la home du hub). */
export function latestArticles(locale: string, limit = 6): Article[] {
  return [...getArticles(locale)]
    .sort((a, b) => (a.updated < b.updated ? 1 : -1))
    .slice(0, limit);
}

export const BASE_URL = "https://meridiandata.fr";
