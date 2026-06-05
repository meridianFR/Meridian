import Link from "next/link";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  alternates: { canonical: "/journal" },
  title: "Meridian Journal — analyse ton comportement de trader",
  description:
    "Le journal de trading qui transforme ton historique MT4/MT5 en décisions : erreurs récurrentes chiffrées en R, statut de tes setups, Weekly Report comportemental chaque dimanche. 19 €/mois, sans engagement.",
};

const APP_HREF = "/journal-preview";

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

const setupStatut = (r: number) =>
  r >= 20 ? "Prioritaire" : r >= 5 ? "Solide" : r >= -5 ? "À surveiller" : "À retirer";
const statutClass: Record<string, string> = {
  Prioritaire: "text-edge",
  Solide: "text-ink",
  "À surveiller": "text-ink-mute",
  "À retirer": "text-risk",
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

function DashboardHero() {
  const kpis = [
    { k: "R cumulé · 90j", v: fmtR(D.total), tone: "edge" },
    { k: "Winrate", v: `${D.winrate} %`, tone: "" },
    { k: "Expectancy", v: fmtR(D.expectancy), tone: "edge" },
    { k: "Profit factor", v: D.profitFactor.toFixed(2), tone: "" },
    { k: "Drawdown max", v: `-${D.maxDD.toFixed(1)}R`, tone: "risk" },
  ];
  return (
    <div className="glow-border glow-border-live rounded-2xl bg-black/50 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-white">
            Meridian<span className="text-ink-muted">°</span> Journal
          </span>
          <span className="mono text-[9px] uppercase tracking-[0.2em] text-ink-faint hidden sm:inline">
            compte démo
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1 mono text-[10px] uppercase tracking-[0.15em]">
          {["Dashboard", "Trades", "Performance", "Weekly"].map((t, i) => (
            <span
              key={t}
              className={`px-2.5 py-1 rounded-full ${i === 0 ? "bg-white/10 text-white" : "text-ink-faint"}`}
            >
              {t}
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
            <span className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">Equity cumulée · R</span>
            <span className="mono text-[10px] text-ink-faint">{D.n} trades</span>
          </div>
          <EquityCurve data={D.equity} gid="hero" className="h-44 md:h-56" />
        </div>
        <div className="bg-black p-5">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-3.5">Derniers trades</div>
          <div className="space-y-2.5">
            {D.recent.slice(0, 6).map((t) => (
              <div key={t.i} className="flex items-center justify-between gap-2">
                <span className="mono text-[11px] text-white w-14 shrink-0">{t.sym}</span>
                <span
                  className={`mono text-[9px] px-1.5 py-0.5 rounded shrink-0 ${
                    t.side === "L" ? "text-edge bg-edge/10" : "text-risk bg-risk/10"
                  }`}
                >
                  {t.side}
                </span>
                <span className="mono text-[9px] uppercase tracking-[0.1em] text-ink-faint flex-1 text-right">
                  {t.conform ? "conf." : "écart"}
                </span>
                <RVal v={t.r} className="text-[12px] w-12 text-right shrink-0" />
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

function HourBars() {
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
          Matin <RVal v={D.mornExp} className="text-[10px]" />
        </span>
        <span>
          Après 15h <RVal v={D.aftExp} className="text-[10px]" />
        </span>
      </div>
    </div>
  );
}

function SetupBars() {
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
                {statut}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TradesPanel() {
  return (
    <div className="space-y-3">
      {D.recent.map((t) => (
        <div key={t.i} className="flex items-center gap-3 text-[12px]">
          <span className="mono text-white w-16 shrink-0">{t.sym}</span>
          <span
            className={`mono text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
              t.side === "L" ? "text-edge bg-edge/10" : "text-risk bg-risk/10"
            }`}
          >
            {t.side === "L" ? "Long" : "Short"}
          </span>
          <span className="text-ink-mute truncate flex-1 hidden sm:block">{t.setup}</span>
          <span
            className={`mono text-[10px] uppercase tracking-[0.1em] shrink-0 ${
              t.conform ? "text-ink-faint" : "text-risk"
            }`}
          >
            {t.conform ? "Conforme" : "Écart"}
          </span>
          <RVal v={t.r} className="text-[13px] w-12 text-right shrink-0" />
        </div>
      ))}
    </div>
  );
}

function ErreurRows() {
  return (
    <div className="space-y-2.5">
      {D.byTag.map((e) => (
        <div key={e.tag} className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[13px] text-white truncate">{e.tag}</div>
            <div className="mono text-[10px] text-ink-faint">{e.n} trades</div>
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

/* ------------------------------------------------------------------ contenu */

const PROBLEMS = [
  { k: "L'Excel", d: "Tu remplis, tu ne relis jamais. Des colonnes qui s'accumulent, aucune lecture." },
  { k: "Le track record broker", d: "Une courbe d'equity et un solde. Zéro analyse de ce que tu fais vraiment." },
  { k: "Les journaux à 40 champs", d: "Trop de friction. Tu abandonnes au bout de huit trades." },
];

const PILLARS = [
  {
    eyebrow: "01 — Tracking",
    title: "Tes chiffres, en R",
    desc: "Winrate, expectancy, drawdown, profit factor. En R par défaut. Import broker en trente secondes.",
  },
  {
    eyebrow: "02 — Comportement",
    title: "Tes erreurs, chiffrées",
    desc: "Ce que le revenge trade te coûte. Tes heures destructrices. Les patterns que tu ne vois pas seul.",
  },
  {
    eyebrow: "03 — Stratégie",
    title: "Quoi garder, quoi retirer",
    desc: "Un statut clair par setup : prioritaire, solide, à retirer. Une décision, pas juste une statistique.",
  },
];

const STEPS = [
  {
    n: "01",
    t: "Importe",
    d: "Glisse ton historique MT4 ou MT5. Deux cents trades lus en trente secondes, le R recalculé depuis ton stop.",
  },
  {
    n: "02",
    t: "Journalise",
    d: "Quatre champs par trade : instrument, sens, setup, conformité au plan. Le reste est rempli automatiquement.",
  },
  {
    n: "03",
    t: "Lis",
    d: "Dashboard, erreurs récurrentes, Weekly Report. Tu sais quoi ajuster avant la séance suivante.",
  },
];

const INCLUS = [
  "Import MT4 / MT5",
  "Statistiques en R",
  "5 vues de performance",
  "Statut automatique des setups",
  "12 tags comportement",
  "Heatmap de conformité",
  "Insights automatiques",
  "Weekly Report hebdomadaire",
  "Jusqu'à 3 comptes",
  "Export CSV / PDF",
  "Support email",
];

const ROADMAP = [
  "API broker directe",
  "Comparaison cohorte anonymisée",
  "Tags personnalisés",
  "Application mobile",
  "Crypto",
];

const PLATFORMS = [
  { mark: <MetaTraderLogo variant="4" />, status: "Import CSV · prêt", tone: "edge" as const },
  { mark: <MetaTraderLogo variant="5" />, status: "Import CSV · prêt", tone: "edge" as const },
  { mark: <CsvMark />, status: "Fichier · prêt", tone: "edge" as const },
  { mark: <ApiMark />, status: "À venir · roadmap", tone: "mute" as const },
];

const PLANS = [
  {
    name: "Mensuel",
    plan: "monthly",
    price: "19 €",
    period: "/ mois",
    sub: "Sans engagement.",
    perks: ["Tout le Journal, sans limite", "Weekly Report chaque dimanche", "Jusqu'à 3 comptes"],
    cta: "Essayer le mensuel",
    primary: false,
    badge: "",
  },
  {
    name: "Annuel",
    plan: "annual",
    price: "190 €",
    period: "/ an",
    sub: "Soit 15,83 €/mois.",
    perks: ["Tout le mensuel", "Deux mois offerts (−17 %)", "Pack PDF stratégies inclus"],
    cta: "Prendre l'annuel",
    primary: true,
    badge: "Deux mois offerts",
  },
];

const FAQ: FaqItem[] = [
  {
    q: "Pour qui ce n'est PAS ?",
    a: "Si tu trades deux fois par mois en swing long terme, ce journal est surdimensionné. Si tu cherches des signaux ou un coach, ce n'est pas ici. Meridian Journal est fait pour les traders actifs qui veulent mesurer et corriger.",
  },
  {
    q: "Ça marche avec quel broker ?",
    a: "MT4 et MT5, via l'export d'historique standard — donc la quasi-totalité des brokers. Un import CSV générique couvre le reste. L'API directe est en roadmap.",
  },
  {
    q: "Mes données sont-elles en sécurité ?",
    a: "Hébergement dans l'Union européenne, données chiffrées, jamais revendues. Export et suppression complète à tout moment.",
  },
  {
    q: "Est-ce que ça va me rendre rentable ?",
    a: "Non. Aucun outil ne rend rentable. Le Journal te montre tes patterns et ce que tes erreurs te coûtent, en R. Ce que tu en fais t'appartient.",
  },
  {
    q: "Combien de temps par jour ?",
    a: "Environ trente secondes par trade, et dix à quinze minutes de revue le dimanche. C'est tout.",
  },
  {
    q: "Et si j'arrête ?",
    a: "Résiliation en un clic, sans justification. Tu repars avec un export complet de tes données.",
  },
];

/* ------------------------------------------------------------------ page */

export default function JournalMarketing() {
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
              ° Meridian Journal
            </div>
            <h1 className="h-title text-[38px] sm:text-[52px] md:text-[62px] lg:text-[68px] fade-in-up">
              Trade ce que tu mesures.
              <br />
              <span className="shimmer">Mesure ce que tu trades.</span>
            </h1>
            <p className="text-ink-mute text-base md:text-lg max-w-xl mt-6 leading-relaxed fade-in-up-2">
              Le journal qui transforme ton historique de trades en décisions : quel setup garder,
              quelle erreur te coûte le plus, à quelle heure tu détruis ton edge. Pas un track record
              de plus.
            </p>
            <div className="flex flex-wrap gap-3 mt-8 fade-in-up-3">
              <Link href="#tarifs" className="btn btn-primary">
                Essayer le Journal — 19 €/mois
              </Link>
              <Link href={APP_HREF} className="btn btn-ghost">
                Voir la démo
              </Link>
            </div>
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mt-5 fade-in-up-3">
              Import MT4 / MT5 · Weekly Report comportemental · sans engagement
            </div>
          </div>

          {/* grand visuel — dashboard complet, compte de démonstration, données en R */}
          <div className="mt-10 md:mt-12 fade-in-up-3">
            <DashboardHero />
            <div className="mono text-[9px] uppercase tracking-[0.2em] text-ink-faint mt-4 text-center">
              Aperçu d'un compte de démonstration · toutes les données en R · anonymisées
            </div>
          </div>
        </div>
      </section>

      {/* 2 — LE PROBLÈME */}
      <section className="relative py-24 md:py-32 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">° Le problème</div>
            <h2 className="h-title text-3xl md:text-5xl max-w-3xl mb-14">
              Ton journal actuel te dit que tu as perdu.
              <br />
              <span className="text-ink-muted">Pas pourquoi.</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {PROBLEMS.map((p, i) => (
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
              Le problème n'est pas le manque de données.
              <span className="text-ink-muted"> C'est l'absence de lecture.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3 — LES 3 PILIERS */}
      <section className="relative py-24 md:py-32 border-t border-border">
        <div className="max-w-wrap mx-auto px-6 sm:px-10">
          <Reveal>
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">
              ° Ce que fait Meridian Journal
            </div>
            <h2 className="h-title text-3xl md:text-5xl max-w-2xl mb-14">
              Trois lectures,
              <br />
              <span className="shimmer">une décision.</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {PILLARS.map((p, i) => (
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
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">° Aperçu — Dashboard</div>
            <h2 className="h-title text-3xl md:text-5xl max-w-2xl mb-6">
              Une courbe construite
              <br />
              <span className="shimmer">trade par trade.</span>
            </h2>
            <p className="text-ink-mute text-base leading-relaxed max-w-2xl mb-12">
              Tu importes ton historique, le R est recalculé depuis ton stop, et chaque trade vient
              nourrir ta courbe d'equity. Pas un euro affiché — uniquement des multiples de risque.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="glow-border rounded-2xl bg-black/40 backdrop-blur-sm p-6 md:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border mb-6">
                {[
                  { k: "R cumulé", v: fmtR(D.total), tone: "edge" },
                  { k: "Winrate", v: `${D.winrate} %`, tone: "" },
                  { k: "Expectancy", v: fmtR(D.expectancy), tone: "edge" },
                  { k: "Profit factor", v: D.profitFactor.toFixed(2), tone: "" },
                ].map((s) => (
                  <div key={s.k} className="bg-black px-4 py-3">
                    <div className="mono text-[9px] uppercase tracking-[0.2em] text-ink-faint">{s.k}</div>
                    <div className={`mono text-base font-semibold mt-0.5 ${s.tone === "edge" ? "text-edge" : "text-white"}`}>
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-2">Equity cumulée · R</div>
              <EquityCurve data={D.equity} gid="tour" className="h-40 md:h-52" />
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mt-7 mb-2">
                Chaque barre, un trade · {D.n} trades
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
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">° Aperçu — Performance</div>
            <h2 className="h-title text-3xl md:text-5xl max-w-2xl mb-6">
              Là où tu gagnes.
              <br />
              <span className="text-ink-muted">Là où tu rends.</span>
            </h2>
            <p className="text-ink-mute text-base leading-relaxed max-w-2xl mb-12">
              Cinq vues de performance. Par instrument, par heure, par setup. Tu vois en un regard ce
              qui porte ton edge — et ce qui le grignote.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            <Reveal>
              <div className="bg-black p-7 md:p-8 h-full">
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-6">
                  Performance par instrument · R
                </div>
                <InstrumentBars />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="bg-black p-7 md:p-8 h-full">
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-6">
                  Expectancy par heure · R
                </div>
                <HourBars />
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
                ° Aperçu — Comportement
              </div>
              <h2 className="h-title text-3xl md:text-5xl mb-6">
                Ton journal devrait te dire
                <br />
                <span className="shimmer">quoi arrêter de faire.</span>
              </h2>
              <p className="text-ink-mute text-base leading-relaxed max-w-md">
                Douze tags comportement, une heatmap de conformité, des insights automatiques. Les
                erreurs qui reviennent, chiffrées en R, et les créneaux où ton edge s'effondre.
              </p>
            </Reveal>

            <Reveal as="div" className="lg:col-span-7" delay={120}>
              <div className="glow-border rounded-2xl bg-black/40 backdrop-blur-sm p-6 md:p-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="rounded-xl border border-border bg-black p-5">
                    <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-4">
                      Tes erreurs récurrentes
                    </div>
                    <ErreurRows />
                  </div>
                  <div className="rounded-xl border border-border bg-black p-5">
                    <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-4">
                      Conformité · 7 semaines
                    </div>
                    <div className="flex flex-wrap gap-[3px]">
                      {HEAT.map((v, i) => (
                        <span key={i} className="w-3.5 h-3.5 rounded-[2px]" style={{ background: heatColor(v) }} />
                      ))}
                    </div>
                    <div className="mono text-[10px] text-ink-faint mt-4">Conformité moyenne · {D.conform} %</div>
                  </div>
                </div>
                <div className="mt-5 rounded-xl border border-border bg-black p-5">
                  <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-2">
                    Insight automatique
                  </div>
                  <p className="text-sm text-ink leading-relaxed">
                    Ton expectancy passe de <RVal v={D.mornExp} /> avant midi à <RVal v={D.aftExp} /> après 15h.
                    Ton edge se concentre le matin — l'après-midi, il s'efface.
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
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">° Aperçu — Décision</div>
            <h2 className="h-title text-3xl md:text-5xl max-w-2xl mb-6">
              Quoi garder.
              <br />
              <span className="shimmer">Quoi retirer.</span>
            </h2>
            <p className="text-ink-mute text-base leading-relaxed max-w-2xl mb-12">
              Un statut par setup, calculé sur ton historique réel. Et un journal qui se remplit en
              quatre champs — le reste sort tout seul.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            <Reveal>
              <div className="bg-black p-7 md:p-8 h-full">
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-6">
                  Statut des setups
                </div>
                <SetupBars />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="bg-black p-7 md:p-8 h-full">
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-6">
                  Journal · derniers trades
                </div>
                <TradesPanel />
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
              <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">° Chaque dimanche, 20h</div>
              <h2 className="h-title text-3xl md:text-5xl mb-6">
                Un rapport.
                <br />
                <span className="text-ink-muted">Pas un dashboard de plus.</span>
              </h2>
              <p className="text-ink-mute text-base leading-relaxed max-w-md">
                Pendant que tu te reposes, ton journal lit ta semaine. Trois minutes de lecture, une
                question pour ta revue. C'est ce qui te ramène, chaque dimanche.
              </p>
            </Reveal>

            <Reveal as="div" className="lg:col-span-7" delay={120}>
              <div className="glow-border rounded-2xl bg-black/40 backdrop-blur-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <span className="mono text-[11px] text-ink-mute">meridianFR@hotmail.com</span>
                  <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Weekly Report · S21</span>
                </div>
                <div className="p-6 md:p-7 space-y-4">
                  <div className="text-lg font-semibold tracking-tight">
                    Ta semaine 21 — <span className="mono text-edge">+4.2R</span>, et une question sur tes sorties
                  </div>
                  <p className="text-sm text-ink-mute leading-relaxed">Salut Thomas,</p>
                  {[
                    {
                      t: "Ce qui s'est passé",
                      d: "18 trades, +4.2R cumulés, conformité 78 %. Une semaine propre, portée par le matin.",
                    },
                    {
                      t: "Ce qui a marché",
                      d: "Tes Breakout NY open : +6.1R sur 7 trades. C'est ton setup le plus net du mois.",
                    },
                    {
                      t: "Ce qui n'a pas marché",
                      d: "Deux sorties prématurées t'ont coûté −2.3R de manque à gagner sur des trades conformes.",
                    },
                    {
                      t: "Une hypothèse",
                      d: "Tu sembles couper tes gains quand le trade dépasse +1.5R. La peur de rendre, pas un signal.",
                    },
                    {
                      t: "Une question pour ta revue",
                      d: "Sur tes 3 meilleurs trades coupés tôt, qu'est-ce que tu ressentais à l'instant où tu as fermé ?",
                    },
                  ].map((m) => (
                    <div key={m.t}>
                      <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-1">{m.t}</div>
                      <p className="text-sm text-ink leading-relaxed">{m.d}</p>
                    </div>
                  ))}
                  <p className="text-sm text-ink-mute leading-relaxed pt-1">Bonne semaine, Meridian</p>
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
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">° Comment ça marche</div>
            <h2 className="h-title text-3xl md:text-5xl max-w-2xl mb-14">
              Trois étapes,
              <br />
              <span className="shimmer">zéro friction.</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {STEPS.map((s, i) => (
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
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">° Compatibilité</div>
            <h2 className="h-title text-3xl md:text-5xl max-w-3xl mb-6">Compatible avec ce que tu trades déjà.</h2>
            <p className="text-ink-mute text-base leading-relaxed max-w-2xl mb-12">
              MetaTrader 4 et MetaTrader 5 couvrent la quasi-totalité des brokers. Tu exportes ton
              historique, tu le déposes dans le Journal, le R est recalculé depuis ton stop. Aucune
              connexion à ton compte, aucun mot de passe.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {PLATFORMS.map((p, i) => (
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
              <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">° Questions</div>
              <h2 className="h-title text-3xl md:text-5xl">
                Les vraies
                <br />
                <span className="text-ink-muted">questions.</span>
              </h2>
            </Reveal>
            <Reveal as="div" className="lg:col-span-8" delay={120}>
              <FaqAccordion items={FAQ} />
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
            <div className="mono text-[10px] uppercase tracking-[0.4em] text-ink-faint mb-5">° Tarifs</div>
            <h2 className="h-title text-3xl md:text-5xl max-w-2xl mb-4">
              Deux formules.
              <br />
              <span className="shimmer">Le même Journal complet.</span>
            </h2>
            <p className="text-ink-mute text-base leading-relaxed max-w-2xl mb-14">
              Mensuel ou annuel, tu as accès à tout. La seule différence, c'est le prix sur l'année.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border max-w-3xl">
            {PLANS.map((p, i) => (
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
                  <Link
                    href={`/abonnement?plan=${p.plan}`}
                    className={`btn ${p.primary ? "btn-primary" : "btn-ghost"} w-full justify-center`}
                  >
                    {p.cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden border border-border mt-px">
              <div className="bg-black p-8 md:p-10">
                <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-6">
                  Inclus dans les deux formules
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {INCLUS.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-ink">
                      <span className="text-edge mono mt-0.5 shrink-0">+</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-black p-8 md:p-10">
                <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-6">Pas encore — roadmap</div>
                <ul className="space-y-3">
                  {ROADMAP.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-ink-mute">
                      <span className="text-ink-faint mono mt-0.5 shrink-0">·</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="text-ink-faint text-xs leading-relaxed mt-6 max-w-xs">
                  On construit avec les retours des premiers abonnés. Pas de date promise, pas de
                  fonctionnalité fantôme.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-12 flex flex-col items-center gap-5 text-center">
              <div className="inline-flex items-center gap-2 text-ink-mute">
                <LockIcon className="text-edge" />
                <span className="text-[13px]">Paiement sécurisé via Stripe</span>
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
                Sans engagement. Résiliable en un clic. Tes données exportables à tout moment.
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
              Arrête de deviner.
              <br />
              <span className="shimmer">Commence à mesurer.</span>
            </h2>
            <div className="flex justify-center">
              <Link href="#tarifs" className="btn btn-primary">
                Essayer le Journal — 19 €/mois
              </Link>
            </div>
            <p className="text-ink-mute text-sm mt-6">Sans engagement. Ton premier Weekly Report sous sept jours.</p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
