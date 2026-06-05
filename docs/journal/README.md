# Meridian Journal — Specs produit

Specs design et produit du SaaS **Meridian Journal** (V1, lancement Q3 2026).

Ces documents servent à :
- aligner le design produit avant de coder
- garder une référence stable pendant l'implémentation
- documenter les décisions verrouillées pour les futurs contributeurs

## Plan des livrables

| Étape | Dossier / fichier | Statut |
|---|---|---|
| 01 — Wireframes des 5 sections | `wireframes/` | fait |
| 02 — Taxonomie des 12 tags comportement | `02-tags-comportement.md` | fait |
| 03 — Charte rédactionnelle Weekly Report | `03-weekly-report.md` | fait |
| 04 — Specs parseur CSV MT4/MT5 | `04-csv-parser.md` | fait |
| 05 — Spec page marketing /journal | `05-page-marketing.md` | fait |

## Décisions verrouillées (2026-05-28)

1. **Unité par défaut = R** (multiple de risque), € en toggle user
2. **Weekly Report 100% manuel les 30 premiers abonnés**, puis bascule progressive Claude API
3. **Brokers V1 = MT4 + MT5 (CSV uniquement)**, pas d'API broker Y1

## Contraintes produit (rappel)

- Cible : "trader sérieux fatigué" (28-42 ans, MT4/MT5, prop firm)
- Pricing : 19 €/mois ou 190 €/an
- Ton : 8 règles non-négociables (pas d'émojis, pas de !, tutoiement, factuel)
- Stack : Next.js + Supabase + Resend + Claude API (à confirmer en sprint stack)
- Anti-features : pas de backtest, pas de signaux, pas de calendrier, pas de chart temps réel, pas de Discord intégré

## Source de vérité

Ces specs priment sur tout ce qui aurait pu être discuté ailleurs. Si conflit avec un autre document, c'est ce dossier qui gagne. Les décisions verrouillées ne se rouvrent qu'en revue trimestrielle (KPIs Q4).
