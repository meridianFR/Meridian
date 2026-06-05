export function HeroChart() {
  return (
    <div className="hero-chart relative w-full h-full min-h-[420px]">
      <svg
        viewBox="0 0 600 420"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="meridian-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="meridian-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="meridian-grid-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <pattern id="hero-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
          </pattern>

          <mask id="grid-mask">
            <rect width="600" height="420" fill="url(#meridian-grid-fade)" />
          </mask>
        </defs>

        <rect width="600" height="420" fill="url(#hero-grid)" mask="url(#grid-mask)" />

        {[80, 160, 240, 320].map((y) => (
          <line
            key={y}
            x1="0"
            x2="600"
            y1={y}
            y2={y}
            stroke="#ffffff"
            strokeOpacity="0.04"
            strokeDasharray="3 6"
          />
        ))}

        <path
          d="M 0 320 L 40 300 L 90 305 L 140 270 L 200 285 L 260 240 L 320 250 L 380 200 L 440 215 L 500 165 L 560 175 L 600 140 L 600 420 L 0 420 Z"
          fill="url(#meridian-fill)"
        />

        <path
          className="hero-line"
          d="M 0 320 L 40 300 L 90 305 L 140 270 L 200 285 L 260 240 L 320 250 L 380 200 L 440 215 L 500 165 L 560 175 L 600 140"
          fill="none"
          stroke="url(#meridian-line)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {[
          { x: 140, y: 270 },
          { x: 320, y: 250 },
          { x: 500, y: 165 },
        ].map((p, i) => (
          <g key={i} className="hero-dot" style={{ animationDelay: `${1.6 + i * 0.25}s` }}>
            <circle cx={p.x} cy={p.y} r="6" fill="#ffffff" fillOpacity="0.08" />
            <circle cx={p.x} cy={p.y} r="2" fill="#ffffff" />
          </g>
        ))}

        <g className="hero-marker" style={{ animationDelay: "2.2s" }}>
          <circle cx="600" cy="140" r="10" fill="#ffffff" fillOpacity="0.12" />
          <circle cx="600" cy="140" r="3.5" fill="#ffffff" />
        </g>
      </svg>

      <div className="absolute top-4 left-4 right-4 flex items-center text-[10px] mono uppercase tracking-[0.3em] text-ink-faint">
        <span>° Meridian</span>
      </div>
    </div>
  );
}
