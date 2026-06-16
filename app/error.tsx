"use client"

import { AlertCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/components/language-provider"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <h2 className="text-xl font-semibold">{t.error.title}</h2>
      <p className="text-muted-foreground text-center max-w-md">
        {t.error.description}
      </p>
      <Button onClick={reset} variant="outline" className="gap-2">
        <RotateCcw className="h-4 w-4" />
        {t.error.tryAgain}
      </Button>
    </div>
  )
}
