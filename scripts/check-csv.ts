/* Vérification de l'import CSV. Lancer : npx tsx scripts/check-csv.ts */
import { parseDelimited, parseDateTime, computeR, parseTradesCsv } from "../lib/journal/csv";

let pass = 0;
let fail = 0;
function ok(label: string, cond: boolean, extra?: unknown) {
  if (cond) pass++;
  else {
    fail++;
    console.log(`  ✗ ${label}${extra !== undefined ? ` — ${JSON.stringify(extra)}` : ""}`);
  }
}

console.log("parseDelimited:");
const g = parseDelimited('a,b,c\n1,"deux,virgule",3\n');
ok("2 lignes", g.length === 2, g.length);
ok("cellule quotée avec virgule", g[1][1] === "deux,virgule", g[1][1]);
ok("détection ;", parseDelimited("a;b\n1;2")[1].length === 2);

console.log("parseDateTime:");
ok("MT format point", parseDateTime("2026.05.28 14:32:00") === "2026-05-28T14:32:00");
ok("ISO", parseDateTime("2026-05-28", "14:32") === "2026-05-28T14:32:00");
ok("européen JJ/MM/AAAA", parseDateTime("28/05/2026 09:05") === "2026-05-28T09:05:00");
ok("année courte", parseDateTime("28.05.26 09:05") === "2026-05-28T09:05:00");
ok("date invalide -> null", parseDateTime("pas une date") === null);

console.log("computeR:");
ok("long 56/40 = 1.4", computeR("long", 18412, 18468, 18372) === 1.4);
ok("short 5/5 = 1.0", computeR("short", 100, 95, 105) === 1.0);
ok("perte long négative", computeR("long", 100, 98, 95) === -0.4);
ok("sl absent -> null", computeR("long", 100, 110, null) === null);
ok("risque nul -> null", computeR("long", 100, 110, 100) === null);

console.log("parseTradesCsv — format Meridian (avec en-tête accentué):");
const meridian = `date,instrument,direction,r,setup,Conformité,note
2026-05-28 14:32,US30,long,0.8,Breakout NY open,Conforme,Setup propre
2026-05-28 11:08,xauusd,short,-1.0,Mean reversion,Partiel,`;
const m = parseTradesCsv(meridian);
ok("2 détectés", m.detected === 2, m.detected);
ok("2 prêts (rien à confirmer)", m.ready === 2, { ready: m.ready, rows: m.rows });
ok("r ligne 1 = 0.8", m.rows[0].r === 0.8);
ok("instrument normalisé majuscules", m.rows[1].instrument === "XAUUSD", m.rows[1].instrument);
ok("flag accentué reconnu (norm OK)", m.rows[0].flag === "conforme" && m.rows[1].flag === "partiel");

console.log("parseTradesCsv — format MT5 (SL, sans R ni setup):");
const mt5 = `Open Time,Symbol,Type,Volume,Open Price,S/L,Close Price,Close Time,Profit
2026.05.28 09:47:00,GER40,buy,1.0,18412,18372,18468,2026.05.28 10:29:00,560.00
2026.05.28 11:00:00,EURUSD,sell,0.50,1.0850,1.0870,1.0820,2026.05.28 11:30:00,150.00
Totaux:,,,,,,,,710.00`;
const x = parseTradesCsv(mt5);
ok("2 trades (ligne Totaux ignorée)", x.detected === 2, x.detected);
ok("R recalculé via SL = 1.4", x.rows[0].r === 1.4, x.rows[0].r);
ok("short R = (1.0850-1.0820)/(1.0870-1.0850)=1.5", x.rows[1].r === 1.5, x.rows[1].r);
ok("durée 42 min", x.rows[0].durationMin === 42, x.rows[0].durationMin);
ok("tout à confirmer (setup+flag manquants)", x.toConfirm === 2, x.toConfirm);
ok("direction buy->long", x.rows[0].direction === "long");
ok("direction sell->short", x.rows[1].direction === "short");

console.log("robustesse:");
ok("csv vide -> erreur", parseTradesCsv("").errors.length > 0);
ok("colonnes inconnues -> erreur", parseTradesCsv("a,b\n1,2").errors.length > 0);

console.log(`\n${fail === 0 ? "✅ TOUS LES TESTS PASSENT" : "❌ ÉCHECS"} — ${pass} pass, ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
