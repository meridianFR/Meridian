// Diagnostic Stripe : valide la secret key + crée une session Checkout de test
// avec les price IDs réels (preuve que tout le parcours paiement est branché).
// Lit .env.local. N'affiche aucun secret. Usage : node scripts/check-stripe.mjs
import nextEnv from "@next/env";
import Stripe from "stripe";

nextEnv.loadEnvConfig(process.cwd());

const key = process.env.STRIPE_SECRET_KEY;
const monthly = process.env.STRIPE_PRICE_MONTHLY;
const annual = process.env.STRIPE_PRICE_ANNUAL;
const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

if (!key || !monthly || !annual) {
  console.log("⛔ Clé secrète ou price IDs manquants.");
  process.exit(1);
}
const stripe = new Stripe(key);

try {
  for (const [label, price] of [["Mensuel", monthly], ["Annuel", annual]]) {
    const p = await stripe.prices.retrieve(price);
    const amount = (p.unit_amount ?? 0) / 100;
    console.log(`✅ ${label.padEnd(8)} ${price} → ${amount} ${p.currency.toUpperCase()}/${p.recurring?.interval} (actif: ${p.active})`);
  }
  // Création d'une vraie session Checkout (mode test) = preuve du parcours complet
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: monthly, quantity: 1 }],
    success_url: `${site}/app?checkout=success`,
    cancel_url: `${site}/abonnement?plan=monthly&canceled=1`,
  });
  console.log("");
  console.log("✅ Session Checkout créée :", session.id);
  console.log("   URL paiement OK :", session.url ? "oui" : "NON");
  console.log("\n🎉 Stripe entièrement opérationnel (clé + prix + checkout).");
} catch (e) {
  console.log("❌ Erreur Stripe :", e.message);
  process.exit(1);
}
