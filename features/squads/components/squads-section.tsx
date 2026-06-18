"use client"

import { useDeferredValue, useState } from "react"
import { Search, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useTranslations } from "@/components/language-provider"
import { teamSquadsMap } from "@/db/squads-data"
import { TeamSquad, PlayerPosition } from "@/features/squads/types"
import { PlayoffWinners, Team } from "@/lib/types"
import { cn } from "@/lib/utils"
import { TeamFlag } from "@/components/team-flag"

const positionOrder: PlayerPosition[] = ["goalkeeper", "defender", "midfielder", "forward"]

interface SquadsSectionProps {
  groups: Record<string, string[]>
  teamsMap: Record<string, Team>
  playoffWinners: PlayoffWinners
}

interface SquadListItem {
  teamId: string
  team: Team
  squad: TeamSquad
  sortName: string
  searchableText: string
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
                <div key={player.id} className="flex items-start gap-2 rounded-lg border bg-background/70 p-2.5">
                  {typeof player.shirtNumber === "number" && (
                    <span className="flex h-6 min-w-7 items-center justify-center rounded-md bg-muted px-1.5 text-[11px] font-semibold text-muted-foreground">
                      #{player.shirtNumber}
                    </span>
                  )}
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
  const [query, setQuery] = useState("")
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const deferredQuery = useDeferredValue(query)

  const squads = Object.values(groups)
    .flat()
    .map((teamId) => {
      const team = teamsMap[teamId]
      const squadTeamId = playoffWinners[teamId as keyof PlayoffWinners] ?? teamId
      const squad = teamSquadsMap[squadTeamId] ?? { teamId: squadTeamId, players: [] }

      return {
        teamId,
        team,
        squad,
        sortName: team?.name ?? teamId,
        searchableText: [team?.name, team?.confederation, teamId, squadTeamId]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase(),
      }
    })
    .sort((a, b) => a.sortName.localeCompare(b.sortName))

  const normalizedQuery = deferredQuery.trim().toLocaleLowerCase()
  const filteredSquads: SquadListItem[] = normalizedQuery
    ? squads.filter((item) => item.searchableText.includes(normalizedQuery))
    : squads
  const activeItem = filteredSquads.find((item) => item.teamId === selectedTeamId) ?? filteredSquads[0] ?? null
  const activeTeamId = activeItem?.teamId ?? null

  const labels: Record<PlayerPosition, string> = {
    goalkeeper: t.squads.positions.goalkeeper,
    defender: t.squads.positions.defender,
    midfielder: t.squads.positions.midfielder,
    forward: t.squads.positions.forward,
  }

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-3xl border bg-card">
        <div className="relative p-6 sm:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.16),transparent_42%),radial-gradient(circle_at_85%_18%,hsl(var(--accent)/0.72),transparent_28%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div className="max-w-3xl space-y-3">
              <Badge variant="secondary" className="w-fit">{t.squads.teamsBadge}</Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.squads.title}</h2>
              <p className="text-muted-foreground">
                {t.squads.description}
              </p>
            </div>
            <div className="rounded-2xl border bg-background/70 p-3 shadow-sm backdrop-blur">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label={t.squads.searchLabel}
                  placeholder={t.squads.searchPlaceholder}
                  className="h-11 rounded-xl bg-background pl-9 pr-10"
                />
                {query.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg"
                    aria-label={t.squads.clearSearch}
                    onClick={() => setQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="mt-2 px-1 text-xs text-muted-foreground">
                {t.squads.resultsCount(filteredSquads.length)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <Card className="overflow-hidden lg:sticky lg:top-4 lg:self-start">
          <CardHeader className="border-b bg-muted/30 py-4">
            <CardTitle className="text-lg">{t.squads.listTitle}</CardTitle>
            <CardDescription>{t.squads.listDescription}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredSquads.length > 0 ? (
              <div className="max-h-[38rem] overflow-y-auto p-2">
                <ol className="space-y-1">
                  {filteredSquads.map(({ teamId, team, squad }) => {
                    const isActive = teamId === activeTeamId

                    return (
                      <li key={teamId}>
                        <Button
                          type="button"
                          variant="ghost"
                          aria-pressed={isActive}
                          onClick={() => setSelectedTeamId(teamId)}
                          className={cn(
                            "h-auto w-full justify-start rounded-xl px-3 py-2.5 text-left",
                            isActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                          )}
                        >
                          <TeamFlag code={team?.code} name={team?.name} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold">{team?.name ?? teamId}</span>
                            <span className={cn("block truncate text-xs text-muted-foreground", isActive && "text-primary-foreground/75")}>
                              {team?.confederation ?? t.squads.tbd}
                            </span>
                          </span>
                          <span className={cn(
                            "rounded-full border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground",
                            isActive && "border-primary-foreground/25 text-primary-foreground/80",
                          )}
                          >
                            {squad.players.length}
                          </span>
                        </Button>
                      </li>
                    )
                  })}
                </ol>
              </div>
            ) : (
              <div className="p-6 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{t.squads.noResultsTitle}</p>
                <p className="mt-1">{t.squads.noResultsDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-primary/20">
          {activeItem ? (
            <>
              <div className="relative overflow-hidden border-b bg-muted/20 p-5 sm:p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.16),transparent_34%),linear-gradient(120deg,transparent,hsl(var(--muted)/0.74))]" />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-4 items-center">
                    <TeamFlag code={activeItem.team.code} name={activeItem.team.name} width={100} widthImg={160} />
                    <div className="min-w-0 space-y-2">
                      <Badge variant="outline" className="bg-background/75">{t.squads.selectedLabel}</Badge>
                      <div>
                        <h3 className="truncate text-2xl font-bold tracking-tight">{activeItem.team?.name ?? activeItem.teamId}</h3>
                        <p className="text-sm text-muted-foreground">{activeItem.team?.confederation ?? t.squads.tbd}</p>
                      </div>
                    </div>
                  </div>
                  <Badge variant={activeItem.squad.players.length > 0 ? "default" : "outline"} className="shrink-0">
                    {t.squads.playersCount(activeItem.squad.players.length)}
                  </Badge>
                </div>
              </div>

              <CardContent className="space-y-5 p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {positionOrder.map((position) => {
                    const count = activeItem.squad.players.filter((player) => player.position === position).length

                    return (
                      <div key={position} className={cn("rounded-xl border p-3", getPositionAccent(position))}>
                        <p className="text-xs font-medium opacity-80">{labels[position]}</p>
                        <p className="mt-1 text-2xl font-bold">{count}</p>
                      </div>
                    )
                  })}
                </div>
                <SquadPlayers squad={activeItem.squad} labels={labels} />
              </CardContent>
            </>
          ) : (
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{t.squads.noResultsTitle}</p>
              <p className="mt-1">{t.squads.noResultsDescription}</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
