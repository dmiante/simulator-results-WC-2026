"use client"

import { Badge } from "@/components/ui/badge"
import { useTranslations } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { teamSquadsMap } from "@/db/squads-data"
import { TeamSquad, PlayerPosition } from "@/features/squads/types"
import { PlayoffWinners, Team } from "@/lib/types"
import { cn } from "@/lib/utils"

const positionOrder: PlayerPosition[] = ["goalkeeper", "defender", "midfielder", "forward"]

interface SquadsSectionProps {
  groups: Record<string, string[]>
  teamsMap: Record<string, Team>
  playoffWinners: PlayoffWinners
}

function getPositionAccent(position: PlayerPosition) {
  switch (position) {
    case "goalkeeper":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
    case "defender":
      return "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
    case "midfielder":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
    case "forward":
      return "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
  }
}

function SquadPlayers({ squad, labels }: { squad: TeamSquad; labels: Record<PlayerPosition, string> }) {
  const t = useTranslations()

  if (squad.players.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
        {t.squads.pendingOfficialSource}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {positionOrder.map((position) => {
        const players = squad.players.filter((player) => player.position === position)
        if (players.length === 0) return null

        return (
          <div key={position} className="space-y-2">
            <Badge variant="outline" className={cn("border", getPositionAccent(position))}>
              {labels[position]}
            </Badge>
            <div className="grid gap-2">
              {players.map((player) => (
                <div key={player.id} className="grid grid-cols-[2.5rem_1fr] items-center gap-3 rounded-lg border bg-background/70 p-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                    {player.shirtNumber ?? "--"}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{player.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{player.club ?? t.squads.clubPending}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function SquadsSection({ groups, teamsMap, playoffWinners }: SquadsSectionProps) {
  const t = useTranslations()

  const labels: Record<PlayerPosition, string> = {
    goalkeeper: t.squads.positions.goalkeeper,
    defender: t.squads.positions.defender,
    midfielder: t.squads.positions.midfielder,
    forward: t.squads.positions.forward,
  }

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="relative p-6 sm:p-8">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.18),transparent_55%)] sm:block" />
          <div className="relative max-w-3xl space-y-3">
            <Badge variant="secondary" className="w-fit">{t.squads.teamsBadge}</Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.squads.title}</h2>
            <p className="text-muted-foreground">
              {t.squads.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Object.entries(groups).map(([groupName, teamIds]) => (
          <Card key={groupName} className="overflow-hidden">
            <CardHeader className="border-b bg-muted/30 py-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {groupName}
                </span>
                {t.common.groupLabel(groupName)}
              </CardTitle>
              <CardDescription>{t.squads.groupDescription}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
              {teamIds.map((teamId) => {
                const team = teamsMap[teamId]
                const squadTeamId = playoffWinners[teamId as keyof PlayoffWinners] ?? teamId
                const squad = teamSquadsMap[squadTeamId] ?? { teamId: squadTeamId, players: [] }

                return (
                  <div key={teamId} className="rounded-xl border bg-card/60 p-4 shadow-xs">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl" aria-hidden="true">{team?.flag}</span>
                          <h3 className="truncate font-semibold">{team?.name ?? teamId}</h3>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{team?.confederation ?? t.squads.tbd}</p>
                      </div>
                      <Badge variant={squad.players.length > 0 ? "default" : "outline"}>
                        {squad.players.length}/26
                      </Badge>
                    </div>
                    <SquadPlayers squad={squad} labels={labels} />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
