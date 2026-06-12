import { Badge } from "@/components/ui/badge"
import { DarkModeButton } from "../dark-mode-button"

export function TournamentHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="FIFA World Cup 2026"
              className="h-20 w-20 shrink-0 object-contain md:h-24 md:w-24"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground text-balance">FIFA World Cup 2026</h1>
              <p className="text-muted-foreground text-sm mt-1">United States • Mexico • Canada</p>
            </div>
          </div>
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
            <DarkModeButton />
          </div>
        </div>
      </div>
    </header>
  )
}
