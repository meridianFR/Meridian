"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ERREURS,
  INSIGHTS,
  INSTRUMENT_OPTIONS,
  KPI_JOUR,
  REPORT_DRAFT_PREVIEW,
  REPORTS,
  TAG_OPTIONS,
  type Trade,
  type WeeklyReport,
} from "./data";
import { computeStats, equitySeries, filterByHorizon, HORIZONS, type DimRow, type Horizon } from "./stats";
import {
  Card,
  CardLabel,
  DistribBars,
  EmotionScatter,
  EquityCurve,
  Eyebrow,
  FlagPill,
  Heatmap,
  HeatmapLegend,
  HoursBars,
  MagnitudeBar,
  Rval,
  StatusPill,
  StreakDots,
  WinLossBar,
} from "./ui";

/* ------------------------------------------------------------------ 01 Aujourd'hui */

export function Aujourdhui({
  trades,
  onSaisir,
  onImport,
  onOpenTrade,
  onVoirTout,
}: {
  trades: Trade[];
  onSaisir: () => void;
  onImport: () => void;
  onOpenTrade: (t: Trade) => void;
  onVoirTout: () => void;
}) {
  const [etat, setEtat] = useState("Calme");
  return (
    <div className="space-y-5">
      <Eyebrow>02 — Aujourd&apos;hui · Lundi 28 mai 2026 · Semaine 22</Eyebrow>

      <Card className="p-6">
        <CardLabel className="mb-3">Status</CardLabel>
        <p className="text-lg mb-5">Tu as 3 trades non journalisés depuis ton dernier import.</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={onSaisir} className="btn btn-primary">
            Saisir un trade
          </button>
          <button onClick={onImport} className="btn btn-ghost">
            Importer CSV
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
        {[
          { k: "Trades du jour", v: `${KPI_JOUR.trades}`, s: `${KPI_JOUR.long} long · ${KPI_JOUR.short} short` },
          { k: "R réalisé", v: "", s: "estim. live", r: KPI_JOUR.rRealise },
          { k: "Conformité plan", v: `${KPI_JOUR.conformite}%`, s: `${KPI_JOUR.conformesCount}/4 conformes` },
          { k: "Temps écran", v: KPI_JOUR.tempsEcran, s: "info passive" },
        ].map((c) => (
          <div key={c.k} className="bg-bg p-5">
            <div className="mono text-[9px] uppercase tracking-[0.25em] text-ink-faint mb-2">{c.k}</div>
            <div className="text-2xl font-bold">{c.r !== undefined ? <Rval v={c.r} /> : c.v}</div>
            <div className="text-[11px] text-ink-muted mt-1">{c.s}</div>
          </div>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <CardLabel>Pré-séance</CardLabel>
          <span className="mono text-[10px] text-ink-faint">optionnel</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {["Calme", "Tendu", "Fatigué", "Pressé"].map((e) => (
            <button
              key={e}
              onClick={() => setEtat(e)}
              className={`px-4 py-2 rounded-lg text-sm border transition ${etat === e ? "border-border-2 bg-white/5 text-white" : "border-border text-ink-muted"}`}
            >
              {e}
            </button>
          ))}
        </div>
        <input
          placeholder="Note du jour (140 caractères)"
          maxLength={140}
          className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-border-2"
        />
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <CardLabel>Derniers trades</CardLabel>
          <button onClick={onVoirTout} className="text-[11px] text-ink-muted hover:text-white transition">
            voir tout →
          </button>
        </div>
        <div className="divide-y divide-border">
          {trades.slice(0, 3).map((t) => (
            <button
              key={t.id}
              onClick={() => onOpenTrade(t)}
              className="w-full flex items-center gap-3 py-2.5 text-sm text-left hover:bg-white/[0.02] transition"
            >
              <span className="mono text-ink-muted w-12">{t.time}</span>
              <span className="mono w-16">{t.instrument}</span>
              <span className="text-ink-muted w-14 uppercase text-[11px] mono">{t.direction}</span>
              <span className="w-16">
                <Rval v={t.r} />
              </span>
              <span className="flex-1 text-ink-mute truncate">{t.setup}</span>
              <FlagPill flag={t.flag} />
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ 02 Trades */

function FilterSelect({
  value,
  onChange,
  allLabel,
  options,
  optionLabels,
}: {
  value: string;
  onChange: (v: string) => void;
  allLabel: string;
  options: string[];
  optionLabels?: Record<string, string>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`pill bg-transparent cursor-pointer transition ${value !== "Tous" ? "pill-white" : "hover:border-border-2"}`}
    >
      <option value="Tous">{allLabel}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {optionLabels?.[o] ?? o}
        </option>
      ))}
    </select>
  );
}

const PAGE_SIZE = 12;

export function Trades({
  trades,
  setups,
  onOpen,
  tagFilter,
  onClearTagFilter,
}: {
  trades: Trade[];
  setups: string[];
  onOpen: (t: Trade) => void;
  tagFilter: string | null;
  onClearTagFilter: () => void;
}) {
  const [fInstr, setFInstr] = useState("Tous");
  const [fSetup, setFSetup] = useState("Tous");
  const [fFlag, setFFlag] = useState("Tous");
  const [fTag, setFTag] = useState("Tous");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  // Synchronise le filtre tag quand on arrive depuis Comportement.
  useEffect(() => {
    if (tagFilter) setFTag(tagFilter);
  }, [tagFilter]);

  const flagLabel: Record<string, string> = { conforme: "Conforme", partiel: "Partiel", horsplan: "Hors plan" };

  const filtered = useMemo(
    () =>
      trades.filter(
        (t) =>
          (fInstr === "Tous" || t.instrument === fInstr) &&
          (fSetup === "Tous" || t.setup === fSetup) &&
          (fFlag === "Tous" || t.flag === fFlag) &&
          (fTag === "Tous" || t.tags.includes(fTag)) &&
          (q.trim() === "" ||
            `${t.instrument} ${t.setup} ${t.note} ${t.tags.join(" ")}`.toLowerCase().includes(q.trim().toLowerCase())),
      ),
    [trades, fInstr, fSetup, fFlag, fTag, q],
  );

  // Reset page quand un filtre change.
  useEffect(() => {
    setPage(1);
  }, [fInstr, fSetup, fFlag, fTag, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const reset = () => {
    setFInstr("Tous");
    setFSetup("Tous");
    setFFlag("Tous");
    setFTag("Tous");
    setQ("");
    onClearTagFilter();
  };
  const anyFilter = fInstr !== "Tous" || fSetup !== "Tous" || fFlag !== "Tous" || fTag !== "Tous" || q !== "";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Eyebrow>03 — Trades</Eyebrow>
        <span className="mono text-[11px] text-ink-muted">{trades.length} trades</span>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <FilterSelect value={fInstr} onChange={setFInstr} allLabel="Tous instruments" options={INSTRUMENT_OPTIONS} />
        <FilterSelect value={fSetup} onChange={setFSetup} allLabel="Tous setups" options={setups} />
        <FilterSelect
          value={fFlag}
          onChange={setFFlag}
          allLabel="Conformité : toutes"
          options={["conforme", "partiel", "horsplan"]}
          optionLabels={flagLabel}
        />
        <FilterSelect value={fTag} onChange={setFTag} allLabel="Tous tags" options={TAG_OPTIONS} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="/ Rechercher…"
          className="pill bg-transparent outline-none focus:border-border-2 min-w-[140px]"
        />
        {anyFilter && (
          <button onClick={reset} className="pill text-ink-faint hover:text-white transition ml-auto">
            Effacer ✕
          </button>
        )}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="text-left mono text-[10px] uppercase tracking-[0.2em] text-ink-faint border-b border-border">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Heure</th>
                <th className="px-4 py-3 font-medium">Instr.</th>
                <th className="px-4 py-3 font-medium">Sens</th>
                <th className="px-4 py-3 font-medium text-right">R</th>
                <th className="px-4 py-3 font-medium">Durée</th>
                <th className="px-4 py-3 font-medium">Setup</th>
                <th className="px-4 py-3 font-medium text-right">Flag</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => onOpen(t)}
                  className="border-b border-border/60 hover:bg-white/[0.02] cursor-pointer transition"
                >
                  <td className="px-4 py-3 mono text-ink-muted">{t.date}</td>
                  <td className="px-4 py-3 mono text-ink-muted">{t.time}</td>
                  <td className="px-4 py-3 mono">{t.instrument}</td>
                  <td className="px-4 py-3 mono text-[11px] uppercase text-ink-muted">{t.direction}</td>
                  <td className="px-4 py-3 text-right">
                    <Rval v={t.r} />
                  </td>
                  <td className="px-4 py-3 mono text-ink-muted">{t.duration}</td>
                  <td className="px-4 py-3 text-ink-mute">{t.setup}</td>
                  <td className="px-4 py-3 text-right">
                    <FlagPill flag={t.flag} />
                  </td>
                </tr>
              ))}
              {slice.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-ink-faint">
                    Aucun trade ne correspond à ces filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center justify-between text-[11px] text-ink-muted mono">
        <span>
          {filtered.length === 0
            ? "0 trade"
            : `Affichage ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} sur ${filtered.length}`}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Préc.
          </button>
          <span>
            Page {safePage} / {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={safePage >= pages}
            className="hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Suiv. →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 03 Performance */

type Vue = "setup" | "jour" | "instrument" | "heure";

const fmtPF = (pf: number) => (Number.isFinite(pf) ? pf.toFixed(2) : "∞");

/** Tuile KPI réutilisée dans les bandes (label mono + grande valeur + sous-texte). */
function KpiTile({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="bg-bg p-5">
      <div className="mono text-[9px] uppercase tracking-[0.25em] text-ink-faint mb-2">{label}</div>
      <div className="text-2xl font-bold leading-tight">{value}</div>
      {sub != null && <div className="text-[11px] text-ink-muted mt-1">{sub}</div>}
    </div>
  );
}

/** Carte "Meilleur / Pire setup". */
function SetupHighlight({ row, kind }: { row: DimRow | null; kind: "best" | "worst" }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-3">
        <CardLabel>{kind === "best" ? "Meilleur setup" : "Pire setup"}</CardLabel>
        <span className={`pill ${kind === "best" ? "pill-green" : "pill-red"}`}>{kind === "best" ? "Top R" : "Bottom R"}</span>
      </div>
      {row ? (
        <>
          <div className="text-lg font-semibold tracking-tight mb-2 truncate">{row.key}</div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-2xl font-bold">
              <Rval v={row.rcumul} />
            </span>
            <span className="text-ink-muted mono text-[11px]">
              {row.n} trades · {row.winrate.toFixed(0)}% WR · exp <Rval v={row.exp} />
            </span>
          </div>
        </>
      ) : (
        <div className="text-ink-faint text-sm">—</div>
      )}
    </Card>
  );
}

export function Performance({ trades }: { trades: Trade[] }) {
  const [vue, setVue] = useState<Vue>("setup");
  const [horizon, setHorizon] = useState<Horizon>("annee");
  const s = useMemo(() => computeStats(trades), [trades]);
  // Courbe d'equity recalculée sur l'horizon sélectionné (R cumulé rebasé à 0).
  const curve = useMemo(() => equitySeries(filterByHorizon(trades, horizon)), [trades, horizon]);

  const dim: DimRow[] =
    vue === "setup" ? s.bySetup : vue === "jour" ? s.byDay : vue === "instrument" ? s.byInstrument : s.byHour;
  const head = vue === "setup" ? "Setup" : vue === "jour" ? "Jour" : vue === "instrument" ? "Instrument" : "Heure";
  const monoFirst = vue === "instrument" || vue === "heure";
  const mag = Math.max(s.avgWin, Math.abs(s.avgLoss)) || 1;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Eyebrow>01 — Performance</Eyebrow>
        <span className="pill">90 derniers jours ▾</span>
      </div>

      {/* KPI strip — tout calculé en direct depuis les trades */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border rounded-2xl overflow-hidden border border-border">
        <KpiTile label="Trades" value={s.n} />
        <KpiTile label="Win rate" value={`${s.winRate.toFixed(1)}%`} sub={`${s.wins} G / ${s.losses} P`} />
        <KpiTile label="Profit factor" value={fmtPF(s.profitFactor)} />
        <KpiTile label="Espérance" value={<Rval v={s.expectancy} />} sub="par trade" />
        <KpiTile label="R net cumulé" value={<Rval v={s.netR} />} />
      </div>

      {/* Répartition gagnants / perdants */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <CardLabel>Répartition des trades</CardLabel>
          <span className="mono text-[11px] text-ink-muted">
            {s.wins} gagnants · {s.losses} perdants{s.scratches ? ` · ${s.scratches} BE` : ""}
          </span>
        </div>
        <WinLossBar wins={s.wins} losses={s.losses} scratches={s.scratches} />
      </Card>

      {/* Chiffres clés — gain/perte moyen + séries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-6">
          <CardLabel className="mb-4">Gain moyen vs perte moyenne</CardLabel>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-ink-muted w-24 shrink-0">Gain moyen</span>
              <MagnitudeBar frac={s.avgWin / mag} positive />
              <span className="w-16 text-right shrink-0">
                <Rval v={s.avgWin} />
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-ink-muted w-24 shrink-0">Perte moyenne</span>
              <MagnitudeBar frac={Math.abs(s.avgLoss) / mag} positive={false} />
              <span className="w-16 text-right shrink-0">
                <Rval v={s.avgLoss} />
              </span>
            </div>
          </div>
          <div className="flex justify-between text-[12px] mt-4 pt-3 border-t border-border">
            <span className="text-ink-muted">Ratio gain / perte</span>
            <span className="mono text-white">{s.payoff.toFixed(2)} : 1</span>
          </div>
        </Card>

        <Card className="p-6">
          <CardLabel className="mb-4">Plus longues séries</CardLabel>
          <div className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="mono text-[11px] text-ink-muted">Série gagnante</span>
                <span className="text-xl font-bold text-edge">{s.maxWinStreak}</span>
              </div>
              <StreakDots count={s.maxWinStreak} kind="win" />
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="mono text-[11px] text-ink-muted">Série perdante</span>
                <span className="text-xl font-bold text-risk">{s.maxLossStreak}</span>
              </div>
              <StreakDots count={s.maxLossStreak} kind="loss" />
            </div>
          </div>
        </Card>
      </div>

      {/* Meilleur / pire setup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SetupHighlight row={s.bestSetup} kind="best" />
        <SetupHighlight row={s.worstSetup} kind="worst" />
      </div>

      {/* Jour / heure / marché les plus rentables + drawdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
        <KpiTile label="Jour le + rentable" value={s.bestDay?.key ?? "—"} sub={s.bestDay ? <Rval v={s.bestDay.rcumul} /> : null} />
        <KpiTile label="Heure la + rentable" value={s.bestHour?.key ?? "—"} sub={s.bestHour ? <Rval v={s.bestHour.rcumul} /> : null} />
        <KpiTile
          label="Marché le + rentable"
          value={s.bestInstrument?.key ?? "—"}
          sub={s.bestInstrument ? <Rval v={s.bestInstrument.rcumul} /> : null}
        />
        <KpiTile label="Drawdown max" value={<Rval v={s.maxDD} />} sub="pic à creux" />
      </div>

      {/* Courbe d'equity — R cumulé sur l'horizon choisi (semaine / mois / année) */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <CardLabel>Courbe d&apos;equity (R cumulé)</CardLabel>
          <div className="flex gap-1.5">
            {HORIZONS.map(([id, label]) => (
              <button
                key={id}
                onClick={() => setHorizon(id)}
                className={`pill transition ${horizon === id ? "pill-white" : "hover:border-border-2"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <EquityCurve data={curve.equity} />
        <div className="flex items-center justify-between mono text-[10px] text-ink-faint mt-2">
          <span>
            {curve.periodStart} → {curve.periodEnd}
          </span>
          <span className="text-[11px]">
            <Rval v={curve.netR} /> cumul
          </span>
        </div>
      </Card>

      {/* Détail par dimension */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["setup", "Par setup"],
            ["jour", "Par jour"],
            ["instrument", "Par instrument"],
            ["heure", "Par heure"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} onClick={() => setVue(id)} className={`pill transition ${vue === id ? "pill-white" : "hover:border-border-2"}`}>
            {label}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left mono text-[10px] uppercase tracking-[0.2em] text-ink-faint border-b border-border">
                <th className="px-4 py-3 font-medium">{head}</th>
                <th className="px-4 py-3 font-medium text-right">N</th>
                <th className="px-4 py-3 font-medium text-right">Winrate</th>
                <th className="px-4 py-3 font-medium text-right">Exp. R</th>
                <th className="px-4 py-3 font-medium text-right">R cumul</th>
                {vue === "setup" && <th className="px-4 py-3 font-medium text-right">Statut</th>}
              </tr>
            </thead>
            <tbody>
              {dim.map((row) => (
                <tr key={row.key} className="border-b border-border/60 hover:bg-white/[0.02] transition">
                  <td className={`px-4 py-3 ${monoFirst ? "mono" : ""}`}>{row.key}</td>
                  <td className="px-4 py-3 text-right mono text-ink-muted">{row.n}</td>
                  <td className="px-4 py-3 text-right mono">{row.winrate.toFixed(0)}%</td>
                  <td className="px-4 py-3 text-right">
                    <Rval v={row.exp} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Rval v={row.rcumul} />
                  </td>
                  {vue === "setup" && (
                    <td className="px-4 py-3 text-right">
                      <StatusPill status={row.status ?? "MARGINAL"} />
                    </td>
                  )}
                </tr>
              ))}
              {dim.length === 0 && (
                <tr>
                  <td colSpan={vue === "setup" ? 6 : 5} className="px-4 py-12 text-center text-sm text-ink-faint">
                    Aucune donnée sur la période.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <CardLabel className="mb-4">Distribution des R</CardLabel>
        <DistribBars data={s.distrib} />
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ 04 Comportement */

export function Comportement({ onVoirTrades }: { onVoirTrades: (tag: string) => void }) {
  return (
    <div className="space-y-5">
      <Eyebrow>04 — Comportement · Meridian Edge</Eyebrow>

      <div className="glow-border rounded-2xl p-6">
        <CardLabel className="mb-5">Tes 3 erreurs récurrentes ce mois</CardLabel>
        <div className="space-y-5">
          {ERREURS.map((e) => (
            <div key={e.rank} className="flex gap-4">
              <span className="mono text-2xl font-bold text-ink-faint">{e.rank}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold uppercase tracking-tight text-sm">{e.tag}</span>
                  <span className="mono text-[11px] text-ink-muted">{e.count} occurrences</span>
                </div>
                <div className="mono text-sm mb-1">
                  {e.manqueAGagner ? "gain manqué moyen " : "coût moyen "}
                  <Rval v={e.avg} /> · {e.manqueAGagner ? "potentiel " : "cumul "}
                  <Rval v={e.cumul} />
                </div>
                <p className="text-[13px] text-ink-muted">
                  {e.context}{" "}
                  <button onClick={() => onVoirTrades(e.tag)} className="text-ink-mute underline hover:text-white transition">
                    Voir les trades →
                  </button>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6">
        <CardLabel className="mb-4">Conformité au plan — 70 derniers jours</CardLabel>
        <Heatmap />
        <div className="flex flex-wrap items-center gap-4 mt-4 text-[11px] text-ink-muted mono">
          <HeatmapLegend />
          <span className="ml-auto">Streak actuelle : 4 jours · Record : 11 jours</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <CardLabel className="mb-4">Heures profitables vs destructrices</CardLabel>
          <HoursBars />
          <p className="text-[12px] text-ink-muted mt-4">Décrochage net après 14h.</p>
        </Card>
        <Card className="p-6">
          <CardLabel className="mb-4">Émotion × R</CardLabel>
          <EmotionScatter />
          <p className="text-[12px] text-ink-muted mt-2">Plus tu trades tendu (4-5), plus ta perf se dégrade.</p>
        </Card>
      </div>

      <Card className="p-6">
        <CardLabel className="mb-4">Insights auto</CardLabel>
        <ul className="space-y-2.5">
          {INSIGHTS.map((i) => (
            <li key={i} className="text-sm text-ink-mute flex gap-2.5">
              <span className="text-ink-faint">·</span>
              {i}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ 05 Revue */

export function Revue({
  onStart,
  onOpenReport,
}: {
  onStart: () => void;
  onOpenReport: (r: WeeklyReport) => void;
}) {
  return (
    <div className="space-y-5">
      <Eyebrow>05 — Revue</Eyebrow>

      <div className="glow-border rounded-2xl p-6">
        <CardLabel className="mb-3">Semaine en cours · S22 · 27 mai → 02 juin 2026</CardLabel>
        <p className="text-lg mb-1">Tu n&apos;as pas encore fait ta revue de cette semaine.</p>
        <p className="text-sm text-ink-muted mb-5">{REPORT_DRAFT_PREVIEW}</p>
        <button onClick={onStart} className="btn btn-primary">
          Démarrer ma revue hebdo
        </button>
      </div>

      <Card className="overflow-hidden">
        <div className="px-6 py-4 mono text-[10px] uppercase tracking-[0.25em] text-ink-faint border-b border-border">
          Archive des Weekly Reports
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left mono text-[10px] uppercase tracking-[0.2em] text-ink-faint border-b border-border">
                <th className="px-6 py-3 font-medium">Semaine</th>
                <th className="px-6 py-3 font-medium">Période</th>
                <th className="px-6 py-3 font-medium text-right">R cumul</th>
                <th className="px-6 py-3 font-medium text-right">Conform.</th>
                <th className="px-6 py-3 font-medium text-right">Statut</th>
              </tr>
            </thead>
            <tbody>
              {REPORTS.map((r) => (
                <tr
                  key={r.week}
                  onClick={() => onOpenReport(r)}
                  className="border-b border-border/60 hover:bg-white/[0.02] cursor-pointer transition"
                >
                  <td className="px-6 py-3 mono">{r.week}</td>
                  <td className="px-6 py-3 text-ink-mute">{r.period}</td>
                  <td className="px-6 py-3 text-right">
                    <Rval v={r.rcumul} />
                  </td>
                  <td className="px-6 py-3 text-right mono">{r.conf}%</td>
                  <td className="px-6 py-3 text-right text-[11px] text-ink-muted mono">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <CardLabel className="mb-2">Revue mensuelle</CardLabel>
        <p className="text-sm text-ink-mute">
          Prochain rendez-vous : dimanche 02 juin 2026. Format étendu, 30 min. Tu reverras tes 4 dernières semaines.
        </p>
      </Card>
    </div>
  );
}
