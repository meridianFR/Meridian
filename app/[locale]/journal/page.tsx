import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { Reveal } from "@/components/reveal";
import { FaqAccordion, type FaqItem } from "@/components/faq-accordion";
import {
  MetaTraderLogo,
  CsvMark,
  ApiMark,
  VisaMark,
  MastercardMark,
  AmexMark,
  ApplePayMark,
  StripeMark,
  LockIcon,
} from "@/components/journal-logos";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "JournalSales" });
  return {
    alternates: { canonical: "/journal" },
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

const APP_HREF = "/journal-preview";

/** Traducteur simplifié passé aux sous-composants (le rendu est côté serveur). */
type Tx = (key: string, values?: Record<string, string | number>) => string;

/* ------------------------------------------------------------------ données simulées (compte de démonstration, déterministe, tout en R) */

type Sim = {
  i: number;
  day: number;
  sym: string;
  side: "L" | "S";
  setup: string;
  hour: number;
  r: number;
  conform: boolean;
  tag: string | null;
};

const SIM_INSTRUMENTS = ["GER40", "US100", "EURUSD", "XAUUSD", "US30"];
const SIM_SETUPS = ["Breakout NY open", "Trend pullback", "Mean reversion", "Fade NY high"];
const SIM_HOURS = [9, 10, 11, 13, 14, 15, 16, 17];

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSim(): Sim[] {
  const rng = mulberry32(20240531);
  const N = 132;
  const setupBias: Record<string, number> = {
    "Breakout NY open": 0.6,
    "Trend pullback": 0.28,
    "Mean reversion": 0.05,
    "Fade NY high": -0.9,
  };
  const instrBias: Record<string, number> = {
    GER40: 0.2,
    US100: 0.1,
    EURUSD: 0.0,
    XAUUSD: -0.15,
    US30: 0.05,
  };
  const out: Sim[] = [];
  for (let i = 0; i < N; i++) {
    const setup = SIM_SETUPS[Math.floor(rng() * SIM_SETUPS.length)];
    const sym = SIM_INSTRUMENTS[Math.floor(rng() * SIM_INSTRUMENTS.length)];
    const hour = SIM_HOURS[Math.floor(rng() * SIM_HOURS.length)];
    const side: "L" | "S" = rng() < 0.5 ? "L" : "S";
    const hourBias = hour <= 11 ? 0.3 : hour >= 15 ? -0.4 : 0;
    const edge = setupBias[setup] + instrBias[sym] + hourBias;
    const p = Math.min(0.74, Math.max(0.3, 0.52 + edge * 0.28));
    const win = rng() < p;
    let r = win ? 0.6 + rng() * 1.9 : -(0.75 + rng() * 1.05);
    r = Math.round(r * 10) / 10;
    const conform = rng() < 0.78;
    let tag: string | null = null;
    if (!win && !conform) {
      const roll = rng();
      tag = roll < 0.42 ? "Revenge trade" : roll < 0.72 ? "Sortie prématurée" : "Position traînée";
    } else if (!win && rng() < 0.16) {
      tag = "Sortie prématurée";
    }
    const day = Math.floor((i / N) * 88) + 1;
    out.push({ i, day, sym, side, setup, hour, r, conform, tag });
  }
  return out;
}

const SIM = buildSim();

const D = (() => {
  let cum = 0;
  const equity: number[] = [];
  let wins = 0;
  let grossWin = 0;
  let grossLoss = 0;
  let peak = 0;
  let maxDD = 0;
  for (const t of SIM) {
    cum += t.r;
    equity.push(Math.round(cum * 10) / 10);
    if (t.r >= 0) {
      wins++;
      grossWin += t.r;
    } else {
      grossLoss += -t.r;
    }
    peak = Math.max(peak, cum);
    maxDD = Math.max(maxDD, peak - cum);
  }
  const n = SIM.length;
  const byInstr = SIM_INSTRUMENTS.map((sym) => {
    const ts = SIM.filter((t) => t.sym === sym);
    return { sym, r: ts.reduce((a, t) => a + t.r, 0), n: ts.length };
  }).sort((a, b) => b.r - a.r);
  const byHour = SIM_HOURS.map((h) => {
    const ts = SIM.filter((t) => t.hour === h);
    return { h, exp: ts.length ? ts.reduce((a, t) => a + t.r, 0) / ts.length : 0, n: ts.length };
  });
  const bySetup = SIM_SETUPS.map((name) => {
    const ts = SIM.filter((t) => t.setup === name);
    return { name, r: ts.reduce((a, t) => a + t.r, 0), n: ts.length };
  }).sort((a, b) => b.r - a.r);
  const tagNames = ["Revenge trade", "Sortie prématurée", "Position traînée"];
  const byTag = tagNames
    .map((tag) => {
      const ts = SIM.filter((t) => t.tag === tag);
      return { tag, n: ts.length, r: ts.reduce((a, t) => a + t.r, 0) };
    })
    .sort((a, b) => a.r - b.r);
  const conform = Math.round((SIM.filter((t) => t.conform).length / n) * 100);
  const morn = SIM.filter((t) => t.hour <= 11);
  const aft = SIM.filter((t) => t.hour >= 15);
  const mornExp = morn.reduce((a, t) => a + t.r, 0) / (morn.length || 1);
  const aftExp = aft.reduce((a, t) => a + t.r, 0) / (aft.length || 1);
  return {
    n,
    equity,
    total: Math.round(cum * 10) / 10,
    winrate: Math.round((wins / n) * 100),
    expectancy: cum / n,
    profitFactor: grossLoss ? grossWin / grossLoss : grossWin,
    maxDD,
    byInstr,
    byHour,
    bySetup,
    byTag,
    conform,
    mornExp,
    aftExp,
    recent: SIM.slice(-7).reverse(),
  };
})();

const fmtR = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}R`;

function RVal({ v, className = "" }: { v: number; className?: string }) {
  return <span className={`mono ${v >= 0 ? "text-edge" : "text-risk"} ${className}`}>{fmtR(v)}</span>;
}

// Statut interne (stable, sert de clé) → clé de traduction pour l'affichage.
const setupStatut = (r: number) =>
  r >= 20 ? "Prioritaire" : r >= 5 ? "Solide" : r >= -5 ? "À surveiller" : "À retirer";
const statutClass: Record<string, string> = {
  Prioritaire: "text-edge",
  Solide: "text-ink",
  "À surveiller": "text-ink-mute",
  "À retirer": "text-risk",
};
const STATUT_KEY: Record<string, string> = {
  Prioritaire: "statPrioritaire",
  Solide: "statSolide",
  "À surveiller": "statSurveiller",
  "À retirer": "statRetirer",
};
const TAG_KEY: Record<string, string> = {
  "Revenge trade": "tagRevenge",
  "Sortie prématurée": "tagEarlyExit",
  "Position traînée": "tagDragged",
};

/* ------------------------------------------------------------------ visuels */

function EquityCurve({ data, gid, className = "h-44" }: { data: number[]; gid: string; className?: string }) {
  const w = 100;
  const h = 40;
  const max = Math.max(...data, 0);
  const min = Math.min(...data, 0);
  const span = max - min || 1;
  const x = (i: number) => (i / (data.length - 1)) * w;
  const y = (v: number) => h - ((v - min) / span) * h;
  const line = data.map((v, i) => `${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  const zeroY = y(0);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={`w-full ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`eq-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(34,197,94,0.22)" />
          <stop offset="100%" stopColor="rgba(34,197,94,0)" />
        </linearGradient>
      </defs>
      <line
        x1="0"
        y1={zeroY}
        x2={w}
        y2={zeroY}
        stroke="#262626"
        strokeWidth="0.4"
        strokeDasharray="2 2"
        vectorEffect="non-scaling-stroke"
      />
      <polygon points={area} fill={`url(#eq-${gid})`} />
      <polyline
        points={line}
        fill="none"
        stroke="#22c55e"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function TradeRBars({ trades, className = "h-20" }: { trades: Sim[]; className?: string }) {
  const w = 100;
  const h = 40;
  const mid = h / 2;
  const max = Math.max(...trades.map((t) => Math.abs(t.r)), 1);
  const bw = w / trades.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={`w-full ${className}`} aria-hidden="true">
      <line x1="0" y1={mid} x2={w} y2={mid} stroke="#262626" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
      {trades.map((t, i) => {
        const bh = (Math.abs(t.r) / max) * (mid - 1);
        return (
          <rect
            key={i}
            x={i * bw + bw * 0.16}
            y={t.r >= 0 ? mid - bh : mid}
            width={bw * 0.68}
            height={bh}
            fill={t.r >= 0 ? "#22c55e" : "#ef4444"}
            opacity="0.85"
          />
        );
      })}
    </svg>
  );
}

function DashboardHero({ t }: { t: Tx }) {
  const kpis = [
    { k: t("kpiCumR90"), v: fmtR(D.total), tone: "edge" },
    { k: t("kpiWinrate"), v: `${D.winrate} %`, tone: "" },
    { k: t("kpiExpectancy"), v: fmtR(D.expectancy), tone: "edge" },
    { k: t("kpiProfitFactor"), v: D.profitFactor.toFixed(2), tone: "" },
    { k: t("kpiMaxDD"), v: `-${D.maxDD.toFixed(1)}R`, tone: "risk" },
  ];
  const tabs = [t("tabDashboard"), t("tabTrades"), t("tabPerformance"), t("tabWeekly")];
  return (
    <div className="glow-border glow-border-live rounded-2xl bg-black/50 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-white">
            Meridian<span className="text-ink-muted">°</span> Journal
          </span>
          <span className="mono text-[9px] uppercase tracking-[0.2em] text-ink-faint hidden sm:inline">
            {t("demoAccount")}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1 mono text-[10px] uppercase tracking-[0.15em]">
          {tabs.map((tab, i) => (
            <span
              key={tab}
              className={`px-2.5 py-1 rounded-full ${i === 0 ? "bg-white/10 text-white" : "text-ink-faint"}`}
            >
              {tab}
            </span>
          ))}
        </div>
        <span className="pill pill-green">90 j</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-border border-b border-border">
        {kpis.map((s) => (
          <div key={s.k} className="bg-black px-4 py-3.5">
            <div className="mono text-[9px] uppercase tracking-[0.2em] text-ink-faint">{s.k}</div>
            <div
              className={`mono text-lg font-semibold mt-1 ${
                s.tone === "edge" ? "text-edge" : s.tone === "risk" ? "text-risk" : "text-white"
              }`}
            >
              {s.v}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
        <div className="lg:col-span-2 bg-black p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">{t("equityCumR")}</span>
            <span className="mono text-[10px] text-ink-faint">{t("nTrades", { n: D.n })}</span>
          </div>
          <EquityCurve data={D.equity} gid="hero" className="h-44 md:h-56" />
        </div>
        <div className="bg-black p-5">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-3.5">{t("lastTrades")}</div>
          <div className="space-y-2.5">
            {D.recent.slice(0, 6).map((tr) => (
              <div key={tr.i} className="flex items-center justify-between gap-2">
                <span className="mono text-[11px] text-white w-14 shrink-0">{tr.sym}</span>
                <span
                  className={`mono text-[9px] px-1.5 py-0.5 rounded shrink-0 ${
                    tr.side === "L" ? "text-edge bg-edge/10" : "text-risk bg-risk/10"
                  }`}
                >
                  {tr.side}
                </span>
                <span className="mono text-[9px] uppercase tracking-[0.1em] text-ink-faint flex-1 text-right">
                  {tr.conform ? t("confShort") : t("ecartShort")}
                </span>
                <RVal v={tr.r} className="text-[12px] w-12 text-right shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InstrumentBars() {
  const max = Math.max(...D.byInstr.map((x) => Math.abs(x.r)), 1);
  return (
    <div className="space-y-3.5">
      {D.byInstr.map((x) => (
        <div key={x.sym}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="mono text-[12px] text-white">{x.sym}</span>
            <RVal v={x.r} className="text-[12px]" />
          </div>
          <div className="h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className={`h-full rounded-full ${x.r >= 0 ? "bg-edge" : "bg-risk"}`}
              style={{ width: `${Math.max(6, (Math.abs(x.r) / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function HourBars({ t }: { t: Tx }) {
  const max = Math.max(...D.byHour.map((x) => Math.abs(x.exp)), 0.4);
  return (
    <div>
      <div className="flex items-stretch justify-between gap-1.5">
        {D.byHour.map((x) => (
          <div key={x.h} className="flex-1 flex flex-col items-center">
            <div className="h-12 w-full flex items-end justify-center">
              {x.exp >= 0 && (
                <div className="w-2.5 rounded-t bg-edge" style={{ height: `${(x.exp / max) * 100}%` }} />
              )}
            </div>
            <div className="h-px w-full bg-border-2" />
            <div className="h-12 w-full flex items-start justify-center">
              {x.exp < 0 && (
                <div className="w-2.5 rounded-b bg-risk" style={{ height: `${(Math.abs(x.exp) / max) * 100}%` }} />
              )}
            </div>
            <span className="mono text-[8px] text-ink-faint mt-1.5">{x.h}h</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mono text-[9px] uppercase tracking-[0.15em] text-ink-faint mt-4">
        <span>
          {t("morning")} <RVal v={D.mornExp} className="text-[10px]" />
        </span>
        <span>
          {t("afternoon")} <RVal v={D.aftExp} className="text-[10px]" />
        </span>
      </div>
    </div>
  );
}

function SetupBars({ t }: { t: Tx }) {
  const max = Math.max(...D.bySetup.map((s) => Math.abs(s.r)), 1);
  return (
    <div className="space-y-3.5">
      {D.bySetup.map((s) => {
        const statut = setupStatut(s.r);
        return (
          <div key={s.name}>
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-[12px] text-white truncate">{s.name}</span>
              <RVal v={s.r} className="text-[12px] shrink-0" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden">
                <div
                  className={`h-full rounded-full ${s.r >= 0 ? "bg-edge" : "bg-risk"}`}
                  style={{
                    width: `${Math.max(8, (Math.abs(s.r) / max) * 100)}%`,
                    opacity: statut === "À surveiller" ? 0.5 : 1,
                  }}
                />
              </div>
              <span
                className={`mono text-[9px] uppercase tracking-[0.15em] shrink-0 w-[88px] text-right ${statutClass[statut]}`}
              >
                {t(STATUT_KEY[statut])}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TradesPanel({ t }: { t: Tx }) {
  return (
    <div className="space-y-3">
      {D.recent.map((tr) => (
        <div key={tr.i} className="flex items-center gap-3 text-[12px]">
          <span className="mono text-white w-16 shrink-0">{tr.sym}</span>
          <span
            className={`mono text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
              tr.side === "L" ? "text-edge bg-edge/10" : "text-risk bg-risk/10"
            }`}
          >
            {tr.side === "L" ? t("long") : t("short")}
          </span>
          <span className="text-ink-mute truncate flex-1 hidden sm:block">{tr.setup}</span>
          <span
            className={`mono text-[10px] uppercase tracking-[0.1em] shrink-0 ${
              tr.conform ? "text-ink-faint" : "text-risk"
            }`}
          >
            {tr.conform ? t("conforme") : t("ecart")}
          </span>
          <RVal v={tr.r} className="text-[13px] w-12 text-right shrink-0" />
        </div>
      ))}
    </div>
  );
}

function ErreurRows({ t }: { t: Tx }) {
  return (
    <div className="space-y-2.5">
      {D.byTag.map((e) => (
        <div key={e.tag} className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[13px] text-white truncate">{t(TAG_KEY[e.tag])}</div>
            <div className="mono text-[10px] text-ink-faint">{t("nTrades", { n: e.n })}</div>
          </div>
          <RVal v={e.r} className="text-sm shrink-0" />
        </div>
      ))}
    </div>
  );
}

const HEAT = [3, 3, 2, 0, 3, 1, 0, 3, 2, 3, 3, 2, 0, 0, 1, 3, 3, 0, 2, 3, 3, 0, 0, 3, 1, 2, 3, 3, 0, 0, 3, 3, 2, 3, 0];
const heatColor = (v: number) =>
  v === 0 ? "#151515" : v === 1 ? "rgba(239,68,68,0.5)" : v === 2 ? "#525252" : "rgba(34,197,94,0.6)";

/* ------------------------------------------------------------------ page */

export default async function JournalMarketing() {
  const t = await getTranslations("JournalSales");
  const problems = t.raw("problems") as { k: string; d: string }[];
  const pillars = t.raw("pillars") as { eyebrow: string; title: string; desc: string }[];
  const weeklyItems = t.raw("weeklyItems") as { t: string; d: string }[];
  const steps = t.raw("steps") as { n: string; t: string; d: string }[];
  const faq = t.raw("faq") as FaqItem[];
  const included = t.raw("included") as string[];

  const platforms = [
    { mark: <MetaTraderLogo variant="4" />, status: t("platReadyCsv"), tone: "edge" as const },
    { mark: <MetaTraderLogo variant="5" />, status: t("platReadyCsv"), tone: "edge" as const },
    { mark: <CsvMark />, status: t("platReadyFile"), tone: "edge" as const },
    { mark: <ApiMark />, status: t("platSoon"), tone: "mute" as const },
  ];

  const plans = [
    {
      name: t("planMonthlyName"),
      plan: "monthly",
      price: "19 €",
      period: t("planMonthlyPeriod"),
      sub: t("planMonthlySub"),
      perks: t.raw("planMonthlyPerks") as string[],
      cta: t("planMonthlyCta"),
      primary: false,
      badge: "",
    },
    {
      name: t("planAnnualName"),
      plan: "annual",
      price: "190 €",
      period: t("planAnnualPeriod"),
      sub: t("planAnnualSub"),
      perks: t.raw("planAnnualPerks") as string[],
      cta: t("planAnnualCta"),
      primary: true,
      badge: t("planAnnualBadge"),
    },
  ];

  return (
    <main className="relative min-h-screen">
      {/* 1 — HERO + grand visuel dashboard */}
      <section className="relative pt-28 md:pt-32 pb-24 md:pb-28 overflow-hidden">
        <AmbientOrbs />
        <div
          className="absolute inset-x-0 top-0 h-[620px] pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.06), transparent 70%)",
          }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10 relative">
          <div className="max-w-3xl">
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-6 fade-in">
              {t("heroEyebrow")}
            </div>
            <h1 className="h-title text-[38px] sm:text-[52px] md:text-[62px] lg:text-[68px] fade-in-up">
              {t("heroTitle1")}
              <br />
              <span className="shimmer">{t("heroTitle2")}</span>
            </h1>
            <p className="text-ink-mute text-base md:text-lg max-w-xl mt-6 leading-relaxed fade-in-up-2">
              {t("heroIntro")}
            </p>
            <div className="flex flex-wrap gap-3 mt-8 fade-in-up-3">
              <a href="#tarifs" className="btn btn-primary">
                {t("heroCta1")}
              </a>
              <Link href={APP_HREF} className="btn btn-ghost">
                {t("heroCta2")}
              </Link>
            </div>
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mt-5 fade-in-up-3">
              {t("heroMeta")}
            </div>
          </div>

          {/* grand visuel — dashboard complet, compte de démonstration, données en R */}
          <div className="mt-10 md:mt-12 fade-in-up-3">
            <DashboardHero t={t} />
            <div className="mono text-[9px] uppercase tracking-[0.2em] text-ink-faint mt-4 text-center">
              {t("demoCaption")}
            </div>
          </div>
        </div>
      </section>

      {/* 2 — LE PROBLÈME */}
      <section className="relative py-24 md:py-32 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">{t("problemEyebrow")}</div>
            <h2 className="h-title text-3xl md:text-5xl max-w-3xl mb-14">
              {t("problemTitle1")}
              <br />
              <span className="text-ink-muted">{t("problemTitle2")}</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {problems.map((p, i) => (
              <Reveal key={p.k} delay={i * 120}>
                <div className="bg-black p-8 md:p-10 h-full">
                  <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-5">0{i + 1}</div>
                  <div className="text-xl font-semibold mb-3">{p.k}</div>
                  <p className="text-ink-mute text-sm leading-relaxed">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <p className="text-xl md:text-2xl font-light tracking-tight text-ink mt-12 max-w-3xl">
              {t("problemConcl1")}
              <span className="text-ink-muted">{t("problemConcl2")}</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3 — LES 3 PILIERS */}
      <section className="relative py-24 md:py-32 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">
              {t("pillarsEyebrow")}
            </div>
            <h2 className="h-title text-3xl md:text-5xl max-w-2xl mb-14">
              {t("pillarsTitle1")}
              <br />
              <span className="shimmer">{t("pillarsTitle2")}</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {pillars.map((p, i) => (
              <Reveal key={p.eyebrow} delay={i * 120}>
                <div className="pillar-card bg-black p-10 md:p-12 h-full">
                  <div className="mono text-[10px] uppercase tracking-[0.35em] text-ink-faint mb-8">{p.eyebrow}</div>
                  <div className="text-2xl md:text-[26px] font-semibold tracking-tight mb-3">{p.title}</div>
                  <p className="text-ink-mute text-sm leading-relaxed max-w-xs">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — APERÇU · LA COURBE, TRADE PAR TRADE */}
      <section className="relative py-24 md:py-32 border-t border-border overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 30%, rgba(255,255,255,0.04), transparent 70%)",
          }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">{t("s4Eyebrow")}</div>
            <h2 className="h-title text-3xl md:text-5xl max-w-2xl mb-6">
              {t("s4Title1")}
              <br />
              <span className="shimmer">{t("s4Title2")}</span>
            </h2>
            <p className="text-ink-mute text-base leading-relaxed max-w-2xl mb-12">
              {t("s4Intro")}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="glow-border rounded-2xl bg-black/40 backdrop-blur-sm p-6 md:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border mb-6">
                {[
                  { k: t("kpiCumR"), v: fmtR(D.total), tone: "edge" },
                  { k: t("kpiWinrate"), v: `${D.winrate} %`, tone: "" },
                  { k: t("kpiExpectancy"), v: fmtR(D.expectancy), tone: "edge" },
                  { k: t("kpiProfitFactor"), v: D.profitFactor.toFixed(2), tone: "" },
                ].map((s) => (
                  <div key={s.k} className="bg-black px-4 py-3">
                    <div className="mono text-[9px] uppercase tracking-[0.2em] text-ink-faint">{s.k}</div>
                    <div className={`mono text-base font-semibold mt-0.5 ${s.tone === "edge" ? "text-edge" : "text-white"}`}>
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-2">{t("equityCumR")}</div>
              <EquityCurve data={D.equity} gid="tour" className="h-40 md:h-52" />
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mt-7 mb-2">
                {t("eachBarTrade", { n: D.n })}
              </div>
              <TradeRBars trades={SIM} className="h-16 md:h-20" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5 — APERÇU · PERFORMANCE */}
      <section className="relative py-24 md:py-32 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">{t("s5Eyebrow")}</div>
            <h2 className="h-title text-3xl md:text-5xl max-w-2xl mb-6">
              {t("s5Title1")}
              <br />
              <span className="text-ink-muted">{t("s5Title2")}</span>
            </h2>
            <p className="text-ink-mute text-base leading-relaxed max-w-2xl mb-12">
              {t("s5Intro")}
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            <Reveal>
              <div className="bg-black p-7 md:p-8 h-full">
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-6">
                  {t("perfByInstrument")}
                </div>
                <InstrumentBars />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="bg-black p-7 md:p-8 h-full">
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-6">
                  {t("expectancyByHour")}
                </div>
                <HourBars t={t} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6 — APERÇU · COMPORTEMENT */}
      <section className="relative py-24 md:py-32 border-t border-border overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 70% 40%, rgba(255,255,255,0.04), transparent 70%)",
          }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <Reveal as="div" className="lg:col-span-5">
              <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">
                {t("s6Eyebrow")}
              </div>
              <h2 className="h-title text-3xl md:text-5xl mb-6">
                {t("s6Title1")}
                <br />
                <span className="shimmer">{t("s6Title2")}</span>
              </h2>
              <p className="text-ink-mute text-base leading-relaxed max-w-md">
                {t("s6Intro")}
              </p>
            </Reveal>

            <Reveal as="div" className="lg:col-span-7" delay={120}>
              <div className="glow-border rounded-2xl bg-black/40 backdrop-blur-sm p-6 md:p-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="rounded-xl border border-border bg-black p-5">
                    <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-4">
                      {t("recurringErrors")}
                    </div>
                    <ErreurRows t={t} />
                  </div>
                  <div className="rounded-xl border border-border bg-black p-5">
                    <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-4">
                      {t("conformity7w")}
                    </div>
                    <div className="flex flex-wrap gap-[3px]">
                      {HEAT.map((v, i) => (
                        <span key={i} className="w-3.5 h-3.5 rounded-[2px]" style={{ background: heatColor(v) }} />
                      ))}
                    </div>
                    <div className="mono text-[10px] text-ink-faint mt-4">{t("avgConformity", { pct: D.conform })}</div>
                  </div>
                </div>
                <div className="mt-5 rounded-xl border border-border bg-black p-5">
                  <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-2">
                    {t("autoInsight")}
                  </div>
                  <p className="text-sm text-ink leading-relaxed">
                    {t.rich("insightText", {
                      morn: () => <RVal v={D.mornExp} />,
                      aft: () => <RVal v={D.aftExp} />,
                    })}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 7 — APERÇU · SETUPS & JOURNAL */}
      <section className="relative py-24 md:py-32 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">{t("s7Eyebrow")}</div>
            <h2 className="h-title text-3xl md:text-5xl max-w-2xl mb-6">
              {t("s7Title1")}
              <br />
              <span className="shimmer">{t("s7Title2")}</span>
            </h2>
            <p className="text-ink-mute text-base leading-relaxed max-w-2xl mb-12">
              {t("s7Intro")}
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            <Reveal>
              <div className="bg-black p-7 md:p-8 h-full">
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-6">
                  {t("setupStatus")}
                </div>
                <SetupBars t={t} />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="bg-black p-7 md:p-8 h-full">
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-6">
                  {t("journalLastTrades")}
                </div>
                <TradesPanel t={t} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 8 — WEEKLY REPORT */}
      <section className="relative py-24 md:py-32 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <Reveal as="div" className="lg:col-span-5">
              <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">{t("s8Eyebrow")}</div>
              <h2 className="h-title text-3xl md:text-5xl mb-6">
                {t("s8Title1")}
                <br />
                <span className="text-ink-muted">{t("s8Title2")}</span>
              </h2>
              <p className="text-ink-mute text-base leading-relaxed max-w-md">
                {t("s8Intro")}
              </p>
            </Reveal>

            <Reveal as="div" className="lg:col-span-7" delay={120}>
              <div className="glow-border rounded-2xl bg-black/40 backdrop-blur-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <span className="mono text-[11px] text-ink-mute">meridianFR@hotmail.com</span>
                  <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">{t("weeklyReportTag")}</span>
                </div>
                <div className="p-6 md:p-7 space-y-4">
                  <div className="text-lg font-semibold tracking-tight">
                    {t.rich("weeklySubject", {
                      r: (chunks) => <span className="mono text-edge">{chunks}</span>,
                    })}
                  </div>
                  <p className="text-sm text-ink-mute leading-relaxed">{t("weeklyGreeting")}</p>
                  {weeklyItems.map((m) => (
                    <div key={m.t}>
                      <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-1">{m.t}</div>
                      <p className="text-sm text-ink leading-relaxed">{m.d}</p>
                    </div>
                  ))}
                  <p className="text-sm text-ink-mute leading-relaxed pt-1">{t("weeklySignoff")}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 9 — COMMENT ÇA MARCHE */}
      <section className="relative py-24 md:py-32 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">{t("s9Eyebrow")}</div>
            <h2 className="h-title text-3xl md:text-5xl max-w-2xl mb-14">
              {t("s9Title1")}
              <br />
              <span className="shimmer">{t("s9Title2")}</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="bg-black p-10 md:p-12 h-full">
                  <div className="mono text-3xl text-ink-faint mb-6">{s.n}</div>
                  <div className="text-xl font-semibold mb-3">{s.t}</div>
                  <p className="text-ink-mute text-sm leading-relaxed">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — COMPATIBILITÉ */}
      <section className="relative py-20 md:py-28 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">{t("s10Eyebrow")}</div>
            <h2 className="h-title text-3xl md:text-5xl max-w-3xl mb-6">{t("s10Title")}</h2>
            <p className="text-ink-mute text-base leading-relaxed max-w-2xl mb-12">
              {t("s10Intro")}
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {platforms.map((p, i) => (
              <Reveal key={i} delay={i * 90}>
                <div className="bg-black p-7 h-full flex flex-col justify-between gap-6 min-h-[148px]">
                  {p.mark}
                  <div
                    className={`mono text-[10px] uppercase tracking-[0.2em] ${
                      p.tone === "edge" ? "text-edge" : "text-ink-faint"
                    }`}
                  >
                    {p.status}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 11 — FAQ */}
      <section className="relative py-24 md:py-32 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <Reveal as="div" className="lg:col-span-4">
              <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">{t("s11Eyebrow")}</div>
              <h2 className="h-title text-3xl md:text-5xl">
                {t("s11Title1")}
                <br />
                <span className="text-ink-muted">{t("s11Title2")}</span>
              </h2>
            </Reveal>
            <Reveal as="div" className="lg:col-span-8" delay={120}>
              <FaqAccordion items={faq} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 12 — TARIFS (deux formules + inclus + paiement) */}
      <section id="tarifs" className="relative py-24 md:py-32 border-t border-border scroll-mt-20 overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.05), transparent 70%)",
          }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">{t("s12Eyebrow")}</div>
            <h2 className="h-title text-3xl md:text-5xl max-w-2xl mb-4">
              {t("s12Title1")}
              <br />
              <span className="shimmer">{t("s12Title2")}</span>
            </h2>
            <p className="text-ink-mute text-base leading-relaxed max-w-2xl mb-14">
              {t("s12Intro")}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border max-w-3xl">
            {plans.map((p, i) => (
              <Reveal key={p.name} delay={i * 120}>
                <div className={`p-8 md:p-10 h-full flex flex-col ${p.primary ? "bg-[#070707]" : "bg-black"}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">{p.name}</span>
                    {p.badge && <span className="pill pill-green">{p.badge}</span>}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold tracking-tight">{p.price}</span>
                    <span className="text-ink-mute text-sm">{p.period}</span>
                  </div>
                  <div className="mono text-[11px] text-ink-faint mt-2 mb-7">{p.sub}</div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {p.perks.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-ink">
                        <span className="text-edge mono mt-0.5 shrink-0">+</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <form method="post" action="/api/checkout">
                    <input type="hidden" name="plan" value={p.plan} />
                    <button
                      type="submit"
                      className={`btn ${p.primary ? "btn-primary" : "btn-ghost"} w-full justify-center`}
                    >
                      {p.cta}
                    </button>
                  </form>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="bg-border rounded-2xl overflow-hidden border border-border mt-px">
              <div className="bg-black p-8 md:p-10">
                <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-6">
                  {t("includedTitle")}
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {included.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-ink">
                      <span className="text-edge mono mt-0.5 shrink-0">+</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-12 flex flex-col items-center gap-5 text-center">
              <div className="inline-flex items-center gap-2 text-ink-mute">
                <LockIcon className="text-edge" />
                <span className="text-[13px]">{t("securePayment")}</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
                <VisaMark />
                <MastercardMark />
                <AmexMark />
                <ApplePayMark />
                <span className="text-ink-faint hidden sm:inline">·</span>
                <StripeMark />
              </div>
              <p className="text-ink-mute text-sm mt-1">
                {t("pricingNote")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 13 — CTA FINAL */}
      <section className="relative py-28 md:py-40 border-t border-border overflow-hidden">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,255,255,0.07), transparent 70%)",
          }}
        />
        <div className="max-w-wrap mx-auto px-6 sm:px-10 text-center">
          <Reveal>
            <h2 className="h-title text-4xl md:text-6xl mb-8">
              {t("s13Title1")}
              <br />
              <span className="shimmer">{t("s13Title2")}</span>
            </h2>
            <div className="flex justify-center">
              <a href="#tarifs" className="btn btn-primary">
                {t("heroCta1")}
              </a>
            </div>
            <p className="text-ink-mute text-sm mt-6">{t("finalNote")}</p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
