# 04 — Specs parseur d'import MT4 / MT5

## Objectif

Permettre à un utilisateur d'importer son historique de trades depuis MetaTrader 4 ou 5, en quelques secondes, avec un mapping fiable vers le modèle de données Meridian. C'est le **premier moment de valeur** (Time-to-Value cible < 7 jours) — la qualité de cet import conditionne la rétention.

### Périmètre V1 (verrouillé)
- **MT4** : import du Statement (HTML) et du CSV exporté
- **MT5** : import du rapport d'historique (HTML/Excel/CSV)
- **Pas d'API broker** (hors-scope Y1)
- **Pas de cTrader / NinjaTrader / DXtrade** (candidats V2)

---

## Comprendre les formats source

### MT4 — un trade = une ligne

MT4 exporte via `Compte > Historique > clic droit > Enregistrer en rapport détaillé`. Format HTML (le plus courant) ou CSV selon broker. Section "Closed Transactions".

Colonnes typiques (anglais) :

| Colonne | Exemple | Notes |
|---|---|---|
| Ticket | 184729301 | identifiant unique du trade |
| Open Time | 2026.05.28 09:47:12 | fuseau serveur broker |
| Type | buy / sell / balance / credit | filtrer balance & credit |
| Size | 0.50 | lots |
| Item | US30 / EURUSD / XAUUSD | symbole (suffixe broker possible : `EURUSD.m`, `US30cash`) |
| Price (open) | 42318.5 | |
| S/L | 42280.0 | **clé pour le calcul du R** — 0 si absent |
| T/P | 42400.0 | 0 si absent |
| Close Time | 2026.05.28 10:05:28 | |
| Price (close) | 42358.2 | |
| Commission | -2.40 | |
| Taxes | 0.00 | |
| Swap | -0.85 | |
| Profit | 198.00 | dans la devise du compte |

**Atout MT4 :** une position = une ligne complète. Parsing direct.

### MT5 — un trade = plusieurs deals à reconstruire

MT5 a un modèle relationnel : **Orders → Deals → Positions**. L'export "History" contient des *deals* (transactions élémentaires). Un trade complet = au minimum 2 deals (un `in`, un `out`).

Colonnes deals typiques :

| Colonne | Exemple | Notes |
|---|---|---|
| Time | 2026.05.28 09:47:12 | |
| Deal | 51028471 | id du deal |
| Symbol | US30 | |
| Type | buy / sell | |
| Direction | in / out / in/out | **clé pour reconstruire la position** |
| Volume | 0.50 | |
| Price | 42318.5 | |
| Order | 49301882 | id de l'ordre parent |
| Commission | -2.40 | |
| Fee | 0.00 | |
| Swap | 0.00 | porté souvent sur le deal de sortie |
| Profit | 198.00 | porté sur le deal `out` |
| Balance | 10198.00 | solde courant |
| Comment | tp / sl / [manual] | indice de motif de sortie |

**Difficulté MT5 :** il faut **reconstruire les positions** en appariant les deals `in` et `out` par `position id` (ou à défaut par ordre/symbole/chronologie). Le SL/TP ne sont **pas** dans les deals → il faut le rapport d'ordres ou un fallback.

---

## Modèle de données Meridian (cible)

Tout import normalise vers ce schéma :

```
Trade {
  id                  // uuid Meridian
  account_id
  external_ticket     // ticket MT4 / position id MT5
  source              // 'mt4' | 'mt5' | 'manual'
  instrument          // normalisé : suffixes broker retirés (EURUSD.m -> EURUSD)
  direction           // 'long' | 'short'
  open_time_utc       // normalisé UTC (depuis fuseau serveur)
  close_time_utc
  entry_price
  exit_price
  size_lots
  sl_initial          // nullable
  tp_planned          // nullable
  pnl_gross           // résultat du mouvement de prix seul
  pnl_net             // pnl_gross + swap + commission + fee + taxes
  swap
  commission          // commission + fee + taxes regroupés
  r_realized          // nullable
  r_source            // 'sl_export' | 'plan_default' | 'manual' | null
  duration_min
  exit_reason         // 'tp' | 'sl' | 'manual' | 'unknown' (depuis Comment MT5)
  // champs enrichis manuellement par l'user après import
  setup, plan_conformity, tags[], emotion, note, chart_url
}
```

---

## Calcul du R (point critique)

R = `pnl_gross_en_points / risque_initial_en_points`, où `risque_initial = |entry_price − sl_initial|`.

### Arbre de décision du R

```
SL initial disponible et > 0 (MT4 colonne S/L, ou MT5 via rapport ordres) ?
├── OUI → r_realized = (mouvement de prix signé) / |entry − sl_initial|
│         r_source = 'sl_export'
│         ⚠ limite : le S/L de l'export peut être le SL FINAL (modifié), pas l'initial.
│            On l'utilise comme proxy V1 et on le signale. SL initial exact = V2 (API).
│
└── NON (SL = 0 ou absent) →
    Plan de trading configuré avec risque par défaut (R% × capital) ?
    ├── OUI → risque_initial = R%_plan en valeur ; r_realized = pnl_net / risque_plan
    │         r_source = 'plan_default'
    │         (R approximatif, basé sur le risque théorique constant)
    │
    └── NON → r_realized = null
              Inviter l'user à définir son risque par défaut dans le plan,
              OU à saisir le SL manuellement par trade.
```

**Règle d'affichage :** un R issu de `plan_default` est marqué d'un indicateur discret (ex. `~+0.8R`, le `~` = estimé). Honnêteté statistique.

---

## Edge cases (exhaustif)

| # | Cas | Traitement |
|---|---|---|
| 1 | **Langue de la plateforme** (FR/ES/DE…) : headers traduits ("Heure", "Volume", "Bénéfice") | Détection par mapping multilingue des headers + fallback détection par position de colonne. Lib de mapping `MT_HEADER_ALIASES`. |
| 2 | **Balance operations** (deposit, withdrawal, credit, balance, correction) | Ignorées (pas des trades). Utilisées séparément pour calculer le capital de départ si besoin. |
| 3 | **Partial close** (MT5 : sortie en plusieurs deals `out`) | Agréger les deals `out` d'une même position : prix de sortie = moyenne pondérée par volume, pnl = somme. 1 Trade Meridian. |
| 4 | **Hedging mode** (positions opposées simultanées même symbole) | Apparier par position id (MT5) / ticket (MT4). Ne pas netter. Chaque position = 1 trade distinct. |
| 5 | **Suffixes de symbole broker** (`EURUSD.m`, `US30cash`, `XAUUSD-ECN`, `GER40.cash`) | Normalisation via table `SYMBOL_ALIASES` → symbole canonique. Suffixes courants retirés par regex. Cas inconnu → garder tel quel + flag pour revue. |
| 6 | **Fuseau horaire serveur** (MT souvent GMT+2/+3, variable) | Demander le fuseau du serveur à l'import (dropdown, défaut GMT+2). Convertir en UTC. Affichage ensuite dans le fuseau user. Critique pour l'analyse "par heure". |
| 7 | **SL = 0 / TP = 0** | Traités comme absents (cf. arbre R). |
| 8 | **Trade encore ouvert** (pas de Close Time) | Ignoré à l'import (on ne journalise que les trades clôturés V1). |
| 9 | **Pending orders annulés / expirés** | Ignorés (pas de deal d'exécution). |
| 10 | **Commission/Swap multi-lignes** | Regrouper dans `commission` (commission+fee+taxes) et `swap`. pnl_net inclut tout. |
| 11 | **Doublons** (réimport du même historique) | Dédup par `external_ticket` + `account_id`. Réimport = upsert, ne crée pas de doublon, préserve les champs enrichis manuels. |
| 12 | **Devise du compte ≠ EUR** (compte USD, GBP…) | pnl déjà dans la devise du compte (MT convertit). Stocker la devise du compte. R non affecté (sans dimension). |
| 13 | **Fichier corrompu / format inattendu** | Parsing tolérant : lignes illisibles collectées dans un rapport d'erreur, import partiel autorisé. Jamais de crash total. |
| 14 | **Scalping (durée < 1 min)** | duration_min peut être 0. Garder en secondes en interne, afficher "< 1 min". |
| 15 | **Très gros historiques** (10 000+ trades) | Parsing par lots, feedback de progression, import asynchrone (job). |

---

## Flow UX d'import

```
ÉTAPE 1 — DÉPÔT
┌────────────────────────────────────────────────┐
│  Importer ton historique                       │
│                                                │
│  [ Glisser ton fichier MT4/MT5 ici ]           │
│   ou [ parcourir ]                             │
│                                                │
│  Formats : .htm .html .csv .xlsx (MT4 / MT5)   │
│  → Comment exporter depuis MetaTrader ? (guide)│
└────────────────────────────────────────────────┘

ÉTAPE 2 — DÉTECTION & RÉGLAGES
┌────────────────────────────────────────────────┐
│  Détecté : MT5 · 247 trades · GER40, US30, ... │
│                                                │
│  Fuseau du serveur broker : [ GMT+2 ▾ ]        │
│  Compte à rattacher :       [ FTMO Live ▾ ]    │
│                                                │
│  ⚠ 12 trades sans stop loss → R estimé via plan│
│                                                │
│                              [ Aperçu → ]      │
└────────────────────────────────────────────────┘

ÉTAPE 3 — APERÇU (10 premières lignes parsées)
┌────────────────────────────────────────────────┐
│  DATE   INSTR   SENS   ENTRÉE  SORTIE   R       │
│  28/05  US30    LONG   42318   42358  +0.8R     │
│  28/05  XAUUSD  SHORT  2334.1  2338.0 -1.0R     │
│  ...                                           │
│                                                │
│  243 trades OK · 4 lignes ignorées (voir détail)│
│                                                │
│         [ Annuler ]   [ Importer 243 trades ]  │
└────────────────────────────────────────────────┘

ÉTAPE 4 — CONFIRMATION
┌────────────────────────────────────────────────┐
│  243 trades importés.                          │
│  Va dans Performance pour voir ton dashboard,   │
│  ou enrichis tes trades (setups, tags).         │
│         [ Voir Performance ]  [ Enrichir ]     │
└────────────────────────────────────────────────┘
```

### Rapport de lignes ignorées
Toujours accessible : liste des lignes non parsées avec la raison (`balance operation`, `trade ouvert`, `format illisible ligne 142`). Transparence = confiance.

---

## Architecture technique (indicative)

| Composant | Rôle |
|---|---|
| `detectFormat(file)` | identifie MT4-HTML / MT4-CSV / MT5-HTML / MT5-Excel / MT5-CSV |
| `parseMT4(raw)` | parse les lignes "Closed Transactions" → `RawTrade[]` |
| `parseMT5(raw)` | parse les deals → `reconstructPositions()` → `RawTrade[]` |
| `reconstructPositions(deals)` | apparie in/out par position id, agrège partials |
| `normalizeSymbol(s)` | retire suffixes broker, mappe vers canonique |
| `normalizeTimezone(t, serverTz)` | → UTC |
| `computeR(trade, plan)` | applique l'arbre de décision R |
| `dedupe(trades, accountId)` | upsert par external_ticket |
| `buildImportReport(parsed, ignored)` | objet pour l'écran d'aperçu |

Tests unitaires obligatoires sur des fichiers réels anonymisés : 1 MT4-FR, 1 MT4-EN, 1 MT5-hedging, 1 MT5-netting avec partials, 1 fichier corrompu. **Fixtures dans `lib/import/__fixtures__/`.**

---

## Ce qu'on ne fait PAS V1
- Pas de connexion API broker en direct (lecture auto)
- Pas de SL initial exact (on prend le SL de l'export comme proxy)
- Pas de tick data / MAE-MFE réels (champs présents, à `—`)
- Pas d'import multi-comptes en un fichier (1 fichier = 1 compte)
- Pas de cTrader / autres plateformes
