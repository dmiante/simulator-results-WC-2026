"use client"

import { Github } from "lucide-react"

import { useTranslations } from "@/components/language-provider"

export function Footer() {
  const t = useTranslations()

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-muted-foreground sm:flex-row">
        <p>{t.footer.title}</p>
        <a
          href="https://github.com/dmiante/simulator-results-WC-2026"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-medium text-foreground transition-colors hover:text-primary"
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          GitHub
        </a>
      </div>
    </footer>
  )
}
