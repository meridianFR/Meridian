# 05 — Spec page marketing `/journal`

## Rôle dans le funnel

Page de l'étape **INTENTION** (2-5% des visiteurs). Cible : un visiteur qui a déjà lu 1-2 frameworks ou reçu la newsletter, et qui envisage de payer. Objectif : convertir en **Starter Bundle 49€** ou **Journal 19€/mois**.

Ce n'est pas une page que les nouveaux visiteurs voient en premier (eux atterrissent sur un outil gratuit ou un framework). C'est une page de décision.

### Règles marketing (verrouillées)
- **Jamais de montant € associé à une perf.** Pas de "+1 200€", pas de capture broker avec solde.
- Screenshots dashboard en **données anonymisées et en R**.
- **Pas d'urgence artificielle** ("plus que 24h", "places limitées").
- **Pas de pop-up**, pas d'exit-intent.
- Témoignages **texte seul, factuels, jamais de montants**.
- Inclure une FAQ honnête avec **"Pour qui ce n'est PAS"**.

---

## Conventions techniques (réutiliser l'existant)

Cohérence avec la home (`app/page.tsx`). Réutiliser :

| Élément | Classe / composant existant |
|---|---|
| Conteneur | `max-w-wrap mx-auto px-6 sm:px-10` |
| Titre hero | `h-title` + `.shimmer` sur le mot-clé |
| Eyebrow | `mono text-[10px] uppercase tracking-[0.4em] text-ink-faint` préfixé `°` |
| Texte secondaire | `text-ink-mute` / `text-ink-muted` / `text-ink-faint` |
| CTA primaire | `btn btn-primary` |
| CTA ghost | `btn btn-ghost` |
| Carte premium | `glow-border rounded-2xl` |
| Grille bordée | `grid gap-px bg-border rounded-2xl overflow-hidden border border-border` (cellules `bg-black`) |
| Apparition scroll | `<Reveal>` / `<Reveal delay={n}>` |
| Ambiance | `<AmbientOrbs />` (hero only) |
| Nav / Footer | `components/nav.tsx`, `components/footer.tsx` (déjà globaux) |

Route : `app/journal/page.tsx`. Ajouter l'entrée "Journal" dans `components/nav.tsx`.

---

## Structure de la page (sections, dans l'ordre)

### 1. Hero

```
° MERIDIAN JOURNAL

Trade ce que tu mesures.
[shimmer: Mesure ce que tu trades.]

Le journal qui transforme ton historique de trades en décisions :
quel setup garder, quelle erreur te coûte le plus, à quelle heure tu
détruis ton edge. Pas un track record de plus.

[ Essayer — 19€/mois ]   [ Voir une démo ]

(sous les CTA, en mono petit :)
Import MT4 / MT5 · Weekly Report comportemental · sans engagement
```

À droite ou dessous : visuel de l'écran **Comportement** (le différenciant), anonymisé, données en R. Encadré `glow-border`.

### 2. Le problème (accroche persona)

Eyebrow `° Le problème`. Titre : *"Ton journal actuel te dit que tu as perdu. Pas pourquoi."*

3 colonnes (grille bordée) :

| L'Excel | Le track record broker | Les journaux à 40 champs |
|---|---|---|
| Tu remplis, tu ne relis jamais. Aucune lecture. | Une courbe d'equity. Zéro analyse comportementale. | Tu abandonnes au bout de 8 trades. Trop de friction. |

Phrase de bascule : *"Le problème n'est pas le manque de données. C'est l'absence de lecture."*

### 3. Les 3 piliers du Journal

Eyebrow `° Ce que fait Meridian Journal`. Réutiliser le pattern `pillar-card` de la home.

| 01 — Tracking | 02 — Comportement | 03 — Stratégie |
|---|---|---|
| PnL, winrate, expectancy, drawdown. En R par défaut. Import broker en 30 secondes. | Tes erreurs récurrentes, chiffrées. Ce que le revenge trade te coûte. Tes heures destructrices. | Quel setup prioriser, lequel retirer. Un statut clair, pas juste des chiffres. |

### 4. Démo — l'écran Comportement (la preuve)

Eyebrow `° La différence`. Titre : *"Ton journal devrait te dire quoi arrêter de faire."*

Screenshot annoté (GIF court 5-10s autorisé) de l'écran 04, anonymisé :
- Le bloc "Tes 3 erreurs récurrentes" (revenge trade -11.2R, etc.)
- La heatmap conformité
- Un insight auto

Légende : *"Capture d'un compte de démonstration. Données en R, anonymisées."*

### 5. Le Weekly Behavioral Report

Eyebrow `° Chaque dimanche, 20h`. Titre : *"Un rapport. Pas un dashboard de plus."*

Reprendre **l'exemple conforme** de la charte (doc 03), rendu dans un encadré `glow-border` façon email :
- Les 5 mouvements visibles
- En R, ton calme

Texte d'accompagnement : *"Pendant que tu te reposes, ton journal lit ta semaine. Trois minutes de lecture, une question pour ta revue. C'est ce qui te ramène, chaque dimanche."*

### 6. Comment ça marche (3 étapes)

Grille bordée 3 colonnes, numérotées en mono :

| 01 — Importe | 02 — Journalise | 03 — Lis |
|---|---|---|
| Glisse ton historique MT4/MT5. 243 trades en 30 secondes. | 4 champs par trade. Setup, conformité, tag. Le reste est auto. | Dashboard, erreurs récurrentes, Weekly Report. Tu sais quoi ajuster. |

### 7. Liste de features (transparence)

Eyebrow `° Ce qui est inclus`. Deux colonnes : "Inclus dans le Journal" / "Pas encore (roadmap)".

**Inclus V1 :** import MT4/MT5 · stats en R · 5 vues de performance · statut auto des setups · 12 tags comportement · heatmap conformité · insights auto · Weekly Report hebdo · jusqu'à 3 comptes · export CSV/PDF · support email.

**Roadmap (transparent, pas promesse datée) :** API broker directe · comparaison cohorte anonymisée · tags personnalisés · app mobile · crypto. *"On construit avec les retours des premiers abonnés."*

### 8. Pricing (transparent)

Eyebrow `° Tarifs`. Trois cartes :

| Découverte | Journal | Journal annuel |
|---|---|---|
| **0€** | **19€** /mois | **190€** /an (−17%) |
| 10 frameworks, 4 outils gratuits, 1 audit 100 trades | Journal illimité, import, Weekly Report, support | Tout le mensuel + Pack PDF inclus |
| `btn-ghost` Commencer gratuitement | `btn-primary` Essayer le Journal | `btn-ghost` Prendre l'annuel |

Mention sous les cartes : *"Sans engagement. Résiliable en un clic. Paiement Stripe."*
Lien discret : *"Tu hésites ? Commence par le Starter Bundle à 49€ (journal manuel + 1 mois de Weekly Report écrit à la main), migration offerte vers le SaaS."*

### 9. FAQ honnête (différenciateur de ton)

Eyebrow `° Questions`. Accordéon. Inclure obligatoirement les questions inconfortables :

- **Pour qui ce n'est PAS ?** *"Si tu trades 2 fois par mois en swing long terme, ce journal est surdimensionné. Si tu cherches des signaux ou un coach, ce n'est pas ici. Meridian Journal est fait pour les traders actifs qui veulent mesurer et corriger."*
- **Ça marche avec quel broker ?** MT4 et MT5 via export (tous brokers). API directe en roadmap.
- **Mes données sont-elles en sécurité ?** Hébergement EU, données chiffrées, jamais revendues, export et suppression à tout moment.
- **Est-ce que ça va me rendre rentable ?** *"Non. Aucun outil ne rend rentable. Le Journal te montre tes patterns. Ce que tu en fais t'appartient."* (honnêteté = signature de la marque)
- **Combien de temps par jour ?** ~30 secondes par trade, 10-15 min de revue le dimanche.
- **Et si j'arrête ?** Résiliation un clic, export complet de tes données.

### 10. Témoignages (factuels, sans montants)

Eyebrow `° Ils l'utilisent`. **Structure placeholder** — à remplir avec de vrais retours des premiers Starter Bundle. Format imposé :

> *"J'ai découvert que je perdais 80% de mon edge après 14h. J'ai arrêté de trader l'après-midi. Ma conformité a doublé."*
> — Prénom, trader indices, [ville]

**Interdit :** tout montant (€, %), tout "j'ai gagné X". Uniquement des changements de comportement.

### 11. CTA final

Bandeau plein avec `radial-gradient` (comme home). Titre `h-title` : *"Arrête de deviner. [shimmer: Commence à mesurer.]"*
CTA : `[ Essayer le Journal — 19€/mois ]`. Sous-texte : *"Sans engagement. Ton premier Weekly Report sous 7 jours."*

### 12. Footer
`components/footer.tsx` existant.

---

## Métadonnées SEO

- `<title>` : "Meridian Journal — Journal de trading qui analyse ton comportement | MT4 MT5"
- `<meta description>` : "Le journal de trading qui transforme ton historique MT4/MT5 en décisions : erreurs récurrentes chiffrées, statut de tes setups, rapport hebdo. 19€/mois."
- OG image : visuel écran Comportement anonymisé (R, pas €)
- Mots-clés cibles : "journal de trading", "journal trading MT4", "analyser ses trades", "journal trading français"
- Schema.org `SoftwareApplication` + `Offer` (prix 19€)

---

## Composants à créer (implémentation)

| Composant | Réutilise | Nouveau ? |
|---|---|---|
| `JournalHero` | structure hero home | adapter |
| `ProblemGrid` | grille bordée | nouveau contenu |
| `PillarCards` | `pillar-card` home | réutilise pattern |
| `BehaviorDemo` | `glow-border` + image | nouveau (screenshot/GIF) |
| `WeeklyReportPreview` | `glow-border` | nouveau (rendu email) |
| `HowItWorks` | grille bordée numérotée | nouveau |
| `FeatureList` | grille 2 col | nouveau |
| `PricingCards` | grille bordée | nouveau |
| `FaqAccordion` | — | nouveau (accordéon a11y) |
| `Testimonials` | grille | nouveau (placeholder) |
| `FinalCta` | bandeau radial home | adapter |

### Assets à produire avant implémentation
1. Screenshot/GIF écran Comportement anonymisé (R)
2. Rendu visuel du Weekly Report exemple
3. OG image

**Note :** ces assets dépendent du SaaS qui n'existe pas encore en Q2. Option intérimaire pour pré-vente : maquettes statiques fidèles (Figma → export) en attendant le vrai produit. Ne jamais utiliser de fausses données € ou de fausse perf.

---

## Ce que la page ne fait PAS
- Pas de pop-up email / exit-intent
- Pas de compte à rebours / fausse rareté
- Pas de chiffres de gains
- Pas de captures de comptes broker réels
- Pas de logos "vu dans" mensongers
- Pas de chatbot intrusif
