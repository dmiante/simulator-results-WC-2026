"use client"

import { useMemo, useSyncExternalStore } from "react"

import { useLanguage } from "@/components/language-provider"
import { formatDateTime } from "@/lib/i18n"

interface MatchDateTimeProps {
  dateTime: string // ISO 8601 format in UTC (e.g., "2026-06-12T01:00:00Z")
  className?: string
}

/**
 * Client-side component that formats a UTC datetime to the user's local timezone.
 * Uses a two-pass rendering approach to avoid hydration mismatch.
 */
const subscribe = () => () => {}

export function MatchDateTime({ dateTime, className }: MatchDateTimeProps) {
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false)
  const { locale } = useLanguage()

  const display = useMemo(() => {
    if (!isHydrated) return null

    return formatDateTime(dateTime, locale)
  }, [dateTime, isHydrated, locale])

  // SSR/initial render: show placeholder to avoid hydration mismatch
  if (!display) {
    return (
      <time dateTime={dateTime} className={className}>
        ...
      </time>
    )
  }

  return (
    <time dateTime={dateTime} className={className}>
      {display}
    </time>
  )
}
