import { Badge } from "@/components/ui/badge"
import { DarkModeButton } from "../dark-mode-button"

export function TournamentHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-3xl">⚽</div>
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
