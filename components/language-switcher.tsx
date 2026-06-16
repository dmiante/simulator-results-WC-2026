"use client"

import { Check, Languages } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"
import { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, messages: t, setLocale } = useLanguage()

  const options: Array<{ locale: Locale; label: string }> = [
    { locale: "en", label: t.language.english },
    { locale: "es", label: t.language.spanish },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-9 cursor-pointer gap-2 px-2.5", className)}
          aria-label={t.language.selectLanguage}
        >
          <Languages className="h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.locale}
            onClick={() => setLocale(option.locale)}
            className="cursor-pointer gap-2"
          >
            <Check className={cn("h-4 w-4", locale === option.locale ? "opacity-100" : "opacity-0")} />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
