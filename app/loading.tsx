"use client"

import { useTranslations } from "@/components/language-provider"

export default function Loading() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">{t.loading.simulator}</p>
      </div>
    </div>
  )
}
