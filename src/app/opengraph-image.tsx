import { ImageResponse } from "next/og";

export const alt = "Go-Live Clearance — inspect before you ship";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f0e6",
          color: "#1c1917",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ display: "flex", width: 64, height: 64, alignItems: "center", justifyContent: "center", background: "#1c1917", color: "white", fontSize: 22, fontWeight: 700 }}>
            GL
          </div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>Go-Live Clearance</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#a16207", fontSize: 22, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>
            Pre-launch URL inspection
          </div>
          <div style={{ marginTop: 18, maxWidth: 950, fontSize: 68, lineHeight: 1.05, fontWeight: 800 }}>
            Inspect before you ship.
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#57534e" }}>
            Crawlability · Metadata · Security · Launch readiness
          </div>
        </div>
      </div>
    ),
    size
  );
}
