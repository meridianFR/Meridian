# 03 — Charte rédactionnelle du Weekly Behavioral Report

## Rôle

Le Weekly Behavioral Report est **l'ancre de rétention** du Meridian Journal. Envoyé chaque dimanche à 20h, c'est le moment où le client repense au produit. Si le report manque, le produit manque.

Ce n'est **pas un dashboard de plus**. C'est un email narratif, lisible en 3 minutes, qui transforme la donnée brute de la semaine en une lecture et une question.

### Double usage de cette charte

1. **Phase manuelle (30 premiers abonnés)** — Tu écris chaque report à la main. Cette charte est ton gabarit rédactionnel.
2. **Phase IA (à partir de ~30 abonnés)** — La section "Prompt système" plus bas devient le prompt Claude API. Le ton, la structure et les garde-fous sont identiques.

---

## Structure — 5 mouvements

Réutilise le canevas Manifesto Meridian (5 mouvements). Toujours dans cet ordre. Jamais plus de 5.

| # | Mouvement | Longueur | Contenu |
|---|---|---|---|
| 1 | **Ce qui s'est passé** | 2-3 phrases | 3 chiffres clés de la semaine, factuels |
| 2 | **Ce qui a marché** | 2-4 phrases | 1 seul pattern positif, chiffré |
| 3 | **Ce qui n'a pas marché** | 3-5 phrases | 1 seule erreur récurrente, chiffrée, contextualisée |
| 4 | **Une hypothèse** | 2-4 phrases | 1 hypothèse explicative, jamais une certitude |
| 5 | **Une question pour ta revue** | 2-3 phrases | 1 question ouverte, opérationnelle, qui ne juge pas |

**Règle d'or :** un seul sujet par mouvement. Si tu veux parler de 2 erreurs, tu choisis la plus coûteuse. La concision est ce qui rend le report lu jusqu'au bout.

---

## Règles de ton (les 8 règles appliquées au report)

1. **Pas d'émojis.** Aucun.
2. **Pas de point d'exclamation.** Aucun dans le report (la règle "max 1/newsletter" ne s'applique pas ici : zéro).
3. **Chiffres avant adjectifs.** "5 trades sur 6 gagnants" jamais "une super semaine".
4. **Tutoiement.** Toujours.
5. **Verbes concrets.** Mesurer, couper, tenir, attendre. Jamais transformer/débloquer/révolutionner.
6. **Pas d'all-caps.** Pas de "ÉNORME PROGRÈS".
7. **Quant senior, pas coach.** Pas de "bravo", "champion", "tu gères". Constat, pas applaudissement.
8. **Calme, lucide, précis.** La vérité même quand elle déçoit. Une semaine à -6R se dit clairement.

### Règle absolue de données
- **R uniquement, jamais €.** Pas un seul montant en euros dans le report.
- **Pas de prédiction marché.** Jamais "le marché devrait", "attends-toi à".
- **Pas de recommandation de trade.** Jamais "achète", "vends", "évite EURUSD".
- **Pas de jugement moral.** "Tu coupes tes gagnants trop tôt" (constat) ≠ "tu manques de discipline" (jugement).

---

## Exemple complet — CONFORME

> **Objet :** Ta semaine 21 — +4.2R, et une question sur tes sorties
>
> Salut Thomas,
>
> Voici ta semaine, en chiffres et en lecture.
>
> **Ce qui s'est passé**
> 18 trades. +4.2R cumulés. Winrate 56%. Conformité au plan : 78%, ton meilleur score depuis cinq semaines.
>
> **Ce qui a marché**
> Ton setup Breakout NY open. 6 trades, 5 gagnants, +3.8R à lui seul — soit l'essentiel de ta performance de la semaine. Tu l'as joué dans la zone d'entrée, sans chasser le prix.
>
> **Ce qui n'a pas marché**
> Tes sorties prématurées. Quatre trades taggés "sortie prématurée" cette semaine. Sur ces quatre, le TP a été touché ensuite trois fois. Manque à gagner estimé : +2.4R. Tu coupes tes gagnants tôt — pas tes perdants.
>
> **Une hypothèse**
> Tu sembles sortir quand le trade est déjà confortablement en profit, comme pour sécuriser. C'est le réflexe inverse de celui qui te fait parfois tenir un perdant. Les deux viennent peut-être du même endroit : l'inconfort face à l'incertitude.
>
> **Une question pour ta revue**
> Que se passerait-il si tu laissais tes trois prochains Breakout NY open aller jusqu'au TP sans intervenir ? Note ce que tu ressens à chaque fois. On en reparle dimanche.
>
> Bonne semaine,
> Meridian

### Pourquoi cet exemple est conforme
- 3 chiffres dans le mouvement 1, pas 10
- 1 seul pattern positif, chiffré (+3.8R)
- 1 seule erreur, chiffrée (+2.4R manqués), contextualisée (touche le tag `Sortie prématurée`)
- L'hypothèse est formulée avec "semble", "peut-être" — jamais affirmée
- La question est opérationnelle (un test concret la semaine suivante), ouverte, sans jugement
- R partout, zéro €, zéro émoji, zéro exclamation

---

## Exemple — NON CONFORME (à ne jamais produire)

> **Objet :** 🚀 GROSSE semaine Thomas ! +850€ !!!
>
> Bravo champion ! Quelle performance cette semaine, tu déchires !
> Tu as fait +850€, soit +12% sur ton compte. À ce rythme tu doubles ton capital en 2 mois.
> Le marché va rester haussier la semaine prochaine, profites-en pour charger sur le US30.
> Continue comme ça, tu es sur la bonne voie pour devenir un trader rentable. 💪📈
>
> Allez, on lâche rien !

### Pourquoi c'est banni — point par point
| Problème | Règle violée |
|---|---|
| Émojis 🚀💪📈 | Règle 1 |
| Exclamations multiples | Règle 2 |
| "GROSSE", "champion", "tu déchires" | Règles 6, 7 |
| Montant en € (+850€) | Règle absolue données |
| Projection "doubles ton capital en 2 mois" | Promesse de gain (interdit marque) |
| "Le marché va rester haussier" | Prédiction marché (interdit) |
| "charge sur le US30" | Recommandation de trade (interdit) |
| Aucune donnée comportementale, aucune question | Vide l'objet même du report |

---

## Données disponibles en entrée

Le report s'appuie sur les données agrégées de la semaine, déjà calculées par le moteur d'analytics :

```
SemaineData {
  trades_count
  r_cumul, winrate, profit_factor, max_dd_semaine
  conformite_pct, conformite_pct_4_dernieres_semaines
  best_setup { nom, n, winrate, r_cumul }
  worst_setup { nom, n, winrate, r_cumul }
  top_tags [ { tag, count, r_impact_moyen, r_impact_cumul, pattern_temporel } ]
  comparaison_semaine_precedente { delta_r, delta_conformite }
  jours_non_journalises
  emotion_moyenne
  revue_hebdo_user { reussite, erreur, best_setup, regle_durcie, score_discipline }
}
```

La **revue hebdo de l'utilisateur** (écran 05) est intégrée si elle a été faite : le report peut rebondir dessus ("Tu as identifié X en revue ; les chiffres le confirment").

---

## Sélection du sujet de chaque mouvement (logique)

Pour la phase manuelle ET le futur prompt, voici comment choisir :

| Mouvement | Règle de sélection |
|---|---|
| **Ce qui a marché** | Le setup avec le meilleur `r_cumul` positif sur la semaine (n≥2). Si aucune semaine positive : le comportement le plus discipliné (ex. conformité en hausse). |
| **Ce qui n'a pas marché** | Le tag avec le `coût net` le plus élevé (count × \|r_impact_moyen\|). Si aucun tag : le setup le plus négatif, ou la baisse de conformité. |
| **Hypothèse** | Relier l'erreur du mouvement 3 à un contexte (heure, émotion, enchaînement de pertes). Toujours formulée comme hypothèse. |
| **Question** | Dériver de l'hypothèse un micro-test concret réalisable la semaine suivante. |

### Cas particuliers
- **Semaine négative (-R) :** ne pas enrober. "Semaine à -3.8R" dit clairement, puis chercher le signal d'apprentissage. Le persona déteste qu'on lui mente.
- **Semaine sans trade :** report court. "Aucun trade cette semaine. Repos délibéré ou absence de setup ? Note-le, c'est une donnée." Pas de remplissage.
- **Première semaine (peu de données) :** report d'accueil, expliquer ce qui viendra quand il y aura plus de trades. Honnête sur le manque de recul statistique.

---

## Workflow phase manuelle (30 premiers abonnés)

1. **Dimanche 16h** — Le moteur génère le `SemaineData` de chaque abonné actif, listé dans un back-office simple
2. **16h-19h** — Tu rédiges chaque report (gabarit pré-rempli avec les chiffres, tu écris la lecture). Cible : 8-12 min par report → 30 reports = ~5h. À 30 abonnés c'est le plafond du manuel.
3. **19h30** — Relecture rapide (checklist ton ci-dessous)
4. **20h00** — Envoi groupé via Resend (programmé)

### Checklist avant envoi (chaque report)
- [ ] Zéro émoji, zéro point d'exclamation
- [ ] Zéro montant en €
- [ ] Zéro prédiction marché, zéro reco de trade
- [ ] 1 seul sujet par mouvement
- [ ] La question finale est ouverte et testable
- [ ] Le prénom est correct
- [ ] Si semaine négative : dite franchement, pas enrobée

### Bascule manuel → IA
- À 30 abonnés : Claude API génère, **tu valides chaque report avant envoi** (review systématique)
- Bascule full auto uniquement après **50 reports IA consécutifs** sans correction nécessaire
- Garder un échantillon de review (1/10) même en full auto

---

## Prompt système (futur — Claude API)

À utiliser tel quel quand on bascule en génération assistée. Variables injectées entre `{{ }}`.

```
Tu rédiges le Weekly Behavioral Report hebdomadaire de Meridian Journal,
un journal de trading pour traders particuliers francophones.

DESTINATAIRE : {{prenom}}, trader actif sur indices/forex/CFD.

TON — règles non négociables :
- Tutoiement. Français.
- Aucun émoji. Aucun point d'exclamation.
- Calme, factuel, lucide. Tu es un quant senior, pas un coach.
- Chiffres avant adjectifs. Phrases courtes.
- Jamais de jugement moral, uniquement des constats.

INTERDICTIONS ABSOLUES :
- Aucun montant en euros. Tout en R (multiple de risque).
- Aucune prédiction de marché.
- Aucune recommandation de trade (acheter/vendre/éviter un instrument).
- Aucune promesse de gain ou projection de capital.

STRUCTURE — exactement 5 mouvements, dans cet ordre, titrés :
1. Ce qui s'est passé — 3 chiffres clés (2-3 phrases)
2. Ce qui a marché — 1 seul pattern positif chiffré (2-4 phrases)
3. Ce qui n'a pas marché — 1 seule erreur chiffrée et contextualisée (3-5 phrases)
4. Une hypothèse — explicative, formulée comme hypothèse ("semble", "peut-être") (2-4 phrases)
5. Une question pour ta revue — ouverte, testable la semaine suivante, sans jugement (2-3 phrases)

LONGUEUR TOTALE : 180-260 mots. Objet d'email court incluant le R cumul de la semaine.

Si la semaine est négative : dis-le clairement, ne l'enrobe pas.
Si aucun trade : report court, pas de remplissage.

DONNÉES DE LA SEMAINE :
{{semaine_data_json}}

REVUE DE L'UTILISATEUR (si présente) :
{{revue_hebdo_json}}

Rédige le report.
```

### Garde-fous techniques IA
- **Validateur post-génération** : regex/règles qui rejettent un report contenant `€`, `$`, un émoji (plage Unicode), un `!`, ou les mots interdits (`achète`, `vends`, `garanti`, `va monter`, `va baisser`). Report rejeté → fallback gabarit déterministe ou file de review humaine.
- **Température basse** (0.4-0.6) pour limiter la créativité hasardeuse
- **Pas d'accès marché** : le modèle ne reçoit que les données du compte, aucune donnée de prix temps réel
- **Log + échantillonnage** : 1 report sur 10 lu manuellement en permanence, même en régime full auto

---

## Format d'envoi

- **Email HTML sobre** : fond clair OU sombre selon préférence (mais cohérent charte — noir #000 si dark). Texte, pas d'image lourde. Logo Meridian en en-tête.
- **Pas de tracking pixel agressif** (ouverture OK pour métrique rétention, pas de heatmap intrusive)
- **Lien unique** en bas : "Voir cette semaine dans ton journal →" vers écran 05
- **Archivé** dans l'app (écran 05), consultable et re-téléchargeable en PDF
- **Expéditeur** : `meridian@meridian.app`, nom "Meridian", reply-to actif (un humain lit les réponses — signal de rétention fort)
