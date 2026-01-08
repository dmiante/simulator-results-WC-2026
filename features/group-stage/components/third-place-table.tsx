"use client"

import { cn } from "@/lib/utils"
import { GroupStanding, Team } from "@/lib/types"

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

  const isEliminated = (teamId: string) => {
    return ranking.eliminated?.some(t => t.teamId === teamId) ?? false
  }

  // // Calcular posición provisional (para equipos que no han completado)
  // const getProvisionalPosition = (teamId: string) => {
  //   return ranking.all.findIndex(t => t.teamId === teamId) + 1
  // }

  // const completedCount = ranking.completedTeams?.length ?? 0
  // const qualifiedCount = ranking.qualified?.length ?? 0

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-6 py-8 border-b border-border bg-muted/30">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-sm">
            3°
          </span>
          Ranking Third Places
        </h3>
        {/* <div className="flex flex-wrap gap-4 mt-2">
          <p className="text-sm text-muted-foreground">
            • Groups completed: <span className="font-semibold text-foreground">{completedCount}/12</span>
          </p>
          <p className="text-sm text-muted-foreground">
            • Clasificados confirmados: <span className="font-semibold text-amber-500">{qualifiedCount}/8</span>
          </p>
        </div> */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground border-b border-border bg-muted/20">
              <th className="text-center py-3 px-2 font-medium">#</th>
              <th className="text-left py-3 px-2 font-medium">Team</th>
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
              const eliminated = isEliminated(team.teamId)
              const provisionalPosition = index + 1
              const inQualifyingZone = provisionalPosition <= 8

              return (
                <tr
                  key={team.teamId}
                  className={cn(
                    "border-b border-border last:border-0 transition-colors",
                    // Completado y clasificado
                    hasCompleted && qualified && "bg-blue-500/10",
                    // Completado y eliminado
                    hasCompleted && eliminated && "bg-red-500/10",
                    // No completado pero en zona de clasificación
                    !hasCompleted && inQualifyingZone && "bg-blue-500/10",
                    // No completado y fuera de zona
                    !hasCompleted && !inQualifyingZone && "bg-muted/30"
                  )}
                >
                  <td className="py-3 px-2">
                    <div className="flex justify-center">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                          hasCompleted && qualified && "bg-blue-500 text-white",
                          hasCompleted && eliminated && "bg-red-500 text-white",
                          !hasCompleted && inQualifyingZone && "bg-blue-500 text-white",
                          !hasCompleted && !inQualifyingZone && "bg-muted text-muted-foreground"
                        )}
                      >
                        {index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{teamData?.flag}</span>
                      <span className="font-medium truncate max-w-[120px]">
                        {teamData?.name || team.teamId}
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{team.played}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{team.won}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{team.drawn}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{team.lost}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{team.goalsFor}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">{team.goalsAgainst}</td>
                  <td className="text-center py-3 px-2 text-muted-foreground">
                    <span className={cn(
                      team.goalDifference > 0 && "text-green-500",
                      team.goalDifference < 0 && "text-red-500"
                    )}>
                      {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </span>
                  </td>
                  <td className="text-center py-3 px-2 font-bold">{team.points}</td>
                  {/* <td className="text-center py-3 px-2">
                    {hasCompleted ? (
                      qualified ? (
                        <span className="text-xs font-medium text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
                          ✓ Clasificado
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                          ✗ Eliminado
                        </span>
                      )
                    ) : (
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded",
                        inQualifyingZone 
                          ? "text-amber-600 bg-amber-100/50 dark:bg-amber-900/20" 
                          : "text-muted-foreground bg-muted"
                      )}>
                        {team.played}/3 jugados
                      </span>
                    )}
                  </td> */}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
{/* 
      <div className="p-3 border-t border-border flex flex-wrap gap-4 text-xs bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-muted-foreground">Clasificado (confirmado)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/50" />
          <span className="text-muted-foreground">En zona de clasificación (provisional)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-muted-foreground">Eliminado</span>
        </div>
      </div> */}
    </div>
  )
}