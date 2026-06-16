"use client"

import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslations } from "@/components/language-provider"
import { DarkModeButton } from "../dark-mode-button"

export function TournamentHeader() {
  const t = useTranslations()

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex min-w-0 items-center gap-4">
            <Image
              src="/logo.png"
              alt={t.header.title}
              width={96}
              height={96}
              priority
              className="h-20 w-20 shrink-0 object-contain md:h-24 md:w-24"
            />
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">{t.header.title}</h1>
              <p className="text-muted-foreground text-sm mt-1">{t.header.hostCountries}</p>
            </div>
          </div>
          <div className="flex items-start justify-between gap-3 md:items-center md:justify-end">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {t.header.teamsStat}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {t.header.groupsStat}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {t.header.matchesStat}
              </Badge>
              <Badge className="text-xs bg-primary text-primary-foreground">{t.common.simulator}</Badge>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <LanguageSwitcher />
              <DarkModeButton className="hidden shrink-0 lg:inline-flex" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
