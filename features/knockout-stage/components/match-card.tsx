import { Input } from "@/components/ui/input"
import { Match, Team } from "@/lib/types"
import { cn } from "@/lib/utils"

export function MatchCard({
  match,
  team1,
  team2,
  onScoreChange,
  isFinal = false,
  isThirdPlace = false,
  placeholder1,
  placeholder2,
}: {
  match: Match
  team1: Team
  team2: Team
  onScoreChange: (matchId: string, team: "team1" | "team2", score: number | null) => void
  isFinal?: boolean
  isThirdPlace?: boolean
  placeholder1?: string
  placeholder2?: string
}) {
  const isTeam1TBD = !team1 || team1.name === "TBD"
  const isTeam2TBD = !team2 || team2.name === "TBD"
  
  // Display text for teams
  const team1Display = isTeam1TBD ? (placeholder1 || "TBD") : team1.name
  const team2Display = isTeam2TBD ? (placeholder2 || "TBD") : team2.name

  const getWinner = () => {
    if (match.team1Score === null || match.team2Score === null) return null
    if (match.team1Score > match.team2Score) return "team1"
    if (match.team2Score > match.team1Score) return "team2"
    return null
  }

  const winner = getWinner()

  return (
    <div
      className={cn(
        "rounded-lg border-2 overflow-hidden transition-all",
        "bg-white border-slate-300",
        isFinal && "border-amber-500/70 shadow-lg shadow-amber-500/20",
        isThirdPlace && "border-orange-500/50",
        !isFinal && !isThirdPlace && "hover:border-slate-400",
      )}
      style={{ width: "200px", height: "80px" }}
    >
      <div className="flex flex-col h-full">
        {/* Team 1 */}
        <div
          className={cn(
            "flex items-center justify-between px-3 py-2 border-b border-slate-200 h-1/2",
            winner === "team1" && "bg-emerald-100",
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {!isTeam1TBD && <span className="text-base shrink-0">{team1.flag}</span>}
            <span
              className={cn(
                "text-sm font-medium text-slate-700",
                isTeam1TBD && "text-slate-400 italic",
                winner === "team1" && "font-bold text-emerald-600",
              )}
            >
              {team1Display}
            </span>
          </div>
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
              "w-12 h-7 text-center text-sm p-0 font-bold bg-slate-100 border-slate-300 text-slate-800",
              winner === "team1" && "bg-emerald-100 border-emerald-400",
            )}
            placeholder="-"
            disabled={isTeam1TBD}
          />
        </div>

        {/* Team 2 */}
        <div
          className={cn("flex items-center justify-between px-3 py-2 h-1/2", winner === "team2" && "bg-emerald-100")}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {!isTeam2TBD && <span className="text-base shrink-0">{team2.flag}</span>}
            <span
              className={cn(
                "text-sm font-medium text-slate-700",
                isTeam2TBD && "text-slate-400 italic",
                winner === "team2" && "font-bold text-emerald-600",
              )}
            >
              {team2Display}
            </span>
          </div>
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
              "w-12 h-7 text-center text-sm p-0 font-bold bg-slate-100 border-slate-300 text-slate-800",
              winner === "team2" && "bg-emerald-100 border-emerald-400",
            )}
            placeholder="-"
            disabled={isTeam2TBD}
          />
        </div>
      </div>
    </div>
  )
}