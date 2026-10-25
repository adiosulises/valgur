import { ImageResponse } from "next/og";

export const alt = "Valgur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link-preview card shown when the site is shared (WhatsApp, iMessage, Instagram, X...).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FF0084",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 220, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>VALGUR</div>
        <div style={{ fontSize: 44, marginTop: 24, letterSpacing: 8 }}>valgur.mx</div>
      </div>
    ),
    size
  );
}
