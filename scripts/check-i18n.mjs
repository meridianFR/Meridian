// Vérifie la parité des clés de traduction entre messages/fr.json (source de
// vérité) et les autres langues. Échoue (exit 1) si une clé manque ou est en
// trop, pour qu'on n'oublie jamais de traduire un nouveau contenu.
//
//   node scripts/check-i18n.mjs      (ou: npm run i18n:check)

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = "fr"; // langue de référence
const TARGETS = ["en", "pt"];

function load(locale) {
  const path = join(root, "messages", `${locale}.json`);
  return JSON.parse(readFileSync(path, "utf8"));
}

// Aplatit l'objet en chemins de clés "Namespace.sous.cle" (ignore les tableaux,
// dont on ne compare pas le contenu interne — seulement leur présence).
function flatten(obj, prefix = "", out = new Set()) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flatten(value, path, out);
    } else {
      out.add(path);
    }
  }
  return out;
}

const source = flatten(load(SOURCE));
let hasError = false;

for (const locale of TARGETS) {
  const target = flatten(load(locale));
  const missing = [...source].filter((k) => !target.has(k));
  const extra = [...target].filter((k) => !source.has(k));

  if (missing.length === 0 && extra.length === 0) {
    console.log(`  ${locale}: OK (${target.size} clés)`);
    continue;
  }
  hasError = true;
  console.error(`  ${locale}: DÉSYNCHRONISÉ`);
  if (missing.length) {
    console.error(`    Manquantes (présentes en ${SOURCE}, absentes en ${locale}) :`);
    for (const k of missing) console.error(`      - ${k}`);
  }
  if (extra.length) {
    console.error(`    En trop (absentes en ${SOURCE}) :`);
    for (const k of extra) console.error(`      + ${k}`);
  }
}

if (hasError) {
  console.error(
    `\ni18n: des traductions manquent. Ajoute les clés dans messages/${TARGETS.join(
      "/",
    )}.json (fr = source).`,
  );
  process.exit(1);
}
console.log(`\ni18n: ${SOURCE} ↔ ${TARGETS.join("/")} synchronisés.`);
