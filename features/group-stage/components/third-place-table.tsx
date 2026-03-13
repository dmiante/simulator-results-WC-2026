"use client"

import { cn } from "@/lib/utils"
import { GroupStanding, Team } from "@/lib/types"
import { TeamFlag } from "@/components/team-flag"
import { ConfederationBadge } from "@/components/confederation-badge"

interface ThirdPlaceTableProps {
  ranking: {
    all: GroupStanding[]
    qualified: GroupStanding[]
    eliminated: GroupStanding[]
    completedTeams?: GroupStanding[]
    incompleteTeams?: GroupStanding[]
  }
  teamsMap: Record<string, Team>
}

export function ThirdPlaceTable({ ranking, teamsMap }: ThirdPlaceTableProps) {
  // Verificar si ranking existe y tiene datos
  if (!ranking || !ranking.all || ranking.all.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-sm">
              3°
            </span>
            Ranking de Terceros Lugares
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Los mejores 8 terceros clasifican a la Ronda de 32
          </p>
        </div>
        <div className="p-8 text-center text-muted-foreground">
          No hay datos disponibles aún. Ingresa resultados en los grupos.
        </div>
      </div>
    )
  }

  const isQualified = (teamId: string) => {
    return ranking.qualified?.some(t => t.teamId === teamId) ?? false
  }


  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-6 py-8 border-b border-border bg-muted/30">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-sm">
            3°
          </span>
          Ranking Third Places
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground border-b border-border bg-muted/20">
              <th className="text-center py-3 px-2 font-medium">#</th>
              <th className="text-left py-3 px-2 font-medium">Team</th>
              <th className="text-center py-3 px-2 font-medium">Group</th>
              <th className="text-center py-3 px-2 font-medium">P</th>
              <th className="text-center py-3 px-2 font-medium">W</th>
              <th className="text-center py-3 px-2 font-medium">D</th>
              <th className="text-center py-3 px-2 font-medium">L</th>
              <th className="text-center py-3 px-2 font-medium">GF</th>
              <th className="text-center py-3 px-2 font-medium">GC</th>
              <th className="text-center py-3 px-2 font-medium">GD</th>
              <th className="text-center py-3 px-2 font-medium">Pts</th>
            </tr>
          </thead>
          <tbody>
            {ranking.all.map((team, index) => {
              const teamData = teamsMap[team.teamId]
              const hasCompleted = team.played === 3
              const qualified = isQualified(team.teamId)

              return (
                <tr
                  key={team.teamId}
                  className={cn(
                    "border-b border-border last:border-0 transition-colors",
                    // Completado y clasificado
                    hasCompleted && qualified && "bg-blue-500/10",
                  )}
                >
                  <td className="py-3 px-2">
                    <div className="flex justify-center">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                          hasCompleted && qualified && "bg-blue-500 text-white",
                        )}
                      >
                        {index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <TeamFlag code={teamData?.code} name={teamData?.name || "Unknown"} />
                      <span className="font-medium truncate">
                        {teamData?.name || team.teamId}
                      </span>
                      {teamData?.confederation && <ConfederationBadge confederation={teamData.confederation} />}
                    </div>
                  </td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{team.group}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{team.played}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{team.won}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{team.drawn}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{team.lost}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{team.goalsFor}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{team.goalsAgainst}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">
                    <span>
                      {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </span>
                  </td>
                  <td className="text-center py-3 px-2 font-bold">{team.points}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-border flex flex-wrap gap-4 text-xs bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">Clasificado (confirmado)</span>
        </div>
      </div>
    </div>
  )
}