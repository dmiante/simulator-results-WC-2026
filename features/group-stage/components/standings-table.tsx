"use client"

import { cn } from "@/lib/utils"
import { StandingsTableProps } from "../types"
import { TeamFlag } from "@/components/team-flag"


export function StandingsTable({ standings, teamsMap, qualifiedTeams }: StandingsTableProps) {
  const getQualificationStatus = (teamId: string, position: number) => {
    if (qualifiedTeams.first.includes(teamId)) return "first"
    if (qualifiedTeams.second.includes(teamId)) return "second"
    if (qualifiedTeams.thirdBest.includes(teamId)) return "third"
    if (position === 0) return "potential-first"
    if (position === 1) return "potential-second"
    if (position === 2) return "potential-third"
    return null
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground border-b border-border">
            <th className="text-center py-2 font-medium">#</th>
            <th className="text-left py-2 font-medium">Team</th>
            <th className="text-center py-2 font-medium">P</th>
            <th className="text-center py-2 font-medium">W</th>
            <th className="text-center py-2 font-medium">D</th>
            <th className="text-center py-2 font-medium">L</th>
            <th className="text-center py-2 font-medium">GD</th>
            <th className="text-center py-2 font-medium">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, idx) => {
            const team = teamsMap[standing.teamId]
            const status = getQualificationStatus(standing.teamId, idx)

            return (
              <tr
                key={standing.teamId}
                className={cn(
                  "border-b border-border last:border-0",
                  status === "first" && "bg-blue-500/10",
                  status === "second" && "bg-blue-500/10",
                  status === "third" && "bg-amber-500/10",
                )}
              >
                <td className="py-3 flex justify-center items-center">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium",
                      status === "first" && "bg-blue-500 text-white",
                      status === "second" && "bg-blue-500 text-white",
                      status === "third" && "bg-amber-500 text-white",
                      !status && "bg-muted text-muted-foreground",
                    )}
                  >
                    {idx + 1}
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <TeamFlag code={team?.code || "xx"} name={team?.name || "Unknown"} />
                    <span className="font-medium text-foreground truncate max-w-[100px]">{team?.name}</span>
                  </div>
                </td>
                <td className="text-center py-2 text-muted-foreground">{standing.played}</td>
                <td className="text-center py-2 text-muted-foreground">{standing.won}</td>
                <td className="text-center py-2 text-muted-foreground">{standing.drawn}</td>
                <td className="text-center py-2 text-muted-foreground">{standing.lost}</td>
                <td className="text-center py-2 text-muted-foreground">
                  {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                </td>
                <td className="text-center py-2 font-bold text-foreground">{standing.points}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
