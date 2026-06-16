"use client"

import { cn } from "@/lib/utils"
import { StandingsTableProps } from "../types"
import { TeamFlag } from "@/components/team-flag"
import { ConfederationBadge } from "@/components/confederation-badge"
import { useTranslations } from "@/components/language-provider"


export function StandingsTable({ standings, teamsMap, qualifiedTeams }: StandingsTableProps) {
  const t = useTranslations()

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
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="min-w-[360px] w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground border-b border-border">
              <th className="text-center py-2 font-medium">{t.standings.rank}</th>
              <th className="text-left py-2 font-medium">{t.standings.team}</th>
              <th className="text-center py-2 font-medium">{t.standings.played}</th>
              <th className="text-center py-2 font-medium">{t.standings.won}</th>
              <th className="text-center py-2 font-medium">{t.standings.drawn}</th>
              <th className="text-center py-2 font-medium">{t.standings.lost}</th>
              <th className="text-center py-2 font-medium">{t.standings.goalDifference}</th>
              <th className="text-center py-2 font-medium">{t.standings.points}</th>
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
                      <TeamFlag code={team?.code || "xx"} name={team?.name || t.standings.unknown} />
                      <span className="font-medium text-foreground truncate max-w-[80px] sm:max-w-[100px]">{team?.name}</span>
                      {team?.confederation && <ConfederationBadge confederation={team.confederation} />}
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
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent sm:hidden" />
    </div>
  )
}
