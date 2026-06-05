"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Aujourdhui, Comportement, Performance, Revue, Trades } from "./screens";
import { ImportDrawer, RevueDrawer, SaisieDrawer, TradeDetailDrawer, WeeklyReportDrawer } from "./drawers";
import type { Account, Trade, TradeInput } from "@/lib/journal/types";
import type { WeeklyReport } from "@/lib/journal/weekly-report";
import {
  createAccountAction,
  createSetupAction,
  createTradeAction,
  deleteTradeAction,
  importTradesAction,
  saveWeeklyReviewAction,
  updateTradeAction,
} from "@/lib/journal/actions";

type Tab = "performance" | "aujourdhui" | "trades" | "comportement" | "revue";
const TABS: { id: Tab; label: string }[] = [
  { id: "performance", label: "Performance" },
  { id: "aujourdhui", label: "Aujourd'hui" },
  { id: "trades", label: "Trades" },
  { id: "comportement", label: "Comportement" },
  { id: "revue", label: "Revue" },
];

const sortTrades = (arr: Trade[]) => [...arr].sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function currentWeekKey(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // lundi
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function JournalApp({
  accounts,
  currentAccountId,
  initialTrades,
  initialSetups,
  reviewedWeeks: initialReviewed,
  userEmail,
}: {
  accounts: Account[];
  currentAccountId: string;
  initialTrades: Trade[];
  initialSetups: string[];
  reviewedWeeks: string[];
  userEmail: string;
}) {
  const router = useRouter();
  const [trades, setTrades] = useState<Trade[]>(() => sortTrades(initialTrades));
  const [setups, setSetups] = useState<string[]>(initialSetups);
  const [reviewedWeeks, setReviewedWeeks] = useState<string[]>(initialReviewed);
  const [tab, setTab] = useState<Tab>("performance");

  const [accountMenu, setAccountMenu] = useState(false);
  const [newAccountMode, setNewAccountMode] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");

  const [saisieOpen, setSaisieOpen] = useState(false);
  const [editTrade, setEditTrade] = useState<Trade | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [revueOpen, setRevueOpen] = useState(false);
  const [detailTrade, setDetailTrade] = useState<Trade | null>(null);
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const currentAccount = accounts.find((a) => a.id === currentAccountId);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const closeAll = useCallback(() => {
    setSaisieOpen(false);
    setEditTrade(null);
    setImportOpen(false);
    setRevueOpen(false);
    setDetailTrade(null);
    setReport(null);
    setAccountMenu(false);
  }, []);

  const openSaisie = useCallback(() => {
    setEditTrade(null);
    setSaisieOpen(true);
  }, []);

  // Raccourcis clavier (N saisir · I importer · R revue · 1-5 onglets · Esc ferme).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (e.key === "Escape") return closeAll();
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "n") {
        e.preventDefault();
        openSaisie();
      } else if (k === "i") {
        e.preventDefault();
        setImportOpen(true);
      } else if (k === "r") {
        e.preventDefault();
        setRevueOpen(true);
      } else if (k >= "1" && k <= "5") {
        e.preventDefault();
        setTab(TABS[Number(k) - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAll, openSaisie]);

  /* -------------------------------------------------------------- mutations */

  async function submitTrade(input: TradeInput) {
    setBusy(true);
    const res = editTrade ? await updateTradeAction(editTrade.id, input) : await createTradeAction(currentAccountId, input);
    setBusy(false);
    if (!res.ok) return flash(res.error);
    setTrades((cur) => sortTrades(editTrade ? cur.map((t) => (t.id === res.data.id ? res.data : t)) : [res.data, ...cur]));
    setSaisieOpen(false);
    setEditTrade(null);
    flash(editTrade ? "Trade mis à jour." : "Trade enregistré.");
  }

  async function handleImport(rows: TradeInput[]) {
    setBusy(true);
    const res = await importTradesAction(currentAccountId, rows);
    setBusy(false);
    if (!res.ok) return flash(res.error);
    setTrades((cur) => sortTrades([...res.data.trades, ...cur]));
    setImportOpen(false);
    flash(`${res.data.count} trades importés.`);
  }

  async function handleDelete(trade: Trade) {
    setBusy(true);
    const res = await deleteTradeAction(trade.id);
    setBusy(false);
    if (!res.ok) return flash(res.error);
    setTrades((cur) => cur.filter((t) => t.id !== trade.id));
    setDetailTrade(null);
    flash("Trade supprimé.");
  }

  const createSetup = useCallback(
    (name: string): string => {
      const clean = name.trim();
      if (!clean) return name;
      if (!setups.some((s) => s.toLowerCase() === clean.toLowerCase())) {
        setSetups((cur) => [...cur, clean].sort((a, b) => a.localeCompare(b)));
        createSetupAction(clean).catch(() => {});
      }
      return clean;
    },
    [setups],
  );

  async function handleSaveReview(answers: Record<string, string>, score: number) {
    setBusy(true);
    const res = await saveWeeklyReviewAction(currentAccountId, currentWeekKey(), answers, score);
    setBusy(false);
    if (!res.ok) return flash(res.error);
    setReviewedWeeks((cur) => [...new Set([...cur, res.data.weekStart])]);
    setRevueOpen(false);
    flash("Revue enregistrée.");
  }

  async function handleAddAccount() {
    const name = newAccountName.trim();
    if (!name) return;
    setBusy(true);
    const res = await createAccountAction(name);
    setBusy(false);
    if (!res.ok) return flash(res.error);
    setNewAccountMode(false);
    setNewAccountName("");
    setAccountMenu(false);
    router.push(`/app?account=${res.data.id}`);
  }

  const editFromDetail = (t: Trade) => {
    setDetailTrade(null);
    setEditTrade(t);
    setSaisieOpen(true);
  };
  const voirTrades = (tag: string) => {
    setTagFilter(tag);
    setTab("trades");
  };

  const setupNames = useMemo(() => setups, [setups]);

  return (
    <div className="relative z-10 min-h-screen">
      {/* Header */}
      <header className="nav-blur sticky top-0 z-50 border-b border-border">
        <div className="max-w-wrap mx-auto px-5 sm:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-white rounded-[5px] flex items-center justify-center text-black font-bold leading-none">°</div>
              <span className="font-semibold tracking-tight text-[15px] hidden sm:inline">Meridian Journal</span>
            </div>

            <div className="relative">
              <button onClick={() => setAccountMenu((x) => !x)} className="pill hover:border-border-2 transition max-w-[160px] truncate">
                <span className="truncate">{currentAccount?.name ?? "Compte"}</span> ▾
              </button>
              {accountMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setAccountMenu(false)} />
                  <div className="absolute top-10 left-0 w-60 bg-panel-2 border border-border rounded-xl p-1 z-50">
                    {accounts.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          setAccountMenu(false);
                          if (a.id !== currentAccountId) router.push(`/app?account=${a.id}`);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${a.id === currentAccountId ? "text-white bg-white/5" : "text-ink-mute hover:bg-white/5 hover:text-white"}`}
                      >
                        {a.name}
                      </button>
                    ))}
                    {newAccountMode ? (
                      <div className="p-2">
                        <input
                          autoFocus
                          value={newAccountName}
                          onChange={(e) => setNewAccountName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddAccount()}
                          placeholder="Nom du compte"
                          className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-border-2"
                        />
                        <div className="flex gap-2 mt-2">
                          <button onClick={handleAddAccount} disabled={busy || !newAccountName.trim()} className="btn btn-primary !py-1.5 !px-3 text-[12px] flex-1 justify-center disabled:opacity-40">
                            Créer
                          </button>
                          <button onClick={() => setNewAccountMode(false)} className="btn btn-ghost !py-1.5 !px-3 text-[12px]">
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setNewAccountMode(true)} className="w-full text-left px-3 py-2 rounded-lg text-sm text-ink-faint hover:bg-white/5 hover:text-white transition">
                        + Nouveau compte
                      </button>
                    )}
                    <div className="border-t border-border my-1" />
                    <div className="px-3 py-1.5 mono text-[10px] text-ink-faint truncate">{userEmail}</div>
                    <form method="post" action="/api/billing-portal">
                      <button type="submit" className="w-full text-left px-3 py-2 rounded-lg text-sm text-ink-mute hover:bg-white/5 hover:text-white transition">
                        Gérer l&apos;abonnement
                      </button>
                    </form>
                    <form method="post" action="/auth/signout">
                      <button type="submit" className="w-full text-left px-3 py-2 rounded-lg text-sm text-ink-mute hover:bg-white/5 hover:text-white transition">
                        Se déconnecter
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={openSaisie} className="btn btn-ghost !py-2 !px-3.5 text-[13px]">
              <span className="mono text-[10px] text-ink-faint mr-1">N</span>
              <span className="hidden sm:inline">Saisir</span>
            </button>
            <button onClick={() => setImportOpen(true)} className="btn btn-ghost !py-2 !px-3.5 text-[13px]">
              <span className="mono text-[10px] text-ink-faint mr-1">I</span>
              <span className="hidden sm:inline">Importer</span>
            </button>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="max-w-wrap mx-auto px-5 sm:px-10 flex gap-5 sm:gap-7 h-12 items-center overflow-x-auto no-scrollbar">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`mono text-[11px] uppercase tracking-[0.2em] h-full relative transition whitespace-nowrap ${tab === t.id ? "text-white" : "text-ink-faint hover:text-ink-mute"}`}
              >
                <span className="text-ink-faint mr-1.5">0{i + 1}</span>
                {t.label}
                {tab === t.id && <span className="absolute bottom-0 left-0 right-0 h-px bg-white" />}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-wrap mx-auto px-5 sm:px-10 py-8 md:py-10">
        {tab === "performance" && <Performance trades={trades} />}
        {tab === "aujourdhui" && (
          <Aujourdhui trades={trades} onSaisir={openSaisie} onImport={() => setImportOpen(true)} onOpenTrade={setDetailTrade} onVoirTout={() => setTab("trades")} />
        )}
        {tab === "trades" && <Trades trades={trades} setups={setupNames} onOpen={setDetailTrade} tagFilter={tagFilter} onClearTagFilter={() => setTagFilter(null)} />}
        {tab === "comportement" && <Comportement trades={trades} onVoirTrades={voirTrades} />}
        {tab === "revue" && <Revue trades={trades} reviewedWeeks={reviewedWeeks} onStart={() => setRevueOpen(true)} onOpenReport={setReport} />}
      </main>

      {/* Drawers */}
      <SaisieDrawer open={saisieOpen} onClose={() => { setSaisieOpen(false); setEditTrade(null); }} onSubmit={submitTrade} editTrade={editTrade} setups={setupNames} onCreateSetup={createSetup} busy={busy} />
      <ImportDrawer open={importOpen} onClose={() => setImportOpen(false)} onImport={handleImport} busy={busy} />
      <TradeDetailDrawer trade={detailTrade} onClose={() => setDetailTrade(null)} onEdit={editFromDetail} onDelete={handleDelete} busy={busy} />
      <RevueDrawer open={revueOpen} onClose={() => setRevueOpen(false)} trades={trades} onSave={handleSaveReview} busy={busy} />
      <WeeklyReportDrawer report={report} onClose={() => setReport(null)} />

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[80] pill bg-black/90 backdrop-blur border-border-2 text-center">
          {toast}
        </div>
      )}
    </div>
  );
}
