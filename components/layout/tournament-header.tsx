import { Badge } from "@/components/ui/badge"
import { DarkModeButton } from "../dark-mode-button"

export function TournamentHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex min-w-0 items-center gap-4">
            <img
              src="/logo.png"
              alt="FIFA World Cup 2026"
              className="h-20 w-20 shrink-0 object-contain md:h-24 md:w-24"
            />
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">FIFA World Cup 2026</h1>
              <p className="text-muted-foreground text-sm mt-1">United States • Mexico • Canada</p>
            </div>
          </div>
          <div className="flex items-start justify-between gap-3 md:items-center md:justify-end">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                48 Teams
              </Badge>
              <Badge variant="secondary" className="text-xs">
                12 Groups
              </Badge>
              <Badge variant="secondary" className="text-xs">
                104 Matches
              </Badge>
              <Badge className="text-xs bg-primary text-primary-foreground">Simulator</Badge>
            </div>
            <DarkModeButton className="hidden shrink-0 lg:inline-flex" />
          </div>
        </div>
      </div>
    </header>
  )
}
