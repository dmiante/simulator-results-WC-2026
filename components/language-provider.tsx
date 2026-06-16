"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

import { Locale, LOCALE_COOKIE_NAME, Messages, messages } from "@/lib/i18n"

interface LanguageContextValue {
  locale: Locale
  messages: Messages
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<LanguageContextValue>(() => {
    return {
      locale,
      messages: messages[locale],
      setLocale: (nextLocale) => {
        document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; samesite=lax`
        document.documentElement.lang = nextLocale
        setLocaleState(nextLocale)
      },
    }
  }, [locale])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }

  return context
}

export function useTranslations() {
  return useLanguage().messages
}
