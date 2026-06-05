# 02 — Taxonomie des 12 tags comportement V1

## Principe

Les tags comportement servent à **étiqueter les écarts entre ce que le trader voulait faire et ce qu'il a fait**. C'est la matière première du module Meridian Edge (écran 04) et du Weekly Behavioral Report.

### Pourquoi une liste fermée V1

| Raison | Conséquence |
|---|---|
| **Statistiques exploitables** | 1 200 utilisateurs taggant librement = 1 200 vocabulaires. Impossible d'agréger ou de comparer. |
| **Friction d'entrée minimisée** | Dropdown 12 items > champ libre où il faut "trouver le bon mot" |
| **Vocabulaire commun** | Le Weekly Report peut citer les tags par leur nom officiel sans paraphraser |
| **Couverture suffisante** | Validation persona : 12 tags couvrent ~85% des erreurs récurrentes des traders particuliers actifs |
| **Roadmap claire V2** | Tags custom + taxonomie partagée arrivent quand on a 100 clients et des données réelles d'usage |

### Règles d'usage dans l'UI

- Multi-select **jusqu'à 3 tags par trade** (au-delà, l'analyse devient floue)
- Optionnel — un trade peut n'avoir aucun tag (cas "exécution propre")
- Présent dans le drawer de saisie (section pliable) et le drawer détail trade
- Modifiable à tout moment après la saisie initiale

---

## Les 12 tags V1

Organisés en 3 catégories. Chaque tag a un **nom court** (affichage UI), une **définition factuelle**, des **critères de déclenchement** (ce qui rend le tag applicable), et un **exemple concret**.

### A — ENTRÉE (5 tags)

#### 1. `FOMO`
**Définition.** Entrée déclenchée par la peur de manquer le mouvement, sur un prix déjà bien éloigné du point d'entrée optimal du setup.
**Critères.** Le trader reconnaît avoir entré "tard". L'entrée est éloignée de plus de 50% de la range du setup attendu.
**Exemple.** Breakout NY open visé à 42 300 ; entrée à 42 380 après que le prix soit déjà parti. SL trop éloigné ou R/R dégradé.

#### 2. `Revenge`
**Définition.** Trade pris dans les minutes/heures qui suivent une perte, dans l'intention (consciente ou non) de "se refaire".
**Critères.** Trade pris <60 min après une perte de >0.8R, et hors fenêtre habituelle de trading OU sur instrument non-coeur OU setup non-prioritaire.
**Exemple.** Stop loss touché à 14h12 sur US30. À 14h28, entrée sur EURUSD malgré aucun setup planifié.

#### 3. `Hors plan`
**Définition.** Setup utilisé n'est pas dans la liste des setups autorisés par ton plan de trading.
**Critères.** Le champ "Setup" est marqué `Hors plan` ou ne correspond pas à un setup déclaré dans la config.
**Exemple.** Plan autorise Breakout, Trend pullback, Mean reversion. Trade pris sur "Fade NY high" non listé.

#### 4. `Overtrading`
**Définition.** Trade forcé en l'absence d'un signal clair, par ennui ou pression de "faire le chiffre".
**Critères.** Signal subjectif (le trader reconnaît avoir cherché un setup au lieu de le voir). Ou objectif : >N trades/jour où N = règle plan (ex. 3).
**Exemple.** Plan autorise 3 trades/jour max. 5ème trade pris dans la dernière heure de session.

#### 5. `Surtaille`
**Définition.** Taille de position supérieure au risque par trade défini dans le plan.
**Critères.** R risqué > règle plan (par ex. plan = 1%, trade pris à 1.8%).
**Exemple.** Plan = 1% par trade. Lot ouvert qui implique 2.3% de risque sur le SL initial.

---

### B — GESTION EN TRADE (4 tags)

#### 6. `Sortie prématurée`
**Définition.** Fermeture du trade avant le TP planifié, sans signal technique justifiant la sortie.
**Critères.** Sortie >30% avant TP planifié, sans invalidation du setup, sans news majeure intermédiaire.
**Exemple.** TP à +2R prévu, sortie à +0.4R par peur de voir le profit s'éroder. Le prix touche le TP 12 min plus tard.

#### 7. `SL déplacé`
**Définition.** Stop loss reculé (élargi) contre la position en cours de trade.
**Critères.** Modification du SL dans le sens défavorable au trade après ouverture.
**Exemple.** SL initial à 42 280, prix descend à 42 285, SL reculé à 42 250 pour "donner de l'air".

#### 8. `Position traînée`
**Définition.** Position maintenue ouverte alors que le SL initial a été techniquement atteint ou que l'invalidation du setup s'est produite.
**Critères.** Le prix a touché le SL initial mais le trade reste ouvert (SL annulé ou jamais placé techniquement).
**Exemple.** SL mental à 42 280. Prix descend à 42 270. Trade maintenu "en attendant le retournement". Sortie finale à -3.2R.

#### 9. `BE prématuré`
**Définition.** Trail du stop loss au point d'entrée (break-even) trop tôt dans la vie du trade, ce qui le sort sur un retracement normal alors qu'il aurait atteint son TP.
**Critères.** SL trail à BE avant que le prix n'ait parcouru au moins 1R. Sortie BE puis TP touché ensuite.
**Exemple.** Entrée à 42 300, TP à 42 400 (+1R réel). SL trail à BE à 42 310. Pullback à 42 299 sort le trade. TP touché 8 min après.

---

### C — CONTEXTE / DISCIPLINE (3 tags)

#### 10. `News`
**Définition.** Trade pris pendant ou immédiatement avant une publication économique interdite par le plan (ex. NFP, FOMC, CPI).
**Critères.** Trade ouvert dans la fenêtre +/-15 min autour d'une news majeure listée dans le plan comme bloquante.
**Exemple.** Plan interdit trading 15 min avant/après NFP. Trade pris à 14h27 avant NFP de 14h30.

#### 11. `Tilt`
**Définition.** Trade pris dans un état émotionnel reconnu comme dégradé (frustration, panique, euphorie excessive) au moment de l'entrée.
**Critères.** Champ "Émotion" pré-séance ou post-trade marqué ≥4 (tendu / paniqué) — auto-suggéré comme tag candidat.
**Exemple.** Après 3 pertes consécutives, le trader sait être "remonté" mais reprend une position 20 min plus tard.

#### 12. `Hésitation`
**Définition.** Setup valide identifié mais entrée différée par doute. Soit le trade est manqué (à journaliser quand même comme "trade manqué"), soit entrée tardive avec R/R dégradé.
**Critères.** Trader reconnaît l'hésitation. Distinct de FOMO : ici le setup était présent et visible, ce n'est pas une chasse au prix mais un blocage psychologique.
**Exemple.** Breakout US30 net à 9h47, hésitation 8 min, entrée à 9h55 avec un R/R passé de 1:2 à 1:1.

---

## Mapping aux analytics

Chaque tag alimente le module Comportement (écran 04) via :

| Calcul | Description |
|---|---|
| **Count par tag** | Nombre de trades portant ce tag sur la période |
| **R impact moyen** | R moyen des trades portant ce tag (signé) |
| **R impact cumulé** | Somme des R des trades portant ce tag |
| **Coût net** | (R impact moyen × count) — utilisé pour ordonner le Top 3 |
| **Pattern temporel** | Détection auto : heure / jour / contexte d'apparition (ex. *"survient surtout après 14h"*) |

### Tags qui activent une règle d'insight auto

| Tag | Règle d'insight déclenchée |
|---|---|
| `Revenge` | Si ≥3 occurrences sur le mois → flag dans Insights *"Revenge trade détecté X fois, coût Y R"* |
| `Hors plan` | Si ≥10% des trades → *"X% de tes trades sont hors plan, expectancy Y R"* |
| `Surtaille` | Si ≥1 occurrence → flag rouge prop firm (`Risque règle prop firm`) |
| `Tilt` | Si ≥2 occurrences/semaine → suggestion dans Weekly Report d'examiner le sommeil/stress |
| `BE prématuré` | Si ratio (sortie BE puis TP touché) ≥30% → *"Tu sors X% du temps à BE alors que le TP est touché ensuite"* |

---

## Couverture vs cas non couverts

### Ce que les 12 tags couvrent
- Toutes les erreurs d'entrée impulsive (FOMO, revenge, overtrading, hors plan)
- Toutes les erreurs de gestion classiques (sortie tôt, SL déplacé, traîné, BE)
- Risk management (Surtaille)
- Contexte (news, tilt, hésitation)

### Ce qui n'est PAS un tag V1 (décisions explicites)

| Idée écartée | Raison |
|---|---|
| `Slippage broker` | Pas une erreur trader, c'est un fait. Mesuré ailleurs. |
| `Mauvais R/R` | Couvert indirectement par Hors plan + Surtaille |
| `News non vue` | Pas un comportement, un défaut de préparation. À traiter dans Plan de trading. |
| `Stratégie échouée` | Pas un comportement. Le statut auto setup (Performance) gère. |
| `Mauvais timing entrée` | Trop subjectif. FOMO + Hésitation couvrent les cas actionnables. |
| `Mauvais instrument` | Couvert par Hors plan. |
| `Manque de patience` | Reformulé → c'est FOMO ou Overtrading. |
| `Greed` / `Fear` | Émotions, pas comportements. Capturées par le slider Émotion 1-5. |

---

## Roadmap V2 (verrouillé à activer Y2 si demande)

- **Tags custom utilisateur** — jusqu'à 5 tags propres par compte, propagés en analytics personnels
- **Taxonomie partagée optionnelle** — opt-in pour publier les tags custom utiles aux autres users
- **Tags pour trades manqués** — `Trade manqué - hésitation`, `Trade manqué - hors fenêtre` (capture la perte d'opportunité)
- **Tags positifs** — `Exécution propre`, `Bonne gestion`, etc. (V1 = uniquement tags d'erreur, le défaut étant "pas d'erreur")

### Décision V1 — uniquement tags négatifs

**Why.** Les tags positifs gonflent artificiellement le sentiment de progrès et diluent la lisibilité du Top 3 erreurs. L'absence de tag négatif = trade propre. Plus simple, plus honnête.
**How to apply.** Ne pas céder à la pression utilisateur "ajouter Exécution propre" avant d'avoir 6 mois de données V1.

---

## Localisation

Tags rédigés en **français**, conformément au lancement FR. Pas de version EN V1 (extension EN = candidat Y2 selon décisions verrouillées).

Le tag `FOMO` reste en anglais car c'est le terme largement employé en français trading. Tous les autres sont francisés.

---

## Source

Cette taxonomie est dérivée de :
- 8 retours d'expérience trader actifs (forums FR, Reddit r/Trading_FR, Twitter FR)
- Recoupement avec littérature trading (Steenbarger, Kiev, Tharp)
- Cohérence avec frameworks Meridian existants : A.03 Checklist pré-trade, C.01 Gérer le tilt, A.02 Plan de trading

À ré-évaluer après 30 abonnés payants : les tags réellement utilisés (>5% des trades) gardent. Tags utilisés <2% : revus à 50 abonnés.
