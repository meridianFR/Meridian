/* Vérification du Weekly Report. Lancer : npx tsx scripts/check-weekly.ts */
import type { Trade, Flag, Direction } from "../lib/journal/types";
import { generateWeeklyReport, weeklyReportsFromTrades, tradesOfWeek, weekStart, isoWeek } from "../lib/journal/weekly-report";

let pass = 0;
let fail = 0;
function ok(label: string, cond: boolean, extra?: unknown) {
  if (cond) pass++;
  else {
    fail++;
    console.log(`  ✗ ${label}${extra !== undefined ? ` — ${JSON.stringify(extra)}` : ""}`);
  }
}
function T(at: string, direction: Direction, r: number, flag: Flag, tags: string[], setup = "Breakout NY open"): Trade {
  return { id: at, accountId: "a", at, instrument: "US30", direction, r, setup, flag, entry: 0, exit: 0, size: 0, tags, emotion: 3, note: "", durationMin: null };
}

const week: Trade[] = [
  T("2026-05-25T09:30", "long", 1.0, "conforme", []),
  T("2026-05-25T14:10", "short", -1.0, "horsplan", ["Revenge", "Hors plan"]),
  T("2026-05-26T10:00", "long", 2.0, "conforme", []),
  T("2026-05-26T15:30", "long", 0.5, "partiel", ["Sortie prématurée"]),
  T("2026-05-27T11:00", "short", -0.5, "conforme", []),
  T("2026-05-27T16:00", "long", -1.0, "horsplan", ["Hors plan"]),
];

console.log("weekStart / isoWeek:");
ok("weekStart == lundi (getDay()===1)", weekStart(new Date("2026-05-27T16:00")).getDay() === 1);
ok("isoWeek renvoie {year,week}", typeof isoWeek(new Date("2026-05-27")).week === "number");

console.log("tradesOfWeek:");
ok("6 trades dans la semaine", tradesOfWeek(week, new Date("2026-05-26")).length === 6);

console.log("generateWeeklyReport:");
const r = generateWeeklyReport(week, new Date("2026-05-26"))!;
ok("report non null", !!r);
ok("trades = 6", r.trades === 6, r.trades);
ok("rcumul = +1.0", r.rcumul === 1.0, r.rcumul);
ok("conformité = 50%", r.conf === 50, r.conf);
ok("période mentionne mai 2026", r.period.includes("mai 2026"), r.period);
ok("week label commence par S", r.week.startsWith("S"), r.week);
ok("passe contient le winrate", /Winrate \d+%/.test(r.movements.passe), r.movements.passe);
ok("pasMarche pivote sur 'Hors plan' (impact -2R)", r.movements.pasMarche.includes("Hors plan"), r.movements.pasMarche);
ok("hypothèse = celle de Hors plan", r.movements.hypothese.includes("sortent de ton plan"), r.movements.hypothese);
ok("question = celle de Hors plan", r.movements.question.includes("raison du setup"), r.movements.question);
ok("subject positif (+1R)", r.subject.includes("+1.0R"), r.subject);

console.log("archive multi-semaines:");
const multi: Trade[] = [
  ...week,
  T("2026-05-18T10:00", "long", 0.5, "conforme", []),
  T("2026-06-01T10:00", "long", -0.5, "horsplan", ["FOMO"]),
];
const reps = weeklyReportsFromTrades(multi);
ok("3 semaines distinctes", reps.length === 3, reps.length);
ok("tri du + récent au + ancien", reps[0].start > reps[1].start && reps[1].start > reps[2].start, reps.map((x) => x.start));
ok("semaine négative -> subject 'où ça a basculé'", reps[0].subject.includes("où ça a basculé"), reps[0].subject);

console.log("vide:");
ok("aucun trade -> null", generateWeeklyReport([], new Date()) === null);
ok("archive vide -> []", weeklyReportsFromTrades([]).length === 0);

console.log(`\n${fail === 0 ? "✅ TOUS LES TESTS PASSENT" : "❌ ÉCHECS"} — ${pass} pass, ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
