import type React from "react"
import type { Metadata, Viewport } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Inter, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { messages } from "@/lib/i18n"
import { getServerLocale } from "@/lib/i18n-server"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale()
  const metadata = messages[locale].metadata

  return {
    metadataBase: new URL("https://wcsimulator2026.vercel.app"),
    title: {
      default: metadata.title,
      template: metadata.titleTemplate,
    },
    description: metadata.description,
    keywords: metadata.keywords,
    referrer: "strict-origin-when-cross-origin",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: "/",
      siteName: metadata.siteName,
      locale: metadata.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.shortDescription,
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
      icon: [
        { url: "/logo.svg", type: "image/svg+xml" },
        { url: "/logo.png", type: "image/png" },
      ],
      apple: "/logo.png",
    },
  }
}

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getServerLocale()

  return (
    <html lang={locale} className={`${inter.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider initialLocale={locale}>
            {children}
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
