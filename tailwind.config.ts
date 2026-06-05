import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        panel: "#0a0a0a",
        "panel-2": "#111111",
        border: "#1a1a1a",
        "border-2": "#262626",
        ink: "#f5f5f5",
        "ink-mute": "#a3a3a3",
        "ink-muted": "#8a8a8a",
        "ink-faint": "#6e6e6e",
        signal: "#ffffff",
        edge: "#22c55e",
        risk: "#ef4444",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.035em",
        "ultra-wide": "0.2em",
        eyebrow: "0.4em",
      },
      maxWidth: {
        wrap: "1280px",
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 35s linear infinite",
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
