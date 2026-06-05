// Académie Meridian — data layer du hub /ressources
// Modèle hub & spoke : chaque PILIER (page de catégorie + guide long) agrège des
// ARTICLES satellites. Tout reste evergreen + périmètre recommandation générale
// (Position AMF DOC-2008-23) : aucune statistique de performance, aucun signal.
//
// Convention identique à lib/strategies.ts : types exportés + tableaux + helpers.
// Le CONTENU long-form vit dans components/resources/bodies.tsx (registre par slug),
// la lib ne porte que la donnée structurée (métadonnées, maillage, SEO).

export type Intent = "info" | "comm" | "trans";

export const INTENT_LABEL: Record<Intent, string> = {
  info: "Informationnel",
  comm: "Commercial",
  trans: "Transactionnel",
};

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

// ————————————————————————————————————————————————————————————————
// PILIERS LIVE (avec route + guide long). On ne publie PAS de pilier vide :
// une page mince nuit au SEO. Les 4 autres piliers du plan sont en attente.
// ————————————————————————————————————————————————————————————————

export const PILLARS: Pillar[] = [
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

/** Piliers planifiés (teasers sur le hub, sans route tant qu'ils sont vides). */
export const PLANNED_PILLARS: { title: string; keyword: string }[] = [
  { title: "Psychologie du trading", keyword: "psychologie du trading" },
  { title: "Plan de trading", keyword: "plan de trading" },
  { title: "Statistiques & performance", keyword: "statistiques trading" },
  { title: "Prop firm", keyword: "prop firm" },
];

// ————————————————————————————————————————————————————————————————
// ARTICLES LIVE (avec route + contenu). Métadonnées ici, corps dans bodies.tsx.
// ————————————————————————————————————————————————————————————————

export const ARTICLES: Article[] = [
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

// ————————————————————————————————————————————————————————————————
// Helpers
// ————————————————————————————————————————————————————————————————

export function getPillar(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function articlesForPillar(pillarSlug: string): Article[] {
  return ARTICLES.filter((a) => a.pillarSlug === pillarSlug);
}

export function relatedArticles(article: Article, limit = 2): Article[] {
  const explicit = (article.relatedSlugs ?? [])
    .map((s) => getArticle(s))
    .filter((a): a is Article => Boolean(a));
  if (explicit.length >= limit) return explicit.slice(0, limit);
  const siblings = articlesForPillar(article.pillarSlug).filter(
    (a) => a.slug !== article.slug && !explicit.some((e) => e.slug === a.slug)
  );
  return [...explicit, ...siblings].slice(0, limit);
}

/** Params statiques pour app/ressources/[pilier]/[article]. */
export function allArticleParams(): { pilier: string; article: string }[] {
  return ARTICLES.map((a) => ({ pilier: a.pillarSlug, article: a.slug }));
}

/** Articles les plus récents (pour la home du hub). */
export function latestArticles(limit = 6): Article[] {
  return [...ARTICLES]
    .sort((a, b) => (a.updated < b.updated ? 1 : -1))
    .slice(0, limit);
}

export const BASE_URL = "https://meridian.app";
