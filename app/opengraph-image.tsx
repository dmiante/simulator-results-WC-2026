import { ImageResponse } from "next/og"

import { messages } from "@/lib/i18n"
import { getServerLocale } from "@/lib/i18n-server"

export const alt = "FIFA World Cup 2026 Simulator / Simulador"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const locale = await getServerLocale()
  const t = messages[locale]

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
          {t.header.title}
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
          {t.simulator.title}
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
          <span>{locale === "es" ? "🇺🇸 Estados Unidos" : "🇺🇸 United States"}</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>{locale === "es" ? "🇲🇽 México" : "🇲🇽 Mexico"}</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>{locale === "es" ? "🇨🇦 Canadá" : "🇨🇦 Canada"}</span>
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
            <span style={{ fontSize: 14, color: "#93c5fd" }}>{t.common.teams}</span>
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
            <span style={{ fontSize: 14, color: "#93c5fd" }}>{t.common.groups}</span>
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
            <span style={{ fontSize: 14, color: "#93c5fd" }}>{t.common.matches}</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
