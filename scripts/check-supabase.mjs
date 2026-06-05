// Diagnostic Supabase : vérifie connexion + existence des tables.
// Lit les clés depuis .env.local (via @next/env), n'affiche AUCUN secret.
// Usage : node scripts/check-supabase.mjs
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

nextEnv.loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function mask(v) {
  return v ? `présent (${v.length} car.)` : "MANQUANT";
}
console.log("URL        :", url || "MANQUANT");
console.log("anon key   :", mask(anon));
console.log("service key:", mask(service));
console.log("");

if (!url || !service) {
  console.log("⛔ URL ou service key manquante — stop.");
  process.exit(1);
}

const sb = createClient(url, service, { auth: { persistSession: false } });
const tables = ["profiles", "subscriptions", "accounts", "trades", "setups", "weekly_reviews"];
let ok = 0;
for (const t of tables) {
  const { error, count } = await sb.from(t).select("*", { count: "exact", head: true });
  if (error) {
    console.log(`❌ ${t.padEnd(15)} ERREUR: ${error.message}`);
  } else {
    console.log(`✅ ${t.padEnd(15)} OK (${count ?? 0} lignes)`);
    ok++;
  }
}
console.log("");
console.log(ok === tables.length ? "🎉 Supabase OK — connexion + schéma complets." : `⚠️ ${ok}/${tables.length} tables OK.`);
