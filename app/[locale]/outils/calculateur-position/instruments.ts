export type InstrumentCategory =
  | "forex"
  | "forex-jpy"
  | "metals"
  | "indices"
  | "crypto"
  | "energy";

export type Instrument = {
  symbol: string;
  name: string;
  category: InstrumentCategory;
  base: string;
  quote: string;
  pipSize: number;
  contractSize: number;
  pricePrecision: number;
  defaultPrice: number;
};

export const INSTRUMENTS: Instrument[] = [
  { symbol: "EUR/USD", name: "Euro / Dollar US", category: "forex", base: "EUR", quote: "USD", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 1.0845 },
  { symbol: "GBP/USD", name: "Livre / Dollar US", category: "forex", base: "GBP", quote: "USD", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 1.2710 },
  { symbol: "USD/JPY", name: "Dollar US / Yen", category: "forex-jpy", base: "USD", quote: "JPY", pipSize: 0.01, contractSize: 100000, pricePrecision: 3, defaultPrice: 152.40 },
  { symbol: "USD/CHF", name: "Dollar US / Franc", category: "forex", base: "USD", quote: "CHF", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 0.8850 },
  { symbol: "AUD/USD", name: "Dollar AU / Dollar US", category: "forex", base: "AUD", quote: "USD", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 0.6620 },
  { symbol: "USD/CAD", name: "Dollar US / Dollar CA", category: "forex", base: "USD", quote: "CAD", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 1.3680 },
  { symbol: "NZD/USD", name: "Dollar NZ / Dollar US", category: "forex", base: "NZD", quote: "USD", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 0.6020 },
  { symbol: "EUR/GBP", name: "Euro / Livre", category: "forex", base: "EUR", quote: "GBP", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 0.8530 },
  { symbol: "EUR/JPY", name: "Euro / Yen", category: "forex-jpy", base: "EUR", quote: "JPY", pipSize: 0.01, contractSize: 100000, pricePrecision: 3, defaultPrice: 165.20 },
  { symbol: "GBP/JPY", name: "Livre / Yen", category: "forex-jpy", base: "GBP", quote: "JPY", pipSize: 0.01, contractSize: 100000, pricePrecision: 3, defaultPrice: 193.60 },
  { symbol: "EUR/CHF", name: "Euro / Franc", category: "forex", base: "EUR", quote: "CHF", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 0.9598 },
  { symbol: "EUR/AUD", name: "Euro / Dollar AU", category: "forex", base: "EUR", quote: "AUD", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 1.6382 },
  { symbol: "EUR/CAD", name: "Euro / Dollar CA", category: "forex", base: "EUR", quote: "CAD", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 1.4836 },
  { symbol: "EUR/NZD", name: "Euro / Dollar NZ", category: "forex", base: "EUR", quote: "NZD", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 1.8015 },
  { symbol: "GBP/CHF", name: "Livre / Franc", category: "forex", base: "GBP", quote: "CHF", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 1.1248 },
  { symbol: "GBP/AUD", name: "Livre / Dollar AU", category: "forex", base: "GBP", quote: "AUD", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 1.9200 },
  { symbol: "GBP/CAD", name: "Livre / Dollar CA", category: "forex", base: "GBP", quote: "CAD", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 1.7387 },
  { symbol: "GBP/NZD", name: "Livre / Dollar NZ", category: "forex", base: "GBP", quote: "NZD", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 2.1113 },
  { symbol: "AUD/JPY", name: "Dollar AU / Yen", category: "forex-jpy", base: "AUD", quote: "JPY", pipSize: 0.01, contractSize: 100000, pricePrecision: 3, defaultPrice: 100.89 },
  { symbol: "AUD/CHF", name: "Dollar AU / Franc", category: "forex", base: "AUD", quote: "CHF", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 0.5859 },
  { symbol: "AUD/CAD", name: "Dollar AU / Dollar CA", category: "forex", base: "AUD", quote: "CAD", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 0.9056 },
  { symbol: "AUD/NZD", name: "Dollar AU / Dollar NZ", category: "forex", base: "AUD", quote: "NZD", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 1.0997 },
  { symbol: "NZD/JPY", name: "Dollar NZ / Yen", category: "forex-jpy", base: "NZD", quote: "JPY", pipSize: 0.01, contractSize: 100000, pricePrecision: 3, defaultPrice: 91.74 },
  { symbol: "NZD/CHF", name: "Dollar NZ / Franc", category: "forex", base: "NZD", quote: "CHF", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 0.5328 },
  { symbol: "NZD/CAD", name: "Dollar NZ / Dollar CA", category: "forex", base: "NZD", quote: "CAD", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 0.8235 },
  { symbol: "CAD/JPY", name: "Dollar CA / Yen", category: "forex-jpy", base: "CAD", quote: "JPY", pipSize: 0.01, contractSize: 100000, pricePrecision: 3, defaultPrice: 111.40 },
  { symbol: "CAD/CHF", name: "Dollar CA / Franc", category: "forex", base: "CAD", quote: "CHF", pipSize: 0.0001, contractSize: 100000, pricePrecision: 5, defaultPrice: 0.6470 },
  { symbol: "CHF/JPY", name: "Franc / Yen", category: "forex-jpy", base: "CHF", quote: "JPY", pipSize: 0.01, contractSize: 100000, pricePrecision: 3, defaultPrice: 172.20 },
  { symbol: "XAU/USD", name: "Or / Dollar US", category: "metals", base: "XAU", quote: "USD", pipSize: 0.01, contractSize: 100, pricePrecision: 2, defaultPrice: 2380.00 },
  { symbol: "XAG/USD", name: "Argent / Dollar US", category: "metals", base: "XAG", quote: "USD", pipSize: 0.001, contractSize: 5000, pricePrecision: 3, defaultPrice: 28.40 },
  { symbol: "US30", name: "Indice US 30", category: "indices", base: "USD", quote: "USD", pipSize: 1, contractSize: 1, pricePrecision: 1, defaultPrice: 39200 },
  { symbol: "NAS100", name: "Indice Nasdaq 100", category: "indices", base: "USD", quote: "USD", pipSize: 1, contractSize: 1, pricePrecision: 1, defaultPrice: 18450 },
  { symbol: "SPX500", name: "Indice S&P 500", category: "indices", base: "USD", quote: "USD", pipSize: 0.1, contractSize: 1, pricePrecision: 2, defaultPrice: 5180 },
  { symbol: "GER40", name: "Indice DAX 40", category: "indices", base: "EUR", quote: "EUR", pipSize: 1, contractSize: 1, pricePrecision: 1, defaultPrice: 18250 },
  { symbol: "CAC40", name: "Indice CAC 40", category: "indices", base: "EUR", quote: "EUR", pipSize: 1, contractSize: 1, pricePrecision: 1, defaultPrice: 8120 },
  { symbol: "UK100", name: "Indice FTSE 100", category: "indices", base: "GBP", quote: "GBP", pipSize: 1, contractSize: 1, pricePrecision: 1, defaultPrice: 8240 },
  { symbol: "BTC/USD", name: "Bitcoin / Dollar US", category: "crypto", base: "BTC", quote: "USD", pipSize: 1, contractSize: 1, pricePrecision: 1, defaultPrice: 67500 },
  { symbol: "ETH/USD", name: "Ethereum / Dollar US", category: "crypto", base: "ETH", quote: "USD", pipSize: 0.1, contractSize: 1, pricePrecision: 2, defaultPrice: 3480 },
  { symbol: "SOL/USD", name: "Solana / Dollar US", category: "crypto", base: "SOL", quote: "USD", pipSize: 0.01, contractSize: 1, pricePrecision: 2, defaultPrice: 165.40 },
  { symbol: "WTI", name: "Pétrole WTI", category: "energy", base: "USD", quote: "USD", pipSize: 0.01, contractSize: 1000, pricePrecision: 2, defaultPrice: 78.40 },
  { symbol: "BRENT", name: "Pétrole Brent", category: "energy", base: "USD", quote: "USD", pipSize: 0.01, contractSize: 1000, pricePrecision: 2, defaultPrice: 82.10 },
];

export const ACCOUNT_CURRENCIES = ["EUR", "USD", "GBP", "CHF"] as const;
export type AccountCurrency = (typeof ACCOUNT_CURRENCIES)[number];

const FX_DEFAULTS: Record<string, number> = {
  "EUR/USD": 1.0845,
  "EUR/GBP": 0.8530,
  "EUR/JPY": 165.20,
  "EUR/CHF": 0.9598,
  "EUR/CAD": 1.4830,
  "EUR/AUD": 1.6380,
  "EUR/NZD": 1.8020,
  "USD/JPY": 152.40,
  "USD/CHF": 0.8850,
  "USD/CAD": 1.3680,
  "USD/GBP": 0.7870,
  "USD/AUD": 1.5110,
  "GBP/USD": 1.2710,
  "GBP/JPY": 193.60,
  "GBP/CHF": 1.1245,
  "AUD/USD": 0.6620,
  "NZD/USD": 0.6020,
};

export function getFxRate(from: string, to: string): number {
  if (from === to) return 1;
  const direct = FX_DEFAULTS[`${from}/${to}`];
  if (direct) return direct;
  const inverse = FX_DEFAULTS[`${to}/${from}`];
  if (inverse) return 1 / inverse;
  const fromToUsd = from === "USD" ? 1 : FX_DEFAULTS[`${from}/USD`] ?? (FX_DEFAULTS[`USD/${from}`] ? 1 / FX_DEFAULTS[`USD/${from}`] : null);
  const usdToDest = to === "USD" ? 1 : FX_DEFAULTS[`USD/${to}`] ?? (FX_DEFAULTS[`${to}/USD`] ? 1 / FX_DEFAULTS[`${to}/USD`] : null);
  if (fromToUsd !== null && usdToDest !== null) return fromToUsd * usdToDest;
  return 1;
}

export function findInstrument(symbol: string): Instrument {
  return INSTRUMENTS.find((i) => i.symbol === symbol) ?? INSTRUMENTS[0];
}

export type CalcInput = {
  capital: number;
  accountCurrency: string;
  instrument: Instrument;
  entryPrice: number;
  slMode: "pips" | "price";
  slPips: number;
  slPrice: number;
  tpMode: "pips" | "price";
  tpPips: number;
  tpPrice: number;
  riskPct: number;
  direction: "long" | "short";
};

export type CalcResult = {
  riskAmount: number;
  slDistance: number;
  slDistancePips: number;
  tpDistance: number;
  tpDistancePips: number;
  pipValuePerLot: number;
  lossPerLot: number;
  positionSizeLots: number;
  positionSizeUnits: number;
  rr: number | null;
  reward: number | null;
  isValid: boolean;
  warnings: string[];
};

export function calculate(input: CalcInput): CalcResult {
  const {
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
    riskPct,
    direction,
  } = input;

  const warnings: string[] = [];

  const riskAmount = capital * (riskPct / 100);

  const slDistance =
    slMode === "pips"
      ? slPips * instrument.pipSize
      : Math.abs(entryPrice - slPrice);

  const slDistancePips = slDistance / instrument.pipSize;

  const tpDistance =
    tpMode === "pips"
      ? tpPips * instrument.pipSize
      : Math.abs(entryPrice - tpPrice);
  const tpDistancePips = tpDistance / instrument.pipSize;

  const quoteToAccount = getFxRate(instrument.quote, accountCurrency);
  const pipValuePerLot = instrument.pipSize * instrument.contractSize * quoteToAccount;
  const lossPerLot = slDistance * instrument.contractSize * quoteToAccount;

  const positionSizeLots = lossPerLot > 0 ? riskAmount / lossPerLot : 0;
  const positionSizeUnits = positionSizeLots * instrument.contractSize;

  const rr = slDistance > 0 && tpDistance > 0 ? tpDistance / slDistance : null;
  const reward = rr ? riskAmount * rr : null;

  if (slDistance === 0) warnings.push("Le stop loss doit différer du prix d'entrée.");
  if (entryPrice <= 0) warnings.push("Le prix d'entrée doit être positif.");
  if (riskPct > 2) warnings.push("Risque par trade au-delà de 2 % — au-dessus des seuils standards.");
  if (riskPct < 0.1) warnings.push("Risque par trade très faible — vérifie si c'est intentionnel.");

  const isValid = slDistance > 0 && entryPrice > 0 && capital > 0 && riskPct > 0;

  return {
    riskAmount,
    slDistance,
    slDistancePips,
    tpDistance,
    tpDistancePips,
    pipValuePerLot,
    lossPerLot,
    positionSizeLots,
    positionSizeUnits,
    rr,
    reward,
    isValid,
    warnings,
  };
}

export function projectDrawdown(capital: number, riskPct: number, nLosses: number) {
  const survivalRate = 1 - riskPct / 100;
  const remaining = capital * Math.pow(survivalRate, nLosses);
  const drawdown = capital - remaining;
  const drawdownPct = (drawdown / capital) * 100;
  return { remaining, drawdown, drawdownPct };
}

export function formatMoney(value: number, currency: string): string {
  if (!isFinite(value)) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: value >= 1000 || Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatLot(value: number): string {
  if (!isFinite(value) || value <= 0) return "—";
  if (value >= 10) return value.toFixed(1);
  if (value >= 1) return value.toFixed(2);
  if (value >= 0.01) return value.toFixed(2);
  return value.toFixed(4);
}

export function formatPips(value: number): string {
  if (!isFinite(value)) return "—";
  return value.toFixed(value >= 100 ? 0 : 1);
}

export function formatPrice(value: number, precision: number): string {
  if (!isFinite(value)) return "—";
  return value.toFixed(precision);
}

export function formatRR(value: number | null): string {
  if (value === null || !isFinite(value)) return "—";
  return `1:${value.toFixed(2)}`;
}

export function categoryLabel(category: InstrumentCategory): string {
  switch (category) {
    case "forex":
    case "forex-jpy":
      return "Forex";
    case "metals":
      return "Métaux";
    case "indices":
      return "Indices";
    case "crypto":
      return "Crypto";
    case "energy":
      return "Énergies";
  }
}
