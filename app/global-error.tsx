"use client"

import { useSyncExternalStore } from "react"

import { defaultLocale, getLocaleFromAcceptLanguage, messages } from "@/lib/i18n"

const subscribe = () => () => {}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale = useSyncExternalStore(
    subscribe,
    () => getLocaleFromAcceptLanguage(navigator.languages?.join(",") || navigator.language),
    () => defaultLocale,
  )
  const t = messages[locale]

  return (
    <html lang={locale} suppressHydrationWarning>
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: "1rem",
            padding: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            {t.error.title}
          </h2>
          <p style={{ color: "#666" }}>{t.error.criticalDescription}</p>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "1px solid #ccc",
              cursor: "pointer",
              background: "transparent",
            }}
          >
            {t.error.tryAgain}
          </button>
        </div>
      </body>
    </html>
  )
}
