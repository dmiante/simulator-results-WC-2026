"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Trophy, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Match, Team } from "@/lib/tournament-data"
import type { JSX } from "react/jsx-runtime"

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
  team1: Team | undefined
  team2: Team | undefined
  onScoreChange: (matchId: string, team: "team1" | "team2", score: number | null) => void
  isFinal?: boolean
  isThirdPlace?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  const handleChange = (team: "team1" | "team2", value: string) => {
    const score = value === "" ? null : Math.max(0, Math.min(99, Number.parseInt(value) || 0))
    onScoreChange(match.id, team, score)
  }

  const getWinner = () => {
    if (match.team1Score === null || match.team2Score === null) return null
    if (match.team1Score > match.team2Score) return "team1"
    if (match.team2Score > match.team1Score) return "team2"
    return "draw"
  }

  const winner = getWinner()
  const isComplete = match.team1Score !== null && match.team2Score !== null

  return (
    <div
      className={cn(
        "w-[170px] rounded-lg overflow-hidden transition-all duration-200 backdrop-blur-sm",
        isFinal
          ? "border-2 border-primary/60 bg-gradient-to-b from-primary/15 to-primary/5 shadow-lg ring-2 ring-primary/20"
          : isThirdPlace
            ? "border border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-transparent shadow-md"
            : "border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-slate-50 to-slate-50/50 dark:from-slate-800/50 dark:to-slate-900/50",
        isHovered && "shadow-xl ring-1 ring-primary/30 scale-105",
        isComplete &&
          !isFinal &&
          !isThirdPlace &&
          "border-green-500/40 bg-gradient-to-b from-green-500/8 to-green-500/4",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(isFinal || isThirdPlace) && (
        <div
          className={cn(
            "text-[10px] font-bold uppercase tracking-widest text-center py-1.5 px-2",
            isFinal && "bg-gradient-to-r from-primary/20 to-primary/10 text-primary",
            isThirdPlace && "bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-600",
          )}
        >
          {isFinal ? "🏆 Final" : "3️⃣ 3rd Place"}
        </div>
      )}

      <div
        className={cn(
          "flex items-center gap-2 px-2.5 py-2 border-b border-slate-200 dark:border-slate-700 transition-colors",
          winner === "team1"
            ? "bg-gradient-to-r from-green-500/20 to-green-500/5 dark:from-green-500/15 dark:to-green-500/5"
            : isHovered && "bg-slate-100 dark:bg-slate-700/50",
        )}
      >
        {team1 ? (
          <>
            <span className="text-lg shrink-0">{team1.flag}</span>
            <span
              className={cn(
                "text-xs font-semibold flex-1 truncate transition-colors",
                winner === "team1" ? "text-foreground font-bold" : "text-muted-foreground",
              )}
            >
              {team1.code}
            </span>
          </>
        ) : (
          <span className="text-xs text-muted-foreground/40 flex-1 italic">TBD</span>
        )}
        <Input
          type="number"
          min={0}
          max={99}
          value={match.team1Score ?? ""}
          onChange={(e) => handleChange("team1", e.target.value)}
          className={cn(
            "w-8 h-7 text-center p-0.5 text-xs font-bold border-0 rounded transition-all",
            winner === "team1"
              ? "bg-green-500/30 text-green-700 dark:text-green-300 ring-1 ring-green-500/50"
              : "bg-slate-200/60 dark:bg-slate-700/60 text-foreground hover:bg-slate-300/60 dark:hover:bg-slate-600/60",
          )}
          placeholder="-"
          disabled={!team1 || !team2}
        />
      </div>

      <div
        className={cn(
          "flex items-center gap-2 px-2.5 py-2 transition-colors",
          winner === "team2"
            ? "bg-gradient-to-r from-green-500/20 to-green-500/5 dark:from-green-500/15 dark:to-green-500/5"
            : isHovered && "bg-slate-100 dark:bg-slate-700/50",
        )}
      >
        {team2 ? (
          <>
            <span className="text-lg shrink-0">{team2.flag}</span>
            <span
              className={cn(
                "text-xs font-semibold flex-1 truncate transition-colors",
                winner === "team2" ? "text-foreground font-bold" : "text-muted-foreground",
              )}
            >
              {team2.code}
            </span>
          </>
        ) : (
          <span className="text-xs text-muted-foreground/40 flex-1 italic">TBD</span>
        )}
        <Input
          type="number"
          min={0}
          max={99}
          value={match.team2Score ?? ""}
          onChange={(e) => handleChange("team2", e.target.value)}
          className={cn(
            "w-8 h-7 text-center p-0.5 text-xs font-bold border-0 rounded transition-all",
            winner === "team2"
              ? "bg-green-500/30 text-green-700 dark:text-green-300 ring-1 ring-green-500/50"
              : "bg-slate-200/60 dark:bg-slate-700/60 text-foreground hover:bg-slate-300/60 dark:hover:bg-slate-600/60",
          )}
          placeholder="-"
          disabled={!team1 || !team2}
        />
      </div>
    </div>
  )
}

function CurvedConnector({
  y1,
  y2,
  connectorWidth = 40,
  direction = "right",
}: {
  y1: number
  y2: number
  connectorWidth?: number
  direction?: "left" | "right"
}) {
  const midY = (y1 + y2) / 2
  const controlX = connectorWidth / 2

  if (direction === "right") {
    return (
      <path
        d={`M 0 ${y1} Q ${controlX} ${y1} ${controlX} ${midY} T ${connectorWidth} ${midY}
                 M 0 ${y2} Q ${controlX} ${y2} ${controlX} ${midY}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-slate-300 dark:text-slate-600"
      />
    )
  } else {
    return (
      <path
        d={`M ${connectorWidth} ${y1} Q ${controlX} ${y1} ${controlX} ${midY} T 0 ${midY}
                 M ${connectorWidth} ${y2} Q ${controlX} ${y2} ${controlX} ${midY}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-slate-300 dark:text-slate-600"
      />
    )
  }
}

function BracketConnectors({
  matchCount,
  startY,
  matchHeight,
  gap,
  direction,
}: {
  matchCount: number
  startY: number
  matchHeight: number
  gap: number
  direction: "left" | "right"
}) {
  const paths: JSX.Element[] = []
  const connectorWidth = 40

  for (let i = 0; i < matchCount; i += 2) {
    const y1 = startY + i * (matchHeight + gap) + matchHeight / 2
    const y2 = startY + (i + 1) * (matchHeight + gap) + matchHeight / 2

    paths.push(
      <CurvedConnector key={`connector-${i}`} y1={y1} y2={y2} connectorWidth={connectorWidth} direction={direction} />,
    )
  }

  return (
    <svg
      width={connectorWidth}
      className="shrink-0"
      style={{ height: startY * 2 + matchCount * (matchHeight + gap) - gap }}
      viewBox={`0 0 ${connectorWidth} ${startY * 2 + matchCount * (matchHeight + gap) - gap}`}
      preserveAspectRatio="none"
    >
      {paths}
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

  useEffect(() => {
    const getWinner = (match: Match): string => {
      if (match.team1Score === null || match.team2Score === null) return ""
      if (match.team1Score > match.team2Score) return match.team1Id
      if (match.team2Score > match.team1Score) return match.team2Id
      return ""
    }

    const getLoser = (match: Match): string => {
      if (match.team1Score === null || match.team2Score === null) return ""
      if (match.team1Score < match.team2Score) return match.team1Id
      if (match.team2Score < match.team1Score) return match.team2Id
      return ""
    }

    setMatches((prev) => {
      const updated = [...prev]

      for (let i = 0; i < 8; i++) {
        const r16Match = updated.find((m) => m.id === `round16-${i + 1}`)
        const r32Match1 = updated.find((m) => m.id === `round32-${i * 2 + 1}`)
        const r32Match2 = updated.find((m) => m.id === `round32-${i * 2 + 2}`)
        if (r16Match && r32Match1 && r32Match2) {
          r16Match.team1Id = getWinner(r32Match1)
          r16Match.team2Id = getWinner(r32Match2)
        }
      }

      for (let i = 0; i < 4; i++) {
        const qMatch = updated.find((m) => m.id === `quarter-${i + 1}`)
        const r16Match1 = updated.find((m) => m.id === `round16-${i * 2 + 1}`)
        const r16Match2 = updated.find((m) => m.id === `round16-${i * 2 + 2}`)
        if (qMatch && r16Match1 && r16Match2) {
          qMatch.team1Id = getWinner(r16Match1)
          qMatch.team2Id = getWinner(r16Match2)
        }
      }

      for (let i = 0; i < 2; i++) {
        const sMatch = updated.find((m) => m.id === `semi-${i + 1}`)
        const qMatch1 = updated.find((m) => m.id === `quarter-${i * 2 + 1}`)
        const qMatch2 = updated.find((m) => m.id === `quarter-${i * 2 + 2}`)
        if (sMatch && qMatch1 && qMatch2) {
          sMatch.team1Id = getWinner(qMatch1)
          sMatch.team2Id = getWinner(qMatch2)
        }
      }

      const semi1 = updated.find((m) => m.id === "semi-1")
      const semi2 = updated.find((m) => m.id === "semi-2")
      const finalMatch = updated.find((m) => m.id === "final-1")
      const thirdMatch = updated.find((m) => m.id === "third-1")

      if (finalMatch && semi1 && semi2) {
        finalMatch.team1Id = getWinner(semi1)
        finalMatch.team2Id = getWinner(semi2)
      }

      if (thirdMatch && semi1 && semi2) {
        thirdMatch.team1Id = getLoser(semi1)
        thirdMatch.team2Id = getLoser(semi2)
      }

      return updated
    })
  }, [matches.filter((m) => m.team1Score !== null && m.team2Score !== null).length, setMatches])

  const champion = (() => {
    if (!final || final.team1Score === null || final.team2Score === null) return null
    if (final.team1Score > final.team2Score) return teamsMap[final.team1Id]
    if (final.team2Score > final.team1Score) return teamsMap[final.team2Id]
    return null
  })()

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(1.5, prev + delta)))
  }

  const resetZoom = () => setZoom(1)

  const matchHeight = 60
  const r32Gap = 12
  const r16Gap = 100
  const qfGap = 260
  const sfGap = 580

  return (
    <div className="space-y-6">
      {champion && (
        <div className="relative overflow-hidden rounded-xl border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-transparent to-transparent p-8 text-center shadow-lg">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl -z-10" />
          </div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 mb-4 shadow-md">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">World Champion 2026</h2>
          <div className="flex items-center justify-center gap-4">
            <span className="text-5xl animate-bounce">{champion.flag}</span>
            <span className="text-3xl font-bold text-primary">{champion.name}</span>
          </div>
        </div>
      )}

      <div className="hidden lg:block space-y-4">
        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-muted-foreground font-medium">Scroll horizontally to explore the bracket</div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => handleZoom(-0.1)} className="hover:bg-primary/10">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold w-14 text-center text-foreground">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={() => handleZoom(0.1)} className="hover:bg-primary/10">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />
            <Button variant="outline" size="sm" onClick={resetZoom} className="hover:bg-primary/10 bg-transparent">
              <Maximize2 className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="overflow-x-auto overflow-y-auto border rounded-xl bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-950/50 p-8 shadow-lg"
          style={{ maxHeight: "calc(100vh - 300px)" }}
        >
          <div
            className="flex items-start justify-center gap-0 min-w-max transition-transform"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
          >
            <div className="flex flex-col gap-3">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center mb-2 bg-slate-200/60 dark:bg-slate-700/60 px-3 py-1.5 rounded-full w-full">
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

            <div className="pt-12">
              <BracketConnectors matchCount={8} startY={0} matchHeight={matchHeight} gap={r32Gap} direction="right" />
            </div>

            <div
              className="flex flex-col justify-around"
              style={{ gap: r16Gap, paddingTop: matchHeight / 2 + r32Gap / 2 + 48 }}
            >
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center mb-2 bg-slate-200/60 dark:bg-slate-700/60 px-3 py-1.5 rounded-full absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
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

            <div style={{ paddingTop: matchHeight / 2 + r32Gap / 2 + 48 }}>
              <BracketConnectors matchCount={4} startY={0} matchHeight={matchHeight} gap={r16Gap} direction="right" />
            </div>

            <div
              className="flex flex-col justify-around"
              style={{ gap: qfGap, paddingTop: matchHeight + r32Gap + r16Gap / 2 + 48 }}
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

            <div style={{ paddingTop: matchHeight + r32Gap + r16Gap / 2 + 48 }}>
              <BracketConnectors matchCount={2} startY={0} matchHeight={matchHeight} gap={qfGap} direction="right" />
            </div>

            <div
              className="flex flex-col justify-center"
              style={{ paddingTop: matchHeight * 1.5 + r32Gap + r16Gap + qfGap / 2 + 48 }}
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

            <div
              style={{
                paddingTop: matchHeight * 2 + r32Gap + r16Gap + qfGap + sfGap / 2 + 48,
              }}
            >
              <BracketConnectors matchCount={1} startY={0} matchHeight={matchHeight} gap={sfGap} direction="right" />
            </div>

            <div
              className="flex flex-col justify-center"
              style={{
                paddingTop: matchHeight * 2.5 + r32Gap + r16Gap + qfGap + sfGap + 48,
              }}
            >
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

            <div
              style={{
                paddingTop: matchHeight * 2 + r32Gap + r16Gap + qfGap + sfGap / 2 + 48,
              }}
            >
              <BracketConnectors matchCount={1} startY={0} matchHeight={matchHeight} gap={sfGap} direction="left" />
            </div>

            <div
              className="flex flex-col justify-center"
              style={{ paddingTop: matchHeight * 1.5 + r32Gap + r16Gap + qfGap / 2 + 48 }}
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

            <div style={{ paddingTop: matchHeight + r32Gap + r16Gap / 2 + 48 }}>
              <BracketConnectors matchCount={2} startY={0} matchHeight={matchHeight} gap={qfGap} direction="left" />
            </div>

            <div
              className="flex flex-col justify-around"
              style={{ gap: qfGap, paddingTop: matchHeight + r32Gap + r16Gap / 2 + 48 }}
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

            <div style={{ paddingTop: matchHeight / 2 + r32Gap / 2 + 48 }}>
              <BracketConnectors matchCount={4} startY={0} matchHeight={matchHeight} gap={r16Gap} direction="left" />
            </div>

            <div
              className="flex flex-col justify-around"
              style={{ gap: r16Gap, paddingTop: matchHeight / 2 + r32Gap / 2 + 48 }}
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

            <div className="pt-12">
              <BracketConnectors matchCount={8} startY={0} matchHeight={matchHeight} gap={r32Gap} direction="left" />
            </div>

            <div className="flex flex-col gap-3">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center mb-2 bg-slate-200/60 dark:bg-slate-700/60 px-3 py-1.5 rounded-full w-full">
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
      </div>

      <div className="lg:hidden space-y-4">
        <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent rounded-lg p-3 border border-primary/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileRound((prev) => Math.max(0, prev - 1))}
            disabled={mobileRound === 0}
            className="hover:bg-primary/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm font-bold text-foreground text-center flex-1">
            {mobileRounds[mobileRound].title}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileRound((prev) => Math.min(mobileRounds.length - 1, prev + 1))}
            disabled={mobileRound === mobileRounds.length - 1}
            className="hover:bg-primary/20"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex justify-center gap-2">
          {mobileRounds.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setMobileRound(idx)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-200",
                idx === mobileRound ? "bg-primary w-8" : "bg-muted-foreground/40 hover:bg-muted-foreground/60",
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-700">
          {mobileRounds[mobileRound].matches.map((match) => (
            <div key={match.id} className="flex justify-center">
              <MatchCard
                match={match}
                team1={teamsMap[match.team1Id]}
                team2={teamsMap[match.team2Id]}
                onScoreChange={onScoreChange}
                isFinal={match.stage === "final"}
                isThirdPlace={match.stage === "third"}
              />
            </div>
          ))}
        </div>

        <div className="text-center text-xs font-medium text-muted-foreground">
          Round {mobileRound + 1} of {mobileRounds.length}
        </div>
      </div>
    </div>
  )
}
