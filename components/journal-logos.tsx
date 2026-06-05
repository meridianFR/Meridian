/* Marques monochromes (design system Meridian : noir / blanc / gris).
   Représentations sobres — pas de logos couleur, cohérent avec la charte. */

/* ---------------------------------------------------------------- plateformes */

export function MetaTraderLogo({ variant }: { variant: "4" | "5" }) {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 32 32" className="w-9 h-9 shrink-0 text-white" fill="none" aria-hidden="true">
        <rect x="3" y="19" width="6" height="10" rx="1.5" fill="currentColor" opacity="0.45" />
        <rect x="13" y="11" width="6" height="18" rx="1.5" fill="currentColor" opacity="0.7" />
        <rect x="23" y="4" width="6" height="25" rx="1.5" fill="currentColor" />
      </svg>
      <div className="leading-tight">
        <div className="text-[15px] font-semibold text-white">MetaTrader {variant}</div>
        <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">MT{variant}</div>
      </div>
    </div>
  );
}

export function CsvMark() {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 32 32" className="w-9 h-9 shrink-0 text-white" fill="none" aria-hidden="true">
        <path
          d="M9 3.5h9l6 6V27a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 8 27V5a1.5 1.5 0 0 1 1-1.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.55"
        />
        <path d="M18 3.5v6h6" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
        <rect x="11" y="17" width="2.6" height="7" rx="0.6" fill="currentColor" opacity="0.45" />
        <rect x="14.7" y="14" width="2.6" height="10" rx="0.6" fill="currentColor" opacity="0.7" />
        <rect x="18.4" y="19" width="2.6" height="5" rx="0.6" fill="currentColor" />
      </svg>
      <div className="leading-tight">
        <div className="text-[15px] font-semibold text-white">CSV générique</div>
        <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">.CSV</div>
      </div>
    </div>
  );
}

export function ApiMark() {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 32 32" className="w-9 h-9 shrink-0 text-white" fill="none" aria-hidden="true">
        <circle cx="9" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <circle cx="23" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M12 16h8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2.4" opacity="0.6" />
      </svg>
      <div className="leading-tight">
        <div className="text-[15px] font-semibold text-white">API directe</div>
        <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Broker</div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- moyens de paiement */

export function VisaMark() {
  return (
    <span className="text-[17px] font-bold italic tracking-tight text-ink-mute" aria-label="Visa">
      VISA
    </span>
  );
}

export function MastercardMark() {
  return (
    <span className="inline-flex items-center gap-1.5 text-ink-mute" aria-label="Mastercard">
      <svg viewBox="0 0 36 24" className="h-5 w-auto" aria-hidden="true">
        <circle cx="15" cy="12" r="8" fill="currentColor" opacity="0.45" />
        <circle cx="23" cy="12" r="8" fill="currentColor" opacity="0.8" />
      </svg>
      <span className="text-[13px] font-medium hidden sm:inline">Mastercard</span>
    </span>
  );
}

export function AmexMark() {
  return (
    <span
      className="inline-flex items-center justify-center rounded-[3px] border border-border-2 px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-ink-mute"
      aria-label="American Express"
    >
      AMEX
    </span>
  );
}

export function ApplePayMark() {
  return (
    <span className="inline-flex items-center gap-1 text-ink-mute" aria-label="Apple Pay">
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
        <path d="M17.05 12.04c-.03-2.6 2.12-3.84 2.22-3.9-1.21-1.78-3.1-2.02-3.78-2.05-1.6-.16-3.13.94-3.94.94-.82 0-2.07-.92-3.4-.9-1.75.03-3.36 1.02-4.26 2.58-1.82 3.16-.47 7.83 1.3 10.39.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2 .84 3.39.81 1.4-.02 2.29-1.27 3.15-2.53.99-1.46 1.4-2.87 1.42-2.95-.03-.01-2.72-1.05-2.75-4.15zM14.69 4.41c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2.01-1.08 3.18 1.15.09 2.32-.58 3.03-1.45z" />
      </svg>
      <span className="text-[13px] font-medium">Pay</span>
    </span>
  );
}

export function StripeMark() {
  return (
    <span className="text-[15px] font-bold tracking-tight text-ink-mute" aria-label="Stripe">
      stripe
    </span>
  );
}

export function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-3.5 h-3.5 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
