/**
 * Lecture centralisée des variables d'environnement.
 *
 * Principe : RIEN n'est jeté à l'import. Le site marketing public doit
 * fonctionner même sans configuration paiement. Les helpers `isXxxConfigured()`
 * permettent de dégrader proprement, et la logique d'accès « fail closed »
 * (cf. middleware + layout /app) refuse l'accès tant que tout n'est pas prêt.
 *
 * Sécurité : seules les variables préfixées NEXT_PUBLIC_ sont exposées au
 * navigateur. Les secrets (service role, clés Stripe) ne sont lus que via des
 * fonctions appelées côté serveur ; même importées par erreur dans un bundle
 * client, Next les remplace par `undefined` (aucune fuite).
 */

// --- Public (exposable au navigateur) ---

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

// --- Offres (source de vérité partagée) ---

export type PlanId = "monthly" | "annual";

export function isPlanId(value: unknown): value is PlanId {
  return value === "monthly" || value === "annual";
}

export const PLANS: Record<
  PlanId,
  { name: string; price: string; period: string; sub: string; perks: string[] }
> = {
  monthly: {
    name: "Mensuel",
    price: "19 €",
    period: "/ mois",
    sub: "Sans engagement.",
    perks: ["Tout le Journal, sans limite", "Weekly Report chaque dimanche", "Jusqu'à 3 comptes"],
  },
  annual: {
    name: "Annuel",
    price: "190 €",
    period: "/ an",
    sub: "Soit 15,83 €/mois — deux mois offerts.",
    perks: ["Tout le mensuel", "Deux mois offerts (−17 %)", "Pack PDF stratégies inclus"],
  },
};

// --- Server-only (jamais exposés au navigateur) ---

export function supabaseServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
}

export function stripeSecretKey(): string {
  return process.env.STRIPE_SECRET_KEY ?? "";
}

export function stripeWebhookSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET ?? "";
}

export function stripePriceId(plan: PlanId): string {
  return plan === "annual"
    ? process.env.STRIPE_PRICE_ANNUAL ?? ""
    : process.env.STRIPE_PRICE_MONTHLY ?? "";
}

/** Vrai uniquement si la clé secrète ET les deux price IDs sont présents. */
export function isStripeConfigured(): boolean {
  return Boolean(
    stripeSecretKey() &&
      process.env.STRIPE_PRICE_MONTHLY &&
      process.env.STRIPE_PRICE_ANNUAL,
  );
}
