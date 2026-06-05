# 01 — Aujourd'hui

## Objectif
Point d'entrée par défaut. Donne à l'utilisateur l'état de la journée en cours en moins de 5 secondes, et un chemin direct vers les 2 actions clés : saisir un trade, ou démarrer la revue si on est dimanche.

## Question utilisateur
*"Où j'en suis aujourd'hui, et qu'est-ce que je dois faire maintenant ?"*

## Wireframe — état standard (journée de trading)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  01 — AUJOURD'HUI · LUNDI 28 MAI 2026 · SEMAINE 22                         │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ STATUS                                                                 │ │
│ │                                                                        │ │
│ │ Tu as 3 trades non journalisés depuis ton dernier import.              │ │
│ │                                                                        │ │
│ │  [ Saisir un trade ]   [ Importer CSV ]                                │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ┌──────────────────┬──────────────────┬──────────────────┬───────────────┐ │
│ │ TRADES DU JOUR   │ R RÉALISÉ        │ CONFORMITÉ PLAN  │ TEMPS ÉCRAN   │ │
│ │      4           │      +1.2R       │      75%         │     2h14      │ │
│ │ (2 long, 2 short)│  (estim. live)   │ (3/4 conformes)  │ (info passive)│ │
│ └──────────────────┴──────────────────┴──────────────────┴───────────────┘ │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ PRÉ-SÉANCE                                                  optionnel  │ │
│ │                                                                        │ │
│ │ État du jour :  [ Calme ] [ Tendu ] [ Fatigué ] [ Pressé ]             │ │
│ │ Sommeil :       [ — h ]                                                │ │
│ │ Note :          [_____________________________________________]        │ │
│ │                                                                        │ │
│ │                                                       [ Enregistrer ]  │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ DERNIERS TRADES                                          voir tout →   │ │
│ │                                                                        │ │
│ │ 14:32  US30   LONG    +0.8R   Breakout NY open   ✓ Conforme            │ │
│ │ 11:08  XAUUSD SHORT   -1.0R   Mean reversion     ~ Partiel             │ │
│ │ 09:47  GER40  LONG    +1.4R   Breakout euro open ✓ Conforme            │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

## Wireframe — état dimanche (jour de revue)

Le bloc STATUS se transforme :

```
┌────────────────────────────────────────────────────────────────────────────┐
│ STATUS · DIMANCHE                                                          │
│                                                                            │
│ Semaine 22 terminée. 18 trades, +4.2R cumul.                               │
│ Ton Weekly Report sera envoyé ce soir 20h.                                 │
│                                                                            │
│  [ Démarrer ma revue hebdo ]                                               │
└────────────────────────────────────────────────────────────────────────────┘
```

## Anatomie des composants

### Bloc STATUS (sticky en haut)

État dynamique, calculé serveur :

| Situation | Message | CTA primaire |
|---|---|---|
| Trades non journalisés détectés | *"Tu as N trades non journalisés depuis ton dernier import."* | `Saisir un trade` + `Importer CSV` |
| Tous trades à jour, journée en cours | *"À jour. Reviens ce soir pour boucler la séance."* | `Saisir un trade` (ghost) |
| Pas de trade aujourd'hui (lun-ven) | *"Aucun trade aujourd'hui. Repos délibéré ?"* | `Marquer journée sans trade` |
| Dimanche, semaine non revue | *"Semaine X terminée. Démarrer ta revue hebdo."* | `Démarrer ma revue hebdo` |
| Dimanche, semaine déjà revue | *"Revue de la semaine X complétée. Bonne soirée."* | aucun |

### KPI Strip

4 cellules, fond `#0a0a0a`, séparateur `gap-px` blanc 4%.

| Cellule | Source | Format |
|---|---|---|
| TRADES DU JOUR | count trades journalisés date = today | `4` + sub-label `(2 long, 2 short)` |
| R RÉALISÉ | sum R des trades clôturés today | `+1.2R` vert si positif, rouge si négatif |
| CONFORMITÉ PLAN | % trades flag "Conforme" today | `75%` + sub-label `(3/4 conformes)` |
| TEMPS ÉCRAN | session active app today (tracking passif) | `2h14` muted, info "discipline" |

Pas plus de 4 KPI. Si rien à afficher (zero trade) : ligne `—` partout.

### Bloc PRÉ-SÉANCE (collapse-able)

Saisie quotidienne 15 sec, alimente les analytics comportementaux.
- Champ État : 4 boutons mutuellement exclusifs
- Champ Sommeil : input nombre + label `h`
- Champ Note libre : 140 caractères max (Twitter-like, force la concision)
- Collapsé par défaut une fois soumis
- Si la journée est déjà entamée et que ce bloc est vide à 18h → rappel discret dans STATUS *"N'oublie pas ton check pré-séance demain matin"*

### Bloc DERNIERS TRADES (3 lignes max)

Aperçu rapide. Clic sur une ligne ouvre le drawer détail trade (cf. wireframe 02).

Colonnes : heure · instrument · direction · R · setup · conformité.

## Flow : drawer de saisie rapide d'un trade

Ouvert par `[N]` (raccourci ou bouton). Drawer latéral droit, 720px desktop.

```
┌────────────────────────── DRAWER · NOUVEAU TRADE · ESC ferme ─────────┐
│                                                                       │
│ INSTRUMENT                                                            │
│ [ US30______________________ ▾ ]   autocomplete                       │
│                                                                       │
│ DIRECTION                                                             │
│ [  LONG  ]  [  SHORT  ]    1 tap, mutex                               │
│                                                                       │
│ SETUP                                                                 │
│ [ Breakout NY open ▾ ]   dropdown depuis plan de trading              │
│                                                                       │
│ CONFORMITÉ PLAN                                                       │
│ [ ✓ Conforme ] [ ~ Partiel ] [ ✗ Hors plan ]                          │
│                                                                       │
│ ──────────────────────────────────────────────────────────────────    │
│  Champs auto remplis à l'import CSV : entrée, sortie, taille, P&L,    │
│  durée, slippage. Saisie manuelle possible ↓                          │
│ ──────────────────────────────────────────────────────────────────    │
│                                                                       │
│ ▾ Détails d'exécution      (replié par défaut si CSV présent)         │
│ ▾ Tags comportement        (multi-select, max 3)                      │
│ ▾ Note libre               (280 char)                                 │
│ ▾ Capture chart            (drag & drop, optionnel)                   │
│ ▾ Émotion ressentie        (slider 1-5)                               │
│                                                                       │
│                                            [ Annuler ] [ Enregistrer ]│
└───────────────────────────────────────────────────────────────────────┘
```

**Règle d'or :** un trade peut être enregistré avec uniquement les 4 champs du haut. Le reste est optionnel. Pas de validation bloquante sur les champs comportement.

## États

### Vide (jamais journalisé)
```
┌──────────────────────────────────────────────────────────┐
│  Bienvenue.                                              │
│                                                          │
│  Pour commencer, importe l'historique de ton broker      │
│  ou saisis ton premier trade manuellement.               │
│                                                          │
│  [ Importer CSV ]   [ Saisir mon premier trade ]         │
│                                                          │
│  Tu n'as pas encore de plan de trading ?                 │
│  → Configurer mon plan de trading                        │
└──────────────────────────────────────────────────────────┘
```

### Chargement
Skeleton des 3 blocs (STATUS, KPI Strip, DERNIERS TRADES). Pas de spinner.

### Erreur d'import
Bandeau rouge discret au-dessus du bloc STATUS :
*"Erreur lors du dernier import (12 lignes non parsées). Voir le détail."* + lien.

## Notes design

- **Cet écran ne montre jamais le P&L cumul du compte.** Le solde et l'equity ne sont pas l'angle. C'est dans Performance → Equity curve, sur demande explicite.
- **Le bloc PRÉ-SÉANCE est optionnel** : forcer sa saisie tuerait la promesse "pas de friction". Mais on incite via le rappel discret.
- **Le STATUS est calculé serveur** : c'est lui qui pilote la conversion en revue dominicale (ancre de rétention).
- **Pas de "widget de news" ou de "calendrier économique" ici.** Hors-scope verrouillé.
- **L'écran tient en 1 viewport desktop** sans scroll (au-dessus de la ligne de flottaison à 1080p). Si on ajoute un bloc, on retire un autre.
