# 00 — Navigation globale & conventions

## Structure de l'app

Header fixe (nav-blur, 64px de hauteur) + zone de contenu pleine largeur.

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ▢° MERIDIAN JOURNAL    [FTMO Live ▾]                          [N] [I] [@] │
├────────────────────────────────────────────────────────────────────────────┤
│  01 AUJOURD'HUI  ·  02 TRADES  ·  03 PERFORMANCE  ·  04 COMPORT.  ·  05 REVUE │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│                                                                            │
│                          [ ZONE DE CONTENU ]                               │
│                                                                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Header — composition

| Élément | Position | Détail |
|---|---|---|
| Logo `▢°` + wordmark `MERIDIAN JOURNAL` | gauche | font-bold tracking-tight, lien vers `/01-aujourdhui` |
| Sélecteur de compte | gauche (suite logo) | dropdown : "FTMO Live · 50K", "FTMO Demo", "Compte perso", "+ Ajouter" |
| Raccourcis primaires | droite | `[N]` Saisir trade · `[I]` Importer CSV (pill ghost) |
| Avatar utilisateur | droite extrême | dropdown : Réglages, Plan de trading, Facturation, Déconnexion |

### Onglets de navigation

Une seule ligne, 5 items, séparateurs `·`. Label en `font-mono uppercase tracking-[0.3em] text-[12px]`. Item actif = blanc + soulignement 1px blanc 2px sous le label. Item inactif = `text-muted` (#737373).

### Pas de sidebar

Décision verrouillée : pas de sidebar à 14 items. Toute fonction critique passe par les 5 onglets ou par les raccourcis du header.

## Conventions visuelles

Rappel des règles design (cf. `memory/meridian-branding.md`) :

### Couleurs fonctionnelles

| Valeur | Couleur |
|---|---|
| Gain / R positif | `#22c55e` (Edge green) |
| Perte / R négatif | `#ef4444` (Risk red) |
| Conforme au plan | `#22c55e` |
| Hors plan | `#ef4444` |
| Neutre / partiel | `#737373` |

**Jamais d'autres couleurs sémantiques.** Pas de bleu pour "info", pas d'orange pour "warning". Si une info doit être mise en valeur sans être un gain/perte, on utilise le contraste blanc/gris.

### Affichage des chiffres

- R par défaut partout : `+1.4R`, `−0.8R`, `+12.3R cumul`
- € en toggle (réglages user). Si activé, affichage `+1.4R · +120 €` (R en premier, € en gris muted derrière)
- Winrate, % conformité : `0–100%`, 1 décimale max
- Police : JetBrains Mono pour tout chiffre
- Pas de virgule de milliers — espace insécable (`1 400 trades`, pas `1,400`)

### Composants UI réutilisés

| Nom | Usage |
|---|---|
| `KPIStrip` | bande horizontale 4-5 KPIs, gap-px sur fond `#0a0a0a` |
| `Card` | `rounded-2xl p-6` avec hover spotlight |
| `Pill` | badge arrondi pour statuts (`Conforme`, `Hors plan`, `Live`) |
| `Drawer` | panneau latéral droit pour détails (50% largeur viewport desktop, full mobile) |
| `EyebrowLabel` | label mono uppercase `tracking-[0.4em] text-muted` |
| `EquityCurve` | ligne blanche sur noir, pas de fill |
| `Heatmap` | calendrier style GitHub, gris (#1a1a1a) → blanc, pas de gradient coloré |

## Raccourcis clavier globaux

| Touche | Action |
|---|---|
| `N` | Saisir un nouveau trade (ouvre drawer de saisie) |
| `I` | Importer CSV broker |
| `R` | Démarrer revue (hebdo ou mensuelle selon date) |
| `1` à `5` | Naviguer vers l'onglet correspondant |
| `/` | Focus barre de recherche dans Trades |
| `Esc` | Fermer drawer / modal |
| `?` | Afficher la liste des raccourcis |

## États transverses

### État chargement
Skeleton uniforme : `bg-[#0a0a0a]` + shimmer subtile gris foncé. Pas de spinner.

### État vide (zero data)
Page propre, message court factuel, 1 CTA primaire.
Exemple : *"Aucun trade journalisé. Importe ton premier CSV ou saisis un trade manuellement."* + boutons `[I]` et `[N]`.

### État erreur
Bandeau discret en haut de la zone de contenu : `border-l-2 border-red-500 bg-[#0a0a0a] px-4 py-3`. Message factuel, action de récupération. Pas d'icône, pas d'alarmisme.

## Responsive

| Breakpoint | Adaptations |
|---|---|
| Desktop ≥ 1280 px | Layout complet, tableaux à 8 colonnes, drawers 720 px |
| Tablette 768–1279 px | Tableaux à 6 colonnes (les 2 moins critiques cachées), drawers 560 px |
| Mobile < 768 px | Navigation = bottom tab bar 5 items, drawers en bottom-sheet 90% hauteur, certains écrans (Performance détaillée) renvoient vers desktop |

**Mobile = 3 écrans utiles uniquement** : Aujourd'hui (saisie rapide), dernier trade, dernier Weekly Report. Le reste reste optimisé desktop.
