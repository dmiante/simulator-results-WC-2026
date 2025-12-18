"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Match, Team } from "@/lib/tournament-data"

interface MatchInputProps {
  match: Match
  team1: Team | undefined
  team2: Team | undefined
  onScoreChange: (matchId: string, team: "team1" | "team2", score: number | null) => void
  compact?: boolean
}

export function MatchInput({ match, team1, team2, onScoreChange, compact = false }: MatchInputProps) {
  const handleChange = (team: "team1" | "team2", value: string) => {
    const score = value === "" ? null : Math.max(0, Math.min(99, Number.parseInt(value) || 0))
    onScoreChange(match.id, team, score)
  }

  const getWinner = () => {
    if (match.team1Score === null || match.team2Score === null) return null
    if (match.team1Score > match.team2Score) return "team1"
    if (match.team2Score > match.team1Score) return "team2"
    return "draw"
  }

  const winner = getWinner()

  if (!team1 || !team2) {
    return (
      <div className="flex items-center justify-center gap-3 p-2 bg-muted/30 rounded-lg">
        <span className="text-sm text-muted-foreground">TBD</span>
        <span className="text-muted-foreground">vs</span>
        <span className="text-sm text-muted-foreground">TBD</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors",
        compact && "p-1.5",
      )}
    >
      {/* Team 1 */}
      <div className={cn("flex items-center gap-1.5 flex-1 min-w-0", winner === "team1" && "font-semibold")}>
        <span className={cn("text-base", compact && "text-sm")}>{team1.flag}</span>
        <span
          className={cn(
            "text-sm truncate text-foreground",
            compact && "text-xs",
            winner === "team2" && "text-muted-foreground",
          )}
        >
          {team1.code}
        </span>
      </div>

      {/* Score inputs */}
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min={0}
          max={99}
          value={match.team1Score ?? ""}
          onChange={(e) => handleChange("team1", e.target.value)}
          className={cn(
            "w-10 h-8 text-center p-0 text-sm font-medium",
            compact && "w-8 h-7 text-xs",
            winner === "team1" && "border-green-500 bg-green-500/10",
          )}
          placeholder="-"
        />
        <span className="text-muted-foreground text-xs">:</span>
        <Input
          type="number"
          min={0}
          max={99}
          value={match.team2Score ?? ""}
          onChange={(e) => handleChange("team2", e.target.value)}
          className={cn(
            "w-10 h-8 text-center p-0 text-sm font-medium",
            compact && "w-8 h-7 text-xs",
            winner === "team2" && "border-green-500 bg-green-500/10",
          )}
          placeholder="-"
        />
      </div>

      {/* Team 2 */}
      <div
        className={cn("flex items-center gap-1.5 flex-1 min-w-0 justify-end", winner === "team2" && "font-semibold")}
      >
        <span
          className={cn(
            "text-sm truncate text-foreground",
            compact && "text-xs",
            winner === "team1" && "text-muted-foreground",
          )}
        >
          {team2.code}
        </span>
        <span className={cn("text-base", compact && "text-sm")}>{team2.flag}</span>
      </div>
    </div>
  )
}
