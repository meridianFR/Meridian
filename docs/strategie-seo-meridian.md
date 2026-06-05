# Plan stratégique SEO & Croissance — Meridian

> Objectif : faire de Meridian une **référence du trading francophone** via un actif SEO long terme,
> sans dépendre des réseaux sociaux ni de la publicité.
> Horizon : 12 mois. Cadence : solo, ~25 h/semaine (lifestyle business).
> Slogan directeur : **« Trade ce que tu mesures. »**

---

## 0. Thèse stratégique & garde-fous

**Thèse.** Meridian ne gagnera pas en *publiant plus* (impossible en solo), mais en *publiant mieux et plus juste* : un corpus **evergreen** restreint, profond, irréprochable sur la confiance (E-E-A-T), où chaque page est conçue pour (a) ranker, (b) rendre un service immédiat, (c) alimenter un produit premium. On vise l'**autorité thématique**, pas le volume.

**Réconciliation avec les 5 décisions verrouillées** — l'académie SEO les respecte toutes :

| Décision verrouillée | Comment le SEO la respecte |
|---|---|
| **Pas de média** | On construit un **corpus intemporel** (méthodologie qui ne périme pas), pas un flux d'actualité / commentaire marché / signaux. Une « Académie », pas un magazine. Aucun contenu daté, aucune news. Chaque article est un *asset* qui capitalise — l'inverse du tapis roulant médiatique. |
| **Méthodes génériques (cadre AMF)** | 100 % éducatif/méthodologique, périmètre **recommandation générale (Position AMF DOC-2008-23)**. Jamais de signal, jamais de reco d'instrument, **jamais de statistique de performance affichée**, jamais de promesse de gain. |
| **Free limité** | Règle inchangée : *le savoir est gratuit (le contenu SEO), l'automatisation sur tes données est payante (le Journal)*. Le contenu est le haut de tunnel ; il converge vers le payant. |
| **FR d'abord** | 100 % français, mots-clés français. L'EN reste un levier **Y2** (marché 10× plus grand → à garder en réserve). |
| **Lifestyle / 25 h** | Roadmap calibrée sur la capacité réelle d'un solo : **4 → 8 articles/mois**, batching, réemploi des assets existants (anatomies de stratégies, pages outils). Pas de cadence d'agence. |

**Filtre éditorial unique** (inchangé) : *« Le trader sérieux fatigué signerait-il, ou roulerait-il des yeux ? »* Tout article passe ce test.

---

## 1. Architecture SEO

### 1.1 État actuel (audit express)

Routes live : `/` · `/strategies` (+ `[slug]/anatomie`, 2 actives) · `/outils` (5 pages) · `/journal` · `/formation` · `/formation-premium` · `/faq` · `/manifesto` · `/a-propos` · `/ecosysteme` · pages légales.
**Manque structurel : aucun hub de contenu éditorial.** C'est le moteur SEO absent. Base technique saine (sitemap, robots, OG image dynamiques, Next 15).

### 1.2 Le hub : `/ressources`

**Recommandation de nommage : URL `/ressources`, label nav « Ressources », marque éditoriale « Académie Meridian » en H1 du hub.**
Raison : « Ressources » est sobre, attendu, neutre SEO, sans connotation guru (le persona déteste les « académies à 1 500 € »). « Académie Meridian » comme signature éditoriale ajoute l'autorité sans le sticker prix. *L'URL est quasi irréversible en SEO → à verrouiller maintenant (cf. §8).*

### 1.3 Modèle d'URL — silos thématiques (topic clusters)

On adopte le modèle **hub & spoke en silos** (le plus puissant pour un domaine neuf : il crée des cocons sémantiques nets et un maillage évident) :

```
/ressources                                  HUB — index académie (piliers + derniers articles)
├── /ressources/gestion-du-risque            PILIER (guide 3–8k mots) = page de catégorie
│   ├── …/calculer-sa-taille-de-position      SPOKE (article cluster)
│   ├── …/ratio-risque-rendement
│   └── …/regle-1-pourcent
├── /ressources/journal-de-trading           PILIER
│   ├── …/pourquoi-tenir-un-journal
│   ├── …/journal-de-trading-excel
│   └── …/comparatif-journaux-de-trading
├── /ressources/psychologie-du-trading        PILIER
├── /ressources/plan-de-trading               PILIER
├── /ressources/statistiques-trading          PILIER
├── /ressources/prop-firm                      PILIER
└── /ressources/glossaire                      Hub lexical (linking interne massif)
```

Règle : **pilier = la page de catégorie elle-même** (elle ranke sur la tête de requête ET sert d'index du cluster). Profondeur max 3 clics depuis la home ; piliers à 2 clics.

### 1.4 Menu idéal (nav resserrée)

Le persona déteste l'encombrement ; la marque est sobre. On resserre la nav principale à **5 entrées** et on relègue le reste en footer.

**Nav principale :**
`Stratégies` · `Outils` · `Ressources` *(nouveau)* · `Journal` · **bouton CTA « Le Journal »** (ou capture email selon la phase).

**Footer (3 colonnes éditoriales) :**
- *Apprendre* : Ressources, Stratégies, Glossaire, Formation
- *Outils* : les 5 calculateurs + Journal + Écosystème
- *Marque* : Manifeste, À propos, FAQ, Newsletter, Légal/CGV/Disclaimer

> `Formation`, `Manifesto`, `À propos`, `FAQ` quittent la barre du haut → footer + maillage contextuel. La nav gagne en clarté et concentre le *link equity* sur les pages business (Ressources/Outils/Journal).

### 1.5 Pages outils (les calculateurs comme aimants SEO)

Les calculateurs **rankent durablement, attirent des backlinks naturels et donnent une valeur immédiate**. Action : sous chaque outil, ajouter un **bloc éditorial** (300–600 mots) + lien vers le pilier + 2-3 articles → l'outil cesse d'être un cul-de-sac et capte de l'informationnel.

**Roadmap outils (au-delà des 5 existants)** — chacun = une page SEO transactionnelle :
1. Valeur d'un pip (`valeur d'un pip`) — Q1
2. R-multiple / gain en R — Q2
3. Espérance de gain (expectancy) — Q2
4. Drawdown & risque de ruine — Q3
5. Objectif & sizing challenge prop firm — Q3 (persona-natif, fort intent)
6. Capitalisation / intérêts composés — Q4

### 1.6 Pages formations (les PDF comme lead magnets)

`/formation` devient la **vitrine des assets téléchargeables** (gated email) + le pilote payant `/formation-premium`. Les PDF/templates jouent un double rôle : *lead magnets* du tunnel **et** contenu du Starter Bundle (49 €) puis du Pack PDF (19 €). Détail en §4.

---

## 2. Stratégie de contenu — 100 idées d'articles

**Légende.** Intention : `Info` (informationnel) · `Comm` (commercial/comparatif) · `Trans` (transactionnel/outil).
Difficulté SEO estimée : `F` faible · `M` moyenne · `É` élevée. Potentiel commercial (proximité d'un produit Meridian) : `F` · `M` · `É`. Priorité : **P1** (quick win — publier d'abord) · **P2** · **P3**.

> ⚠️ Les volumes exacts sont à valider dans Ahrefs / Semrush / Keyword Planner avant rédaction. Les bandes ci-dessous sont des estimations d'expert sur le marché FR.

### Cluster A — Gestion du risque  → *bridge : calculateurs Risk/Position, Journal*

| # | Titre | Mot-clé principal | Int. | Diff | $ | Prio |
|---|---|---|---|---|---|---|
| 1 | Comment calculer sa taille de position | calculer taille de position | Trans | M | É | **P1** |
| 2 | Le ratio risque/rendement (risk reward) expliqué | ratio risque rendement | Info | M | É | **P1** |
| 3 | La règle des 1 % par trade | règle 1% trading | Info | F | É | **P1** |
| 4 | Combien risquer par trade selon son capital | combien risquer par trade | Info | F | É | **P1** |
| 5 | Le R-multiple : raisonner en R | r multiple trading | Info | F | É | **P1** |
| 6 | Où placer son stop loss | où placer son stop loss | Info | M | M | **P1** |
| 7 | Calculer la valeur d'un pip | valeur d'un pip | Trans | M | M | **P1** |
| 8 | Le money management en trading (guide) | money management trading | Info | M | É | P2 |
| 9 | Drawdown : définition et gestion | drawdown trading | Info | M | M | P2 |
| 10 | Risque par jour vs par trade : fixer ses limites | limite de perte journalière | Info | F | É | P2 |
| 11 | Éviter le risque de ruine | risque de ruine | Info | F | M | P2 |
| 12 | Stop fixe vs trailing stop | trailing stop | Info | M | F | P2 |
| 13 | L'effet de levier sans se ruiner | effet de levier trading | Info | É | M | P3 |
| 14 | Pourquoi la martingale ruine les traders | martingale trading | Info | M | F | P3 |
| 15 | Gérer des positions corrélées | corrélation paires forex | Info | M | F | P3 |
| 16 | Position sizing en compte prop firm | taille de position prop firm | Trans | F | É | **P1** |

### Cluster B — Journal de trading  → *bridge : Meridian Journal (produit phare), Starter Bundle*

| # | Titre | Mot-clé principal | Int. | Diff | $ | Prio |
|---|---|---|---|---|---|---|
| 17 | Journal de trading : le guide complet | journal de trading | Info | É | É | **P1** |
| 18 | Pourquoi tenir un journal de trading | pourquoi tenir un journal de trading | Info | F | É | **P1** |
| 19 | Comment tenir un journal de trading | comment tenir un journal de trading | Info | M | É | **P1** |
| 20 | Journal de trading Excel : modèle gratuit | journal de trading excel | Trans | M | É | **P1** |
| 21 | Comparatif : meilleurs journaux de trading | meilleur journal de trading | Comm | M | É | **P1** |
| 22 | Template journal de trading Notion | journal trading notion | Trans | F | É | **P1** |
| 23 | Que noter dans son journal de trading | que noter journal trading | Info | F | É | P2 |
| 24 | Edgewonk / Tradervue : alternatives FR | edgewonk avis | Comm | F | É | P2 |
| 25 | Exporter son historique MT4/MT5 | exporter historique mt4 | Trans | F | É | P2 |
| 26 | Faire sa revue hebdomadaire de trading | revue trading hebdomadaire | Info | F | É | **P1** |
| 27 | Analyser ses trades pour progresser | analyser ses trades | Info | F | É | P2 |
| 28 | Journal papier vs numérique | journal trading papier | Info | F | M | P3 |
| 29 | Annoter et screenshoter ses trades | annoter ses trades | Info | F | M | P3 |
| 30 | Tenir un journal quand on scalpe | journal scalping | Info | F | M | P3 |

### Cluster C — Psychologie du trading  → *bridge : Weekly Behavioral Report (Journal), Mind (Y2)*

| # | Titre | Mot-clé principal | Int. | Diff | $ | Prio |
|---|---|---|---|---|---|---|
| 31 | Psychologie du trading : le guide | psychologie du trading | Info | É | M | **P1** |
| 32 | Le revenge trading : comprendre et arrêter | revenge trading | Info | F | M | **P1** |
| 33 | Gérer le tilt en trading | tilt trading | Info | F | M | **P1** |
| 34 | Le FOMO en trading | fomo trading | Info | F | M | **P1** |
| 35 | L'overtrading : causes et solutions | overtrading | Info | F | M | **P1** |
| 36 | Gérer ses émotions en trading | gérer ses émotions trading | Info | É | M | P2 |
| 37 | La discipline en trading | discipline trading | Info | M | M | P2 |
| 38 | Les biais cognitifs du trader | biais cognitifs trading | Info | M | F | P2 |
| 39 | Accepter une perte : protocole | accepter ses pertes trading | Info | F | M | P2 |
| 40 | Routine mentale avant une session | routine mentale trading | Info | F | M | P2 |
| 41 | L'aversion à la perte | aversion à la perte | Info | F | F | P3 |
| 42 | Rester patient en trading | patience trading | Info | F | F | P3 |
| 43 | L'excès de confiance après une série gagnante | excès de confiance trading | Info | F | F | P3 |
| 44 | Le syndrome de l'imposteur du trader | syndrome imposteur trading | Info | F | F | P3 |

### Cluster D — Plan de trading  → *bridge : template Plan, Checklist pré-trade, Starter Bundle*

| # | Titre | Mot-clé principal | Int. | Diff | $ | Prio |
|---|---|---|---|---|---|---|
| 45 | Plan de trading : guide complet + modèle | plan de trading | Info | M | É | **P1** |
| 46 | Comment créer un plan de trading | créer un plan de trading | Info | M | É | **P1** |
| 47 | Exemple de plan de trading (modèle) | exemple plan de trading | Trans | F | É | **P1** |
| 48 | Checklist pré-trade : le modèle | checklist trading | Trans | F | É | **P1** |
| 49 | Les règles d'un bon plan de trading | règles plan de trading | Info | F | M | P2 |
| 50 | Plan de trading pour challenge prop firm | plan de trading prop firm | Info | F | É | P2 |
| 51 | Construire sa routine de trading quotidienne | routine de trading | Info | F | M | P2 |
| 52 | Backtester sa stratégie manuellement | backtest manuel | Info | M | M | P2 |
| 53 | Choisir ses horaires (sessions de trading) | sessions de trading | Info | M | M | P2 |
| 54 | Définir des objectifs de trading réalistes | objectifs trading | Info | F | M | P3 |

### Cluster E — Statistiques & performance  → *bridge : Journal / Edge, calculateurs*

| # | Titre | Mot-clé principal | Int. | Diff | $ | Prio |
|---|---|---|---|---|---|---|
| 55 | Les statistiques de trading à suivre (guide) | statistiques trading | Info | M | É | **P1** |
| 56 | Le win rate : définition et pièges | win rate trading | Info | F | É | **P1** |
| 57 | Le profit factor expliqué | profit factor | Info | F | É | **P1** |
| 58 | L'expectancy (espérance de gain) | expectancy trading | Info | F | É | **P1** |
| 59 | Win rate vs risk reward : le bon équilibre | win rate vs risk reward | Info | F | É | **P1** |
| 60 | Qu'est-ce que l'edge en trading | edge trading | Info | F | É | P2 |
| 61 | Calculer son espérance de gain (exemple) | calcul espérance de gain | Trans | F | É | P2 |
| 62 | Maximum drawdown : l'interpréter | maximum drawdown | Info | F | M | P2 |
| 63 | Combien de trades pour valider une stratégie | échantillon statistique trading | Info | F | M | P2 |
| 64 | Lire sa courbe d'equity | courbe d'equity | Info | F | M | P2 |
| 65 | Les KPI d'un trader rentable | kpi trading | Info | F | É | P2 |
| 66 | Le ratio de Sharpe pour particuliers | ratio de sharpe trading | Info | M | F | P3 |

### Cluster F — Prop firm / financement  → *bridge : calculateurs, Journal (passer un challenge = suivre ses stats)*

| # | Titre | Mot-clé principal | Int. | Diff | $ | Prio |
|---|---|---|---|---|---|---|
| 67 | Prop firm : comment ça marche (guide) | prop firm | Info | É | É | **P1** |
| 68 | Réussir un challenge prop firm | réussir challenge prop firm | Info | M | É | **P1** |
| 69 | Gérer le risque pour passer une prop firm | gestion risque prop firm | Info | F | É | **P1** |
| 70 | Calculer sa taille de lot en challenge | lot size prop firm | Trans | F | É | **P1** |
| 71 | Drawdown maximum en prop firm : l'éviter | drawdown prop firm | Info | F | É | P2 |
| 72 | Les erreurs qui font échouer un challenge | erreurs prop firm | Info | F | É | P2 |
| 73 | FTMO : comprendre les règles | ftmo règles | Comm | M | M | P2 |
| 74 | Compte financé : les règles à respecter | compte financé trading | Info | F | M | P2 |
| 75 | Plan de trading spécial prop firm | plan trading prop firm | Info | F | É | P2 |
| 76 | La psychologie du challenge prop firm | psychologie challenge prop firm | Info | F | M | P2 |
| 77 | Prop firm vs compte perso : que choisir | prop firm ou compte personnel | Comm | F | M | P2 |
| 78 | Objectif de profit : combien de trades | objectif profit prop firm | Info | F | M | P3 |
| 79 | Passer la phase 2 (vérification) | phase 2 prop firm | Info | F | M | P3 |
| 80 | Comparatif des prop firms (FR) | meilleure prop firm | Comm | É | M | P3 |

### Cluster G — Stratégies & setups  → *bridge : le Lab `/strategies` + anatomies existantes (réemploi !)*

| # | Titre | Mot-clé principal | Int. | Diff | $ | Prio |
|---|---|---|---|---|---|---|
| 81 | Le breakout de range expliqué | stratégie breakout | Info | M | M | **P1** |
| 82 | Le pullback sur EMA 200 | pullback ema 200 | Info | M | M | **P1** |
| 83 | Le trading de tendance (trend following) | trading de tendance | Info | M | M | P2 |
| 84 | Le mean reversion (retour à la moyenne) | mean reversion trading | Info | M | F | P2 |
| 85 | Day trading vs swing trading | day trading vs swing trading | Info | M | M | P2 |
| 86 | Comment identifier une tendance | identifier une tendance | Info | M | M | P2 |
| 87 | Order block (smart money) expliqué | order block trading | Info | M | F | P3 |
| 88 | Le Fair Value Gap (FVG) | fair value gap | Info | M | F | P3 |
| 89 | L'opening range breakout (ORB) | opening range breakout | Info | F | F | P3 |
| 90 | Supports et résistances : la méthode | support résistance trading | Info | É | F | P3 |
| 91 | Le price action pour débutants | price action trading | Info | É | F | P3 |
| 92 | Le scalping : méthode et risques | scalping trading | Info | É | F | P3 |

### Cluster H — Débuter, outils & lexique  → *bridge : top de funnel large, glossaire (maillage)*

| # | Titre | Mot-clé principal | Int. | Diff | $ | Prio |
|---|---|---|---|---|---|---|
| 93 | Lexique du trading (glossaire) | lexique trading | Info | M | F | P2 |
| 94 | Combien de capital pour débuter | capital pour débuter trading | Info | M | M | P2 |
| 95 | Démo vs réel : quand basculer | compte démo trading | Info | F | M | P2 |
| 96 | Les erreurs des traders débutants | erreurs débutant trading | Info | M | M | P2 |
| 97 | MT4 ou MT5 : lequel choisir | mt4 ou mt5 | Comm | M | F | P3 |
| 98 | Les frais de trading (spread, swap) | frais de trading | Info | M | F | P3 |
| 99 | Forex, indices ou actions : que trader | que trader débutant | Info | M | F | P3 |
| 100 | Comment débuter le trading (guide sérieux) | débuter en trading | Info | É | M | P3 |

### Top 20 « quick wins » — ordre de publication recommandé

Critère : **P1 × fort potentiel commercial × difficulté faible/moyenne × proximité d'un produit existant.**

1. Comment calculer sa taille de position (#1)
2. Pourquoi tenir un journal de trading (#18)
3. Le ratio risque/rendement (#2)
4. Comment tenir un journal de trading (#19)
5. La règle des 1 % (#3)
6. Journal de trading Excel : modèle gratuit (#20)
7. Le win rate : définition et pièges (#56)
8. Position sizing en compte prop firm (#16)
9. Comparatif : meilleurs journaux de trading (#21)
10. L'expectancy / espérance de gain (#58)
11. Plan de trading : guide + modèle (#45)
12. Le profit factor (#57)
13. Réussir un challenge prop firm (#68)
14. Le revenge trading (#32)
15. Checklist pré-trade : le modèle (#48)
16. Combien risquer par trade (#4)
17. Faire sa revue hebdomadaire (#26)
18. Gérer le risque pour passer une prop firm (#69)
19. Le R-multiple (#5)
20. Exemple de plan de trading (#47)

---

## 3. Pages piliers (guides 3 000–8 000 mots)

**Pourquoi des piliers ?** Sur un domaine neuf en niche YMYL (trading = *Your Money Your Life*, Google exige la confiance), on ne ranke pas sur une tête de requête avec un article isolé. On la ranke en **devenant le nœud central d'un cluster** : le pilier reçoit le *link equity* de tous ses articles-satellites, couvre le sujet en profondeur (signal d'exhaustivité), et chaque satellite ranke en longue traîne tout en renforçant le pilier. **6 piliers de contenu + 1 pilier technique existant (Stratégies).**

| Pilier (URL) | Tête de requête | Pont produit | Pourquoi c'est un pilier | Long. |
|---|---|---|---|---|
| **Gestion du risque** `/ressources/gestion-du-risque` | money management / gestion du risque trading | Calculateurs Risk + Position | Sujet n°1 du persona « qui veut durer » ; relie 16 satellites ; convertit vers les outils | 4–6k |
| **Journal de trading** `/ressources/journal-de-trading` | journal de trading | **Meridian Journal (phare)** | **Pilier le plus rentable** : l'intention informationnelle mène droit au SaaS. Aucun concurrent FR-natif premium | 5–8k |
| **Psychologie du trading** `/ressources/psychologie-du-trading` | psychologie du trading | Weekly Behavioral Report / Mind (Y2) | Fort volume, douleur centrale du persona (tilt, revenge) ; relie au rapport comportemental | 4–6k |
| **Plan de trading** `/ressources/plan-de-trading` | plan de trading | Template Plan + Checklist + Starter Bundle | Intention « je structure » ; modèle téléchargeable = lead magnet roi | 3–5k |
| **Statistiques & performance** `/ressources/statistiques-trading` | statistiques trading | Journal / Edge + calculateurs | Incarne « Trade ce que tu mesures » ; pont direct vers le cœur produit | 4–6k |
| **Prop firm** `/ressources/prop-firm` | prop firm | Calculateurs + Journal | **Goldmine FR** : persona 100 % natif (FTMO/FundedNext) ; fort intent, peu de contenu FR de qualité | 4–6k |
| **Stratégies** `/strategies` *(existant)* | stratégie de trading | Anatomies + Journal | Déjà construit (Lab + 2 anatomies). Devient le 7ᵉ pilier ; les articles G y pointent | — |

> Chaque pilier suit l'**anatomie de page framework** existante (intro éditoriale → corps structuré → schémas → pièges → CTA soft → disclaimer). Réemploi maximal du design system Kairos.

---

## 4. Tunnel de conversion

Principe directeur (inchangé) : **valeur d'abord, zéro pop-up intrusif, capture email douce, pont logique vers le produit — jamais un pitch.**

```
   GOOGLE (requête informationnelle)
        │
        ▼
┌───────────────────────────────┐
│  ARTICLE SEO (le contenu free)│  ← 90 % des visiteurs entrent ici (pas la home)
└───────────────────────────────┘
        │  Chaque article propose, dans cet ordre :
        ├─►  ① OUTIL en contexte  ───────►  /outils/calculateur-…   (valeur immédiate, 0 friction)
        ├─►  ② LEAD MAGNET ciblé  ───────►  capture email (Beehiiv)  → NEWSLETTER hebdo
        ├─►  ③ MAILLAGE  ─────────────────►  pilier + 2-3 articles    (temps passé ↑)
        └─►  ④ PONT PRODUIT (soft) ──────►  /journal  ou  Starter Bundle 49 €
                                                   │
                                                   ▼
                                         ACTIVATION → RÉTENTION
                                    (Weekly Behavioral Report dominical)
```

### Appariement cluster → lead magnet → produit

| Cluster | Lead magnet (email-gated) | Produit cible |
|---|---|---|
| Gestion du risque | « Mémo gestion du risque » (PDF) + calculateurs | Journal (suivi du risque) |
| Journal | **Template Journal Excel + Notion** | **Meridian Journal** / Starter Bundle |
| Psychologie | « Protocole anti-tilt en 4 étapes » (PDF) | Journal (rapport comportemental) |
| Plan de trading | **Modèle de plan de trading** (PDF) | Starter Bundle |
| Statistiques | « Les 7 stats du trader rentable » (cheat-sheet) | Journal / Edge |
| Prop firm | « Réussir son challenge » (PDF) | Journal + calculateurs |
| Stratégies | Anatomie complète (déjà gratuite) → newsletter | Journal |

### Le « CTA stack » — gabarit appliqué à CHAQUE article

1. **Outil en ligne contextuel** (encart, milieu d'article) — le calculateur pertinent.
2. **Un seul** content-upgrade (lead magnet) cohérent avec l'article — capture email douce.
3. Bloc **« À lire ensuite »** : 1 lien pilier (montant) + 2 articles frères.
4. **Pont produit** en clôture, formulé en bénéfice méthodologique (ex. *« Meridian Journal automatise cette revue hebdo »*), jamais en promesse de gain.
5. Capture newsletter en pied : *« Une édition par semaine. Une seule. »*

### Assets à produire (lead magnets = aussi le contenu Starter Bundle / Pack PDF)

Modèle de plan de trading · Template journal Excel+Notion · Checklist pré-trade imprimable · Mémo gestion du risque · Cheat-sheet « 7 stats » · Guide « Réussir son challenge prop firm ». → centralisés sur `/formation`.

---

## 5. Maillage interne

**10 règles (à coder une fois dans le gabarit d'article, appliquées automatiquement) :**

1. **Silo montant** : chaque satellite lie vers son pilier avec une ancre descriptive riche (ex. *« notre guide de la gestion du risque »*).
2. **Silo descendant** : chaque pilier liste et lie **tous** ses satellites (c'est son rôle d'index).
3. **Article → outil** : tout concept calculable pointe vers le calculateur correspondant, en contexte dans le corps.
4. **Article → produit** : pont soft en clôture, apparié au cluster (Journal pour le cluster Journal/Stats/Psycho ; Starter Bundle pour Plan/Checklist).
5. **Article → lead magnet** : un content-upgrade par article.
6. **Outil → contenu** : chaque page outil renvoie vers son pilier + 2-3 articles (anti cul-de-sac).
7. **Stratégies ↔ articles** : les articles G (breakout, pullback…) pointent vers les **anatomies existantes** ; les anatomies renvoient vers risque/plan/journal.
8. **Liens horizontaux** entre piliers connexes : Risque ↔ Statistiques ↔ Journal ; Plan ↔ Psychologie ; Prop firm ↔ Risque.
9. **Discipline d'ancre** : descriptive, variée, jamais « cliquez ici » ; 1 lien = 1 intention.
10. **Profondeur** : tout article atteignable en ≤ 3 clics ; piliers en ≤ 2 ; fil d'Ariane partout.

**Maximiser le temps passé :** sommaire ancré (TOC), temps de lecture estimé, bloc « À lire ensuite » (3), lecture séquentielle « suivant dans ce cluster », outils embarqués (le visiteur *agit* sans quitter la page), schémas SVG (réemploi du `candle-chart`).

**Données structurées (JSON-LD) à ajouter** — leviers E-E-A-T essentiels en YMYL :
`Article` + `author` (bio fondateur + l'audit 1 400 trades = preuve d'expérience) · `BreadcrumbList` · `FAQPage` (réemploi du composant `faq-accordion`) · `HowTo` (articles méthode). Le `sitemap.ts` se met déjà à jour seul via `STRATEGIES.length` → l'étendre au cluster `/ressources`.

---

## 6. Feuille de route 12 mois

**Calibrage :** solo ~25 h/sem, l'essentiel du contenu produit le **mercredi (Content day)** + une partie des Build days. La roadmap SEO **se superpose** au plan produit existant (Q1 Foundation · Q2 Starter Bundle · Q3 SaaS · Q4 Scale) et **sert chaque Gate**. Réaliste : **~60 articles publiés en Y1** (pas 100 — les 40 restants amorcent Y2). *« Un plan tenu à 70 % bat un plan parfait abandonné à M3. »*

> **Réalité YMYL :** un domaine neuf en finance met **4–8 mois** à décoller (sandbox + exigence de confiance). Les objectifs de trafic sont des fourchettes ; le carburant du ranking en trading, c'est l'**E-E-A-T** (manifeste, audit 1 400 trades, /a-propos, transparence sur les pertes) — c'est un actif de confiance, à exploiter.

| Mois | Phase produit | Articles | Focus SEO | Priorité produit | Objectif trafic organique |
|---|---|---|---|---|---|
| **M1** | Q1 Foundation | 3 | Coder `/ressources` + gabarit + schema. Piliers **Risque** & **Journal** | Site live, 2 outils SEO | indexation (sandbox) |
| **M2** | Q1 | 4 | Satellites Risque + Journal (Top 20 #1-6). Blocs éditoriaux sur les outils | 1er framework, newsletter ON | ~100–300 /mo |
| **M3** | Q1 → **Gate** | 4 | Satellites + 1ʳᵉ page top 30. Pilier **Plan** | Brief Starter Bundle | viser **1 page top 30** (= Gate) |
| **M4** | Q2 Starter | 5 | Pilier **Statistiques** + satellites Stats/Plan. Lead magnets (= contenu Bundle) | Build Starter Bundle | ~500–1 000 /mo |
| **M5** | Q2 | 5 | Cluster **Prop firm** (pilier + satellites) — fort intent | Lancement Bundle | ~800–1 500 /mo |
| **M6** | Q2 → **Gate** | 5 | Pilier **Psychologie** + comparatifs (#21, #24) | Choix stack SaaS | ~1 500–2 500 /mo · **500 emails** |
| **M7** | Q3 SaaS | 6 | Cluster **Journal** approfondi (alimente le SaaS) + 1ᵉʳ refresh | Build SaaS core | ~2 500–4 000 /mo |
| **M8** | Q3 | 6 | Pages commerciales (comparatif, « meilleur journal ») + Stats | Beta privée | ~4 000–6 000 /mo |
| **M9** | Q3 → **Gate** | 6 | Cluster **Stratégies** (réemploi anatomies) + Prop firm | **Launch SaaS public** | ~5 000–8 000 /mo · **1 000 emails** |
| **M10** | Q4 Scale | 6 | Compléter clusters Psychologie/Plan. Pack PDF (= lead magnets) | Activation/rétention, Pack PDF | ~6 000–10 000 /mo |
| **M11** | Q4 | 5 | **Refresh round 2** des articles à impressions + light digital PR (podcasts, valeur Reddit/forums) | 2 podcasts, YouTube longform | ~8 000–13 000 /mo |
| **M12** | Q4 → **Gate Y1** | 5 | Audit complet, plan cluster Y1+ / décision EN (Y2) | Bilan + décision Y2 | ~10 000–18 000 /mo · **1 500–2 500 emails** |

**Cadence détaillée du « Content day » :** batcher 2-3 articles par bloc focalisé (recherche MC groupée → rédaction → publication programmée). Le lundi/mardi (Build) absorbe la production des outils et du gabarit `/ressources`.

**Priorités SEO transverses, par trimestre :**
- **Q1** : technique (hub, schema, vitesse, sitemap étendu) + 3 piliers + Top 20 amorcé. KPI : indexation, 1 page top 30.
- **Q2** : profondeur clusters Risque/Journal/Plan/Stats + lead magnets + 1ᵉʳ refresh. KPI : 1 000 visites/mo, requêtes en page 2→1.
- **Q3** : intention **commerciale** (comparatifs, « meilleur journal », prop firm) au service du launch SaaS. KPI : conversions article→produit, 5 000 visites/mo.
- **Q4** : autorité (refresh systématique, premiers backlinks/PR, complétude des 6 piliers). KPI : 10k+ visites/mo, positions tête de requête en progression.

---

## 7. Différenciation

### Cartographie des acteurs FR & angle de Meridian

| Acteur type | Ce qu'ils font | Faille | Angle Meridian |
|---|---|---|---|
| **Influenceurs / formateurs** (formations 1 500 €, Discord signaux, YouTube) | Promesse de gain, hype, signaux | Le persona les a **quittés** (défiance) | Anti-guru, anti-promesse, méthode + données |
| **Médias / portails** (Investing, ABC Bourse, Café de la Bourse) | Actu, macro, cours | Pas de méthode actionnable, pas d'outil | Evergreen méthodologique + outils (≠ média) |
| **Journaux concurrents** (Edgewonk, Tradervue, TraderSync, Tradezella) | Journaling, souvent EN, UI datée/US | Pas FR-natif, pas d'âme éditoriale | FR-first, design Kairos, **rapport comportemental** |
| **Calculateurs épars** (Myfxbook, Babypips) | Outils fonctionnels | Moches, dispersés, EN | Suite **unifiée**, premium, française |
| **Communautés signaux** (Telegram/Discord) | Bruit, dépendance | Aucune autonomie créée | Silence, autonomie, « process avant prédiction » |

### Les 6 leviers de différenciation (= le moat)

1. **Marque & design premium (Kairos)** — dans une niche d'esthétiques criardes, la **sobriété est l'argument**. La confiance par la retenue. Taillé pour le persona.
2. **Data-first — « Trade ce que tu mesures »** — positionnement *mesure, pas prédiction*. Le **Weekly Behavioral Report** n'a aucun équivalent FR.
3. **Le Journal comme produit phare** — FR-natif + analyse comportementale : pas de concurrent direct. Le contenu y converge → moat produit.
4. **La suite d'outils** — double moat : SEO (les calculateurs rankent et attirent des liens) + utilité, le tout unifié sous une marque (vs outils dispersés).
5. **Intégrité éditoriale / E-E-A-T** — no-promise, conforme AMF, fondateur transparent (1 400 trades, pertes assumées). En YMYL, **la confiance = ranking ET conversion**. Moat composé.
6. **Cohérence d'écosystème** — article, outil, journal partagent une *data layer* + une marque. Les concurrents sont des solutions ponctuelles.

### Thèse « devenir LA référence »

Le statut de référence = **posséder les têtes de requête** (les 6 piliers) × **être le nom de confiance** (E-E-A-T) × **avoir le produit dans lequel on gradue** (le Journal). Meridian ne gagne pas au volume — il gagne en **confiance et en design** : moins d'assets, plus profonds, plus crédibles, chacun ingénié pour ranker *et* pour irriguer un produit premium. Autorité thématique + marque + produit, pas quantité.

---

## 8. Décisions à verrouiller & prochaines actions

**À trancher (impact URL/structure, peu réversible) :**
1. **Nom du hub** → recommandation : URL `/ressources`, label « Ressources », marque « Académie Meridian ». *(à confirmer)*
2. **Modèle d'URL** → recommandation : silos `/ressources/[pilier]/[article]`. *(à confirmer)*
3. **Garde-fou « pas de média »** : on acte que l'académie est **100 % evergreen** (zéro actu/signal) → reste conforme à la décision verrouillée.

**Prochaines actions concrètes (M1) :**
- [ ] Scaffolder la route `/ressources` (hub + gabarit pilier + gabarit article) dans Next.
- [ ] Composant `ArticleLayout` avec CTA stack, TOC, bloc « À lire ensuite », JSON-LD `Article`/`Breadcrumb`/`FAQ`.
- [ ] Étendre `sitemap.ts` au cluster `/ressources`.
- [ ] Rédiger les 2 premiers piliers (Risque, Journal) + 6 premiers articles du Top 20.
- [ ] Ajouter un bloc éditorial + maillage sur les 5 pages outils existantes.
- [ ] Brancher Beehiiv (lead magnets) + premier asset : Template Journal Excel+Notion.

---
*Document de travail — à mettre à jour à chaque Gate trimestriel. Périmètre : recommandation générale (Position AMF DOC-2008-23).*
