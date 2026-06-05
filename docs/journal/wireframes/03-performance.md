# 03 — Performance

## Objectif
Le tableau de bord chiffré. Répond aux 4 premières questions opérationnelles (cf. README) :
1. Quel setup prioriser
2. Quel setup supprimer
3. Quelles heures je détruis mon edge
4. Mon plan est-il réaliste

## Question utilisateur
*"Mes chiffres me disent quoi, factuellement ?"*

## Wireframe — état standard

```
┌────────────────────────────────────────────────────────────────────────────┐
│  03 — PERFORMANCE                            Période : [ 90 derniers jours ▾ ] │
│                                                                            │
│ ┌──────────┬──────────┬──────────┬──────────┬──────────┐                   │
│ │ TRADES   │ WINRATE  │ EXPECTANCY│ PROFIT FAC│ MAX DD   │                  │
│ │   147    │   54.4%  │  +0.32R   │   1.41    │  -8.2R   │                  │
│ └──────────┴──────────┴──────────┴──────────┴──────────┘                   │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ EQUITY CURVE                                                  R cumul  │ │
│ │                                                                        │ │
│ │      ╱╲                                          ╱──╲                  │ │
│ │     ╱  ╲                              ╱──╲      ╱    ╲___              │ │
│ │  __╱    ╲___╱──╲           ╱──╲──╱─╲ ╱    ╲────╱                       │ │
│ │ ╱             ╲──╱─╲     ╱      ╲──╱                                   │ │
│ │                    ╲─╲──╱                                              │ │
│ │                                                                        │ │
│ │ 03 mars                                                       28 mai    │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  VUES                                                                      │
│  [ Par setup ]  [ Par instrument ]  [ Par jour ]  [ Par heure ]  [ Par session ] │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ PAR SETUP                                                              │ │
│ │                                                                        │ │
│ │ SETUP            N    WINRATE   EXP. R    R CUMUL   STATUT             │ │
│ │ ───────────────  ──   ───────   ──────    ───────   ──────────────     │ │
│ │ Breakout NY open  42    61%     +0.54R    +22.7R    PRIORITAIRE        │ │
│ │ Trend pullback    38    58%     +0.41R    +15.6R    SOLIDE             │ │
│ │ BO euro open      31    52%     +0.28R    +8.7R     OK                 │ │
│ │ Mean reversion    24    42%     +0.04R    +1.0R     MARGINAL           │ │
│ │ Fade NY high      12    25%     -0.38R    -4.6R     À RETIRER          │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ DISTRIBUTION DES R                                                     │ │
│ │                                                                        │ │
│ │    ▆                                                                   │ │
│ │    █  ▅                                                                │ │
│ │ ▂  █  █  ▆                                                             │ │
│ │ █  █  █  █  ▄  ▃                                                       │ │
│ │ █  █  █  █  █  █  ▁  ▁                                                 │ │
│ │ ─────────────────────────────                                          │ │
│ │ -3  -2  -1  0  +1 +2 +3 +4 R                                           │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

## Anatomie

### KPI Strip — 5 cellules

| Cellule | Définition | Format |
|---|---|---|
| TRADES | nb trades dans la période | `147` |
| WINRATE | % trades gagnants | `54.4%` |
| EXPECTANCY | (winrate × avg gain R) − (loserate × avg loss R) | `+0.32R` |
| PROFIT FACTOR | sum gains R / abs(sum losses R) | `1.41` |
| MAX DD | max drawdown R rolling | `-8.2R` |

Si la période contient moins de 20 trades : badge `n < 20 — statistiquement faible` sous le strip.

### Equity curve

- Ligne blanche 1.5px sur fond noir
- Pas de zone fillée (épuration)
- Axe X : dates auto-bornées sur la période
- Axe Y : R cumul (toggle € si activé)
- Hover : tooltip avec date, R cumul, R sur la barre
- Marqueurs de DD majeurs (drawdowns > 3R) en gris muted

### Bloc VUES — 5 vues filtrables (tabs)

Une seule active à la fois. Chaque vue affiche un tableau structuré pareil :
nom · n · winrate · expectancy R · R cumul · **statut** auto.

**Statut auto** calculé selon expectancy & taille échantillon :
| Condition | Statut |
|---|---|
| n ≥ 20 et exp ≥ +0.4R | `PRIORITAIRE` (vert) |
| n ≥ 20 et exp ≥ +0.2R | `SOLIDE` |
| n ≥ 20 et exp ≥ 0 | `OK` |
| n ≥ 20 et exp < 0 et > -0.2R | `MARGINAL` (gris) |
| n ≥ 30 et exp < -0.2R | `À RETIRER` (rouge) |
| n < 20 | `n insuffisant` (muted) |

Ce statut est l'angle différenciant. Pas juste des chiffres : une lecture.

### Distribution des R

Histogramme barres verticales, bins de 0.5R.
- Barres positives en blanc, négatives en gris foncé
- Ligne verticale verte à l'expectancy
- Ligne verticale grise à 0

## Vues détaillées

### Par instrument
Mêmes colonnes que Par setup, agrégé par instrument tradé.

### Par jour de semaine
| JOUR | N | WINRATE | EXP. R | R CUMUL |
| Lundi | 32 | 62% | +0.51R | +16.3R |
| ...
Identifie les patterns hebdo (best day, worst day).

### Par heure
Grille 24 colonnes (00h–23h) + heatmap densité + ligne expectancy en surimpression.
Souvent **l'insight le plus actionnable** pour la cible (prop firm = horaires NY/London).

### Par session
Pré-marché US · Open London · Surveillance · Open NY · Cash session · Fermeture
Définition des sessions paramétrable dans réglages.

## États

### Vide / n trop faible
*"Tu as moins de 20 trades sur la période. Statistiquement, c'est trop tôt pour conclure. Continue de journaliser, ton dashboard se construit."*

### Filtre trop restrictif
*"Aucun trade ne correspond. Élargis ta période ou retire un filtre."*

## Notes design

- **Pas de "vanity metrics"** : pas de "win streak", pas de "best trade", pas de "lucky day". Ces chiffres flattent l'égo, ne servent pas la décision.
- **Pas de Sharpe ratio en V1** : confond plus que ça n'éclaire pour des traders qui ne sont pas long-term. Candidat V2 si demande.
- **Pas de Sortino, Calmar, etc.** : même raison. Reste sur des métriques que le persona comprend.
- **Equity curve = ligne, jamais zone fill** : la zone fill est associée aux signaux de "performance trading" influenceurs.
- **L'export PDF de cette page** = base de dossier prop firm. Format A4 portrait, propre. À implémenter V1.
- **L'angle "statut auto"** est ce qui distingue Meridian de Tradervue / Edgewonk. Si on doit en garder UNE feature visuelle marquante, c'est ça.
