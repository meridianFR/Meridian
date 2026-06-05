# 04 — Comportement (Meridian Edge intégré)

## Objectif
Le module qui justifie le prix. Là où Meridian se distingue radicalement d'un Excel ou d'un Tradervue. Répond aux questions :
- Quelle erreur me coûte le plus ?
- Suis-je discipliné quand ça compte ?
- Mon edge se dégrade-t-il ?

## Question utilisateur
*"Quels sont mes patterns comportementaux et combien ils me coûtent ?"*

## Wireframe — état standard

```
┌────────────────────────────────────────────────────────────────────────────┐
│  04 — COMPORTEMENT · MERIDIAN EDGE          Période : [ 30 derniers jours ▾ ] │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ TES 3 ERREURS RÉCURRENTES CE MOIS                                      │ │
│ │                                                                        │ │
│ │ 1. REVENGE TRADE                                                       │ │
│ │    8 occurrences · coût moyen -1.4R · -11.2R cumul                     │ │
│ │    Survient dans les 30 min après une perte. Voir les 8 trades →       │ │
│ │                                                                        │ │
│ │ 2. SORTIE PRÉMATURÉE                                                   │ │
│ │    14 occurrences · gain manqué moyen +0.8R · +11.2R potentiel         │ │
│ │    Concerne surtout Trend pullback. Voir les 14 trades →               │ │
│ │                                                                        │ │
│ │ 3. POSITION TRAÎNÉE                                                    │ │
│ │    5 occurrences · coût moyen -2.1R · -10.5R cumul                     │ │
│ │    Trade au-delà du SL initial, espoir de retournement. Voir →         │ │
│ │                                                                        │ │
│ │                                                       [ Tout voir → ]  │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ CONFORMITÉ AU PLAN — 60 derniers jours                                 │ │
│ │                                                                        │ │
│ │  L M M J V S D L M M J V S D L M M J V S D L M M J V S D L M M J V S D│ │
│ │  ▢ ░ █ █ █ ▢ ▢ ▢ ░ █ ▒ █ ▢ ▢ ▢ █ █ █ █ █ ▢ ▢ ▢ ░ █ ▒ █ ▢ ▢ ▢ █ █ █ █ ▢│ │
│ │                                                                        │ │
│ │  ▢ Pas trade  ░ Hors plan  ▒ Partiel  █ Conforme                       │ │
│ │  Streak conformité actuelle : 4 jours.   Record : 11 jours.            │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ┌────────────────────────────────────┬───────────────────────────────────┐ │
│ │ HEURES PROFITABLES vs DESTRUCTRICES│ ÉMOTION × R                        │ │
│ │                                    │                                   │ │
│ │ 09h ████████████   +2.1R           │  R                                │ │
│ │ 10h ██████████     +1.8R           │  +3 ·         ●  ●                │ │
│ │ 11h ████           +0.4R           │  +2 ·    ●   ●    ●               │ │
│ │ 12h —                              │  +1 ·  ●    ●  ●     ●            │ │
│ │ 13h —                              │   0 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─           │ │
│ │ 14h ██             +0.2R           │  -1 ·       ●    ●  ●             │ │
│ │ 15h ░░░            -0.6R           │  -2 ·   ●            ●            │ │
│ │ 16h ░░░░░          -1.2R           │  -3 ·              ●              │ │
│ │ 17h ░░░░░░░░       -1.7R           │     ──────────────────            │ │
│ │                                    │      1   2   3   4   5 émotion    │ │
│ │ Décrochage net après 14h.          │   ↑ calme    ↑ tendu              │ │
│ └────────────────────────────────────┴───────────────────────────────────┘ │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ INSIGHTS AUTO                                                          │ │
│ │                                                                        │ │
│ │ · Tes jours non journalisés (4 sur 22) ont une perf -40% vs journalisés│ │
│ │ · Conformité plan en condition de stress (après 2 pertes) : 38%        │ │
│ │ · Setup "Breakout NY open" a chuté à 41% winrate ce mois (vs 61% hist) │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

## Anatomie

### Bloc "Tes 3 erreurs récurrentes"

L'angle phare. C'est ce qui doit apparaître en screenshot marketing.

**Calcul :**
- Top 3 tags comportement (parmi les 12 V1) classés par `count × |R impact moyen|`
- Pour chaque erreur : occurrences, coût/gain moyen, coût cumul, contexte (pattern temporel détectable), lien vers les trades concernés

**Ton du libellé :**
- Factuel : *"Survient dans les 30 min après une perte."* (pas *"Tu fais du revenge trade !"*)
- Pas de moralisation, pas d'émoji, pas de bouton "Améliore-toi"

### Heatmap conformité au plan

Calendrier 60 jours (env. 2 mois), style GitHub :
- Cases 12×12px avec gap 2px
- Colorimétrie : `▢` (pas tradé) blanc 4% / `░` hors plan = rouge 50% / `▒` partiel = gris 50% / `█` conforme = vert 70%
- Hover : tooltip date + nb trades + status global
- Bandeau dessous : streak actuel + record (gamification mesurée, pas vanity)

### Heures profitables / destructrices

Barres horizontales avec valeur R à droite.
- Vert si positif, rouge si négatif, gris si n < 5
- Note interprétative en-dessous, générée à partir de seuils (ex. "Décrochage net après 14h" si delta entre matin/après-midi > 1R)

### Scatter émotion × R

- Axe X : émotion auto-reportée pré-séance (1 = calme, 5 = tendu)
- Axe Y : R réalisé du trade
- Chaque point = 1 trade
- Si la corrélation est statistiquement notable (corr abs > 0.3 et n > 30) : ligne de tendance grise + libellé *"Corrélation modérée"*. Sinon : pas de ligne (pas de fausse science).

### Insights auto (le bloc de fin)

3 à 5 phrases auto-générées chaque jour à partir de règles. Pas d'IA générative pour ces lignes V1, ce sont des templates :

| Template | Trigger |
|---|---|
| *"Tes jours non journalisés (X sur Y) ont une perf Z% vs journalisés"* | si jours non journalisés > 2 |
| *"Conformité plan en condition de stress (après 2 pertes) : X%"* | si différence > 15pp vs baseline |
| *"Setup X a chuté à Y% winrate ce mois (vs Z% hist)"* | si chute > 30% rolling |
| *"Lundi est ton meilleur jour (+XR), mercredi ton pire (−YR)"* | si écart > 1R sur n ≥ 8 |
| *"Tu as journalisé X% de tes trades sur ce mois"* | toujours, indicateur de discipline |

Si aucune règle ne se déclenche : *"Aucun pattern net cette période. Continue."* (Honnête.)

## États

### Pas assez de tags pour détecter
*"Tu n'as encore tagué aucun trade. Active les tags comportement lors de la saisie pour activer ce module."*

### Pas assez de données émotionnelles
*"Pas assez de pré-séances renseignées pour analyser. Reviens dans 14 jours."*

## Notes design

- **C'est la page qui doit donner envie de payer 19€/mois.** Le marketing /journal montre cette page en screenshot (anonymisée).
- **Aucun message moralisateur** : *"Tu peux faire mieux !"*, *"Reste discipliné !"* → bannis. Seulement des chiffres et des constats.
- **Pas de score global "discipline" /100** : abstraction creuse. On préfère la heatmap + le score 1-10 que l'user remplit en revue hebdo.
- **Pas de comparaison avec d'autres traders V1.** "Cohorte anonymisée" = candidat V2. En V1 on parle uniquement à l'historique de l'user lui-même.
- **Les seuils des règles d'insight sont des constantes** versionnées dans le code. À ajuster avec les retours utilisateurs des 30 premiers abonnés.
