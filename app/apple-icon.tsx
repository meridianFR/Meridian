import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Icône Apple : fond noir plein (iOS arrondit lui-même), anneau ° blanc centré.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            border: "13px solid #ffffff",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
