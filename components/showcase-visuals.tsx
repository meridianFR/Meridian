// Visuels dédiés à la section "écosystème" de la home.
// Style monochrome premium (blanc sur noir) + accents verts/rouges
// uniquement quand ils portent un sens trading (TP/SL, gains/pertes).

const MONO = { fontFamily: "var(--font-jetbrains-mono), monospace" };

export function StrategyShowcase() {
  return (
    <svg viewBox="0 0 240 140" className="w-full h-auto" aria-hidden="true">
      {[28, 56, 84, 112].map((y) => (
        <line key={y} x1="0" x2="240" y1={y} y2={y} stroke="#fff" strokeOpacity="0.04" />
      ))}

      {/* Zone de gain (entrée -> TP) et de risque (entrée -> SL) */}
      <rect x="0" y="40" width="240" height="42" fill="#22c55e" fillOpacity="0.05" />
      <rect x="0" y="82" width="240" height="30" fill="#ef4444" fillOpacity="0.05" />

      {/* Niveaux */}
      <line x1="0" x2="240" y1="40" y2="40" stroke="#22c55e" strokeOpacity="0.55" strokeDasharray="4 4" />
      <line x1="0" x2="240" y1="82" y2="82" stroke="#fff" strokeOpacity="0.4" strokeDasharray="4 4" />
      <line x1="0" x2="240" y1="112" y2="112" stroke="#ef4444" strokeOpacity="0.55" strokeDasharray="4 4" />

      {/* Trajectoire de prix : montée, pullback à l'entrée, cassure vers le TP */}
      <path
        d="M 0 104 L 28 96 L 56 100 L 86 82 L 110 92 L 134 82 L 162 64 L 190 70 L 214 50 L 228 40"
        fill="none"
        stroke="#fff"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="86" cy="82" r="2.5" fill="#fff" />
      <circle cx="228" cy="40" r="8" fill="#22c55e" fillOpacity="0.15" />
      <circle cx="228" cy="40" r="2.5" fill="#fff" />

      <text x="6" y="34" style={MONO} fontSize="7" letterSpacing="1.5" fill="#86efac">TP</text>
      <text x="6" y="78" style={MONO} fontSize="7" letterSpacing="1.5" fill="#fff" fillOpacity="0.55">ENTRÉE</text>
      <text x="6" y="124" style={MONO} fontSize="7" letterSpacing="1.5" fill="#fca5a5">SL</text>
    </svg>
  );
}

export function CalculatorShowcase() {
  // Champs de saisie lisibles : libellé à gauche, valeur dans un champ à droite.
  const rows = [
    { label: "Capital", value: "10 000 €" },
    { label: "Risque", value: "1,0 %" },
    { label: "Stop", value: "25 pts" },
  ];
  return (
    <svg viewBox="0 0 240 140" className="w-full h-auto" aria-hidden="true">
      {rows.map((r, i) => {
        const cy = 16 + i * 26;
        return (
          <g key={i}>
            <text
              x="16"
              y={cy + 3.5}
              style={MONO}
              fontSize="9.5"
              letterSpacing="0.4"
              fill="#fff"
              fillOpacity="0.55"
            >
              {r.label}
            </text>
            <rect
              x="120"
              y={cy - 9}
              width="104"
              height="19"
              rx="5"
              fill="#fff"
              fillOpacity="0.03"
              stroke="#fff"
              strokeOpacity="0.14"
            />
            <text
              x="216"
              y={cy + 3.5}
              textAnchor="end"
              style={MONO}
              fontSize="9.5"
              fill="#fff"
              fillOpacity="0.92"
            >
              {r.value}
            </text>
          </g>
        );
      })}

      <line x1="16" x2="224" y1="100" y2="100" stroke="#fff" strokeOpacity="0.08" />

      {/* Résultat calculé : taille de position */}
      <rect x="16" y="110" width="208" height="24" rx="6" fill="#22c55e" fillOpacity="0.1" />
      <rect x="16" y="110" width="3" height="24" rx="1.5" fill="#22c55e" fillOpacity="0.8" />
      <text x="28" y="125.5" style={MONO} fontSize="9" letterSpacing="0.4" fill="#86efac">
        Position
      </text>
      <text
        x="214"
        y="126.5"
        textAnchor="end"
        style={MONO}
        fontSize="13"
        fontWeight="700"
        fill="#fff"
      >
        0.42 <tspan fontSize="9" fillOpacity="0.6">lot</tspan>
      </text>
    </svg>
  );
}

export function JournalShowcase() {
  const states = [1, 1, -1, 1, 1, 1, -1, 1, -1, 1, 1, 1];
  return (
    <svg viewBox="0 0 240 140" className="w-full h-auto" aria-hidden="true">
      <defs>
        <linearGradient id="jr-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[24, 48, 72].map((y) => (
        <line key={y} x1="0" x2="240" y1={y} y2={y} stroke="#fff" strokeOpacity="0.04" />
      ))}

      {/* Courbe d'équité */}
      <path d="M 0 78 L 34 70 L 68 74 L 102 58 L 136 62 L 170 42 L 204 48 L 240 28 L 240 88 L 0 88 Z" fill="url(#jr-fill)" />
      <path
        d="M 0 78 L 34 70 L 68 74 L 102 58 L 136 62 L 170 42 L 204 48 L 240 28"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Trades récents : gagnants / perdants */}
      {states.map((s, i) => {
        const fill = s === 1 ? "#22c55e" : s === -1 ? "#ef4444" : "#fff";
        return (
          <rect
            key={i}
            x={16 + i * 17.5}
            y="108"
            width="12"
            height="18"
            rx="2.5"
            fill={fill}
            fillOpacity={s === 0 ? 0.08 : 0.32}
          />
        );
      })}
    </svg>
  );
}

export function FormationShowcase() {
  const mods = [
    { x: 40, state: "done" },
    { x: 120, state: "active" },
    { x: 200, state: "locked" },
  ];
  return (
    <svg viewBox="0 0 240 140" className="w-full h-auto" aria-hidden="true">
      {/* Piste de progression */}
      <line x1="40" x2="200" y1="46" y2="46" stroke="#fff" strokeOpacity="0.12" strokeWidth="2" />
      <line x1="40" x2="120" y1="46" y2="46" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" />

      {mods.map((m, i) => {
        const active = m.state === "active";
        const locked = m.state === "locked";
        const op = locked ? 0.2 : 0.9;
        return (
          <g key={i}>
            <circle cx={m.x} cy="46" r="13" fill="#000" stroke="#fff" strokeOpacity={op} strokeWidth={active ? 2 : 1} />
            {m.state === "done" && (
              <path d={`M ${m.x - 5} 46 l 3 4 l 6 -8`} fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            )}
            {active && <path d={`M ${m.x - 3} 41 L ${m.x + 5} 46 L ${m.x - 3} 51 Z`} fill="#fff" />}
            {locked && <circle cx={m.x} cy="46" r="2.5" fill="#fff" fillOpacity="0.3" />}

            <rect x={m.x - 22} y="74" width="44" height="6" rx="3" fill="#fff" fillOpacity={locked ? 0.12 : 0.4} />
            <rect x={m.x - 14} y="86" width="28" height="5" rx="2.5" fill="#fff" fillOpacity={locked ? 0.08 : 0.2} />
          </g>
        );
      })}

      <rect x="40" y="114" width="34" height="6" rx="3" fill="#fff" fillOpacity="0.25" />
      <rect x="150" y="114" width="50" height="6" rx="3" fill="#fff" fillOpacity="0.12" />
    </svg>
  );
}
