import { ImageResponse } from "next/og"

export const alt = "FIFA World Cup 2026 Simulator"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          fontFamily: "sans-serif",
        }}
      >
        {/* Soccer ball icon */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 20,
            display: "flex",
          }}
        >
          ⚽
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            display: "flex",
          }}
        >
          FIFA World Cup 2026
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            color: "#bfdbfe",
            marginTop: 16,
            display: "flex",
          }}
        >
          Tournament Simulator
        </div>

        {/* Host countries */}
        <div
          style={{
            fontSize: 24,
            color: "#93c5fd",
            marginTop: 24,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <span>🇺🇸 United States</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>🇲🇽 Mexico</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>🇨🇦 Canada</span>
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 40,
            padding: "16px 32px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#ffffff",
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 700 }}>48</span>
            <span style={{ fontSize: 14, color: "#93c5fd" }}>Teams</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#ffffff",
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 700 }}>12</span>
            <span style={{ fontSize: 14, color: "#93c5fd" }}>Groups</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#ffffff",
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 700 }}>104</span>
            <span style={{ fontSize: 14, color: "#93c5fd" }}>Matches</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
