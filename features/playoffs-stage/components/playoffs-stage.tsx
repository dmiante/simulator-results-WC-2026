"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"
import { formatPlayoffDate, getTeamDisplayName, getVenueDisplayName, Messages } from "@/lib/i18n"
import { PlayoffMatch, UEFAPlayoffPath, ICPlayoffPath, PlayoffTeam } from "../types"
import { usePlayoffs } from "../hooks/use-playoffs"
import { Trophy, Calendar, MapPin } from "lucide-react"
import { TeamFlag } from "@/components/team-flag"
import { ConfederationBadge } from "@/components/confederation-badge"
import Image from "next/image"


interface PlayoffMatchCardProps {
  match: PlayoffMatch
  getTeam: (id: string | null) => PlayoffTeam | undefined
}

function getPlayoffSourceLabel(source: string | undefined, t: Messages) {
  if (!source) return t.common.tbd

  const semifinalWinner = source.match(/^Winner SF(\d)$/)
  if (semifinalWinner) return t.playoffs.winnerSf(semifinalWinner[1])

  const matchWinner = source.match(/^Winner Match (\d)$/)
  if (matchWinner) return t.playoffs.winnerMatch(matchWinner[1])

  return source
}

function PlayoffMatchCard({ match, getTeam }: PlayoffMatchCardProps) {
  const { locale, messages: t } = useLanguage()
  const team1 = match.team1Id ? getTeam(match.team1Id) : null
  const team2 = match.team2Id ? getTeam(match.team2Id) : null
  const team1Name = team1 ? getTeamDisplayName(team1, locale) : ""
  const team2Name = team2 ? getTeamDisplayName(team2, locale) : ""
  const hasPenaltyScore = match.penaltyTeam1Score !== undefined && match.penaltyTeam2Score !== undefined
  const penaltyWinnerSide = match.penaltyWinnerId
    ? match.penaltyWinnerId === match.team1Id ? "team1" : "team2"
    : null

  const getWinner = () => {
    if (match.team1Score === null || match.team2Score === null) return null
    if (match.team1Score > match.team2Score) return "team1"
    if (match.team2Score > match.team1Score) return "team2"
    return "draw"
  }

  const winner = getWinner()

  return (
    <div className="bg-muted/30 rounded-lg p-3 space-y-2">
      {/* Match info header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{formatPlayoffDate(match.date, locale)}</span>
        </div>
        {match.venue && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-[80px] sm:max-w-[120px]">{getVenueDisplayName(match.venue, locale)}</span>
          </div>
        )}
      </div>

      {/* Teams and score */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Team 1 */}
        <div className={cn(
          "flex-1 flex items-center gap-1 sm:gap-2 min-w-0 overflow-hidden",
          winner === "team1" && "font-semibold",
          match.penaltyWinnerId === match.team1Id && "font-semibold"
        )}>
          {team1 ? (
            <>
              <TeamFlag code={team1.code} name={team1Name} />
              <span className="hidden sm:inline"><ConfederationBadge confederation={team1.confederation} /></span>
              <span className={cn(
                "text-sm truncate min-w-0",
                winner === "team2" && !match.penaltyWinnerId && "text-muted-foreground"
              )}>
                {team1Name}
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground italic truncate">
              {getPlayoffSourceLabel(match.team1FromMatch, t)}
            </span>
          )}
        </div>

        {/* Score inputs */}
        <div className="flex items-center gap-1 shrink-0">
          <Input
            type="number"
            min={0}
            max={99}
            value={match.team1Score ?? ""}
            readOnly
            disabled={!team1}
            className={cn(
              "w-10 h-8 text-center p-0 text-sm font-medium",
              "pointer-events-none",
              winner === "team1" && "border-green-500 bg-green-500/10",
              match.penaltyWinnerId === match.team1Id && "border-green-500 bg-green-500/10"
            )}
            placeholder="-"
          />
          <span className="text-muted-foreground text-xs">:</span>
          <Input
            type="number"
            min={0}
            max={99}
            value={match.team2Score ?? ""}
            readOnly
            disabled={!team2}
            className={cn(
              "w-10 h-8 text-center p-0 text-sm font-medium",
              "pointer-events-none",
              winner === "team2" && "border-green-500 bg-green-500/10",
              match.penaltyWinnerId === match.team2Id && "border-green-500 bg-green-500/10"
            )}
            placeholder="-"
          />
        </div>

        {/* Team 2 */}
        <div className={cn(
          "flex-1 flex items-center gap-1 sm:gap-2 min-w-0 overflow-hidden justify-end",
          winner === "team2" && "font-semibold",
          match.penaltyWinnerId === match.team2Id && "font-semibold"
        )}>
          {team2 ? (
            <>
              <span className={cn(
                "text-sm truncate min-w-0",
                winner === "team1" && !match.penaltyWinnerId && "text-muted-foreground"
              )}>
                {team2Name}
              </span>
              <span className="hidden sm:inline"><ConfederationBadge confederation={team2.confederation} /></span>
              <TeamFlag code={team2.code} name={team2Name} />
            </>
          ) : (
            <span className="text-sm text-muted-foreground italic truncate">
              {getPlayoffSourceLabel(match.team2FromMatch, t)}
            </span>
          )}
        </div>
      </div>

      {winner === "draw" && penaltyWinnerSide && hasPenaltyScore && team1 && team2 && (
        <div className="border-t border-border/50 pt-2">
          <div className="grid grid-cols-[1fr_auto_1fr] overflow-hidden rounded-md border border-border/60 bg-background/70 text-xs">
            <div
              className={cn(
                "flex min-w-0 items-center justify-between gap-2 px-3 py-2",
                penaltyWinnerSide === "team1"
                  ? "bg-green-500/15 text-green-700 dark:text-green-300"
                  : "bg-muted/40 text-muted-foreground"
              )}
            >
              <div className="flex min-w-0 items-center gap-1.5">
                {penaltyWinnerSide === "team1" && <Trophy className="h-3 w-3 shrink-0" />}
                <span className="truncate font-medium">{team1.code}</span>
              </div>
              <span className="shrink-0 font-semibold tabular-nums text-foreground dark:text-current">
                {match.penaltyTeam1Score}
              </span>
            </div>

            <div className="flex items-center justify-center border-x border-border/60 bg-muted/60 px-2.5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {t.common.penalties}
            </div>

            <div
              className={cn(
                "flex min-w-0 items-center justify-between gap-2 px-3 py-2",
                penaltyWinnerSide === "team2"
                  ? "bg-green-500/15 text-green-700 dark:text-green-300"
                  : "bg-muted/40 text-muted-foreground"
              )}
            >
              <span className="shrink-0 font-semibold tabular-nums text-foreground dark:text-current">
                {match.penaltyTeam2Score}
              </span>
              <div className="flex min-w-0 items-center justify-end gap-1.5 text-right">
                <span className="truncate font-medium">{team2.code}</span>
                {penaltyWinnerSide === "team2" && <Trophy className="h-3 w-3 shrink-0" />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface UEFAPathCardProps {
  path: UEFAPlayoffPath
  getTeam: (id: string | null) => PlayoffTeam | undefined
  winner: string | null
}

function UEFAPathCard({ path, getTeam, winner }: UEFAPathCardProps) {
  const { locale, messages: t } = useLanguage()
  const winnerTeam = winner ? getTeam(winner) : null
  const winnerTeamName = winnerTeam ? getTeamDisplayName(winnerTeam, locale) : ""

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>{t.playoffs.uefaPath(path.id)}</span>
            <Badge variant="outline" className="text-xs">
              {t.playoffs.pathToGroup(path.targetGroup)}
            </Badge>
          </CardTitle>
          {winnerTeam && (
            <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
              <Trophy className="h-3 w-3 mr-1" />
              <TeamFlag code={winnerTeam.code} name={winnerTeamName} />
              {winnerTeamName}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Semifinals */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {t.playoffs.semifinals(formatPlayoffDate(path.semifinal1.date, locale))}
          </h4>
          <div className="grid gap-2">
            <PlayoffMatchCard
              match={path.semifinal1}
              getTeam={getTeam}
            />
            <PlayoffMatchCard
              match={path.semifinal2}
              getTeam={getTeam}
            />
          </div>
        </div>

        {/* Final */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {t.playoffs.final(formatPlayoffDate(path.final.date, locale))}
          </h4>
          <PlayoffMatchCard
            match={path.final}
            getTeam={getTeam}
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface ICPathCardProps {
  path: ICPlayoffPath
  getTeam: (id: string | null) => PlayoffTeam | undefined
  winner: string | null
}

function ICPathCard({ path, getTeam, winner }: ICPathCardProps) {
  const { locale, messages: t } = useLanguage()
  const winnerTeam = winner ? getTeam(winner) : null
  const winnerTeamName = winnerTeam ? getTeamDisplayName(winnerTeam, locale) : ""

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>{t.playoffs.icPath(path.id)}</span>
            <Badge variant="outline" className="text-xs">
              {t.playoffs.pathToGroup(path.targetGroup)}
            </Badge>
          </CardTitle>
          {winnerTeam && (
            <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
              <Trophy className="h-3 w-3 mr-1" />
              <TeamFlag code={winnerTeam.code} name={winnerTeamName} /> {winnerTeam.code}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Semifinal */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {t.playoffs.semifinal(formatPlayoffDate(path.semifinal.date, locale))}
          </h4>
          <PlayoffMatchCard
            match={path.semifinal}
            getTeam={getTeam}
          />
        </div>

        {/* Final */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {t.playoffs.final(formatPlayoffDate(path.final.date, locale))}
          </h4>
          <PlayoffMatchCard
            match={path.final}
            getTeam={getTeam}
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface PlayoffsStageProps {
  playoffsState?: ReturnType<typeof usePlayoffs>['playoffsState']
}

export function PlayoffsStage({
  playoffsState: externalState
}: PlayoffsStageProps = {}) {
  const { locale, messages: t } = useLanguage()
  const { playoffsState: internalState } = usePlayoffs()

  // Use external state/handlers if provided, otherwise use internal hook
  const playoffsState = externalState || internalState

  const { uefaPaths, icPaths, playoffTeams, winners } = playoffsState

  const getTeam = (id: string | null): PlayoffTeam | undefined => {
    if (!id) return undefined
    return playoffTeams.find((t) => t.id === id)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold">{t.playoffs.title}</h2>
        <p className="text-muted-foreground">
          {t.playoffs.description}
        </p>
      </div>

      <Tabs defaultValue="uefa" className="w-full">
        <TabsList className="mb-4 grid h-11 w-full grid-cols-2">
          <TabsTrigger value="uefa">
            <span className="sm:hidden">{t.playoffs.uefaShort}</span>
            <span className="hidden sm:inline">{t.playoffs.uefaLong}</span>
          </TabsTrigger>
          <TabsTrigger value="ic">
            <span className="sm:hidden">{t.playoffs.icShort}</span>
            <span className="hidden sm:inline">{t.playoffs.icLong}</span>
          </TabsTrigger>
        </TabsList>

        {/* UEFA Playoffs */}
        <TabsContent value="uefa" className="space-y-4">
          <div className="text-sm text-muted-foreground text-center mb-4">
            {t.playoffs.uefaDescription}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {uefaPaths.map((path) => (
              <UEFAPathCard
                key={path.id}
                path={path}
                getTeam={getTeam}
                winner={winners[path.targetSlotId as keyof typeof winners]}
              />
            ))}
          </div>
        </TabsContent>

        {/* Inter-Confederation Playoffs */}
        <TabsContent value="ic" className="space-y-4">
          <div className="text-sm text-muted-foreground text-center mb-4">
            {t.playoffs.icDescription}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {icPaths.map((path) => (
              <ICPathCard
                key={path.id}
                path={path}
                getTeam={getTeam}
                winner={winners[path.targetSlotId as keyof typeof winners]}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Winners Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.playoffs.qualifiedSummary}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(winners).map(([slotId, winnerId]) => {
              const winnerTeam = winnerId ? getTeam(winnerId) : null
              const isUefa = slotId.startsWith("uefa")
              const pathLetter = slotId.replace("uefa", "").replace("icp", "")

              return (
                <div
                  key={slotId}
                  className={cn(
                    "p-3 rounded-lg text-center",
                    winnerTeam ? "bg-green-500/10 border border-green-500/30" : "bg-muted/50 border border-dashed"
                  )}
                >
                  <div className="text-xs text-muted-foreground mb-4">
                    {isUefa ? t.playoffs.uefaPath(pathLetter.toUpperCase()) : t.playoffs.icPath(pathLetter)}
                  </div>
                  {winnerTeam ? (
                    <div className="flex flex-col items-center gap-2">
                      <TeamFlag code={winnerTeam.code} name={getTeamDisplayName(winnerTeam, locale)} />
                      <div className="text-sm font-medium">{getTeamDisplayName(winnerTeam, locale)}</div>
                      <ConfederationBadge confederation={winnerTeam.confederation} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Image src="/fifa_flag.svg" alt={t.common.tbd} width={30} height={30} unoptimized />
                      <div className="text-sm text-muted-foreground">{t.common.tbd}</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
