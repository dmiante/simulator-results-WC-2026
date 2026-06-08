"use client"

import { useMemo, useSyncExternalStore } from "react"

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

  const display = useMemo(() => {
    if (!isHydrated) return null

    const date = new Date(dateTime)
    if (isNaN(date.getTime())) return // Guard against invalid date values

    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  }, [dateTime, isHydrated])

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
