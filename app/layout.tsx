import type React from "react"
import type { Metadata, Viewport } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Inter, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  metadataBase: new URL("https://wcsimulator2026.vercel.app"),
  title: {
    default: "FIFA World Cup 2026 Simulator",
    template: "%s | WC 2026 Simulator",
  },
  description:
    "Predict match results and simulate the FIFA World Cup 2026 tournament. Enter scores for all 48 teams across group stages and knockout rounds.",
  keywords: [
    "FIFA",
    "World Cup",
    "2026",
    "simulator",
    "football",
    "soccer",
    "predictions",
    "bracket",
    "knockout",
    "group stage",
    "world cup predictor",
  ],
  referrer: "strict-origin-when-cross-origin",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FIFA World Cup 2026 Simulator",
    description:
      "Predict match results and simulate the FIFA World Cup 2026 tournament with 48 teams across group stages and knockout rounds.",
    url: "/",
    siteName: "WC 2026 Simulator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIFA World Cup 2026 Simulator",
    description:
      "Predict match results and simulate the FIFA World Cup 2026 tournament with 48 teams.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
