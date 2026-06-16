"use client"

import { useTranslations } from "@/components/language-provider"
import { TeamFlag } from "@/components/team-flag"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Match, PredictionMode, Team } from "@/lib/types"
import { cn } from "@/lib/utils"

export function MatchCard({
  match,
  team1,
  team2,
  onScoreChange,
  onPenaltyWinner,
  isFinal = false,
  isThirdPlace = false,
  placeholder1,
  placeholder2,
  resolvedTeam1,
  resolvedTeam2,
  predictionMode = "match",
  onWinnerSelect,
  className,
}: {
  match: Match
  team1: Team | undefined
  team2: Team | undefined
  onScoreChange: (matchId: string, team: "team1" | "team2", score: number | null) => void
  onPenaltyWinner?: (matchId: string, winnerId: string) => void
  onWinnerSelect?: (matchId: string, winnerId: string) => void
  isFinal?: boolean
  isThirdPlace?: boolean
  placeholder1?: string
  placeholder2?: string
  resolvedTeam1?: Team | null
  resolvedTeam2?: Team | null
  predictionMode?: PredictionMode
  className?: string
}) {
  const t = useTranslations()
  const isTeam1TBD = !team1 || team1.name === "TBD"
  const isTeam2TBD = !team2 || team2.name === "TBD"

  // Check if we have resolved teams from group stage
  const hasResolvedTeam1 = resolvedTeam1 && isTeam1TBD
  const hasResolvedTeam2 = resolvedTeam2 && isTeam2TBD

  // Determine if inputs should be disabled - only disable if TBD AND no resolved team
  const isTeam1InputDisabled = isTeam1TBD && !hasResolvedTeam1
  const isTeam2InputDisabled = isTeam2TBD && !hasResolvedTeam2

  // Display text for teams - show resolved team if available, otherwise placeholder
  const team1Display = isTeam1TBD
    ? (hasResolvedTeam1 ? resolvedTeam1.name : (placeholder1 || t.common.tbd))
    : team1.name
  const team2Display = isTeam2TBD
    ? (hasResolvedTeam2 ? resolvedTeam2.name : (placeholder2 || t.common.tbd))
    : team2.name

  // Get team codes for penalty buttons
  const team1Code = hasResolvedTeam1 ? resolvedTeam1.code : (!isTeam1TBD ? team1.code : "")
  const team2Code = hasResolvedTeam2 ? resolvedTeam2.code : (!isTeam2TBD ? team2.code : "")
  const team1Id = hasResolvedTeam1 ? resolvedTeam1.id : match.team1Id
  const team2Id = hasResolvedTeam2 ? resolvedTeam2.id : match.team2Id
  const displayTeam1 = hasResolvedTeam1 ? resolvedTeam1 : team1
  const displayTeam2 = hasResolvedTeam2 ? resolvedTeam2 : team2

  const getWinner = () => {
    if (match.team1Score === null || match.team2Score === null) return null
    if (match.team1Score > match.team2Score) return "team1"
    if (match.team2Score > match.team1Score) return "team2"
    return "draw"
  }

  const winner = getWinner()
  const isDraw = winner === "draw"
  const needsPenalties = isDraw && match.team1Score !== null

  // Determine the penalty winner side for visual highlighting
  const penaltyWinnerSide = match.penaltyWinnerId
    ? match.penaltyWinnerId === match.team1Id ? "team1" : "team2"
    : null

  // Effective winner: the team that advances (either outright or via penalties)
  const effectiveWinner = isDraw ? penaltyWinnerSide : winner
  const positionWinner = predictionMode === "positions"
    ? match.winnerId === team1Id ? "team1" : match.winnerId === team2Id ? "team2" : null
    : null
  const selectedWinner = predictionMode === "positions" ? positionWinner : effectiveWinner
  const canPickTeam1 = predictionMode === "positions" && Boolean(team1Id)
  const canPickTeam2 = predictionMode === "positions" && Boolean(team2Id)

  return (
    <div
      className={cn(
        "rounded-lg border-2 overflow-hidden transition-all w-[270px] min-h-[95px]",
        "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600",
        isFinal && "border-amber-500/70 dark:border-amber-500/50 shadow-lg shadow-amber-500/20",
        isThirdPlace && "border-orange-500/50 dark:border-orange-500/40",
        !isFinal && !isThirdPlace && "hover:border-slate-400 dark:hover:border-slate-500",
        className,
      )}
    >
      <div className="flex flex-col h-full">
        {/* Team 1 */}
        <div
          role={predictionMode === "positions" ? "button" : undefined}
          tabIndex={canPickTeam1 ? 0 : undefined}
          onClick={() => {
            if (canPickTeam1) onWinnerSelect?.(match.id, team1Id)
          }}
          onKeyDown={(event) => {
            if ((event.key === "Enter" || event.key === " ") && canPickTeam1) {
              event.preventDefault()
              onWinnerSelect?.(match.id, team1Id)
            }
          }}
          className={cn(
            "flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-600 h-1/2",
            selectedWinner === "team1" && "bg-emerald-100 dark:bg-emerald-900/40",
            hasResolvedTeam1 && !selectedWinner && "bg-white dark:bg-slate-800",
            predictionMode === "positions" && canPickTeam1 && "cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
            predictionMode === "positions" && !canPickTeam1 && "opacity-60",
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {displayTeam1 && (!isTeam1TBD || hasResolvedTeam1) && (
              <TeamFlag code={displayTeam1.code} name={displayTeam1.name} />
            )}
            <span
              className={cn(
                "min-w-0 truncate text-sm font-medium text-slate-700 dark:text-slate-200",
                isTeam1TBD && !hasResolvedTeam1 && "text-slate-400 dark:text-slate-500 italic",
                hasResolvedTeam1 && "font-semibold",
                selectedWinner === "team1" && "font-bold text-emerald-600 dark:text-emerald-400",
              )}
              title={hasResolvedTeam1 ? `${placeholder1}: ${resolvedTeam1.name}` : undefined}
            >
              {team1Display}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {predictionMode === "positions" && selectedWinner === "team1" && (
              <span className="hidden rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white sm:inline-flex">{t.common.winner}</span>
            )}
            {predictionMode === "match" && (
              <>
            {needsPenalties && onPenaltyWinner && (
              <Button
                size="sm"
                variant={match.penaltyWinnerId === match.team1Id ? "default" : "outline"}
                className={cn(
                  "h-9 min-w-10 px-2 text-xs cursor-pointer xl:h-7 xl:min-w-0 xl:px-1.5",
                  !match.penaltyWinnerId && "animate-pulse border-amber-400 text-amber-600 dark:border-amber-500 dark:text-amber-400",
                )}
                onClick={() => onPenaltyWinner(match.id, match.team1Id)}
              >
                {team1Code}
              </Button>
            )}
            <Input
              type="number"
              min="0"
              max="20"
              value={match.team1Score ?? ""}
              onChange={(e) => {
                const val = e.target.value === "" ? null : Number.parseInt(e.target.value)
                onScoreChange(match.id, "team1", val)
              }}
              className={cn(
                "h-9 w-12 text-center text-sm p-0 font-bold bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-800 dark:text-slate-100 xl:h-7",
                effectiveWinner === "team1" && "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-400 dark:border-emerald-500",
              )}
              placeholder="-"
              disabled={isTeam1InputDisabled}
            />
              </>
            )}
          </div>
        </div>

        {/* Team 2 */}
        <div
          role={predictionMode === "positions" ? "button" : undefined}
          tabIndex={canPickTeam2 ? 0 : undefined}
          onClick={() => {
            if (canPickTeam2) onWinnerSelect?.(match.id, team2Id)
          }}
          onKeyDown={(event) => {
            if ((event.key === "Enter" || event.key === " ") && canPickTeam2) {
              event.preventDefault()
              onWinnerSelect?.(match.id, team2Id)
            }
          }}
          className={cn(
            "flex items-center justify-between px-3 py-2 h-1/2",
            selectedWinner === "team2" && "bg-emerald-100 dark:bg-emerald-900/40",
            hasResolvedTeam2 && !selectedWinner && "bg-white dark:bg-slate-800",
            predictionMode === "positions" && canPickTeam2 && "cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
            predictionMode === "positions" && !canPickTeam2 && "opacity-60",
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {displayTeam2 && (!isTeam2TBD || hasResolvedTeam2) && (
              <TeamFlag code={displayTeam2.code} name={displayTeam2.name} />
            )}
            <span
              className={cn(
                "min-w-0 truncate text-sm font-medium text-slate-700 dark:text-slate-200",
                isTeam2TBD && !hasResolvedTeam2 && "text-slate-400 dark:text-slate-500 italic",
                hasResolvedTeam2 && "font-semibold",
                selectedWinner === "team2" && "font-bold text-emerald-600 dark:text-emerald-400",
              )}
              title={hasResolvedTeam2 ? `${placeholder2}: ${resolvedTeam2.name}` : undefined}
            >
              {team2Display}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {predictionMode === "positions" && selectedWinner === "team2" && (
              <span className="hidden rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white sm:inline-flex">{t.common.winner}</span>
            )}
            {predictionMode === "match" && (
              <>
            {needsPenalties && onPenaltyWinner && (
              <Button
                size="sm"
                variant={match.penaltyWinnerId === match.team2Id ? "default" : "outline"}
                className={cn(
                  "h-9 min-w-10 px-2 text-xs cursor-pointer xl:h-7 xl:min-w-0 xl:px-1.5",
                  !match.penaltyWinnerId && "animate-pulse border-amber-400 text-amber-600 dark:border-amber-500 dark:text-amber-400",
                )}
                onClick={() => onPenaltyWinner(match.id, match.team2Id)}
              >
                {team2Code}
              </Button>
            )}
            <Input
              type="number"
              min="0"
              max="20"
              value={match.team2Score ?? ""}
              onChange={(e) => {
                const val = e.target.value === "" ? null : Number.parseInt(e.target.value)
                onScoreChange(match.id, "team2", val)
              }}
              className={cn(
                "h-9 w-12 text-center text-sm p-0 font-bold bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-800 dark:text-slate-100 xl:h-7",
                effectiveWinner === "team2" && "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-400 dark:border-emerald-500",
              )}
              placeholder="-"
              disabled={isTeam2InputDisabled}
            />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
