# 05 — Revue

## Objectif
Centre de la pratique hebdomadaire. Concrétise le framework A.04 (Protocole de revue hebdo) directement dans le produit, et archive les Weekly Behavioral Reports envoyés par mail.

## Question utilisateur
*"Qu'est-ce que je dois retenir / ajuster cette semaine ?"*

## Wireframe — état standard

```
┌────────────────────────────────────────────────────────────────────────────┐
│  05 — REVUE                                                                │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ SEMAINE EN COURS · S22 · 27 mai → 02 juin 2026                         │ │
│ │                                                                        │ │
│ │   Tu n'as pas encore fait ta revue de cette semaine.                   │ │
│ │   Le Weekly Report sera envoyé dimanche 02 juin à 20h.                 │ │
│ │                                                                        │ │
│ │   [ Démarrer ma revue hebdo ]                                          │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ ARCHIVE DES WEEKLY REPORTS                                             │ │
│ │                                                                        │ │
│ │ SEMAINE     PÉRIODE              R CUMUL  CONFORM.  STATUT             │ │
│ │ ─────────   ───────────────      ───────  ────────  ──────────         │ │
│ │ S21         20–26 mai 2026       +4.2R     78%      Reçu · ouvert      │ │
│ │ S20         13–19 mai 2026       +1.1R     71%      Reçu · ouvert      │ │
│ │ S19         06–12 mai 2026       -2.3R     54%      Reçu · ouvert      │ │
│ │ S18         29 avr–05 mai 2026   +6.8R     85%      Reçu                │ │
│ │ S17         22–28 avril 2026     +0.4R     62%      Reçu                │ │
│ │                                                                        │ │
│ │                                                          Tout voir →   │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ REVUE MENSUELLE                                                        │ │
│ │                                                                        │ │
│ │ Prochain rendez-vous : dimanche 02 juin 2026 (1er dim. du mois)        │ │
│ │ Format étendu : 30 min. Tu reverras tes 4 dernières semaines.          │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

## Flow — drawer "Démarrer ma revue hebdo"

Guide structuré en 6 étapes (framework A.04). Pleine largeur, pas drawer — on prend tout l'écran pour focaliser.

```
┌─────────────── REVUE HEBDOMADAIRE · S22 · ÉTAPE 1 / 6 ─────────── ESC ──┐
│                                                                         │
│  Étape 1 — Réussite chiffrée de la semaine                              │
│                                                                         │
│  Tes chiffres :                                                         │
│     18 trades · +4.2R cumul · winrate 56% · conformité 78%              │
│                                                                         │
│  Quelle est TA réussite chiffrée à retenir ?                            │
│  (Une seule.)                                                           │
│                                                                         │
│  [_____________________________________________________________]       │
│                                                                         │
│  Exemple : "11 jours consécutifs de conformité au plan."                │
│                                                                         │
│                                                       [ Suivant → ]     │
│                                                                         │
│  ●○○○○○   1/6                                                            │
└─────────────────────────────────────────────────────────────────────────┘
```

### Les 6 étapes (framework A.04)

| # | Question | Données affichées | Saisie |
|---|---|---|---|
| 1 | Réussite chiffrée à retenir | KPI hebdo | 1 phrase libre |
| 2 | Erreur la plus coûteuse | Top 3 erreurs Meridian Edge | 1 phrase libre (auto-suggérée éditable) |
| 3 | Setup le plus performant | Vue Par setup | dropdown préfilled |
| 4 | Règle à durcir la semaine prochaine | Règles du plan de trading actuel | dropdown + commentaire |
| 5 | Règle à assouplir (optionnel) | Idem | dropdown + commentaire |
| 6 | Score discipline /10 | Heatmap conformité du mois | slider 0–10 + note libre |

### Final de la revue

Écran de récap :
```
┌─────────────── REVUE S22 · SYNTHÈSE ───────────────┐
│                                                    │
│  Voici ta revue archivée.                          │
│                                                    │
│  Réussite        11 jours de conformité d'affilée  │
│  Erreur          revenge trade après loss          │
│  Best setup      Breakout NY open                  │
│  Règle durcie    pas plus de 2 trades / heure      │
│  Règle assouplie -                                 │
│  Discipline      7/10                              │
│                                                    │
│  Ton Weekly Report intégrera cette revue.          │
│                                                    │
│  [ Télécharger en PDF ]    [ Fermer ]              │
└────────────────────────────────────────────────────┘
```

## Drawer "Lire un Weekly Report archivé"

Clic sur une ligne d'archive → drawer ou modale plein écran contenant le report tel qu'envoyé par mail (rendu HTML clean, pas d'image).

Structure du report (cf. spec étape 03) :
1. Ce qui s'est passé (3 chiffres)
2. Ce qui a marché (1 pattern)
3. Ce qui n'a pas marché (1 erreur)
4. Hypothèse (1)
5. Question ouverte (1)

Boutons en bas : `[ Renvoyer par mail ]` `[ Télécharger PDF ]`.

## États

### Vide (1ère semaine)
*"Ton premier Weekly Report sera envoyé dimanche soir. D'ici là, continue de journaliser."*

### Manquement (semaine non revue à mercredi suivant)
Bandeau discret : *"Tu n'as pas revu la semaine 21. [Faire la revue maintenant]"*

## Notes design

- **Pas de gamification "streak de revues"** : moralisation déguisée, contraire au persona. La revue est un outil, pas un score.
- **Le drawer revue est un flow forcé, pas un formulaire libre.** L'utilisateur ne peut pas tout remplir d'un coup. Une étape = une question = un focus.
- **Pas de chronomètre Pomodoro intégré.** Hors-scope.
- **Les revues peuvent être faites en retard** (jusqu'au dim. suivant), mais sont datées de leur semaine de rattachement.
- **L'export PDF** est important : certains traders prop firm doivent fournir un dossier hebdo à leur risk manager. Format A4 sobre.
- **Pas d'historique des revues mensuelles V1** (volume insuffisant, on les regénère depuis les revues hebdo Y2).
