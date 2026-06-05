// Liste les utilisateurs Supabase (auth) + leur état de confirmation/connexion.
// Sert à suivre le parcours : compte créé → lien cliqué (confirmé) → connecté.
// Lit .env.local. Usage : node scripts/check-users.mjs
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

nextEnv.loadEnvConfig(process.cwd());
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { data, error } = await sb.auth.admin.listUsers();
if (error) {
  console.log("❌ Erreur:", error.message);
  process.exit(1);
}
if (!data.users.length) {
  console.log("⏳ Aucun utilisateur encore — la demande de connexion n'est pas (encore) passée.");
  process.exit(0);
}
console.log(`👤 ${data.users.length} utilisateur(s) :\n`);
for (const u of data.users) {
  console.log(`• ${u.email}`);
  console.log(`   confirmé (lien cliqué) : ${u.email_confirmed_at ? "✅ OUI" : "⏳ pas encore"}`);
  console.log(`   dernière connexion     : ${u.last_sign_in_at ?? "jamais"}`);
  console.log(`   id                     : ${u.id}`);
}
