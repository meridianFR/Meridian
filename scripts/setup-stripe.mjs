// Crée (ou réutilise) les 2 produits/prix récurrents Meridian dans Stripe (mode test)
// puis écrit les price IDs dans .env.local. Idempotent via lookup_key.
// Lit STRIPE_SECRET_KEY depuis .env.local. Usage : node scripts/setup-stripe.mjs
import nextEnv from "@next/env";
import Stripe from "stripe";
import { readFileSync, writeFileSync } from "node:fs";

nextEnv.loadEnvConfig(process.cwd());

const key = process.env.STRIPE_SECRET_KEY;
if (!key || !key.startsWith("sk_")) {
  console.log("⛔ STRIPE_SECRET_KEY absente ou invalide dans .env.local.");
  process.exit(1);
}
const stripe = new Stripe(key);

async function ensure(lookupKey, name, amount, interval) {
  const found = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
  if (found.data.length) {
    console.log(`↺ ${name} : prix existant réutilisé → ${found.data[0].id}`);
    return found.data[0].id;
  }
  const product = await stripe.products.create({ name, metadata: { app: "meridian" } });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: amount,
    currency: "eur",
    recurring: { interval },
    lookup_key: lookupKey,
  });
  console.log(`✅ ${name} créé → ${price.id} (${amount / 100} €/${interval})`);
  return price.id;
}

let monthly, annual;
try {
  monthly = await ensure("meridian_monthly", "Meridian Journal — Mensuel", 1900, "month");
  annual = await ensure("meridian_annual", "Meridian Journal — Annuel", 19000, "year");
} catch (e) {
  console.log("❌ Erreur Stripe :", e.message);
  process.exit(1);
}

const path = ".env.local";
let txt = readFileSync(path, "utf8");
txt = txt.replace(/^STRIPE_PRICE_MONTHLY=.*$/m, `STRIPE_PRICE_MONTHLY=${monthly}`);
txt = txt.replace(/^STRIPE_PRICE_ANNUAL=.*$/m, `STRIPE_PRICE_ANNUAL=${annual}`);
writeFileSync(path, txt);

console.log("\n📝 .env.local mis à jour :");
console.log("   STRIPE_PRICE_MONTHLY=" + monthly);
console.log("   STRIPE_PRICE_ANNUAL=" + annual);
console.log("\n🎉 Produits Stripe prêts (mensuel 19 € / annuel 190 €).");
