import { TeamFlag } from "@/components/team-flag"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Match, Team } from "@/lib/types"
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
}: {
  match: Match
  team1: Team
  team2: Team
  onScoreChange: (matchId: string, team: "team1" | "team2", score: number | null) => void
  onPenaltyWinner?: (matchId: string, winnerId: string) => void
  isFinal?: boolean
  isThirdPlace?: boolean
  placeholder1?: string
  placeholder2?: string
  resolvedTeam1?: Team | null
  resolvedTeam2?: Team | null
}) {
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
    ? (hasResolvedTeam1 ? resolvedTeam1.name : (placeholder1 || "TBD"))
    : team1.name
  const team2Display = isTeam2TBD
    ? (hasResolvedTeam2 ? resolvedTeam2.name : (placeholder2 || "TBD"))
    : team2.name

  // Get team codes for penalty buttons
  const team1Code = hasResolvedTeam1 ? resolvedTeam1.code : (!isTeam1TBD ? team1.code : "")
  const team2Code = hasResolvedTeam2 ? resolvedTeam2.code : (!isTeam2TBD ? team2.code : "")

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

  return (
    <div
      className={cn(
        "rounded-lg border-2 overflow-hidden transition-all",
        "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600",
        isFinal && "border-amber-500/70 dark:border-amber-500/50 shadow-lg shadow-amber-500/20",
        isThirdPlace && "border-orange-500/50 dark:border-orange-500/40",
        !isFinal && !isThirdPlace && "hover:border-slate-400 dark:hover:border-slate-500",
      )}
      style={{ width: "220px", height: "87px" }}
    >
      <div className="flex flex-col h-full">
        {/* Team 1 */}
        <div
          className={cn(
            "flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-600 h-1/2",
            effectiveWinner === "team1" && "bg-emerald-100 dark:bg-emerald-900/40",
            hasResolvedTeam1 && !effectiveWinner && "bg-white dark:bg-slate-800",
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {(!isTeam1TBD || hasResolvedTeam1) && (
              <TeamFlag code={hasResolvedTeam1 ? resolvedTeam1.code : team1.code} name={hasResolvedTeam1 ? resolvedTeam1.name : team1.name} />
            )}
            <span
              className={cn(
                "text-sm font-medium text-slate-700 dark:text-slate-200",
                isTeam1TBD && !hasResolvedTeam1 && "text-slate-400 dark:text-slate-500 italic",
                hasResolvedTeam1 && "font-semibold",
                effectiveWinner === "team1" && "font-bold text-emerald-600 dark:text-emerald-400",
              )}
              title={hasResolvedTeam1 ? `${placeholder1}: ${resolvedTeam1.name}` : undefined}
            >
              {team1Display}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {needsPenalties && onPenaltyWinner && (
              <Button
                size="sm"
                variant={match.penaltyWinnerId === match.team1Id ? "default" : "outline"}
                className={cn(
                  "h-7 text-xs px-1.5 cursor-pointer",
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
                "w-12 h-7 text-center text-sm p-0 font-bold bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-800 dark:text-slate-100",
                effectiveWinner === "team1" && "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-400 dark:border-emerald-500",
              )}
              placeholder="-"
              disabled={isTeam1InputDisabled}
            />
          </div>
        </div>

        {/* Team 2 */}
        <div
          className={cn(
            "flex items-center justify-between px-3 py-2 h-1/2",
            effectiveWinner === "team2" && "bg-emerald-100 dark:bg-emerald-900/40",
            hasResolvedTeam2 && !effectiveWinner && "bg-white dark:bg-slate-800",
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {(!isTeam2TBD || hasResolvedTeam2) && (
              <TeamFlag code={hasResolvedTeam2 ? resolvedTeam2.code : team2.code} name={hasResolvedTeam2 ? resolvedTeam2.name : team2.name} />
            )}
            <span
              className={cn(
                "text-sm font-medium text-slate-700 dark:text-slate-200",
                isTeam2TBD && !hasResolvedTeam2 && "text-slate-400 dark:text-slate-500 italic",
                hasResolvedTeam2 && "font-semibold",
                effectiveWinner === "team2" && "font-bold text-emerald-600 dark:text-emerald-400",
              )}
              title={hasResolvedTeam2 ? `${placeholder2}: ${resolvedTeam2.name}` : undefined}
            >
              {team2Display}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {needsPenalties && onPenaltyWinner && (
              <Button
                size="sm"
                variant={match.penaltyWinnerId === match.team2Id ? "default" : "outline"}
                className={cn(
                  "h-7 text-xs px-1.5 cursor-pointer",
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
                "w-12 h-7 text-center text-sm p-0 font-bold bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-800 dark:text-slate-100",
                effectiveWinner === "team2" && "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-400 dark:border-emerald-500",
              )}
              placeholder="-"
              disabled={isTeam2InputDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
