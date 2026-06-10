"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ACCOUNT_CURRENCIES,
  AccountCurrency,
  INSTRUMENTS,
  Instrument,
  InstrumentCategory,
  calculate,
  findInstrument,
  formatLot,
  formatMoney,
  formatPips,
  formatPrice,
  formatRR,
  projectDrawdown,
} from "./instruments";

const STORAGE_KEY = "meridian-position-v1";
const FAVORITE_LIMIT = 5;

type SavedState = {
  capital: number;
  accountCurrency: AccountCurrency;
  instrument: string;
  favorites: string[];
};

function readStored(): Partial<SavedState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeStored(state: SavedState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function readUrl(): Partial<{
  cap: number;
  ccy: AccountCurrency;
  ins: string;
  ep: number;
  sm: "pips" | "price";
  sp: number;
  spx: number;
  tm: "pips" | "price";
  tp: number;
  tpx: number;
  r: number;
  d: "long" | "short";
}> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const out: any = {};
  if (p.has("cap")) out.cap = parseFloat(p.get("cap")!);
  if (p.has("ccy")) out.ccy = p.get("ccy")!;
  if (p.has("ins")) out.ins = p.get("ins")!;
  if (p.has("ep")) out.ep = parseFloat(p.get("ep")!);
  if (p.has("sm")) out.sm = p.get("sm")!;
  if (p.has("sp")) out.sp = parseFloat(p.get("sp")!);
  if (p.has("spx")) out.spx = parseFloat(p.get("spx")!);
  if (p.has("tm")) out.tm = p.get("tm")!;
  if (p.has("tp")) out.tp = parseFloat(p.get("tp")!);
  if (p.has("tpx")) out.tpx = parseFloat(p.get("tpx")!);
  if (p.has("r")) out.r = parseFloat(p.get("r")!);
  if (p.has("d")) out.d = p.get("d")!;
  return out;
}

const CATEGORY_KEY: Record<InstrumentCategory, string> = {
  forex: "catForex",
  "forex-jpy": "catForex",
  metals: "catMetals",
  indices: "catIndices",
  crypto: "catCrypto",
  energy: "catEnergy",
};

export function Calculator() {
  const t = useTranslations("Calc");
  const catLabel = (c: InstrumentCategory) => t(CATEGORY_KEY[c]);
  const [capital, setCapital] = useState<number>(25000);
  const [accountCurrency, setAccountCurrency] = useState<AccountCurrency>("EUR");
  const [instrumentSymbol, setInstrumentSymbol] = useState<string>("EUR/USD");
  const [entryPrice, setEntryPrice] = useState<number>(1.0845);
  const [slMode, setSlMode] = useState<"pips" | "price">("pips");
  const [slPips, setSlPips] = useState<number>(25);
  const [slPrice, setSlPrice] = useState<number>(1.0820);
  const [tpMode, setTpMode] = useState<"pips" | "price">("pips");
  const [tpPips, setTpPips] = useState<number>(50);
  const [tpPrice, setTpPrice] = useState<number>(1.0895);
  const [riskPct, setRiskPct] = useState<number>(1.0);
  const [direction, setDirection] = useState<"long" | "short">("long");
  const [drawdownN, setDrawdownN] = useState<number>(10);
  const [favorites, setFavorites] = useState<string[]>(["EUR/USD", "XAU/USD", "US30"]);
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = readStored();
    const url = readUrl();
    if (typeof stored.capital === "number") setCapital(stored.capital);
    if (stored.accountCurrency) setAccountCurrency(stored.accountCurrency);
    if (stored.instrument) setInstrumentSymbol(stored.instrument);
    if (stored.favorites && Array.isArray(stored.favorites)) setFavorites(stored.favorites);

    if (typeof url.cap === "number") setCapital(url.cap);
    if (url.ccy) setAccountCurrency(url.ccy);
    if (url.ins) setInstrumentSymbol(url.ins);
    if (typeof url.ep === "number") setEntryPrice(url.ep);
    if (url.sm) setSlMode(url.sm);
    if (typeof url.sp === "number") setSlPips(url.sp);
    if (typeof url.spx === "number") setSlPrice(url.spx);
    if (url.tm) setTpMode(url.tm);
    if (typeof url.tp === "number") setTpPips(url.tp);
    if (typeof url.tpx === "number") setTpPrice(url.tpx);
    if (typeof url.r === "number") setRiskPct(url.r);
    if (url.d) setDirection(url.d);
    setHydrated(true);
  }, []);

  const instrument = useMemo(() => findInstrument(instrumentSymbol), [instrumentSymbol]);

  const previousSymbol = useRef(instrumentSymbol);
  useEffect(() => {
    if (previousSymbol.current !== instrumentSymbol) {
      const inst = findInstrument(instrumentSymbol);
      setEntryPrice(inst.defaultPrice);
      const defaultSlPips = inst.category === "forex" ? 25 : inst.category === "forex-jpy" ? 30 : inst.category === "metals" ? 50 : inst.category === "indices" ? 30 : inst.category === "crypto" ? 200 : 30;
      setSlPips(defaultSlPips);
      setTpPips(defaultSlPips * 2);
      setSlPrice(direction === "long" ? inst.defaultPrice - defaultSlPips * inst.pipSize : inst.defaultPrice + defaultSlPips * inst.pipSize);
      setTpPrice(direction === "long" ? inst.defaultPrice + defaultSlPips * 2 * inst.pipSize : inst.defaultPrice - defaultSlPips * 2 * inst.pipSize);
      previousSymbol.current = instrumentSymbol;
    }
  }, [instrumentSymbol, direction]);

  useEffect(() => {
    if (!hydrated) return;
    writeStored({ capital, accountCurrency, instrument: instrumentSymbol, favorites });
  }, [capital, accountCurrency, instrumentSymbol, favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const p = new URLSearchParams();
    p.set("cap", capital.toString());
    p.set("ccy", accountCurrency);
    p.set("ins", instrumentSymbol);
    p.set("ep", entryPrice.toString());
    p.set("sm", slMode);
    p.set("sp", slPips.toString());
    p.set("spx", slPrice.toString());
    p.set("tm", tpMode);
    p.set("tp", tpPips.toString());
    p.set("tpx", tpPrice.toString());
    p.set("r", riskPct.toString());
    p.set("d", direction);
    const url = `${window.location.pathname}?${p.toString()}`;
    window.history.replaceState({}, "", url);
  }, [hydrated, capital, accountCurrency, instrumentSymbol, entryPrice, slMode, slPips, slPrice, tpMode, tpPips, tpPrice, riskPct, direction]);

  const baseInput = {
    capital,
    accountCurrency,
    instrument,
    entryPrice,
    slMode,
    slPips,
    slPrice,
    tpMode,
    tpPips,
    tpPrice,
    direction,
  };

  const result = useMemo(() => calculate({ ...baseInput, riskPct }), [baseInput, riskPct]);

  const scenarios = useMemo(() => {
    const presets = [0.5, 1.0, 2.0];
    return presets.map((pct) => ({
      pct,
      label: pct === 0.5 ? t("scenConservative") : pct === 1.0 ? t("scenStandard") : t("scenAggressive"),
      result: calculate({ ...baseInput, riskPct: pct }),
    }));
  }, [baseInput]);

  const drawdown = useMemo(() => projectDrawdown(capital, riskPct, drawdownN), [capital, riskPct, drawdownN]);

  const drawdownSeries = useMemo(() => {
    const series: { n: number; remaining: number; drawdownPct: number }[] = [];
    for (let n = 1; n <= 15; n++) {
      const d = projectDrawdown(capital, riskPct, n);
      series.push({ n, remaining: d.remaining, drawdownPct: d.drawdownPct });
    }
    return series;
  }, [capital, riskPct]);

  const copyShareUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }, []);

  const toggleFavorite = useCallback(
    (symbol: string) => {
      setFavorites((prev) => {
        if (prev.includes(symbol)) return prev.filter((s) => s !== symbol);
        const next = [symbol, ...prev.filter((s) => s !== symbol)];
        return next.slice(0, FAVORITE_LIMIT);
      });
    },
    [],
  );

  const handleEntryChange = (value: number) => {
    setEntryPrice(value);
    if (slMode === "price") {
      const distance = direction === "long" ? value - slPrice : slPrice - value;
      if (distance <= 0) {
        setSlPrice(direction === "long" ? value - slPips * instrument.pipSize : value + slPips * instrument.pipSize);
      }
    }
  };

  const filteredInstruments = useMemo(() => {
    const q = search.trim().toUpperCase();
    if (!q) return INSTRUMENTS;
    const qn = q.replace(/[^A-Z0-9]/g, "");
    return INSTRUMENTS.filter(
      (i) =>
        i.symbol.includes(q) ||
        i.symbol.replace(/[^A-Z0-9]/g, "").includes(qn) ||
        i.name.toUpperCase().includes(q),
    );
  }, [search]);

  const reset = () => {
    setCapital(25000);
    setAccountCurrency("EUR");
    setInstrumentSymbol("EUR/USD");
    setEntryPrice(1.0845);
    setSlMode("pips");
    setSlPips(25);
    setSlPrice(1.0820);
    setTpMode("pips");
    setTpPips(50);
    setTpPrice(1.0895);
    setRiskPct(1.0);
    setDirection("long");
    setDrawdownN(10);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
      <section
        aria-label={t("paramsAria")}
        className="lg:col-span-5 card rounded-2xl p-6 lg:p-7"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="h-eyebrow">{t("params")}</span>
          <button
            onClick={reset}
            className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint hover:text-white transition-colors"
            aria-label={t("resetAria")}
          >
            {t("reset")}
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <Label>{t("direction")}</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <DirectionButton active={direction === "long"} onClick={() => setDirection("long")} variant="long">
                {t("long")}
              </DirectionButton>
              <DirectionButton active={direction === "short"} onClick={() => setDirection("short")} variant="short">
                {t("short")}
              </DirectionButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label={t("capital")}
              suffix={accountCurrency}
              value={capital}
              onChange={setCapital}
              step={100}
              min={0}
            />
            <div>
              <Label>{t("currency")}</Label>
              <div className="mt-2 grid grid-cols-4 gap-1">
                {ACCOUNT_CURRENCIES.map((ccy) => (
                  <button
                    key={ccy}
                    onClick={() => setAccountCurrency(ccy)}
                    className={`h-11 rounded-xl border text-[12px] mono tracking-[0.1em] transition-colors ${
                      accountCurrency === ccy
                        ? "bg-white text-black border-white"
                        : "bg-panel border-border text-ink-mute hover:border-border-2 hover:text-white"
                    }`}
                  >
                    {ccy}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>{t("instrument")}</Label>
              <button
                onClick={() => setSearchOpen((o) => !o)}
                className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint hover:text-white transition-colors"
              >
                {searchOpen ? t("close") : t("all")}
              </button>
            </div>
            {!searchOpen ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {favorites.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => setInstrumentSymbol(sym)}
                    className={`px-3 h-8 rounded-full border text-[12px] mono transition-colors ${
                      instrumentSymbol === sym
                        ? "bg-white text-black border-white"
                        : "bg-panel border-border text-ink-mute hover:border-border-2 hover:text-white"
                    }`}
                  >
                    {sym}
                  </button>
                ))}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="px-3 h-8 rounded-full border border-dashed border-border-2 text-[12px] mono text-ink-muted hover:text-white hover:border-ink-muted transition-colors"
                >
                  {t("other")}
                </button>
              </div>
            ) : (
              <div className="mt-2 rounded-xl border border-border bg-panel">
                <input
                  type="text"
                  aria-label={t("searchAria")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="w-full bg-transparent px-3 h-10 text-sm border-b border-border focus:outline-none focus:border-border-2 placeholder:text-ink-faint"
                  autoFocus
                />
                <div className="max-h-56 overflow-y-auto">
                  {filteredInstruments.map((inst) => (
                    <button
                      key={inst.symbol}
                      onClick={() => {
                        setInstrumentSymbol(inst.symbol);
                        toggleFavorite(inst.symbol);
                        setSearchOpen(false);
                        setSearch("");
                      }}
                      className="w-full flex items-center justify-between px-3 h-10 hover:bg-white/[0.04] transition-colors text-left"
                    >
                      <span className="mono text-[13px] text-white">{inst.symbol}</span>
                      <span className="text-[11px] text-ink-faint mono uppercase tracking-[0.15em]">
                        {catLabel(inst.category)}
                      </span>
                    </button>
                  ))}
                  {filteredInstruments.length === 0 && (
                    <div className="px-3 py-4 text-[12px] text-ink-faint">{t("noInstrument")}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <NumberField
            label={t("entryPrice")}
            value={entryPrice}
            onChange={handleEntryChange}
            step={instrument.pipSize}
            precision={instrument.pricePrecision}
            min={0}
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>{t("stopLoss")}</Label>
              <ModeSwitch mode={slMode} onChange={setSlMode} />
            </div>
            {slMode === "pips" ? (
              <NumberField
                value={slPips}
                onChange={setSlPips}
                ariaLabel={t("slPipsAria")}
                suffix={t("pips")}
                step={1}
                min={0}
                bare
              />
            ) : (
              <NumberField
                value={slPrice}
                onChange={setSlPrice}
                ariaLabel={t("slPriceAria")}
                step={instrument.pipSize}
                precision={instrument.pricePrecision}
                min={0}
                bare
              />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>{t("takeProfit")}</Label>
              <ModeSwitch mode={tpMode} onChange={setTpMode} />
            </div>
            {tpMode === "pips" ? (
              <NumberField
                value={tpPips}
                onChange={setTpPips}
                ariaLabel={t("tpPipsAria")}
                suffix={t("pips")}
                step={1}
                min={0}
                bare
              />
            ) : (
              <NumberField
                value={tpPrice}
                onChange={setTpPrice}
                ariaLabel={t("tpPriceAria")}
                step={instrument.pipSize}
                precision={instrument.pricePrecision}
                min={0}
                bare
              />
            )}
          </div>

          <div>
            <div className="flex items-end justify-between mb-3">
              <Label>{t("riskPerTrade")}</Label>
              <span
                className={`mono text-[28px] tabular-nums leading-none tracking-tight ${
                  riskPct > 2 ? "text-risk" : "text-white"
                }`}
              >
                {riskPct.toFixed(2)}
                <span className="text-ink-faint text-[14px] ml-0.5">%</span>
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={3}
              step={0.05}
              value={riskPct}
              onChange={(e) => setRiskPct(parseFloat(e.target.value))}
              className={`risk-slider ${riskPct > 2 ? "risk-slider-danger" : ""}`}
              aria-label={t("riskAria")}
            />
            <div className="flex justify-between mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mt-2">
              <button onClick={() => setRiskPct(0.25)} className="hover:text-white transition-colors">{t("preset025")}</button>
              <button onClick={() => setRiskPct(0.5)} className="hover:text-white transition-colors">{t("preset05")}</button>
              <button onClick={() => setRiskPct(1)} className="hover:text-white transition-colors">{t("preset1")}</button>
              <button onClick={() => setRiskPct(2)} className="hover:text-white transition-colors">{t("preset2")}</button>
              <button onClick={() => setRiskPct(3)} className="hover:text-white transition-colors">{t("preset3")}</button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button onClick={copyShareUrl} className="btn btn-ghost text-[12px]">
              {copied ? t("linkCopied") : t("copyLink")}
            </button>
            <a href="#methode" className="btn btn-ghost text-[12px]">
              {t("why")}
            </a>
          </div>
        </div>
      </section>

      <section
        aria-label="Résultats du calcul"
        className="lg:col-span-7 flex flex-col gap-4 lg:gap-6"
      >
        <div className="glow-border rounded-2xl p-6 lg:p-8">
          <div className="flex items-center justify-between mb-5">
            <span className="h-eyebrow">{t("yourScenario")} · {riskPct.toFixed(2)} %</span>
            <span
              className={`pill ${result.isValid ? "pill-green" : "pill-red"}`}
            >
              {result.isValid ? t("valid") : t("incomplete")}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
            <ResultCell label={t("resSize")} value={formatLot(result.positionSizeLots)} suffix={t("lot")} primary />
            <ResultCell label={t("resRisk")} value={formatMoney(result.riskAmount, accountCurrency)} />
            <ResultCell label={t("resRR")} value={formatRR(result.rr)} />
            <ResultCell
              label={t("resReward")}
              value={result.reward ? formatMoney(result.reward, accountCurrency) : "—"}
              tone={result.reward ? "edge" : "default"}
            />
          </div>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-px text-[11px] mono uppercase tracking-[0.15em] text-ink-faint">
            <Meta label={t("metaPipValue")} value={`${formatMoney(result.pipValuePerLot, accountCurrency)}/${t("lot")}`} />
            <Meta label={t("metaSlDistance")} value={`${formatPips(result.slDistancePips)} ${t("pips")}`} />
            <Meta label={t("metaLossPerLot")} value={formatMoney(result.lossPerLot, accountCurrency)} />
            <Meta label={t("metaUnits")} value={result.positionSizeUnits >= 1 ? result.positionSizeUnits.toFixed(0) : result.positionSizeUnits.toFixed(2)} />
          </div>
          {result.warnings.length > 0 && (
            <ul className="mt-5 space-y-1 text-[12px] text-risk/90">
              {result.warnings.map((w, i) => (
                <li key={i}>· {w}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="h-eyebrow">{t("comparison")}</span>
            <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              {t("slEquals", { pips: formatPips(result.slDistancePips) })}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {scenarios.map((s) => (
              <div
                key={s.pct}
                className={`card rounded-2xl p-5 ${
                  Math.abs(s.pct - riskPct) < 0.01 ? "ring-1 ring-white/20" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                    {s.label}
                  </span>
                  <span className="mono text-[12px] text-ink-mute">{s.pct.toFixed(1)} %</span>
                </div>
                <div className="mono text-[28px] tabular-nums tracking-tight text-white leading-none">
                  {formatLot(s.result.positionSizeLots)}
                  <span className="text-ink-faint text-[13px] ml-1">lot</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[12px] text-ink-mute">
                  <span>{t("scRisk")}</span>
                  <span className="mono tabular-nums">{formatMoney(s.result.riskAmount, accountCurrency)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[12px] text-ink-mute">
                  <span>{t("scReward")}</span>
                  <span className="mono tabular-nums">
                    {s.result.reward ? formatMoney(s.result.reward, accountCurrency) : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Visualizer result={result} direction={direction} accountCurrency={accountCurrency} />

        <DrawdownPanel
          capital={capital}
          riskPct={riskPct}
          n={drawdownN}
          onChangeN={setDrawdownN}
          accountCurrency={accountCurrency}
          remaining={drawdown.remaining}
          drawdownPct={drawdown.drawdownPct}
          series={drawdownSeries}
        />
      </section>

      <RiskSliderStyles />
    </div>
  );
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className="h-eyebrow">
        {children}
      </label>
    );
  }
  return <span className="h-eyebrow">{children}</span>;
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
  step = 1,
  precision,
  min,
  bare = false,
  ariaLabel,
}: {
  label?: string;
  ariaLabel?: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  step?: number;
  precision?: number;
  min?: number;
  bare?: boolean;
}) {
  const fieldId = useId();
  const [text, setText] = useState<string>(() =>
    precision !== undefined ? value.toFixed(precision) : value.toString(),
  );
  const lastValue = useRef(value);

  useEffect(() => {
    if (value !== lastValue.current) {
      setText(precision !== undefined ? value.toFixed(precision) : value.toString());
      lastValue.current = value;
    }
  }, [value, precision]);

  return (
    <div>
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      <div className={`${label ? "mt-2" : ""} relative`}>
        <input
          id={fieldId}
          aria-label={label ? undefined : ariaLabel}
          type="text"
          inputMode="decimal"
          value={text}
          onChange={(e) => {
            const raw = e.target.value.replace(",", ".");
            setText(e.target.value);
            const num = parseFloat(raw);
            if (!isNaN(num) && (min === undefined || num >= min)) {
              lastValue.current = num;
              onChange(num);
            }
          }}
          onBlur={() => {
            const num = parseFloat(text.replace(",", "."));
            if (isNaN(num)) {
              setText(precision !== undefined ? value.toFixed(precision) : value.toString());
            } else if (precision !== undefined) {
              setText(num.toFixed(precision));
            }
          }}
          className={`w-full h-11 px-3 ${suffix ? "pr-12" : ""} bg-panel border border-border rounded-xl mono text-[15px] text-white tabular-nums focus:outline-none focus:border-border-2 transition-colors`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 mono text-[11px] uppercase tracking-[0.15em] text-ink-faint pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function ModeSwitch({
  mode,
  onChange,
}: {
  mode: "pips" | "price";
  onChange: (m: "pips" | "price") => void;
}) {
  const t = useTranslations("Calc");
  return (
    <div className="flex items-center gap-1 mono text-[10px] uppercase tracking-[0.2em]">
      <button
        onClick={() => onChange("pips")}
        className={`px-2 h-6 rounded-md transition-colors ${
          mode === "pips" ? "bg-white text-black" : "text-ink-faint hover:text-white"
        }`}
      >
        {t("modePips")}
      </button>
      <button
        onClick={() => onChange("price")}
        className={`px-2 h-6 rounded-md transition-colors ${
          mode === "price" ? "bg-white text-black" : "text-ink-faint hover:text-white"
        }`}
      >
        {t("modePrice")}
      </button>
    </div>
  );
}

function DirectionButton({
  active,
  onClick,
  variant,
  children,
}: {
  active: boolean;
  onClick: () => void;
  variant: "long" | "short";
  children: React.ReactNode;
}) {
  const color = variant === "long" ? "edge" : "risk";
  return (
    <button
      onClick={onClick}
      className={`h-11 rounded-xl border mono text-[12px] uppercase tracking-[0.15em] transition-colors ${
        active
          ? variant === "long"
            ? "bg-edge/10 border-edge/40 text-edge"
            : "bg-risk/10 border-risk/40 text-risk"
          : "bg-panel border-border text-ink-mute hover:border-border-2 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function ResultCell({
  label,
  value,
  suffix,
  primary,
  tone = "default",
}: {
  label: string;
  value: string;
  suffix?: string;
  primary?: boolean;
  tone?: "default" | "edge" | "risk";
}) {
  const toneClass =
    tone === "edge" ? "text-edge" : tone === "risk" ? "text-risk" : "text-white";
  return (
    <div className="bg-panel-2 px-4 py-4 lg:px-5 lg:py-5">
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-1.5">
        {label}
      </div>
      <div
        className={`mono tabular-nums tracking-tight leading-none ${toneClass} ${
          primary ? "text-[32px] lg:text-[40px]" : "text-[22px] lg:text-[26px]"
        }`}
      >
        {value}
        {suffix && (
          <span className="text-ink-faint text-[13px] ml-1 font-normal">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-panel px-3 py-3 mono">
      <div className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">{label}</div>
      <div className="mt-1 text-[13px] tabular-nums text-white normal-case tracking-normal">{value}</div>
    </div>
  );
}

function Visualizer({
  result,
  direction,
  accountCurrency,
}: {
  result: ReturnType<typeof calculate>;
  direction: "long" | "short";
  accountCurrency: string;
}) {
  const t = useTranslations("Calc");
  const rr = result.rr ?? 0;
  const slPosition = 50;
  const entryPosition = 50 + (direction === "long" ? 200 : -200);
  const tpDelta = (direction === "long" ? 1 : -1) * 200 * rr;
  const tpPosition = entryPosition + tpDelta;

  const xMin = Math.min(slPosition, entryPosition, tpPosition || entryPosition) - 30;
  const xMax = Math.max(slPosition, entryPosition, tpPosition || entryPosition) + 30;
  const totalWidth = xMax - xMin;
  const W = 800;
  const scale = W / totalWidth;
  const toX = (p: number) => (p - xMin) * scale;

  const hasTP = result.tpDistance > 0;

  return (
    <div className="card rounded-2xl p-6 lg:p-7">
      <div className="flex items-center justify-between mb-5">
        <span className="h-eyebrow">{t("visualizer")}</span>
        <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          {direction === "long" ? t("long") : t("short")}
        </span>
      </div>
      <div className="relative">
        <svg aria-hidden="true" viewBox={`0 0 ${W} 140`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          <line x1={0} y1={70} x2={W} y2={70} stroke="#1a1a1a" strokeWidth={1} />
          {hasTP && rr > 0 && (
            <>
              {[1, 2, 3].map((mult) => {
                const x = toX(entryPosition + (direction === "long" ? 1 : -1) * 200 * mult);
                if (x < 0 || x > W) return null;
                return (
                  <g key={mult}>
                    <line x1={x} y1={62} x2={x} y2={78} stroke="#262626" strokeWidth={1} />
                    <text x={x} y={100} textAnchor="middle" className="mono" fontSize={9} fill="#8a8a8a" letterSpacing="0.1em">
                      {mult}R
                    </text>
                  </g>
                );
              })}
            </>
          )}
          {[1].map((mult) => {
            const x = toX(entryPosition - (direction === "long" ? 1 : -1) * 200 * mult);
            return (
              <g key={`neg${mult}`}>
                <line x1={x} y1={62} x2={x} y2={78} stroke="#262626" strokeWidth={1} />
                <text x={x} y={100} textAnchor="middle" className="mono" fontSize={9} fill="#8a8a8a" letterSpacing="0.1em">
                  -1R
                </text>
              </g>
            );
          })}

          <line
            x1={toX(Math.min(slPosition, entryPosition))}
            y1={70}
            x2={toX(Math.max(slPosition, entryPosition))}
            y2={70}
            stroke="#ef4444"
            strokeWidth={2}
            opacity={0.6}
          />
          {hasTP && (
            <line
              x1={toX(Math.min(entryPosition, tpPosition))}
              y1={70}
              x2={toX(Math.max(entryPosition, tpPosition))}
              y2={70}
              stroke="#22c55e"
              strokeWidth={2}
              opacity={0.6}
            />
          )}

          <circle cx={toX(slPosition)} cy={70} r={7} fill="#ef4444" />
          <circle cx={toX(slPosition)} cy={70} r={3} fill="#000" />
          <text x={toX(slPosition)} y={40} textAnchor="middle" className="mono" fontSize={10} fill="#fca5a5" letterSpacing="0.15em">
            SL
          </text>
          <text x={toX(slPosition)} y={125} textAnchor="middle" className="mono" fontSize={10} fill="#8a8a8a" letterSpacing="0.1em">
            -{formatMoney(result.riskAmount, accountCurrency)}
          </text>

          <circle cx={toX(entryPosition)} cy={70} r={8} fill="#fff" />
          <circle cx={toX(entryPosition)} cy={70} r={3} fill="#000" />
          <text x={toX(entryPosition)} y={40} textAnchor="middle" className="mono" fontSize={10} fill="#fff" letterSpacing="0.15em">
            ENTRY
          </text>

          {hasTP && (
            <>
              <circle cx={toX(tpPosition)} cy={70} r={7} fill="#22c55e" />
              <circle cx={toX(tpPosition)} cy={70} r={3} fill="#000" />
              <text x={toX(tpPosition)} y={40} textAnchor="middle" className="mono" fontSize={10} fill="#86efac" letterSpacing="0.15em">
                TP
              </text>
              <text x={toX(tpPosition)} y={125} textAnchor="middle" className="mono" fontSize={10} fill="#8a8a8a" letterSpacing="0.1em">
                +{result.reward ? formatMoney(result.reward, accountCurrency) : "—"}
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

function DrawdownPanel({
  capital,
  riskPct,
  n,
  onChangeN,
  accountCurrency,
  remaining,
  drawdownPct,
  series,
}: {
  capital: number;
  riskPct: number;
  n: number;
  onChangeN: (n: number) => void;
  accountCurrency: string;
  remaining: number;
  drawdownPct: number;
  series: { n: number; remaining: number; drawdownPct: number }[];
}) {
  const t = useTranslations("Calc");
  const maxDrawdown = series[series.length - 1].drawdownPct;
  return (
    <div className="card rounded-2xl p-6 lg:p-7">
      <div className="flex items-center justify-between mb-5">
        <span className="h-eyebrow">{t("drawdownProjected")}</span>
        <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          {t("perTrade", { pct: riskPct.toFixed(2) })}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden mb-6">
        <div className="bg-panel-2 px-4 py-4">
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-1.5">
            {t("consecutiveLosses")}
          </div>
          <div className="mono text-[32px] tabular-nums tracking-tight text-white leading-none">
            {n}
          </div>
        </div>
        <div className="bg-panel-2 px-4 py-4">
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-1.5">
            {t("remainingCapital")}
          </div>
          <div className="mono text-[22px] tabular-nums tracking-tight text-white leading-none">
            {formatMoney(remaining, accountCurrency)}
          </div>
        </div>
        <div className="bg-panel-2 px-4 py-4">
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-1.5">
            {t("drawdown")}
          </div>
          <div className="mono text-[22px] tabular-nums tracking-tight text-risk leading-none">
            -{drawdownPct.toFixed(2)} %
          </div>
        </div>
      </div>

      <input
        type="range"
        min={1}
        max={15}
        step={1}
        value={n}
        onChange={(e) => onChangeN(parseInt(e.target.value))}
        className="risk-slider mb-6"
        aria-label={t("lossesCountAria")}
      />

      <div className="space-y-1.5">
        {series.map((row) => {
          const width = maxDrawdown > 0 ? (row.drawdownPct / maxDrawdown) * 100 : 0;
          const isActive = row.n === n;
          return (
            <div
              key={row.n}
              className={`flex items-center gap-3 transition-opacity ${
                isActive ? "opacity-100" : "opacity-60 hover:opacity-90"
              }`}
              onClick={() => onChangeN(row.n)}
              role="button"
              tabIndex={0}
            >
              <div className="mono text-[10px] uppercase tracking-[0.15em] text-ink-faint w-6 text-right">
                {row.n}
              </div>
              <div className="flex-1 h-2 bg-panel rounded-full overflow-hidden">
                <div
                  className={`h-full ${isActive ? "bg-risk" : "bg-risk/40"} transition-all duration-300`}
                  style={{ width: `${width}%` }}
                />
              </div>
              <div className="mono text-[11px] tabular-nums text-ink-mute w-16 text-right">
                -{row.drawdownPct.toFixed(2)} %
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-[12px] text-ink-muted leading-relaxed">
        {t("drawdownExplain", { pct: riskPct.toFixed(2), n, dd: drawdownPct.toFixed(2) })}
      </p>
    </div>
  );
}

function RiskSliderStyles() {
  return (
    <style jsx global>{`
      .risk-slider {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        background: transparent;
        height: 24px;
        cursor: pointer;
      }
      .risk-slider::-webkit-slider-runnable-track {
        background: #1a1a1a;
        height: 4px;
        border-radius: 2px;
      }
      .risk-slider::-moz-range-track {
        background: #1a1a1a;
        height: 4px;
        border-radius: 2px;
      }
      .risk-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        height: 18px;
        width: 18px;
        margin-top: -7px;
        background: #fff;
        border-radius: 50%;
        cursor: pointer;
        transition: transform 0.15s ease;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
      }
      .risk-slider::-moz-range-thumb {
        height: 18px;
        width: 18px;
        background: #fff;
        border: 0;
        border-radius: 50%;
        cursor: pointer;
        transition: transform 0.15s ease;
      }
      .risk-slider:hover::-webkit-slider-thumb {
        transform: scale(1.1);
      }
      .risk-slider-danger::-webkit-slider-thumb {
        background: #ef4444;
        box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.25);
      }
      .risk-slider-danger::-moz-range-thumb {
        background: #ef4444;
      }
    `}</style>
  );
}
