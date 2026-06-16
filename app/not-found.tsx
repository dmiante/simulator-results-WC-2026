"use client"

import Link from "next/link"

import { useTranslations } from "@/components/language-provider"

export default function NotFound() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4">
      <h1 className="text-4xl sm:text-6xl font-bold text-muted-foreground">404</h1>
      <h2 className="text-xl font-semibold">{t.notFound.title}</h2>
      <p className="text-muted-foreground text-center max-w-md">
        {t.notFound.description}
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
      >
        {t.notFound.back}
      </Link>
    </div>
  )
}
