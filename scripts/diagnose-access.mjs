// Diagnostic accès abonné : croise user Supabase / profile / subscriptions (DB)
// avec la réalité Stripe (customer + subscriptions). Lit .env.local.
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

nextEnv.loadEnvConfig(process.cwd());
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const email = "dacruzpro41@hotmail.com";

const { data: list } = await sb.auth.admin.listUsers();
const user = list.users.find((u) => u.email === email);
console.log("=== USER ===");
console.log(user ? `${user.email} | id ${user.id} | dernier login: ${user.last_sign_in_at ?? "jamais"}` : "introuvable");
if (!user) process.exit(0);

console.log("\n=== PROFILE (DB) ===");
const { data: profile, error: pe } = await sb.from("profiles").select("*").eq("id", user.id).maybeSingle();
console.log(pe ? "erreur: " + pe.message : JSON.stringify(profile, null, 2));

console.log("\n=== SUBSCRIPTIONS (DB) ===");
const { data: subs, error: se } = await sb.from("subscriptions").select("*").eq("user_id", user.id);
console.log(se ? "erreur: " + se.message : (subs.length ? JSON.stringify(subs, null, 2) : "⚠️ AUCUNE ligne en base"));

console.log("\n=== STRIPE (réalité) ===");
const customers = await stripe.customers.list({ email, limit: 10 });
if (!customers.data.length) console.log("⚠️ aucun customer Stripe pour cet email");
for (const c of customers.data) {
  console.log(`customer ${c.id} | metadata: ${JSON.stringify(c.metadata)}`);
  const css = await stripe.subscriptions.list({ customer: c.id, status: "all", limit: 10 });
  if (!css.data.length) console.log("   (aucun abonnement)");
  for (const s of css.data) {
    const pe = s.items?.data?.[0]?.current_period_end ?? s.current_period_end ?? null;
    console.log(`   sub ${s.id} | status: ${s.status} | period_end: ${pe ? new Date(pe * 1000).toISOString() : "—"} | price: ${s.items.data[0]?.price?.id}`);
  }
}
