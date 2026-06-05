/* Vérification déterministe du moteur d'analytics. Lancer : npx tsx scripts/check-analytics.ts */
import type { Trade, Flag, Direction } from "../lib/journal/types";
import {
  computeStats,
  equitySeries,
  errorRanking,
  hoursPerf,
  emotionScatter,
  conformityHeatmap,
  conformityStreak,
  lastDayKpi,
} from "../lib/journal/analytics";

let pass = 0;
let fail = 0;
function eq(label: string, got: unknown, want: unknown) {
  const ok = Math.abs(typeof got === "number" && typeof want === "number" ? got - want : got === want ? 0 : 1) < 1e-9;
  if (ok) {
    pass++;
  } else {
    fail++;
    console.log(`  ✗ ${label}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
  }
}

function T(at: string, direction: Direction, r: number, flag: Flag, tags: string[], emotion: number, instrument: string, setup = "Breakout NY open"): Trade {
  return { id: at, accountId: "a", at, instrument, direction, r, setup, flag, entry: 0, exit: 0, size: 0, tags, emotion, note: "", durationMin: null };
}

const trades: Trade[] = [
  T("2026-05-25T09:30", "long", 1.0, "conforme", [], 2, "US30"),
  T("2026-05-25T14:10", "short", -1.0, "horsplan", ["Revenge", "Hors plan"], 5, "US30"),
  T("2026-05-26T10:00", "long", 2.0, "conforme", [], 1, "GER40"),
  T("2026-05-26T15:30", "long", 0.5, "partiel", ["Sortie prématurée"], 3, "GER40"),
  T("2026-05-27T11:00", "short", -0.5, "conforme", [], 4, "EURUSD"),
  T("2026-05-27T16:00", "long", -1.0, "horsplan", ["Hors plan"], 4, "EURUSD"),
];

console.log("computeStats:");
const s = computeStats(trades);
eq("n", s.n, 6);
eq("wins", s.wins, 3);
eq("losses", s.losses, 3);
eq("winRate", s.winRate, 50);
eq("netR", Number(s.netR.toFixed(6)), 1.0);
eq("profitFactor", Number(s.profitFactor.toFixed(4)), 1.4);
eq("expectancy", Number(s.expectancy.toFixed(4)), Number((1 / 6).toFixed(4)));
eq("avgWin", Number(s.avgWin.toFixed(4)), Number((3.5 / 3).toFixed(4)));
eq("avgLoss", Number(s.avgLoss.toFixed(4)), Number((-2.5 / 3).toFixed(4)));
eq("maxWinStreak", s.maxWinStreak, 2);
eq("maxLossStreak", s.maxLossStreak, 2);
eq("maxDD", Number(s.maxDD.toFixed(6)), -1.5);

console.log("equitySeries:");
const e = equitySeries(trades);
eq("equity length", e.equity.length, 7);
eq("equity last == netR", Number(e.equity[e.equity.length - 1].toFixed(6)), 1.0);

console.log("errorRanking:");
const er = errorRanking(trades);
eq("top tag = Hors plan", er[0].tag, "Hors plan");
eq("Hors plan count", er[0].count, 2);
eq("Hors plan cumul", Number(er[0].cumul.toFixed(6)), -2.0);
eq("rank2 = Revenge", er[1].tag, "Revenge");
eq("Sortie prématurée manqueAGagner", errorRanking(trades, 3).find((x) => x.tag === "Sortie prématurée")?.manqueAGagner, true);

console.log("hoursPerf:");
const hp = hoursPerf(trades);
eq("hours range 9..16 -> 8 buckets", hp.length, 8);
eq("12h is null", hp.find((h) => h.h === "12h")?.r ?? "NULL", "NULL");
eq("09h = +1", hp.find((h) => h.h === "09h")?.r, 1);

console.log("emotionScatter:");
eq("scatter count", emotionScatter(trades).length, 6);

console.log("conformityHeatmap + streak:");
const hm = conformityHeatmap(trades, 70);
eq("heatmap length", hm.length, 70);
eq("most recent day (27) = partiel(2)", hm[69], 2);
eq("day 26 = conforme(3)", hm[68], 3);
eq("day 25 = partiel(2)", hm[67], 2);
eq("streak record", conformityStreak(trades).record, 1);

console.log("lastDayKpi:");
const k = lastDayKpi(trades)!;
eq("kpi trades", k.trades, 2);
eq("kpi long", k.long, 1);
eq("kpi short", k.short, 1);
eq("kpi rRealise", k.rRealise, -1.5);
eq("kpi conformite", k.conformite, 50);

console.log("\nempty input safety:");
eq("computeStats([]).n", computeStats([]).n, 0);
eq("lastDayKpi([]) null", lastDayKpi([]), null);
eq("heatmap([]) length", conformityHeatmap([], 70).length, 70);

console.log(`\n${fail === 0 ? "✅ TOUS LES TESTS PASSENT" : "❌ ÉCHECS"} — ${pass} pass, ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
