import { defineRouting } from "next-intl/routing";

/**
 * Configuration centrale du multilingue.
 *
 * - `locales` : langues disponibles. Ajouter une langue = ajouter son code ici
 *   + le fichier `messages/<code>.json`. (Scalable.)
 * - `defaultLocale` : le français. Avec `localePrefix: "as-needed"`, le français
 *   garde les URLs ACTUELLES sans préfixe (`/strategies`, `/outils`…). Seuls
 *   l'anglais et le portugais sont préfixés (`/en/strategies`, `/pt/strategies`).
 *   → aucun impact sur le SEO français existant, le DNS, Supabase ni Stripe.
 * - `localeDetection: false` : on ne redirige PAS automatiquement selon la langue
 *   du navigateur (sinon Googlebot et les liens FR existants pourraient basculer
 *   en /en de façon imprévue). La langue se choisit via le bouton, et le choix est
 *   mémorisé dans le cookie `NEXT_LOCALE` que next-intl pose à chaque changement.
 */
export const routing = defineRouting({
  locales: ["fr", "en", "pt"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
