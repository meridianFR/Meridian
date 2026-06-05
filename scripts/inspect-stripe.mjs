// Inspecte les produits Stripe (ceux de l'user + tous) et liste leurs prix.
// Lit .env.local. Usage : node scripts/inspect-stripe.mjs
import nextEnv from "@next/env";
import Stripe from "stripe";

nextEnv.loadEnvConfig(process.cwd());
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const userProducts = ["prod_UeCo2N4khvudhS", "prod_UeCoTArRwC5RWd"];

console.log("=== Produits envoyés par l'user ===");
for (const id of userProducts) {
  try {
    const prod = await stripe.products.retrieve(id);
    const prices = await stripe.prices.list({ product: id, active: true, limit: 10 });
    console.log(`\n📦 ${prod.name}  (${id})  actif:${prod.active}`);
    if (!prices.data.length) console.log("   ⚠️ AUCUN prix actif");
    for (const p of prices.data) {
      const rec = p.recurring ? `/${p.recurring.interval} (récurrent ✅)` : "(PONCTUEL ⚠️)";
      console.log(`   prix ${p.id} : ${(p.unit_amount ?? 0) / 100} ${p.currency.toUpperCase()} ${rec}`);
    }
  } catch (e) {
    console.log(`\n❌ ${id} : ${e.message}`);
  }
}

console.log("\n\n=== TOUS les produits actifs du compte ===");
const all = await stripe.products.list({ active: true, limit: 100 });
for (const prod of all.data) {
  const prices = await stripe.prices.list({ product: prod.id, active: true, limit: 5 });
  const summary = prices.data
    .map((p) => `${(p.unit_amount ?? 0) / 100}${p.currency.toUpperCase()}${p.recurring ? "/" + p.recurring.interval : "/ponctuel"}`)
    .join(", ");
  console.log(`• ${prod.name.padEnd(32)} ${prod.id}  [${summary || "aucun prix"}]`);
}
