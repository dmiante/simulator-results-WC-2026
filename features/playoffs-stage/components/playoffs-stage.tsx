"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { PlayoffMatch, UEFAPlayoffPath, ICPlayoffPath, PlayoffTeam } from "../types"
import { usePlayoffs } from "../hooks/use-playoffs"
import { Trophy, Calendar, MapPin, Dices, RotateCcw } from "lucide-react"
import { TeamFlag } from "@/components/team-flag"


interface PlayoffMatchCardProps {
  match: PlayoffMatch
  getTeam: (id: string | null) => PlayoffTeam | undefined
  onScoreChange: (matchId: string, team: "team1" | "team2", score: number | null) => void
  onPenaltyWinner?: (matchId: string, winnerId: string) => void
  showPenaltySelection?: boolean
}

function PlayoffMatchCard({ match, getTeam, onScoreChange, onPenaltyWinner }: PlayoffMatchCardProps) {
  const team1 = match.team1Id ? getTeam(match.team1Id) : null
  const team2 = match.team2Id ? getTeam(match.team2Id) : null

  const handleScoreChange = (team: "team1" | "team2", value: string) => {
    const score = value === "" ? null : Math.max(0, Math.min(99, parseInt(value) || 0))
    onScoreChange(match.id, team, score)
  }

  const getWinner = () => {
    if (match.team1Score === null || match.team2Score === null) return null
    if (match.team1Score > match.team2Score) return "team1"
    if (match.team2Score > match.team1Score) return "team2"
    return "draw"
  }

  const winner = getWinner()
  const isDraw = winner === "draw"
  const needsPenalties = isDraw && match.team1Score !== null

  return (
    <div className="bg-muted/30 rounded-lg p-3 space-y-2">
      {/* Match info header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{match.date}</span>
        </div>
        {match.venue && (
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-[120px]">{match.venue}</span>
          </div>
        )}
      </div>

      {/* Teams and score */}
      <div className="flex items-center gap-2">
        {/* Team 1 */}
        <div className={cn(
          "flex-1 flex items-center gap-2 min-w-0",
          winner === "team1" && "font-semibold",
          match.penaltyWinnerId === match.team1Id && "font-semibold"
        )}>
          {team1 ? (
            <>
              <TeamFlag code={team1.code} name={team1.name} />
              <span className={cn(
                "text-sm truncate",
                winner === "team2" && !match.penaltyWinnerId && "text-muted-foreground"
              )}>
                {team1.name}
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground italic">
              {match.team1FromMatch || "TBD"}
            </span>
          )}
        </div>

        {/* Score inputs */}
        <div className="flex items-center gap-1">
          <Input
            type="number"
            min={0}
            max={99}
            value={match.team1Score ?? ""}
            onChange={(e) => handleScoreChange("team1", e.target.value)}
            disabled={!team1}
            className={cn(
              "w-10 h-8 text-center p-0 text-sm font-medium",
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
            onChange={(e) => handleScoreChange("team2", e.target.value)}
            disabled={!team2}
            className={cn(
              "w-10 h-8 text-center p-0 text-sm font-medium",
              winner === "team2" && "border-green-500 bg-green-500/10",
              match.penaltyWinnerId === match.team2Id && "border-green-500 bg-green-500/10"
            )}
            placeholder="-"
          />
        </div>

        {/* Team 2 */}
        <div className={cn(
          "flex-1 flex items-center gap-2 min-w-0 justify-end",
          winner === "team2" && "font-semibold",
          match.penaltyWinnerId === match.team2Id && "font-semibold"
        )}>
          {team2 ? (
            <>
              <span className={cn(
                "text-sm truncate",
                winner === "team1" && !match.penaltyWinnerId && "text-muted-foreground"
              )}>
                {team2.name}
              </span>
              <TeamFlag code={team2.code} name={team2.name} />
            </>
          ) : (
            <span className="text-sm text-muted-foreground italic">
              {match.team2FromMatch || "TBD"}
            </span>
          )}
        </div>
      </div>

      {/* Penalty shootout selection */}
      {needsPenalties && team1 && team2 && onPenaltyWinner && (
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">Penalties:</span>
          <Button
            size="sm"
            variant={match.penaltyWinnerId === team1.id ? "default" : "outline"}
            className="h-6 text-xs px-2"
            onClick={() => onPenaltyWinner(match.id, team1.id)}
          >
            {team1.code}
          </Button>
          <Button
            size="sm"
            variant={match.penaltyWinnerId === team2.id ? "default" : "outline"}
            className="h-6 text-xs px-2"
            onClick={() => onPenaltyWinner(match.id, team2.id)}
          >
            {team2.code}
          </Button>
        </div>
      )}
    </div>
  )
}

interface UEFAPathCardProps {
  path: UEFAPlayoffPath
  getTeam: (id: string | null) => PlayoffTeam | undefined
  winner: string | null
  onScoreChange: (matchId: string, team: "team1" | "team2", score: number | null) => void
  onPenaltyWinner: (matchId: string, winnerId: string) => void
}

function UEFAPathCard({ path, getTeam, winner, onScoreChange, onPenaltyWinner }: UEFAPathCardProps) {
  const winnerTeam = winner ? getTeam(winner) : null

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>{path.name}</span>
            <Badge variant="outline" className="text-xs">
              → Group {path.targetGroup}
            </Badge>
          </CardTitle>
          {winnerTeam && (
            <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
              <Trophy className="h-3 w-3 mr-1" />
              <TeamFlag code={winnerTeam.code} name={winnerTeam.name} />
              {winnerTeam.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Semifinals */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Semifinals - March 26, 2026
          </h4>
          <div className="grid gap-2">
            <PlayoffMatchCard
              match={path.semifinal1}
              getTeam={getTeam}
              onScoreChange={onScoreChange}
              onPenaltyWinner={onPenaltyWinner}
            />
            <PlayoffMatchCard
              match={path.semifinal2}
              getTeam={getTeam}
              onScoreChange={onScoreChange}
              onPenaltyWinner={onPenaltyWinner}
            />
          </div>
        </div>

        {/* Final */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Final - March 31, 2026
          </h4>
          <PlayoffMatchCard
            match={path.final}
            getTeam={getTeam}
            onScoreChange={onScoreChange}
            onPenaltyWinner={onPenaltyWinner}
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
  onScoreChange: (matchId: string, team: "team1" | "team2", score: number | null) => void
  onPenaltyWinner: (matchId: string, winnerId: string) => void
}

function ICPathCard({ path, getTeam, winner, onScoreChange, onPenaltyWinner }: ICPathCardProps) {
  const winnerTeam = winner ? getTeam(winner) : null

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>{path.name}</span>
            <Badge variant="outline" className="text-xs">
              → Group {path.targetGroup}
            </Badge>
          </CardTitle>
          {winnerTeam && (
            <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
              <Trophy className="h-3 w-3 mr-1" />
              <TeamFlag code={winnerTeam.code} name={winnerTeam.name} /> {winnerTeam.code}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Semifinal */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Semifinal - March 26, 2026
          </h4>
          <PlayoffMatchCard
            match={path.semifinal}
            getTeam={getTeam}
            onScoreChange={onScoreChange}
            onPenaltyWinner={onPenaltyWinner}
          />
        </div>

        {/* Final */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Final - March 31, 2026
          </h4>
          <PlayoffMatchCard
            match={path.final}
            getTeam={getTeam}
            onScoreChange={onScoreChange}
            onPenaltyWinner={onPenaltyWinner}
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface PlayoffsStageProps {
  playoffsState?: ReturnType<typeof usePlayoffs>['playoffsState']
  onMatchScoreChange?: (matchId: string, team: "team1" | "team2", score: number | null) => void
  onPenaltyWinner?: (matchId: string, winnerId: string) => void
  simulatePlayoffs?: () => void
  resetPlayoffs?: () => void
}

export function PlayoffsStage({
  playoffsState: externalState,
  onMatchScoreChange: externalScoreChange,
  onPenaltyWinner: externalPenaltyWinner,
  simulatePlayoffs: externalSimulate,
  resetPlayoffs: externalReset
}: PlayoffsStageProps = {}) {
  const { simulatePlayoffs: internalSimulate, resetPlayoffs: internalReset, playoffsState: internalState, handleMatchScoreChange: handleScore, handlePenaltyWinner: handlePenalty } = usePlayoffs()

  // Use external state/handlers if provided, otherwise use internal hook
  const playoffsState = externalState || internalState
  const handleMatchScoreChange = externalScoreChange || handleScore
  const handlePenaltyWinner = externalPenaltyWinner || handlePenalty
  const simulatePlayoffs = externalSimulate || internalSimulate
  const resetPlayoffs = externalReset || internalReset

  const { uefaPaths, icPaths, playoffTeams, winners } = playoffsState

  const getTeam = (id: string | null): PlayoffTeam | undefined => {
    if (!id) return undefined
    return playoffTeams.find((t) => t.id === id)
  }

  return (
    <div className="space-y-6">
      <div className="gap-2 flex flex-wrap justify-end">
        {simulatePlayoffs && (
          <>
            <Button onClick={simulatePlayoffs} className="gap-2 cursor-pointer" variant="default">
              <Dices className="h-4 w-4" />
              Simulate Playoffs
            </Button>
            <Button onClick={resetPlayoffs} className="gap-2 cursor-pointer" variant="outline">
              <RotateCcw className="h-4 w-4" />
              Reset Playoffs
            </Button>
          </>
        )}
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Qualification Playoffs</h2>
        <p className="text-muted-foreground">
          March 26-31, 2026 • Determine the final 6 teams for the World Cup
        </p>
      </div>

      <Tabs defaultValue="uefa" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="uefa">UEFA Playoffs (4 spots)</TabsTrigger>
          <TabsTrigger value="ic">Inter-Confederation (2 spots)</TabsTrigger>
        </TabsList>

        {/* UEFA Playoffs */}
        <TabsContent value="uefa" className="space-y-4">
          <div className="text-sm text-muted-foreground text-center mb-4">
            16 teams compete in 4 paths • Winners qualify for the World Cup
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {uefaPaths.map((path) => (
              <UEFAPathCard
                key={path.id}
                path={path}
                getTeam={getTeam}
                winner={winners[path.targetSlotId as keyof typeof winners]}
                onScoreChange={handleMatchScoreChange}
                onPenaltyWinner={handlePenaltyWinner}
              />
            ))}
          </div>
        </TabsContent>

        {/* Inter-Confederation Playoffs */}
        <TabsContent value="ic" className="space-y-4">
          <div className="text-sm text-muted-foreground text-center mb-4">
            6 teams compete in 2 paths in Mexico • Winners qualify for the World Cup
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {icPaths.map((path) => (
              <ICPathCard
                key={path.id}
                path={path}
                getTeam={getTeam}
                winner={winners[path.targetSlotId as keyof typeof winners]}
                onScoreChange={handleMatchScoreChange}
                onPenaltyWinner={handlePenaltyWinner}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Winners Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Qualified Teams Summary</CardTitle>
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
                    {isUefa ? `UEFA Path ${pathLetter.toUpperCase()}` : `IC Path ${pathLetter}`}
                  </div>
                  {winnerTeam ? (
                    <div className="flex flex-col items-center gap-2">
                      <TeamFlag code={winnerTeam.code} name={winnerTeam.name} />
                      <div className="text-sm font-medium">{winnerTeam.name}</div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <img src="/fifa_flag.svg" alt="TBD" width={30} height={30} />
                      <div className="text-sm text-muted-foreground">TBD</div>
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
