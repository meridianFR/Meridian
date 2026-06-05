// Réconcilie manuellement l'abonnement d'un user (miroir de syncSubscriptionForCustomer)
// — utile en local sans webhook. Usage : node scripts/reconcile.mjs [email]
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

nextEnv.loadEnvConfig(process.cwd());
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const monthly = process.env.STRIPE_PRICE_MONTHLY;
const annual = process.env.STRIPE_PRICE_ANNUAL;
const planFromPrice = (pid) => (pid === annual ? "annual" : pid === monthly ? "monthly" : null);
const readPeriodEnd = (sub) => {
  const unix = sub.items?.data?.[0]?.current_period_end ?? sub.current_period_end ?? null;
  return unix ? new Date(unix * 1000).toISOString() : null;
};

const email = process.argv[2] || "dacruzpro41@hotmail.com";
const { data: list } = await sb.auth.admin.listUsers();
const user = list.users.find((u) => u.email === email);
if (!user) {
  console.log("❌ user introuvable:", email);
  process.exit(1);
}
const { data: profile } = await sb.from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle();
const customerId = profile?.stripe_customer_id;
if (!customerId) {
  console.log("❌ pas de stripe_customer_id sur le profil");
  process.exit(1);
}

const subs = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 1 });
if (!subs.data.length) {
  await sb.from("subscriptions").delete().eq("user_id", user.id);
  console.log("⚠️ aucun abonnement Stripe — ligne supprimée le cas échéant.");
  process.exit(0);
}
const sub = subs.data[0];
const priceId = sub.items.data[0]?.price?.id ?? null;
const row = {
  user_id: user.id,
  stripe_subscription_id: sub.id,
  stripe_customer_id: customerId,
  status: sub.status,
  price_id: priceId,
  plan: planFromPrice(priceId),
  current_period_end: readPeriodEnd(sub),
  cancel_at_period_end: sub.cancel_at_period_end,
  updated_at: new Date().toISOString(),
};
const { error } = await sb.from("subscriptions").upsert(row, { onConflict: "user_id" });
if (error) {
  console.log("❌ ERREUR upsert:", error.message);
  process.exit(1);
}
console.log("✅ Abonnement réconcilié en base :");
console.log(`   status: ${row.status} | plan: ${row.plan} | fin période: ${row.current_period_end ?? "—"} | annulation prévue: ${row.cancel_at_period_end}`);
console.log(`   → accès accordé: ${["active", "trialing"].includes(row.status) ? "✅ OUI" : "❌ NON (statut " + row.status + ")"}`);
