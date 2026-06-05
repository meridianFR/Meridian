"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, Collapsible, Drawer, FieldLabel, FlagPill, Rval, SegGroup } from "@/app/journal-preview/ui";
import { TAG_OPTIONS, tradeDate, tradeDuration, tradeTime, type Direction, type Flag, type Trade, type TradeInput } from "@/lib/journal/types";
import { parseTradesCsv, type ImportDraft, type ImportResult } from "@/lib/journal/csv";
import { computeStats } from "@/lib/journal/analytics";
import { tradesOfWeek } from "@/lib/journal/weekly-report";
import type { WeeklyReport } from "@/lib/journal/weekly-report";

const DIR_OPTS = [
  ["long", "Long"],
  ["short", "Short"],
] as const;
const FLAG_OPTS = [
  ["conforme", "Conforme"],
  ["partiel", "Partiel"],
  ["horsplan", "Hors plan"],
] as const;

const inputCls = "w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-border-2";

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function todayParts(): { date: string; time: string } {
  const d = new Date();
  return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
}

/* ================================================================= saisie / édition */

export function SaisieDrawer({
  open,
  onClose,
  onSubmit,
  editTrade,
  setups,
  onCreateSetup,
  busy,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: TradeInput) => void;
  editTrade: Trade | null;
  setups: string[];
  onCreateSetup: (name: string) => string;
  busy: boolean;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [instrument, setInstrument] = useState("US30");
  const [direction, setDirection] = useState<Direction>("long");
  const [setup, setSetup] = useState("");
  const [creatingSetup, setCreatingSetup] = useState(false);
  const [newSetup, setNewSetup] = useState("");
  const [flag, setFlag] = useState<Flag>("conforme");
  const [tags, setTags] = useState<string[]>([]);
  const [emotion, setEmotion] = useState(3);
  const [note, setNote] = useState("");
  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");
  const [size, setSize] = useState("");
  const [rInput, setRInput] = useState("");

  useEffect(() => {
    if (!open) return;
    const now = todayParts();
    if (editTrade) {
      setDate(tradeDateInput(editTrade.at));
      setTime(tradeTime(editTrade));
    } else {
      setDate(now.date);
      setTime(now.time);
    }
    setInstrument(editTrade?.instrument ?? "US30");
    setDirection(editTrade?.direction ?? "long");
    setSetup(editTrade?.setup ?? setups[0] ?? "");
    setCreatingSetup(false);
    setNewSetup("");
    setFlag(editTrade?.flag ?? "conforme");
    setTags(editTrade?.tags ?? []);
    setEmotion(editTrade?.emotion ?? 3);
    setNote(editTrade?.note ?? "");
    setEntry(editTrade && editTrade.entry ? String(editTrade.entry) : "");
    setExit(editTrade && editTrade.exit ? String(editTrade.exit) : "");
    setSize(editTrade && editTrade.size ? String(editTrade.size) : "");
    setRInput(editTrade ? String(editTrade.r) : "");
  }, [open, editTrade, setups]);

  const toggleTag = (t: string) => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : cur.length >= 3 ? cur : [...cur, t]));
  const setupChoices = setup && !setups.includes(setup) ? [setup, ...setups] : setups;

  const confirmNewSetup = () => {
    const clean = newSetup.trim();
    if (!clean) return;
    setSetup(onCreateSetup(clean));
    setCreatingSetup(false);
    setNewSetup("");
  };

  const handleSave = () => {
    const input: TradeInput = {
      at: `${date || todayParts().date}T${time || "00:00"}:00`,
      instrument: instrument.trim().toUpperCase() || "—",
      direction,
      r: Number.parseFloat(rInput) || 0,
      setup,
      flag,
      entry: Number.parseFloat(entry) || 0,
      exit: Number.parseFloat(exit) || 0,
      size: Number.parseFloat(size) || 0,
      tags,
      emotion,
      note: note.trim(),
      durationMin: editTrade?.durationMin ?? null,
    };
    onSubmit(input);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={editTrade ? "Modifier le trade" : "Nouveau trade"}
      footer={
        <>
          <button onClick={onClose} className="btn btn-ghost" disabled={busy}>
            Annuler
          </button>
          <button onClick={handleSave} className="btn btn-primary disabled:opacity-50" disabled={busy}>
            {busy ? "…" : editTrade ? "Mettre à jour" : "Enregistrer"}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Date</FieldLabel>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${inputCls} mono`} />
          </div>
          <div>
            <FieldLabel>Heure</FieldLabel>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={`${inputCls} mono`} />
          </div>
        </div>
        <div>
          <FieldLabel>Instrument</FieldLabel>
          <input value={instrument} onChange={(e) => setInstrument(e.target.value)} className={`${inputCls} mono`} placeholder="US30" />
        </div>
        <div>
          <FieldLabel>Direction</FieldLabel>
          <SegGroup value={direction} options={DIR_OPTS} onChange={setDirection} />
        </div>
        <div>
          <FieldLabel>Setup</FieldLabel>
          {creatingSetup ? (
            <div className="flex gap-2">
              <input
                autoFocus
                value={newSetup}
                onChange={(e) => setNewSetup(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    confirmNewSetup();
                  }
                }}
                placeholder="Nom de ton setup"
                className={`${inputCls} flex-1`}
              />
              <button type="button" onClick={confirmNewSetup} disabled={!newSetup.trim()} className="btn btn-primary !py-2 !px-3.5 text-[13px] disabled:opacity-30">
                Ajouter
              </button>
              <button type="button" onClick={() => setCreatingSetup(false)} className="btn btn-ghost !py-2 !px-3.5 text-[13px]">
                Annuler
              </button>
            </div>
          ) : (
            <select value={setup} onChange={(e) => (e.target.value === "__new__" ? setCreatingSetup(true) : setSetup(e.target.value))} className={`${inputCls} text-ink-mute`}>
              {setupChoices.length === 0 && <option value="">—</option>}
              {setupChoices.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="__new__">+ Créer un setup…</option>
            </select>
          )}
        </div>
        <div>
          <FieldLabel>Conformité au plan</FieldLabel>
          <SegGroup value={flag} options={FLAG_OPTS} onChange={setFlag} />
        </div>
        <div>
          <FieldLabel>R réalisé</FieldLabel>
          <input value={rInput} onChange={(e) => setRInput(e.target.value)} className={`${inputCls} mono`} placeholder="1.2" inputMode="decimal" />
        </div>

        <div className="divider my-1" />

        <Collapsible title="Détails d'exécution" defaultOpen={!!editTrade}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Entrée</FieldLabel>
              <input value={entry} onChange={(e) => setEntry(e.target.value)} className={`${inputCls} mono`} placeholder="42318.5" inputMode="decimal" />
            </div>
            <div>
              <FieldLabel>Sortie</FieldLabel>
              <input value={exit} onChange={(e) => setExit(e.target.value)} className={`${inputCls} mono`} placeholder="42358.2" inputMode="decimal" />
            </div>
            <div>
              <FieldLabel>Taille (lots)</FieldLabel>
              <input value={size} onChange={(e) => setSize(e.target.value)} className={`${inputCls} mono`} placeholder="0.5" inputMode="decimal" />
            </div>
          </div>
        </Collapsible>

        <Collapsible title="Tags comportement" badge={`${tags.length}/3`}>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((t) => {
              const active = tags.includes(t);
              const disabled = !active && tags.length >= 3;
              return (
                <button key={t} type="button" onClick={() => toggleTag(t)} disabled={disabled} className={`pill transition ${active ? "pill-red" : ""} ${disabled ? "opacity-30 cursor-not-allowed" : "hover:border-border-2"}`}>
                  {t}
                </button>
              );
            })}
          </div>
        </Collapsible>

        <Collapsible title="Émotion ressentie" badge={`${emotion}/5`}>
          <input type="range" min={1} max={5} value={emotion} onChange={(e) => setEmotion(Number(e.target.value))} className="w-full accent-white" />
          <div className="flex justify-between mono text-[10px] text-ink-faint mt-1">
            <span>Calme</span>
            <span>Tendu</span>
          </div>
        </Collapsible>

        <Collapsible title="Note libre" badge={`${note.length}/280`}>
          <textarea rows={3} maxLength={280} value={note} onChange={(e) => setNote(e.target.value)} className={`${inputCls} resize-none`} placeholder="Ce que tu retiens de ce trade…" />
        </Collapsible>
      </div>
    </Drawer>
  );
}

function tradeDateInput(at: string): string {
  const d = new Date(at);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/* ================================================================= import CSV */

export function ImportDrawer({
  open,
  onClose,
  onImport,
  busy,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (rows: TradeInput[]) => void;
  busy: boolean;
}) {
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setResult(null);
      setFileName("");
      setError("");
    }
  }, [open]);

  async function handleFile(file: File) {
    setError("");
    setFileName(file.name);
    if (file.size > 10 * 1024 * 1024) {
      setError("Fichier trop volumineux (max 10 Mo).");
      return;
    }
    const text = await file.text();
    const res = parseTradesCsv(text);
    if (res.errors.length && res.detected === 0) {
      setError(res.errors[0]);
      setResult(null);
      return;
    }
    setResult(res);
  }

  const confirm = () => {
    if (!result) return;
    const rows: TradeInput[] = result.rows.map(({ aConfirmer, issues, ...t }: ImportDraft) => {
      void aConfirmer;
      void issues;
      return t;
    });
    onImport(rows);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Importer un relevé broker"
      wide={!!result}
      footer={
        result ? (
          <>
            <button onClick={() => setResult(null)} className="btn btn-ghost" disabled={busy}>
              Choisir un autre fichier
            </button>
            <button onClick={confirm} className="btn btn-primary disabled:opacity-50" disabled={busy}>
              {busy ? "Import…" : `Importer ${result.detected} trades`}
            </button>
          </>
        ) : undefined
      }
    >
      {!result ? (
        <div className="space-y-6">
          <p className="text-sm text-ink-mute leading-relaxed">
            Exporte ton historique depuis MetaTrader (clic droit sur l&apos;historique → « Rapport » → CSV), puis dépose le fichier ici. Le R est recalculé à partir de
            ton stop loss quand il est présent ; sinon, la ligne est marquée « à confirmer ».
          </p>
          <input ref={fileRef} type="file" accept=".csv,.txt,.tsv" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            className="border border-dashed border-border-2 rounded-2xl py-12 text-center cursor-pointer hover:border-ink-faint transition"
          >
            <div className="text-sm text-ink-mute mb-1">Glisse ton fichier .csv ici ou clique pour choisir</div>
            <div className="mono text-[11px] text-ink-faint">MT4 · MT5 · format Meridian — max 10 Mo</div>
            {fileName && <div className="mono text-[11px] text-edge mt-3">{fileName}</div>}
          </div>
          {error && <p className="text-sm text-risk">{error}</p>}
          <div className="text-xs text-ink-faint leading-relaxed">
            Colonnes reconnues : date, instrument/symbol, type (buy/sell), volume, prix d&apos;ouverture/clôture, S/L, et — si présents — R, setup, conformité.
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="pill pill-white">{fileName}</span>
            <span className="text-ink-mute">
              {result.detected} trades détectés · {result.ready} prêts · <span className="text-signal">{result.toConfirm} à confirmer</span>
            </span>
          </div>
          <p className="text-xs text-ink-faint leading-relaxed">« À confirmer » = R, setup ou conformité à compléter. Tu pourras éditer chaque trade après import.</p>
          <Card className="overflow-hidden">
            <div className="max-h-[55vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-panel">
                  <tr className="text-left mono text-[10px] uppercase tracking-[0.2em] text-ink-faint border-b border-border">
                    <th className="px-3 py-2.5 font-medium">Date</th>
                    <th className="px-3 py-2.5 font-medium">Instr.</th>
                    <th className="px-3 py-2.5 font-medium">Sens</th>
                    <th className="px-3 py-2.5 font-medium text-right">R</th>
                    <th className="px-3 py-2.5 font-medium">Setup</th>
                    <th className="px-3 py-2.5 font-medium text-right">État</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.slice(0, 200).map((r, i) => (
                    <tr key={i} className="border-b border-border/60">
                      <td className="px-3 py-2.5 mono text-ink-muted whitespace-nowrap">
                        {tradeDate({ at: r.at })} {tradeTime({ at: r.at })}
                      </td>
                      <td className="px-3 py-2.5 mono">{r.instrument}</td>
                      <td className="px-3 py-2.5 mono text-[11px] uppercase text-ink-muted">{r.direction}</td>
                      <td className="px-3 py-2.5 text-right">{r.issues.includes("R non calculable (stop loss absent)") ? <span className="text-ink-faint">—</span> : <Rval v={r.r} />}</td>
                      <td className="px-3 py-2.5 text-ink-mute">{r.setup || <span className="text-ink-faint">à déduire</span>}</td>
                      <td className="px-3 py-2.5 text-right">{r.aConfirmer ? <span className="pill">À confirmer</span> : <FlagPill flag={r.flag} />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          {result.detected > 200 && <p className="text-[11px] text-ink-faint">Aperçu limité aux 200 premières lignes — l&apos;import les prendra toutes.</p>}
        </div>
      )}
    </Drawer>
  );
}

/* ================================================================= détail trade */

export function TradeDetailDrawer({ trade, onClose, onEdit, onDelete, busy }: { trade: Trade | null; onClose: () => void; onEdit: (t: Trade) => void; onDelete: (t: Trade) => void; busy: boolean }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  useEffect(() => setConfirmDelete(false), [trade]);

  return (
    <Drawer
      open={!!trade}
      onClose={onClose}
      title={trade ? `Trade · ${tradeDate(trade)} ${tradeTime(trade)}` : ""}
      footer={
        <>
          <button
            onClick={() => {
              if (!trade) return;
              if (confirmDelete) onDelete(trade);
              else setConfirmDelete(true);
            }}
            disabled={busy}
            className={`btn btn-ghost ${confirmDelete ? "!text-risk !border-risk" : ""}`}
          >
            {confirmDelete ? "Confirmer la suppression" : "Supprimer"}
          </button>
          <button onClick={() => trade && onEdit(trade)} className="btn btn-primary" disabled={busy}>
            Modifier
          </button>
        </>
      }
    >
      {trade && (
        <div className="space-y-7">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="mono font-semibold">{trade.instrument}</span>
            <span className="pill">{trade.direction === "long" ? "Long" : "Short"}</span>
            <Rval v={trade.r} />
            <span className="text-ink-muted">· {tradeDuration(trade)}</span>
            <FlagPill flag={trade.flag} />
          </div>
          <div>
            <FieldLabel>Exécution</FieldLabel>
            <dl className="text-sm space-y-1.5">
              {[
                ["Entrée", trade.entry ? String(trade.entry) : "—"],
                ["Sortie", trade.exit ? String(trade.exit) : "—"],
                ["Taille", trade.size ? `${trade.size} lot` : "—"],
                ["Setup", trade.setup || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-ink-muted">{k}</dt>
                  <dd className="mono">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <FieldLabel>Contexte</FieldLabel>
            <div className="flex flex-wrap gap-2 mb-3">
              {trade.tags.length ? trade.tags.map((t) => <span key={t} className="pill pill-red">{t}</span>) : <span className="text-ink-faint text-sm">Aucun tag · exécution propre</span>}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Émotion</span>
              <span className="mono">{trade.emotion}/5</span>
            </div>
          </div>
          <div>
            <FieldLabel>Annotations</FieldLabel>
            <p className="text-sm text-ink-mute leading-relaxed">{trade.note || <span className="text-ink-faint">Aucune note.</span>}</p>
          </div>
        </div>
      )}
    </Drawer>
  );
}

/* ================================================================= revue hebdo */

const REVUE_STEPS = [
  { key: "reussite", t: "Réussite chiffrée de la semaine", q: "Quelle est ta réussite chiffrée à retenir ?", ex: "11 jours consécutifs de conformité au plan." },
  { key: "erreur", t: "Erreur la plus coûteuse", q: "Quelle erreur t'a le plus coûté ?", ex: "Revenge trade après une perte." },
  { key: "setup", t: "Setup le plus performant", q: "Quel setup as-tu le mieux exécuté ?", ex: "Breakout NY open." },
  { key: "durcir", t: "Règle à durcir", q: "Quelle règle veux-tu durcir la semaine prochaine ?", ex: "Pas plus de 2 trades par heure." },
  { key: "assouplir", t: "Règle à assouplir", q: "Une règle trop stricte à assouplir ? (optionnel)", ex: "—" },
] as const;

export function RevueDrawer({
  open,
  onClose,
  trades,
  onSave,
  busy,
}: {
  open: boolean;
  onClose: () => void;
  trades: Trade[];
  onSave: (answers: Record<string, string>, score: number) => void;
  busy: boolean;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(7);

  useEffect(() => {
    if (open) {
      setStep(0);
      setAnswers({});
      setScore(7);
    }
  }, [open]);

  const weekStats = useMemo(() => {
    const wk = tradesOfWeek(trades, new Date());
    const s = computeStats(wk);
    const conf = wk.length ? Math.round((wk.filter((t) => t.flag === "conforme").length / wk.length) * 100) : 0;
    return { n: wk.length, netR: s.netR, winRate: s.winRate, conf };
  }, [trades]);

  const isScore = step === REVUE_STEPS.length;
  const total = REVUE_STEPS.length + 1;
  const s = REVUE_STEPS[step];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Revue hebdo · étape ${step + 1}/${total}`}
      footer={
        <>
          {step > 0 && (
            <button onClick={() => setStep((x) => x - 1)} className="btn btn-ghost" disabled={busy}>
              Retour
            </button>
          )}
          <button
            onClick={() => {
              if (isScore) onSave(answers, score);
              else setStep((x) => x + 1);
            }}
            className="btn btn-primary disabled:opacity-50"
            disabled={busy}
          >
            {isScore ? (busy ? "Enregistrement…" : "Terminer la revue") : "Suivant"}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-white" : "bg-border-2"}`} />
          ))}
        </div>

        <div className="card rounded-xl p-4">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-2">Tes chiffres cette semaine</div>
          <div className="text-sm mono">
            {weekStats.n} trades · <Rval v={weekStats.netR} /> cumul · winrate {weekStats.winRate.toFixed(0)}% · conformité {weekStats.conf}%
          </div>
        </div>

        {isScore ? (
          <div>
            <div className="h-eyebrow mb-3">Étape {step + 1}</div>
            <h3 className="text-xl font-semibold tracking-tight mb-4">Score discipline</h3>
            <FieldLabel>Ton score de discipline cette semaine, sur 10 ?</FieldLabel>
            <input type="range" min={0} max={10} value={score} onChange={(e) => setScore(Number(e.target.value))} className="w-full accent-white" />
            <div className="text-center mono text-2xl font-bold mt-2">{score}/10</div>
          </div>
        ) : (
          <div>
            <div className="h-eyebrow mb-3">Étape {step + 1}</div>
            <h3 className="text-xl font-semibold tracking-tight mb-4">{s.t}</h3>
            <FieldLabel>{s.q}</FieldLabel>
            <textarea
              rows={3}
              value={answers[s.key] ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [s.key]: e.target.value }))}
              className={`${inputCls} resize-none`}
              placeholder={`Ex : ${s.ex}`}
            />
          </div>
        )}
      </div>
    </Drawer>
  );
}

/* ================================================================= lecture weekly report */

export function WeeklyReportDrawer({ report, onClose }: { report: WeeklyReport | null; onClose: () => void }) {
  const movements = report
    ? ([
        ["Ce qui s'est passé", report.movements.passe],
        ["Ce qui a marché", report.movements.marche],
        ["Ce qui n'a pas marché", report.movements.pasMarche],
        ["Une hypothèse", report.movements.hypothese],
        ["Une question pour ta revue", report.movements.question],
      ] as const)
    : [];

  return (
    <Drawer open={!!report} onClose={onClose} title={report ? `Weekly Report · ${report.week}` : ""} wide>
      {report && (
        <div className="space-y-6">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-ink-faint mb-2">Objet</div>
            <h3 className="text-lg font-semibold tracking-tight leading-snug">{report.subject}</h3>
            <div className="text-[11px] text-ink-faint mono mt-1">{report.period}</div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="pill">
              <Rval v={report.rcumul} /> cumul
            </span>
            <span className="pill">Conformité {report.conf}%</span>
            <span className="pill">{report.trades} trades</span>
          </div>
          <div className="divider" />
          <div className="space-y-5">
            {movements.map(([title, body]) => (
              <div key={title}>
                <div className="font-semibold text-[15px] mb-1.5">{title}</div>
                <p className="text-sm text-ink-mute leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="text-[11px] text-ink-faint">Report généré automatiquement à partir de tes trades de la semaine.</div>
        </div>
      )}
    </Drawer>
  );
}
