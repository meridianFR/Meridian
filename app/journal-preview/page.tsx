"use client";

import { useEffect, useMemo, useState } from "react";
import { ACCOUNTS, SETUP_OPTIONS, TRADES, type Trade, type WeeklyReport } from "./data";
import { ImportDrawer, RevueDrawer, SaisieDrawer, TradeDetailDrawer, WeeklyReportDrawer } from "./drawers";
import { Aujourdhui, Comportement, Performance, Revue, Trades } from "./screens";

type Tab = "aujourdhui" | "trades" | "performance" | "comportement" | "revue";

// Le Dashboard Performance est l'écran d'accueil (le plus visuel) ; Aujourd'hui suit.
const TABS: { id: Tab; label: string }[] = [
  { id: "performance", label: "Performance" },
  { id: "aujourdhui", label: "Aujourd'hui" },
  { id: "trades", label: "Trades" },
  { id: "comportement", label: "Comportement" },
  { id: "revue", label: "Revue" },
];

export default function JournalPreview() {
  const [tab, setTab] = useState<Tab>("performance");
  const [accountOpen, setAccountOpen] = useState(false);
  const [account, setAccount] = useState(ACCOUNTS[0]);

  const [trades, setTrades] = useState<Trade[]>(TRADES);
  const [setups, setSetups] = useState<string[]>(SETUP_OPTIONS);
  const [saisieOpen, setSaisieOpen] = useState(false);
  const [editTrade, setEditTrade] = useState<Trade | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [revueOpen, setRevueOpen] = useState(false);
  const [detailTrade, setDetailTrade] = useState<Trade | null>(null);
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const nextId = useMemo(() => trades.reduce((m, t) => Math.max(m, t.id), 0) + 1, [trades]);

  const closeAll = () => {
    setSaisieOpen(false);
    setEditTrade(null);
    setImportOpen(false);
    setRevueOpen(false);
    setDetailTrade(null);
    setReport(null);
    setAccountOpen(false);
  };

  const openSaisie = () => {
    setEditTrade(null);
    setSaisieOpen(true);
  };
  const openImport = () => setImportOpen(true);

  const saveTrade = (t: Trade) => {
    setTrades((cur) => {
      const exists = cur.some((x) => x.id === t.id);
      return exists ? cur.map((x) => (x.id === t.id ? t : x)) : [t, ...cur];
    });
  };
  const importTrades = (rows: Trade[]) => setTrades((cur) => [...rows, ...cur]);
  const deleteTrade = (t: Trade) => setTrades((cur) => cur.filter((x) => x.id !== t.id));

  // Crée un setup personnalisé (dé-doublonné, insensible à la casse) et renvoie le nom retenu.
  const createSetup = (name: string): string => {
    const clean = name.trim();
    const existing = setups.find((s) => s.toLowerCase() === clean.toLowerCase());
    if (existing) return existing;
    setSetups((cur) => [...cur, clean]);
    return clean;
  };

  const editFromDetail = (t: Trade) => {
    setDetailTrade(null);
    setEditTrade(t);
    setSaisieOpen(true);
  };

  const voirTrades = (tag: string) => {
    setTagFilter(tag);
    setTab("trades");
  };

  // Raccourcis clavier : N nouveau · I import · R revue · Esc ferme.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (e.key === "Escape") {
        closeAll();
        return;
      }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "n") {
        e.preventDefault();
        openSaisie();
      } else if (k === "i") {
        e.preventDefault();
        openImport();
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
  }, []);

  return (
    <div className="relative z-10 min-h-screen">
      <h1 className="sr-only">Aperçu du Journal Meridian — démonstration à données fictives</h1>
      {/* Header */}
      <header className="nav-blur fixed top-0 left-0 right-0 z-50">
        <div className="max-w-wrap mx-auto px-5 sm:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-white rounded-[5px] flex items-center justify-center text-black font-bold leading-none">
                °
              </div>
              <span className="font-semibold tracking-tight text-[15px] hidden sm:inline">Meridian Journal</span>
            </div>

            <div className="relative">
              <button onClick={() => setAccountOpen((x) => !x)} className="pill hover:border-border-2 transition">
                <span className="hidden sm:inline">{account}</span>
                <span className="sm:hidden">Compte</span> ▾
              </button>
              {accountOpen && (
                <div className="absolute top-10 left-0 w-52 bg-panel-2 border border-border rounded-xl p-1 z-50">
                  {ACCOUNTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => {
                        setAccount(a);
                        setAccountOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-ink-mute hover:bg-white/5 hover:text-white transition"
                    >
                      {a}
                    </button>
                  ))}
                  <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-ink-faint hover:bg-white/5 transition">
                    + Ajouter un compte
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={openSaisie} className="btn btn-ghost !py-2 !px-3.5 text-[13px]">
              <span className="mono text-[10px] text-ink-faint mr-1">N</span>
              <span className="hidden sm:inline">Saisir</span>
            </button>
            <button onClick={openImport} className="btn btn-ghost !py-2 !px-3.5 text-[13px]">
              <span className="mono text-[10px] text-ink-faint mr-1">I</span>
              <span className="hidden sm:inline">Importer</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-panel-2 border border-border flex items-center justify-center mono text-[11px] text-ink-mute ml-1">
              TM
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-border">
          <div className="max-w-wrap mx-auto px-5 sm:px-10 flex gap-5 sm:gap-7 h-12 items-center overflow-x-auto no-scrollbar">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`mono text-[11px] uppercase tracking-[0.2em] h-full relative transition whitespace-nowrap ${
                  tab === t.id ? "text-white" : "text-ink-faint hover:text-ink-mute"
                }`}
              >
                <span className="text-ink-faint mr-1.5">0{i + 1}</span>
                {t.label}
                {tab === t.id && <span className="absolute bottom-0 left-0 right-0 h-px bg-white" />}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-wrap mx-auto px-5 sm:px-10 pt-[140px] pb-24">
        {tab === "aujourdhui" && (
          <Aujourdhui
            trades={trades}
            onSaisir={openSaisie}
            onImport={openImport}
            onOpenTrade={setDetailTrade}
            onVoirTout={() => setTab("trades")}
          />
        )}
        {tab === "trades" && (
          <Trades
            trades={trades}
            setups={setups}
            onOpen={setDetailTrade}
            tagFilter={tagFilter}
            onClearTagFilter={() => setTagFilter(null)}
          />
        )}
        {tab === "performance" && <Performance trades={trades} />}
        {tab === "comportement" && <Comportement onVoirTrades={voirTrades} />}
        {tab === "revue" && <Revue onStart={() => setRevueOpen(true)} onOpenReport={setReport} />}
      </main>

      {/* Drawers */}
      <SaisieDrawer
        open={saisieOpen}
        onClose={() => {
          setSaisieOpen(false);
          setEditTrade(null);
        }}
        onSave={saveTrade}
        editTrade={editTrade}
        nextId={nextId}
        setups={setups}
        onCreateSetup={createSetup}
      />
      <ImportDrawer open={importOpen} onClose={() => setImportOpen(false)} onImport={importTrades} nextId={nextId} />
      <TradeDetailDrawer
        trade={detailTrade}
        onClose={() => setDetailTrade(null)}
        onEdit={editFromDetail}
        onDelete={deleteTrade}
      />
      <RevueDrawer open={revueOpen} onClose={() => setRevueOpen(false)} />
      <WeeklyReportDrawer report={report} onClose={() => setReport(null)} />

      {/* Preview banner */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pill bg-black/80 backdrop-blur text-center">
        Preview · données fictives · 1–5 onglets · N saisir · I importer · R revue
      </div>
    </div>
  );
}
