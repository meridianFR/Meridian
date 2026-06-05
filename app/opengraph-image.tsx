import { ImageResponse } from "next/og";

export const alt = "Meridian — Trade ce que tu mesures.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Carte sociale (OG + Twitter) générée à la compilation. Direction noir premium Meridian.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% -8%, rgba(255,255,255,0.16), transparent 60%)",
          padding: "76px 80px",
          color: "#ffffff",
        }}
      >
        {/* eyebrow */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              backgroundColor: "#ffffff",
              marginRight: 18,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 10,
              color: "#8a8a8a",
              textTransform: "uppercase",
            }}
          >
            Outils &amp; Stratégies
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 106,
              fontWeight: 800,
              letterSpacing: -5,
              lineHeight: 1.0,
            }}
          >
            Trade ce que
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 106,
              fontWeight: 800,
              letterSpacing: -5,
              lineHeight: 1.0,
              color: "#9a9a9a",
            }}
          >
            tu mesures.
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", fontSize: 40, fontWeight: 700 }}>
            Meridian
            <span style={{ color: "#8a8a8a", marginLeft: 4 }}>°</span>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#8a8a8a" }}>meridian.app</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
