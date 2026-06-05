import type { ChartConfig } from "@/lib/strategies";

// Couleurs adaptées palette Meridian (Kairos)
// On garde green/red fonctionnels, info devient blanc, premium devient amber subtle
const COLORS = {
  bull: "#22c55e",
  bear: "#ef4444",
  info: "#e5e7eb",
  premium: "#c9a96e",
  text: "#f5f5f5",
  textMuted: "#8a8a8a",
  textFaint: "#6e6e6e",
  grid: "#1a1a1a",
  bg: "#0a0a0a",
};

const ZONE_COLORS = {
  bull: COLORS.bull,
  bear: COLORS.bear,
  info: COLORS.info,
  neutral: "#c9a96e",
};

const LINE_COLORS = {
  bull: COLORS.bull,
  bear: COLORS.bear,
  info: COLORS.info,
  premium: COLORS.premium,
};

const MARKER_COLORS = {
  entry: COLORS.info,
  sl: COLORS.bear,
  tp: COLORS.bull,
};

type Props = {
  config: ChartConfig;
  id: string | number;
  className?: string;
};

export function CandleChart({ config, id, className }: Props) {
  const W = 480;
  const H = 320;
  const P = { l: 40, r: 60, t: 24, b: 32 };
  const cw = W - P.l - P.r;
  const ch = H - P.t - P.b;

  const candles = config.candles;
  const n = candles.length;
  const cwidth = (cw / n) * 0.42;
  const cgap = cw / n;

  const allPrices = candles.flatMap((c) => [c.h, c.l]);
  const extras = config.levels ? config.levels.map((l) => l.y) : [];
  const markerYs = config.markers ? config.markers.map((m) => m.y) : [];
  const zoneEdges = config.zones ? config.zones.flatMap((z) => [z.y1, z.y2]) : [];
  // Marge verticale proportionnelle (~28% de l'amplitude) : les bougies, niveaux et
  // marqueurs ne collent plus au cadre → rendu nettement dézoomé, aéré et respirant.
  const lo = Math.min(...allPrices, ...extras, ...zoneEdges, ...markerYs);
  const hi = Math.max(...allPrices, ...extras, ...zoneEdges, ...markerYs);
  const pad = (hi - lo) * 0.28 || 2;
  const min = lo - pad;
  const max = hi + pad;

  const y = (price: number) => P.t + ch - ((price - min) / (max - min)) * ch;
  const x = (i: number) => P.l + cgap * i + cgap / 2;

  const gridId = `grid-${id}`;

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <pattern id={gridId} width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke={COLORS.grid}
            strokeWidth="0.5"
            strokeDasharray="2 4"
            opacity="0.6"
          />
        </pattern>
        <linearGradient id={`zone-bull-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.bull} stopOpacity="0.18" />
          <stop offset="100%" stopColor={COLORS.bull} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id={`zone-bear-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.bear} stopOpacity="0.04" />
          <stop offset="100%" stopColor={COLORS.bear} stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id={`zone-neutral-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ZONE_COLORS.neutral} stopOpacity="0.12" />
          <stop offset="100%" stopColor={ZONE_COLORS.neutral} stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id={`zone-info-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.info} stopOpacity="0.14" />
          <stop offset="100%" stopColor={COLORS.info} stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* Grid background */}
      <rect x={P.l} y={P.t} width={cw} height={ch} fill={`url(#${gridId})`} />

      {/* Zones */}
      {config.zones?.map((z, i) => {
        const y1 = y(Math.max(z.y1, z.y2));
        const y2 = y(Math.min(z.y1, z.y2));
        const grad =
          z.color === "bull"
            ? "bull"
            : z.color === "bear"
            ? "bear"
            : z.color === "info"
            ? "info"
            : "neutral";
        const labelColor =
          z.color === "bull"
            ? COLORS.bull
            : z.color === "bear"
            ? COLORS.bear
            : z.color === "info"
            ? COLORS.info
            : COLORS.premium;
        return (
          <g key={`zone-${i}`}>
            <rect
              x={P.l}
              y={y1}
              width={cw}
              height={y2 - y1}
              fill={`url(#zone-${grad}-${id})`}
            />
            {z.label && (
              <text
                x={P.l + 8}
                y={y1 + 14}
                fontSize="9.5"
                fontFamily="var(--font-jetbrains-mono), monospace"
                fill={labelColor}
                letterSpacing="1.2"
                fontWeight="700"
              >
                {z.label.toUpperCase()}
              </text>
            )}
          </g>
        );
      })}

      {/* Lines */}
      {config.lines?.map((l, i) => (
        <line
          key={`line-${i}`}
          x1={x(l.x1)}
          y1={y(l.y1)}
          x2={x(l.x2)}
          y2={y(l.y2)}
          stroke={LINE_COLORS[l.color]}
          strokeWidth="1.5"
          strokeDasharray={l.style === "dashed" ? "4 4" : "0"}
          opacity="0.9"
        />
      ))}

      {/* Horizontal levels */}
      {config.levels?.map((lvl, i) => {
        const yy = y(lvl.y);
        const c = LINE_COLORS[lvl.color];
        return (
          <g key={`lvl-${i}`}>
            <line
              x1={P.l}
              y1={yy}
              x2={P.l + cw}
              y2={yy}
              stroke={c}
              strokeWidth="1.2"
              strokeDasharray="5 4"
              opacity="0.85"
            />
            {lvl.label && (
              <>
                <rect
                  x={P.l + cw + 4}
                  y={yy - 8}
                  width="52"
                  height="16"
                  fill={c}
                  opacity="0.18"
                  rx="3"
                />
                <text
                  x={P.l + cw + 30}
                  y={yy + 4}
                  fontSize="9.5"
                  fontFamily="var(--font-jetbrains-mono), monospace"
                  fill={c}
                  textAnchor="middle"
                  fontWeight="700"
                  letterSpacing="0.8"
                >
                  {lvl.label}
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* Candles */}
      {candles.map((c, i) => {
        const cx = x(i);
        const yo = y(c.o);
        const yc = y(c.c);
        const yh = y(c.h);
        const yl = y(c.l);
        const bull = c.c >= c.o;
        const color = bull ? COLORS.bull : COLORS.bear;
        const bodyTop = Math.min(yo, yc);
        const bodyH = Math.max(Math.abs(yc - yo), 1.5);
        const highlight = c.highlight;

        return (
          <g key={`candle-${i}`}>
            {highlight && (
              <rect
                x={cx - cwidth / 2 - 4}
                y={yh - 4}
                width={cwidth + 8}
                height={yl - yh + 8}
                fill={color}
                opacity="0.1"
                rx="3"
              />
            )}
            <line
              x1={cx}
              y1={yh}
              x2={cx}
              y2={yl}
              stroke={color}
              strokeWidth="1.2"
              opacity={highlight ? 1 : 0.85}
            />
            <rect
              x={cx - cwidth / 2}
              y={bodyTop}
              width={cwidth}
              height={bodyH}
              fill={color}
              rx="0.8"
              opacity={highlight ? 1 : 0.9}
              stroke={color}
              strokeWidth="0.5"
            />
          </g>
        );
      })}

      {/* Markers */}
      {config.markers?.map((m, i) => {
        const mx = x(m.x);
        const my = y(m.y);
        const color = MARKER_COLORS[m.type];
        const text = m.label || m.type.toUpperCase();
        const tw = text.length * 6 + 14;
        const dir = m.dir || "right";
        let bx: number;
        let by: number;
        if (dir === "right") {
          bx = mx + 10;
          by = my - 9;
        } else if (dir === "left") {
          bx = mx - tw - 10;
          by = my - 9;
        } else if (dir === "top") {
          bx = mx - tw / 2;
          by = my - 28;
        } else {
          bx = mx - tw / 2;
          by = my + 14;
        }

        return (
          <g key={`marker-${i}`}>
            <circle
              cx={mx}
              cy={my}
              r="3.5"
              fill={color}
              stroke={COLORS.bg}
              strokeWidth="1.5"
            />
            <rect x={bx} y={by} width={tw} height="18" rx="3" fill={color} opacity="0.95" />
            <text
              x={bx + tw / 2}
              y={by + 12}
              fontSize="9.5"
              fontFamily="var(--font-jetbrains-mono), monospace"
              fill={COLORS.bg}
              textAnchor="middle"
              fontWeight="700"
              letterSpacing="0.5"
            >
              {text}
            </text>
          </g>
        );
      })}

      {/* Annotations */}
      {config.annotations?.map((a, i) => (
        <text
          key={`anno-${i}`}
          x={x(a.x)}
          y={y(a.y)}
          fontSize="10"
          fontFamily="var(--font-jetbrains-mono), monospace"
          fill={COLORS.premium}
          textAnchor="middle"
          fontWeight="700"
          letterSpacing="0.5"
        >
          {a.label}
        </text>
      ))}

      {/* Axes */}
      <line
        x1={P.l}
        y1={P.t + ch}
        x2={P.l + cw}
        y2={P.t + ch}
        stroke={COLORS.grid}
        strokeWidth="1"
      />
      <line x1={P.l} y1={P.t} x2={P.l} y2={P.t + ch} stroke={COLORS.grid} strokeWidth="1" />

      {/* Y axis labels */}
      {[0, 1, 2, 3, 4].map((i) => {
        const py = P.t + (ch / 4) * i;
        const pv = (max - ((max - min) * i) / 4).toFixed(0);
        return (
          <text
            key={`yaxis-${i}`}
            x={P.l - 8}
            y={py + 3}
            fontSize="9"
            fontFamily="var(--font-jetbrains-mono), monospace"
            fill={COLORS.textFaint}
            textAnchor="end"
          >
            {pv}
          </text>
        );
      })}
    </svg>
  );
}
