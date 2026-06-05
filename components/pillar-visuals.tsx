export function StrategyVisual() {
  return (
    <svg viewBox="0 0 120 60" className="w-full h-12" aria-hidden="true">
      <defs>
        <linearGradient id="pv-strategy" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      {[8, 18, 28, 38, 48].map((y) => (
        <line key={y} x1="0" x2="120" y1={y} y2={y} stroke="#ffffff" strokeOpacity="0.05" />
      ))}
      <path
        d="M 0 45 L 20 38 L 40 42 L 60 28 L 80 32 L 100 18 L 120 22"
        fill="none"
        stroke="url(#pv-strategy)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="120" cy="22" r="2.5" fill="#ffffff" />
    </svg>
  );
}

export function ToolsVisual() {
  return (
    <svg viewBox="0 0 120 60" className="w-full h-12" aria-hidden="true">
      {[
        { x: 8, y: 14, w: 104, h: 8, op: 0.35 },
        { x: 8, y: 26, w: 78, h: 8, op: 0.55 },
        { x: 8, y: 38, w: 92, h: 8, op: 0.75 },
      ].map((r, i) => (
        <rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          rx="2"
          fill="#ffffff"
          fillOpacity={r.op}
        />
      ))}
      <rect x="100" y="38" width="12" height="8" rx="2" fill="#ffffff" />
    </svg>
  );
}

export function FormationVisual() {
  return (
    <svg viewBox="0 0 120 60" className="w-full h-12" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle
            cx={20 + i * 35}
            cy="30"
            r="10"
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.25 + i * 0.25}
            strokeWidth="1"
          />
          <circle
            cx={20 + i * 35}
            cy="30"
            r="3"
            fill="#ffffff"
            fillOpacity={0.4 + i * 0.2}
          />
        </g>
      ))}
      <line x1="30" x2="45" y1="30" y2="30" stroke="#ffffff" strokeOpacity="0.25" />
      <line x1="65" x2="80" y1="30" y2="30" stroke="#ffffff" strokeOpacity="0.5" />
    </svg>
  );
}
