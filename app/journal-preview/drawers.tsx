"use client";

import { useEffect, useState } from "react";
import {
  IMPORT_PREVIEW,
  SETUP_OPTIONS,
  TAG_OPTIONS,
  type Flag,
  type Trade,
  type WeeklyReport,
} from "./data";
import { Card, CardLabel, Collapsible, Drawer, FieldLabel, FlagPill, Rval, SegGroup } from "./ui";

const DIR_OPTS = [
  ["long", "Long"],
  ["short", "Short"],
] as const;

const FLAG_OPTS = [
  ["conforme", "Conforme"],
  ["partiel", "Partiel"],
  ["horsplan", "Hors plan"],
] as const;

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ saisie */

export function SaisieDrawer({
  open,
  onClose,
  onSave,
  editTrade,
  nextId,
  setups,
  onCreateSetup,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (t: Trade) => void;
  editTrade: Trade | null;
  nextId: number;
  setups: string[];
  onCreateSetup: (name: string) => string;
}) {
  const [instrument, setInstrument] = useState("US30");
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [setup, setSetup] = useState(SETUP_OPTIONS[0]);
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

  // (Ré)initialise le formulaire à chaque ouverture (création ou édition).
  useEffect(() => {
    if (!open) return;
    setInstrument(editTrade?.instrument ?? "US30");
    setDirection(editTrade?.direction ?? "long");
    setSetup(editTrade?.setup ?? SETUP_OPTIONS[0]);
    setCreatingSetup(false);
    setNewSetup("");
    setFlag(editTrade?.flag ?? "conforme");
    setTags(editTrade?.tags ?? []);
    setEmotion(editTrade?.emotion ?? 3);
    setNote(editTrade?.note ?? "");
    setEntry(editTrade ? String(editTrade.entry) : "");
    setExit(editTrade ? String(editTrade.exit) : "");
    setSize(editTrade ? String(editTrade.size) : "");
    setRInput(editTrade ? String(editTrade.r) : "");
  }, [open, editTrade]);

  const toggleTag = (t: string) => {
    setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : cur.length >= 3 ? cur : [...cur, t]));
  };

  // Le <select> doit toujours pouvoir afficher la valeur courante, même si c'est un
  // setup personnalisé absent de la liste partagée (ex. édition d'un trade importé).
  const setupChoices = setup && !setups.includes(setup) ? [setup, ...setups] : setups;

  const onSetupSelect = (v: string) => {
    if (v === "__new__") {
      setNewSetup("");
      setCreatingSetup(true);
    } else {
      setSetup(v);
    }
  };

  const confirmNewSetup = () => {
    const clean = newSetup.trim();
    if (!clean) return;
    setSetup(onCreateSetup(clean));
    setCreatingSetup(false);
    setNewSetup("");
  };

  const cancelNewSetup = () => {
    setCreatingSetup(false);
    setNewSetup("");
  };

  const handleSave = () => {
    const trade: Trade = {
      id: editTrade?.id ?? nextId,
      date: editTrade?.date ?? "29/05",
      time: editTrade?.time ?? nowHHMM(),
      instrument: instrument.trim().toUpperCase() || "—",
      direction,
      r: Number.parseFloat(rInput) || 0,
      duration: editTrade?.duration ?? "—",
      setup,
      flag,
      entry: Number.parseFloat(entry) || 0,
      exit: Number.parseFloat(exit) || 0,
      size: Number.parseFloat(size) || 0,
      tags,
      emotion,
      note: note.trim(),
    };
    onSave(trade);
    onClose();
  };

  const inputCls =
    "w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-border-2";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={editTrade ? `Modifier le trade #${editTrade.id}` : "Nouveau trade"}
      footer={
        <>
          <button onClick={onClose} className="btn btn-ghost">
            Annuler
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            {editTrade ? "Mettre à jour" : "Enregistrer"}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* 4 champs obligatoires */}
        <div>
          <FieldLabel>Instrument</FieldLabel>
          <input value={instrument} onChange={(e) => setInstrument(e.target.value)} className={`${inputCls} mono`} />
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
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    e.stopPropagation();
                    cancelNewSetup();
                  }
                }}
                placeholder="Nom de ton setup"
                className={`${inputCls} flex-1`}
              />
              <button
                type="button"
                onClick={confirmNewSetup}
                disabled={!newSetup.trim()}
                className="btn btn-primary !py-2 !px-3.5 text-[13px] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Ajouter
              </button>
              <button type="button" onClick={cancelNewSetup} className="btn btn-ghost !py-2 !px-3.5 text-[13px]">
                Annuler
              </button>
            </div>
          ) : (
            <select
              value={setup}
              onChange={(e) => onSetupSelect(e.target.value)}
              className={`${inputCls} text-ink-mute`}
            >
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

        <div className="divider my-1" />
        <p className="text-xs text-ink-faint leading-relaxed">
          Entrée, sortie, taille et durée sont remplis automatiquement à l&apos;import du CSV broker. Les champs
          ci-dessous sont optionnels.
        </p>

        {/* Enrichissement repliable */}
        <Collapsible title="Détails d'exécution" defaultOpen={!!editTrade}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Entrée</FieldLabel>
              <input value={entry} onChange={(e) => setEntry(e.target.value)} className={`${inputCls} mono`} placeholder="42318.5" />
            </div>
            <div>
              <FieldLabel>Sortie</FieldLabel>
              <input value={exit} onChange={(e) => setExit(e.target.value)} className={`${inputCls} mono`} placeholder="42358.2" />
            </div>
            <div>
              <FieldLabel>Taille (lots)</FieldLabel>
              <input value={size} onChange={(e) => setSize(e.target.value)} className={`${inputCls} mono`} placeholder="0.5" />
            </div>
            <div>
              <FieldLabel>R réalisé</FieldLabel>
              <input value={rInput} onChange={(e) => setRInput(e.target.value)} className={`${inputCls} mono`} placeholder="1.2" />
            </div>
          </div>
        </Collapsible>

        <Collapsible title="Tags comportement" badge={`${tags.length}/3`}>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((t) => {
              const active = tags.includes(t);
              const disabled = !active && tags.length >= 3;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  disabled={disabled}
                  className={`pill transition ${active ? "pill-red" : ""} ${disabled ? "opacity-30 cursor-not-allowed" : "hover:border-border-2"}`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </Collapsible>

        <Collapsible title="Émotion ressentie" badge={`${emotion}/5`}>
          <input
            type="range"
            min={1}
            max={5}
            value={emotion}
            onChange={(e) => setEmotion(Number(e.target.value))}
            className="w-full accent-white"
          />
          <div className="flex justify-between mono text-[10px] text-ink-faint mt-1">
            <span>Calme</span>
            <span>Tendu</span>
          </div>
        </Collapsible>

        <Collapsible title="Note libre" badge={`${note.length}/280`}>
          <textarea
            rows={3}
            maxLength={280}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={`${inputCls} resize-none`}
            placeholder="Ce que tu retiens de ce trade…"
          />
        </Collapsible>

        <Collapsible title="Capture chart">
          <div className="border border-dashed border-border rounded-lg py-8 text-center text-xs text-ink-faint">
            Glisse une capture ici · ou colle (Ctrl+V)
          </div>
        </Collapsible>
      </div>
    </Drawer>
  );
}

/* ------------------------------------------------------------------ import CSV */

export function ImportDrawer({
  open,
  onClose,
  onImport,
  nextId,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (trades: Trade[]) => void;
  nextId: number;
}) {
  const [step, setStep] = useState<"drop" | "preview">("drop");
  const [source, setSource] = useState<"MT4" | "MT5">("MT5");

  useEffect(() => {
    if (open) setStep("drop");
  }, [open]);

  const pick = (s: "MT4" | "MT5") => {
    setSource(s);
    setStep("preview");
  };

  const confirm = () => {
    const trades: Trade[] = IMPORT_PREVIEW.map((row, i) => ({
      id: nextId + i,
      date: row.date,
      time: row.time,
      instrument: row.instrument,
      direction: row.direction,
      r: row.r,
      duration: "—",
      setup: row.setup === "—" ? SETUP_OPTIONS[0] : row.setup,
      flag: row.flag,
      entry: 0,
      exit: 0,
      size: 0,
      tags: [],
      emotion: 3,
      note: "",
    }));
    onImport(trades);
    onClose();
  };

  const aConfirmer = IMPORT_PREVIEW.filter((r) => r.aConfirmer).length;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Importer un relevé broker"
      wide={step === "preview"}
      footer={
        step === "preview" ? (
          <>
            <button onClick={() => setStep("drop")} className="btn btn-ghost">
              Retour
            </button>
            <button onClick={confirm} className="btn btn-primary">
              Importer {IMPORT_PREVIEW.length} trades
            </button>
          </>
        ) : undefined
      }
    >
      {step === "drop" ? (
        <div className="space-y-6">
          <p className="text-sm text-ink-mute leading-relaxed">
            Exporte ton historique depuis MetaTrader (clic droit sur l&apos;historique → « Rapport » → CSV / HTML),
            puis dépose le fichier ici. Le R est recalculé à partir de ton stop loss, ou de ton risque par défaut si le
            SL n&apos;est pas exporté.
          </p>
          <div className="border border-dashed border-border-2 rounded-2xl py-12 text-center">
            <div className="text-sm text-ink-mute mb-1">Glisse ton fichier .csv ou .htm ici</div>
            <div className="mono text-[11px] text-ink-faint">MT4 · MT5 — max 10 Mo</div>
          </div>
          <div>
            <FieldLabel>Ou démarre avec un exemple</FieldLabel>
            <div className="flex gap-2">
              <button onClick={() => pick("MT4")} className="btn btn-ghost flex-1">
                Relevé MT4
              </button>
              <button onClick={() => pick("MT5")} className="btn btn-ghost flex-1">
                Relevé MT5
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="pill pill-white">{source}</span>
            <span className="text-ink-mute">
              {IMPORT_PREVIEW.length} trades détectés · {IMPORT_PREVIEW.length - aConfirmer} prêts ·{" "}
              <span className="text-signal">{aConfirmer} à confirmer</span>
            </span>
          </div>
          <p className="text-xs text-ink-faint leading-relaxed">
            « À confirmer » = setup non déduit ou conformité au plan à renseigner. Tu pourras compléter après import.
          </p>
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
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
                {IMPORT_PREVIEW.map((r, i) => (
                  <tr key={i} className="border-b border-border/60">
                    <td className="px-3 py-2.5 mono text-ink-muted whitespace-nowrap">
                      {r.date} {r.time}
                    </td>
                    <td className="px-3 py-2.5 mono">{r.instrument}</td>
                    <td className="px-3 py-2.5 mono text-[11px] uppercase text-ink-muted">{r.direction}</td>
                    <td className="px-3 py-2.5 text-right">
                      <Rval v={r.r} />
                    </td>
                    <td className="px-3 py-2.5 text-ink-mute">
                      {r.setup === "—" ? <span className="text-ink-faint">à déduire</span> : r.setup}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      {r.aConfirmer ? (
                        <span className="pill">À confirmer</span>
                      ) : (
                        <FlagPill flag={r.flag} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </Drawer>
  );
}

/* ------------------------------------------------------------------ trade detail */

export function TradeDetailDrawer({
  trade,
  onClose,
  onEdit,
  onDelete,
}: {
  trade: Trade | null;
  onClose: () => void;
  onEdit: (t: Trade) => void;
  onDelete: (t: Trade) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Réinitialise la confirmation à chaque changement de trade (ouverture/fermeture).
  useEffect(() => {
    setConfirmDelete(false);
  }, [trade]);

  return (
    <Drawer
      open={!!trade}
      onClose={onClose}
      title={trade ? `Trade #${trade.id} · ${trade.date} ${trade.time}` : ""}
      footer={
        <>
          <button
            onClick={() => {
              if (!trade) return;
              if (confirmDelete) {
                onDelete(trade);
                onClose();
              } else {
                setConfirmDelete(true);
              }
            }}
            className={`btn btn-ghost ${confirmDelete ? "!text-risk !border-risk" : ""}`}
          >
            {confirmDelete ? "Confirmer la suppression" : "Supprimer"}
          </button>
          <button onClick={() => trade && onEdit(trade)} className="btn btn-primary">
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
            <span className="text-ink-muted">· {trade.duration}</span>
            <FlagPill flag={trade.flag} />
          </div>

          <div>
            <FieldLabel>Exécution</FieldLabel>
            <dl className="text-sm space-y-1.5">
              {[
                ["Entrée", trade.entry ? String(trade.entry) : "—"],
                ["Sortie", trade.exit ? String(trade.exit) : "—"],
                ["Taille", trade.size ? `${trade.size} lot` : "—"],
                ["Setup", trade.setup],
                ["MAE / MFE", "— (tick data en V2)"],
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
              {trade.tags.length ? (
                trade.tags.map((t) => (
                  <span key={t} className="pill pill-red">
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-ink-faint text-sm">Aucun tag · exécution propre</span>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Émotion</span>
              <span className="mono">{trade.emotion}/5</span>
            </div>
          </div>

          <div>
            <FieldLabel>Annotations</FieldLabel>
            <p className="text-sm text-ink-mute leading-relaxed">
              {trade.note || <span className="text-ink-faint">Aucune note.</span>}
            </p>
          </div>
        </div>
      )}
    </Drawer>
  );
}

/* ------------------------------------------------------------------ revue */

const REVUE_STEPS = [
  { t: "Réussite chiffrée de la semaine", q: "Quelle est ta réussite chiffrée à retenir ?", ex: "11 jours consécutifs de conformité au plan." },
  { t: "Erreur la plus coûteuse", q: "Quelle erreur t'a le plus coûté ?", ex: "Revenge trade après une perte (-11.2R sur le mois)." },
  { t: "Setup le plus performant", q: "Quel setup as-tu le mieux exécuté ?", ex: "Breakout NY open." },
  { t: "Règle à durcir", q: "Quelle règle veux-tu durcir la semaine prochaine ?", ex: "Pas plus de 2 trades par heure." },
  { t: "Règle à assouplir", q: "Une règle trop stricte à assouplir ? (optionnel)", ex: "—" },
  { t: "Score discipline", q: "Ton score de discipline cette semaine, sur 10 ?", ex: "7 / 10" },
];

export function RevueDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  const last = step === REVUE_STEPS.length - 1;
  const s = REVUE_STEPS[step];
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Revue hebdo · S22 · étape ${step + 1}/6`}
      footer={
        <>
          {step > 0 && (
            <button onClick={() => setStep((x) => x - 1)} className="btn btn-ghost">
              Retour
            </button>
          )}
          <button
            onClick={() => {
              if (last) onClose();
              else setStep((x) => x + 1);
            }}
            className="btn btn-primary"
          >
            {last ? "Terminer la revue" : "Suivant"}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex gap-1.5">
          {REVUE_STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-white" : "bg-border-2"}`} />
          ))}
        </div>

        <div>
          <div className="h-eyebrow mb-3">Étape {step + 1}</div>
          <h3 className="text-xl font-semibold tracking-tight">{s.t}</h3>
        </div>

        <div className="card rounded-xl p-4">
          <CardLabel className="mb-2">Tes chiffres</CardLabel>
          <div className="text-sm mono">
            18 trades · <Rval v={4.2} /> cumul · winrate 56% · conformité 78%
          </div>
        </div>

        <div>
          <FieldLabel>{s.q}</FieldLabel>
          {step === 5 ? (
            <input type="range" min={0} max={10} defaultValue={7} className="w-full accent-white" />
          ) : (
            <textarea
              rows={3}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-border-2 resize-none"
              placeholder={`Ex : ${s.ex}`}
            />
          )}
        </div>
      </div>
    </Drawer>
  );
}

/* ------------------------------------------------------------------ weekly report viewer */

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
            <CardLabel className="mb-2">Objet</CardLabel>
            <h3 className="text-lg font-semibold tracking-tight leading-snug">{report.subject}</h3>
            <div className="text-[11px] text-ink-faint mono mt-1">
              meridianFR@hotmail.com · dimanche · {report.period}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="pill">
              <Rval v={report.rcumul} /> cumul
            </span>
            <span className="pill">Conformité {report.conf}%</span>
          </div>

          <div className="divider" />

          <p className="text-sm text-ink-mute">Salut Thomas,</p>
          <p className="text-sm text-ink-mute -mt-3">Voici ta semaine, en chiffres et en lecture.</p>

          <div className="space-y-5">
            {movements.map(([title, body]) => (
              <div key={title}>
                <div className="font-semibold text-[15px] mb-1.5">{title}</div>
                <p className="text-sm text-ink-mute leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="text-sm text-ink-mute">
            <p>Bonne semaine,</p>
            <p>Meridian</p>
          </div>

          <div className="divider" />
          <div className="text-[11px] text-ink-faint">
            Report rédigé à la main · les 30 premiers abonnés. Réponds à cet email, un humain le lit.
          </div>
        </div>
      )}
    </Drawer>
  );
}
