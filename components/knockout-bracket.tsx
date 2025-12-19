"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Trophy, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Match, Team } from "@/lib/tournament-data"

interface KnockoutBracketProps {
  matches: Match[]
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>
  teamsMap: Record<string, Team>
  onScoreChange: (matchId: string, team: "team1" | "team2", score: number | null) => void
}

function MatchCard({
  match,
  team1,
  team2,
  onScoreChange,
  isFinal = false,
  isThirdPlace = false,
}: {
  match: Match
  team1: Team
  team2: Team
  onScoreChange: (matchId: string, team: "team1" | "team2", score: number | null) => void
  isFinal?: boolean
  isThirdPlace?: boolean
}) {
  const isTeam1TBD = !team1 || team1.name === "TBD"
  const isTeam2TBD = !team2 || team2.name === "TBD"

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
        "bg-white dark:bg-slate-800 rounded-lg border shadow-sm overflow-hidden transition-all hover:shadow-md group",
        isFinal && "border-primary border-2 shadow-lg",
        isThirdPlace && "border-amber-400 dark:border-amber-600",
        !isFinal && !isThirdPlace && "border-slate-200 dark:border-slate-700",
      )}
      style={{ width: "240px", minHeight: "88px" }}
    >
      <div className="flex flex-col">
        {/* Team 1 */}
        <div
          className={cn(
            "flex items-center justify-between px-3 py-2.5 border-b transition-colors",
            winner === "team1"
              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
              : "border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750",
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {!isTeam1TBD && <span className="text-xl shrink-0">{team1.flag}</span>}
            <span
              className={cn(
                "text-sm font-medium truncate",
                isTeam1TBD && "text-slate-400 dark:text-slate-500 italic",
                winner === "team1" && "font-semibold text-emerald-900 dark:text-emerald-100",
              )}
            >
              {team1?.name || "TBD"}
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
              "w-12 h-8 text-center text-sm font-bold border-slate-300 dark:border-slate-600",
              winner === "team1" && "bg-emerald-100 dark:bg-emerald-900 border-emerald-400 dark:border-emerald-600",
            )}
            placeholder="-"
            disabled={isTeam1TBD}
          />
        </div>

        {/* Team 2 */}
        <div
          className={cn(
            "flex items-center justify-between px-3 py-2.5 transition-colors",
            winner === "team2" ? "bg-emerald-50 dark:bg-emerald-950/30" : "hover:bg-slate-50 dark:hover:bg-slate-750",
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {!isTeam2TBD && <span className="text-xl shrink-0">{team2.flag}</span>}
            <span
              className={cn(
                "text-sm font-medium truncate",
                isTeam2TBD && "text-slate-400 dark:text-slate-500 italic",
                winner === "team2" && "font-semibold text-emerald-900 dark:text-emerald-100",
              )}
            >
              {team2?.name || "TBD"}
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
              "w-12 h-8 text-center text-sm font-bold border-slate-300 dark:border-slate-600",
              winner === "team2" && "bg-emerald-100 dark:bg-emerald-900 border-emerald-400 dark:border-emerald-600",
            )}
            placeholder="-"
            disabled={isTeam2TBD}
          />
        </div>
      </div>
    </div>
  )
}

function StraightConnector({
  matches,
  direction = "right",
  gap = 24,
}: {
  matches: number
  direction?: "left" | "right"
  gap?: number
}) {
  const matchHeight = 88
  const connectorWidth = 32
  const lines = []

  for (let i = 0; i < matches; i += 2) {
    const y1 = i * (matchHeight + gap) + matchHeight / 2
    const y2 = (i + 1) * (matchHeight + gap) + matchHeight / 2
    const midY = (y1 + y2) / 2

    if (direction === "right") {
      // Horizontal line from match to mid point
      lines.push(
        <line
          key={`h1-${i}`}
          x1={0}
          y1={y1}
          x2={connectorWidth / 2}
          y2={y1}
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-300 dark:text-slate-600"
        />,
      )
      lines.push(
        <line
          key={`h2-${i}`}
          x1={0}
          y1={y2}
          x2={connectorWidth / 2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-300 dark:text-slate-600"
        />,
      )
      // Vertical line connecting the two matches
      lines.push(
        <line
          key={`v-${i}`}
          x1={connectorWidth / 2}
          y1={y1}
          x2={connectorWidth / 2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-300 dark:text-slate-600"
        />,
      )
      // Horizontal line from mid point to next round
      lines.push(
        <line
          key={`h3-${i}`}
          x1={connectorWidth / 2}
          y1={midY}
          x2={connectorWidth}
          y2={midY}
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-300 dark:text-slate-600"
        />,
      )
    } else {
      // Horizontal line from next round to mid point
      lines.push(
        <line
          key={`h1-${i}`}
          x1={connectorWidth}
          y1={y1}
          x2={connectorWidth / 2}
          y2={y1}
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-300 dark:text-slate-600"
        />,
      )
      lines.push(
        <line
          key={`h2-${i}`}
          x1={connectorWidth}
          y1={y2}
          x2={connectorWidth / 2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-300 dark:text-slate-600"
        />,
      )
      // Vertical line connecting the two matches
      lines.push(
        <line
          key={`v-${i}`}
          x1={connectorWidth / 2}
          y1={y1}
          x2={connectorWidth / 2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-300 dark:text-slate-600"
        />,
      )
      // Horizontal line from mid point to matches
      lines.push(
        <line
          key={`h3-${i}`}
          x1={connectorWidth / 2}
          y1={midY}
          x2={0}
          y2={midY}
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-300 dark:text-slate-600"
        />,
      )
    }
  }

  const height = matches * (matchHeight + gap) - gap

  return (
    <svg width={connectorWidth} height={height} className="shrink-0" preserveAspectRatio="xMidYMid meet">
      {lines}
    </svg>
  )
}

export function KnockoutBracket({ matches, setMatches, teamsMap, onScoreChange }: KnockoutBracketProps) {
  const [zoom, setZoom] = useState(1)
  const [mobileRound, setMobileRound] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const round32 = matches.filter((m) => m.stage === "round32")
  const round16 = matches.filter((m) => m.stage === "round16")
  const quarters = matches.filter((m) => m.stage === "quarter")
  const semis = matches.filter((m) => m.stage === "semi")
  const third = matches.find((m) => m.stage === "third")
  const final = matches.find((m) => m.stage === "final")

  const leftR32 = round32.slice(0, 8)
  const rightR32 = round32.slice(8, 16)
  const leftR16 = round16.slice(0, 4)
  const rightR16 = round16.slice(4, 8)
  const leftQF = quarters.slice(0, 2)
  const rightQF = quarters.slice(2, 4)
  const leftSF = semis.slice(0, 1)
  const rightSF = semis.slice(1, 2)

  const mobileRounds = [
    { title: "Round of 32", matches: round32 },
    { title: "Round of 16", matches: round16 },
    { title: "Quarter-Finals", matches: quarters },
    { title: "Semi-Finals", matches: semis },
    { title: "Finals", matches: [final, third].filter(Boolean) as Match[] },
  ]

  // Auto-advance winners
  useEffect(() => {
    const getWinner = (match: Match): string => {
      if (match.team1Score === null || match.team2Score === null) return ""
      if (match.team1Score > match.team2Score) return match.team1Id
      if (match.team2Score > match.team1Score) return match.team2Id
      return ""
    }

    const updatedMatches = [...matches]

    for (let i = 0; i < 8; i++) {
      const r16Match = updatedMatches.find((m) => m.id === `round16-${i + 1}`)
      const r32Match1 = updatedMatches.find((m) => m.id === `round32-${i * 2 + 1}`)
      const r32Match2 = updatedMatches.find((m) => m.id === `round32-${i * 2 + 2}`)
      if (r16Match && r32Match1 && r32Match2) {
        r16Match.team1Id = getWinner(r32Match1)
        r16Match.team2Id = getWinner(r32Match2)
      }
    }

    for (let i = 0; i < 4; i++) {
      const qMatch = updatedMatches.find((m) => m.id === `quarter-${i + 1}`)
      const r16Match1 = updatedMatches.find((m) => m.id === `round16-${i * 2 + 1}`)
      const r16Match2 = updatedMatches.find((m) => m.id === `round16-${i * 2 + 2}`)
      if (qMatch && r16Match1 && r16Match2) {
        qMatch.team1Id = getWinner(r16Match1)
        qMatch.team2Id = getWinner(r16Match2)
      }
    }

    for (let i = 0; i < 2; i++) {
      const sMatch = updatedMatches.find((m) => m.id === `semi-${i + 1}`)
      const qMatch1 = updatedMatches.find((m) => m.id === `quarter-${i * 2 + 1}`)
      const qMatch2 = updatedMatches.find((m) => m.id === `quarter-${i * 2 + 2}`)
      if (sMatch && qMatch1 && qMatch2) {
        sMatch.team1Id = getWinner(qMatch1)
        sMatch.team2Id = getWinner(qMatch2)
      }
    }

    const semi1 = updatedMatches.find((m) => m.id === "semi-1")
    const semi2 = updatedMatches.find((m) => m.id === "semi-2")
    const finalMatch = updatedMatches.find((m) => m.id === "final-1")
    const thirdMatch = updatedMatches.find((m) => m.id === "third-1")

    if (finalMatch && semi1 && semi2) {
      finalMatch.team1Id = getWinner(semi1)
      finalMatch.team2Id = getWinner(semi2)
    }

    if (thirdMatch && semi1 && semi2) {
      thirdMatch.team1Id =
        semi1.team1Score === null || semi1.team2Score === null
          ? ""
          : semi1.team1Score > semi1.team2Score
            ? semi1.team2Id
            : semi1.team1Id
      thirdMatch.team2Id =
        semi2.team1Score === null || semi2.team2Score === null
          ? ""
          : semi2.team1Score > semi2.team2Score
            ? semi2.team2Id
            : semi2.team1Id
    }

    setMatches(updatedMatches)
  }, [matches, setMatches])

  const champion =
    final &&
    (() => {
      if (final.team1Score === null || final.team2Score === null) return ""
      if (final.team1Score > final.team2Score) return final.team1Id
      if (final.team2Score > final.team1Score) return final.team2Id
      return ""
    })()

  const matchHeight = 88
  const r32Gap = 24
  const r16Gap = matchHeight + r32Gap
  const qfGap = matchHeight * 2 + r32Gap * 2
  const sfGap = matchHeight * 4 + r32Gap * 4

  return (
    <div className="space-y-6">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Knockout Stage</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
              disabled={zoom >= 1.5}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setZoom(1)} disabled={zoom === 1}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="overflow-x-auto overflow-y-auto border rounded-lg bg-slate-50 dark:bg-slate-900/30 p-8"
          style={{ maxHeight: "calc(100vh - 300px)" }}
        >
          <div
            className="flex items-start justify-center gap-0 min-w-max"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
          >
            {/* Left Side - Round of 32 */}
            <div className="flex flex-col" style={{ gap: `${r32Gap}px` }}>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-center mb-2">
                Round of 32
              </div>
              {leftR32.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  team1={teamsMap[match.team1Id]}
                  team2={teamsMap[match.team2Id]}
                  onScoreChange={onScoreChange}
                />
              ))}
            </div>

            {/* Connector: R32 → R16 (Left) */}
            <div style={{ paddingTop: "50px" }}>
              <StraightConnector matches={8} direction="right" gap={r32Gap} />
            </div>

            {/* Left Side - Round of 16 */}
            <div
              className="flex flex-col"
              style={{ gap: `${r16Gap}px`, paddingTop: `${matchHeight / 2 + r32Gap / 2 + 50}px` }}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-center mb-2 absolute -top-4">
                Round of 16
              </div>
              {leftR16.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  team1={teamsMap[match.team1Id]}
                  team2={teamsMap[match.team2Id]}
                  onScoreChange={onScoreChange}
                />
              ))}
            </div>

            {/* Connector: R16 → QF (Left) */}
            <div style={{ paddingTop: `${matchHeight / 2 + r32Gap / 2 + 50}px` }}>
              <StraightConnector matches={4} direction="right" gap={r16Gap} />
            </div>

            {/* Left Side - Quarter Finals */}
            <div
              className="flex flex-col"
              style={{ gap: `${qfGap}px`, paddingTop: `${matchHeight + r32Gap + r16Gap / 2 + 50}px` }}
            >
              {leftQF.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  team1={teamsMap[match.team1Id]}
                  team2={teamsMap[match.team2Id]}
                  onScoreChange={onScoreChange}
                />
              ))}
            </div>

            {/* Connector: QF → SF (Left) */}
            <div style={{ paddingTop: `${matchHeight + r32Gap + r16Gap / 2 + 50}px` }}>
              <StraightConnector matches={2} direction="right" gap={qfGap} />
            </div>

            {/* Left Side - Semi Final */}
            <div
              className="flex flex-col"
              style={{ paddingTop: `${matchHeight * 1.5 + r32Gap + r16Gap + qfGap / 2 + 50}px` }}
            >
              {leftSF.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  team1={teamsMap[match.team1Id]}
                  team2={teamsMap[match.team2Id]}
                  onScoreChange={onScoreChange}
                />
              ))}
            </div>

            {/* Connector: SF → Final (Left) */}
            <div style={{ paddingTop: `${matchHeight * 1.5 + r32Gap + r16Gap + qfGap / 2 + 50}px` }}>
              <StraightConnector matches={1} direction="right" gap={sfGap} />
            </div>

            {/* Final & Third Place */}
            <div
              className="flex flex-col items-center gap-6"
              style={{ paddingTop: `${matchHeight * 2 + r32Gap + r16Gap + qfGap + 50}px` }}
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-center mb-3">
                  Final
                </div>
                {final && (
                  <MatchCard
                    match={final}
                    team1={teamsMap[final.team1Id]}
                    team2={teamsMap[final.team2Id]}
                    onScoreChange={onScoreChange}
                    isFinal={true}
                  />
                )}
              </div>
              {third && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 text-center mb-3">
                    3rd Place
                  </div>
                  <MatchCard
                    match={third}
                    team1={teamsMap[third.team1Id]}
                    team2={teamsMap[third.team2Id]}
                    onScoreChange={onScoreChange}
                    isThirdPlace={true}
                  />
                </div>
              )}
            </div>

            {/* Connector: SF → Final (Right) */}
            <div style={{ paddingTop: `${matchHeight * 1.5 + r32Gap + r16Gap + qfGap / 2 + 50}px` }}>
              <StraightConnector matches={1} direction="left" gap={sfGap} />
            </div>

            {/* Right Side - Semi Final */}
            <div
              className="flex flex-col"
              style={{ paddingTop: `${matchHeight * 1.5 + r32Gap + r16Gap + qfGap / 2 + 50}px` }}
            >
              {rightSF.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  team1={teamsMap[match.team1Id]}
                  team2={teamsMap[match.team2Id]}
                  onScoreChange={onScoreChange}
                />
              ))}
            </div>

            {/* Connector: QF → SF (Right) */}
            <div style={{ paddingTop: `${matchHeight + r32Gap + r16Gap / 2 + 50}px` }}>
              <StraightConnector matches={2} direction="left" gap={qfGap} />
            </div>

            {/* Right Side - Quarter Finals */}
            <div
              className="flex flex-col"
              style={{ gap: `${qfGap}px`, paddingTop: `${matchHeight + r32Gap + r16Gap / 2 + 50}px` }}
            >
              {rightQF.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  team1={teamsMap[match.team1Id]}
                  team2={teamsMap[match.team2Id]}
                  onScoreChange={onScoreChange}
                />
              ))}
            </div>

            {/* Connector: R16 → QF (Right) */}
            <div style={{ paddingTop: `${matchHeight / 2 + r32Gap / 2 + 50}px` }}>
              <StraightConnector matches={4} direction="left" gap={r16Gap} />
            </div>

            {/* Right Side - Round of 16 */}
            <div
              className="flex flex-col"
              style={{ gap: `${r16Gap}px`, paddingTop: `${matchHeight / 2 + r32Gap / 2 + 50}px` }}
            >
              {rightR16.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  team1={teamsMap[match.team1Id]}
                  team2={teamsMap[match.team2Id]}
                  onScoreChange={onScoreChange}
                />
              ))}
            </div>

            {/* Connector: R32 → R16 (Right) */}
            <div style={{ paddingTop: "50px" }}>
              <StraightConnector matches={8} direction="left" gap={r32Gap} />
            </div>

            {/* Right Side - Round of 32 */}
            <div className="flex flex-col" style={{ gap: `${r32Gap}px` }}>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-center mb-2">
                Round of 32
              </div>
              {rightR32.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  team1={teamsMap[match.team1Id]}
                  team2={teamsMap[match.team2Id]}
                  onScoreChange={onScoreChange}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Champion Display */}
        {champion && (
          <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border-2 border-amber-400 dark:border-amber-600 rounded-lg">
            <div className="flex items-center justify-center gap-4">
              <Trophy className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              <div className="text-center">
                <div className="text-sm font-semibold text-amber-800 dark:text-amber-200 uppercase tracking-wider">
                  World Cup Champion
                </div>
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2 mt-1">
                  <span className="text-3xl">{teamsMap[champion].flag}</span>
                  {teamsMap[champion].name}
                </div>
              </div>
              <Trophy className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        <h2 className="text-2xl font-bold">Knockout Stage</h2>

        <div className="flex items-center justify-between border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileRound(Math.max(0, mobileRound - 1))}
            disabled={mobileRound === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">{mobileRounds[mobileRound].title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileRound(Math.min(mobileRounds.length - 1, mobileRound + 1))}
            disabled={mobileRound === mobileRounds.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center gap-1.5 py-2">
          {mobileRounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setMobileRound(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                index === mobileRound ? "w-8 bg-primary" : "w-2 bg-slate-300 dark:bg-slate-600",
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mobileRounds[mobileRound].matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              team1={teamsMap[match.team1Id]}
              team2={teamsMap[match.team2Id]}
              onScoreChange={onScoreChange}
              isFinal={match.stage === "final"}
              isThirdPlace={match.stage === "third"}
            />
          ))}
        </div>

        {champion && (
          <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border-2 border-amber-400 dark:border-amber-600 rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <Trophy className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              <div className="text-center">
                <div className="text-sm font-semibold text-amber-800 dark:text-amber-200 uppercase tracking-wider">
                  World Cup Champion
                </div>
                <div className="text-xl font-bold text-amber-900 dark:text-amber-100 flex items-center justify-center gap-2 mt-1">
                  <span className="text-2xl">{teamsMap[champion].flag}</span>
                  {teamsMap[champion].name}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
