# 02 — Trades

## Objectif
Vue historique exhaustive et filtrable de tous les trades. C'est la référence brute, l'équivalent du "ledger".

## Question utilisateur
*"Retrouve-moi tel trade / tels trades, et donne-moi tout le détail."*

## Wireframe — état standard

```
┌────────────────────────────────────────────────────────────────────────────┐
│  02 — TRADES                                            1 247 trades  ·  ↓  │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ FILTRES                                                                │ │
│ │ [ 30 derniers jours ▾ ] [ Tous instruments ▾ ] [ Tous setups ▾ ]      │ │
│ │ [ Tous tags ▾ ] [ Conformité : tous ▾ ]    [ Réinitialiser ]          │ │
│ │                                       [ / Rechercher dans notes... ]   │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ┌──────┬────────┬─────────┬───────┬──────┬─────────┬─────────────┬───────┐ │
│ │ DATE │ HEURE  │ INSTR   │ SENS  │   R  │ DURÉE   │ SETUP       │ FLAG  │ │
│ ├──────┼────────┼─────────┼───────┼──────┼─────────┼─────────────┼───────┤ │
│ │ 28/05│ 14:32  │ US30    │ LONG  │ +0.8R│ 18 min  │ BO NY open  │  ✓    │ │
│ │ 28/05│ 11:08  │ XAUUSD  │ SHORT │ -1.0R│  6 min  │ MR daily    │  ~    │ │
│ │ 28/05│ 09:47  │ GER40   │ LONG  │ +1.4R│ 42 min  │ BO euro open│  ✓    │ │
│ │ 27/05│ 16:14  │ US30    │ SHORT │ -0.9R│ 24 min  │ Fade NY hi  │  ✗    │ │
│ │ 27/05│ 10:22  │ EURUSD  │ LONG  │ +2.1R│ 1h12    │ Trend pull. │  ✓    │ │
│ │ ...                                                                    │ │
│ └──────┴────────┴─────────┴───────┴──────┴─────────┴─────────────┴───────┘ │
│                                                                            │
│  Affichage 1–50 sur 1 247          [ < ]  Page 1 / 25  [ > ]   [ Export ]  │
└────────────────────────────────────────────────────────────────────────────┘
```

## Drawer détail trade

Clic sur une ligne → drawer latéral droit (720 px).

```
┌──────────────────── DRAWER · TRADE #1847 · 28/05 14:32 ────── ESC ──┐
│                                                                     │
│ US30  LONG  +0.8R  ·  18 min  ·  Breakout NY open  ·  ✓ Conforme    │
│ ──────────────────────────────────────────────────────────────────  │
│                                                                     │
│ ▼ EXÉCUTION                                                         │
│   Entrée   42 318.5      14:32:08                                   │
│   Sortie   42 358.2      14:50:14   (TP touché)                     │
│   Taille   0.5 lot                                                  │
│   P&L      +198 € · +0.8R                                           │
│   MAE      -12 pts (max adverse excursion)                          │
│   MFE      +52 pts (max favorable excursion)                        │
│   Slippage 0.8 pt entrée, 0.0 pt sortie                             │
│                                                                     │
│ ▼ CONTEXTE                                                          │
│   Setup           Breakout NY open                                  │
│   Conformité      ✓ Conforme au plan                                │
│   Tags            (aucun)                                           │
│   Émotion         3/5 (calme)                                       │
│   Pré-séance      Calme · 7h sommeil                                │
│                                                                     │
│ ▼ ANNOTATIONS                                                       │
│   Note (28/05 14:55) :                                              │
│   "Setup propre, breakout sur volume. Sorti au TP, pas de gestion." │
│                                                                     │
│   [ + Ajouter une note ]                                            │
│                                                                     │
│ ▼ CAPTURE                                                           │
│   [drag & drop ou bouton upload]                                    │
│                                                                     │
│                              [ Supprimer ]    [ Modifier le trade ] │
└─────────────────────────────────────────────────────────────────────┘
```

## Anatomie

### Filtres

Tous combinables, ET logique. Reset visible.
- Période : 7j / 30j / 90j / cette année / personnalisé
- Instrument : multi-select des instruments tradés (auto-extrait des données)
- Setup : multi-select depuis plan de trading
- Tags comportement : multi-select des 12 tags
- Conformité : tous / conforme / partiel / hors plan
- Recherche : full-text sur note libre, raccourci `/`

État filtré : pill `2 filtres actifs · réinitialiser` apparaît en haut du tableau.

### Tableau

8 colonnes desktop, 6 en tablette, 4 en mobile (date, instrument, R, flag).
- Tri : clic en-tête colonne, par défaut tri par date desc.
- Densité : `text-sm` mono pour chiffres, Inter pour setup
- Hover ligne : fond `#0a0a0a`, curseur pointer
- Sélection multiple : checkbox optionnelle (toggle via réglage power-user)

### Pagination

Par défaut 50 lignes / page. Bouton `Afficher plus` ou pagination classique selon préférence user (réglage).

### Export

`Exporter` (top-right tableau) → modal mini :
- Format : CSV / PDF
- Contenu : trades filtrés actuels OU sélection
- Colonnes : checkbox de chaque colonne

## États

### Vide (aucun trade)
*"Aucun trade dans la période. Élargis tes filtres ou importe un nouveau CSV."*

### Filtré sans résultat
*"0 trade correspond à tes filtres. [Réinitialiser les filtres]"*

## Flow d'interaction

- `↑ ↓` navigue dans le tableau
- `Enter` ouvre le drawer
- `Esc` ferme le drawer
- `Cmd+K` ouvre la palette de recherche globale (V2)
- `J / K` next / prev trade dans le drawer ouvert (style Gmail)

## Notes design

- **Le tableau est la "feuille de calcul" du trader**. Doit être dense, scannable, manipulable au clavier. Pas d'animation décorative.
- **MAE / MFE** affichés uniquement si tick data dispo (donc V2 quand on aura les APIs broker). En V1 : champs présents mais à `—`.
- **Pas de chart embarqué dans le drawer.** Capture utilisateur uniquement. Pas de TradingView embed Y1.
- **Édition d'un trade** ouvre le drawer en mode édition (mêmes champs que la saisie). Pas de double UI.
- **Suppression** demande confirmation modale brève. Pas de soft-delete user-visible (mais on garde 30 jours en base pour restauration support).
