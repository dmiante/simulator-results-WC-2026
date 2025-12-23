"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Trophy, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Match, Team } from "@/lib/tournament-data"

interface KnockoutBracketProps {
  matches: Match[]
  setMatches: (matches: Match[]) => void
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
        "rounded-lg border-2 overflow-hidden transition-all",
        "bg-slate-900 border-slate-600/50",
        isFinal && "border-amber-500/70 shadow-lg shadow-amber-500/20",
        isThirdPlace && "border-orange-500/50",
        !isFinal && !isThirdPlace && "hover:border-slate-500",
      )}
      style={{ width: "200px", height: "80px" }}
    >
      <div className="flex flex-col h-full">
        {/* Team 1 */}
        <div
          className={cn(
            "flex items-center justify-between px-3 py-2 border-b border-slate-700/50 h-1/2",
            winner === "team1" && "bg-emerald-900/40",
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {!isTeam1TBD && <span className="text-base shrink-0">{team1.flag}</span>}
            <span
              className={cn(
                "text-sm font-medium truncate text-slate-200",
                isTeam1TBD && "text-slate-500 italic",
                winner === "team1" && "font-bold text-emerald-300",
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
              "w-10 h-6 text-center text-xs font-bold bg-slate-800 border-slate-600 text-white",
              winner === "team1" && "bg-emerald-800 border-emerald-600",
            )}
            placeholder="-"
            disabled={isTeam1TBD}
          />
        </div>

        {/* Team 2 */}
        <div
          className={cn("flex items-center justify-between px-3 py-2 h-1/2", winner === "team2" && "bg-emerald-900/40")}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {!isTeam2TBD && <span className="text-base shrink-0">{team2.flag}</span>}
            <span
              className={cn(
                "text-sm font-medium truncate text-slate-200",
                isTeam2TBD && "text-slate-500 italic",
                winner === "team2" && "font-bold text-emerald-300",
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
              "w-10 h-6 text-center text-xs font-bold bg-slate-800 border-slate-600 text-white",
              winner === "team2" && "bg-emerald-800 border-emerald-600",
            )}
            placeholder="-"
            disabled={isTeam2TBD}
          />
        </div>
      </div>
    </div>
  )
}

function BracketConnector({
  matchCount,
  matchHeight,
  gap,
  connectorWidth,
  direction = "right",
}: {
  matchCount: number
  matchHeight: number
  gap: number
  connectorWidth: number
  direction?: "left" | "right"
}) {
  const paths: React.ReactElement[] = []
  const pairCount = matchCount / 2

  for (let i = 0; i < pairCount; i++) {
    const matchIndex1 = i * 2
    const matchIndex2 = i * 2 + 1

    // Calculate Y positions at exact center of each match box
    const y1 = matchIndex1 * (matchHeight + gap) + matchHeight / 2
    const y2 = matchIndex2 * (matchHeight + gap) + matchHeight / 2
    const midY = (y1 + y2) / 2

    const midX = connectorWidth / 2
    const startX = direction === "right" ? 0 : connectorWidth
    const endX = direction === "right" ? connectorWidth : 0

    // Horizontal from first match to vertical line
    paths.push(<line key={`h1-${i}`} x1={startX} y1={y1} x2={midX} y2={y1} stroke="#4a5568" strokeWidth="2" />)

    // Horizontal from second match to vertical line
    paths.push(<line key={`h2-${i}`} x1={startX} y1={y2} x2={midX} y2={y2} stroke="#4a5568" strokeWidth="2" />)

    // Vertical line connecting the pair
    paths.push(<line key={`v-${i}`} x1={midX} y1={y1} x2={midX} y2={y2} stroke="#4a5568" strokeWidth="2" />)

    // Horizontal from vertical line to next round
    paths.push(<line key={`h3-${i}`} x1={midX} y1={midY} x2={endX} y2={midY} stroke="#4a5568" strokeWidth="2" />)
  }

  const totalHeight = matchCount * (matchHeight + gap) - gap

  return (
    <svg width={connectorWidth} height={totalHeight} className="shrink-0">
      {paths}
    </svg>
  )
}

function SingleConnector({
  matchHeight,
  gap,
  connectorWidth,
  direction = "right",
}: {
  matchHeight: number
  gap: number
  connectorWidth: number
  direction?: "left" | "right"
}) {
  const y1 = matchHeight / 2
  const y2 = matchHeight + gap + matchHeight / 2
  const midY = (y1 + y2) / 2
  const totalHeight = 2 * matchHeight + gap

  const midX = connectorWidth / 2
  const startX = direction === "right" ? 0 : connectorWidth
  const endX = direction === "right" ? connectorWidth : 0

  return (
    <svg width={connectorWidth} height={totalHeight} className="shrink-0">
      <line x1={startX} y1={y1} x2={midX} y2={y1} stroke="#4a5568" strokeWidth="2" />
      <line x1={startX} y1={y2} x2={midX} y2={y2} stroke="#4a5568" strokeWidth="2" />
      <line x1={midX} y1={y1} x2={midX} y2={y2} stroke="#4a5568" strokeWidth="2" />
      <line x1={midX} y1={midY} x2={endX} y2={midY} stroke="#4a5568" strokeWidth="2" />
    </svg>
  )
}

export function KnockoutBracket({ matches, setMatches, teamsMap, onScoreChange }: KnockoutBracketProps) {
  const [zoom, setZoom] = useState(0.85)
  const [mobileRound, setMobileRound] = useState(0)

  const round32 = matches.filter((m) => m.stage === "round32")
  const round16 = matches.filter((m) => m.stage === "round16")
  const quarters = matches.filter((m) => m.stage === "quarter")
  const semis = matches.filter((m) => m.stage === "semi")
  const third = matches.find((m) => m.stage === "third")
  const final = matches.find((m) => m.stage === "final")

  // Split for left/right bracket
  const leftR32 = round32.slice(0, 8)
  const rightR32 = round32.slice(8, 16)
  const leftR16 = round16.slice(0, 4)
  const rightR16 = round16.slice(4, 8)
  const leftQF = quarters.slice(0, 2)
  const rightQF = quarters.slice(2, 4)
  const leftSF = semis.slice(0, 1)
  const rightSF = semis.slice(1, 2)

  // Mobile rounds
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

    setMatches((currentMatches) => {
      const updatedMatches = [...currentMatches]
      let hasChanges = false

      // Round of 16 from Round of 32
      for (let i = 0; i < 8; i++) {
        const r16Match = updatedMatches.find((m) => m.id === `round16-${i + 1}`)
        const r32Match1 = updatedMatches.find((m) => m.id === `round32-${i * 2 + 1}`)
        const r32Match2 = updatedMatches.find((m) => m.id === `round32-${i * 2 + 2}`)
        if (r16Match && r32Match1 && r32Match2) {
          const winner1 = getWinner(r32Match1)
          const winner2 = getWinner(r32Match2)
          if (r16Match.team1Id !== winner1 || r16Match.team2Id !== winner2) {
            r16Match.team1Id = winner1
            r16Match.team2Id = winner2
            hasChanges = true
          }
        }
      }

      // Quarter-finals from Round of 16
      for (let i = 0; i < 4; i++) {
        const qMatch = updatedMatches.find((m) => m.id === `quarter-${i + 1}`)
        const r16Match1 = updatedMatches.find((m) => m.id === `round16-${i * 2 + 1}`)
        const r16Match2 = updatedMatches.find((m) => m.id === `round16-${i * 2 + 2}`)
        if (qMatch && r16Match1 && r16Match2) {
          const winner1 = getWinner(r16Match1)
          const winner2 = getWinner(r16Match2)
          if (qMatch.team1Id !== winner1 || qMatch.team2Id !== winner2) {
            qMatch.team1Id = winner1
            qMatch.team2Id = winner2
            hasChanges = true
          }
        }
      }

      // Semi-finals from Quarter-finals
      for (let i = 0; i < 2; i++) {
        const sMatch = updatedMatches.find((m) => m.id === `semi-${i + 1}`)
        const qMatch1 = updatedMatches.find((m) => m.id === `quarter-${i * 2 + 1}`)
        const qMatch2 = updatedMatches.find((m) => m.id === `quarter-${i * 2 + 2}`)
        if (sMatch && qMatch1 && qMatch2) {
          const winner1 = getWinner(qMatch1)
          const winner2 = getWinner(qMatch2)
          if (sMatch.team1Id !== winner1 || sMatch.team2Id !== winner2) {
            sMatch.team1Id = winner1
            sMatch.team2Id = winner2
            hasChanges = true
          }
        }
      }

      // Final from Semi-finals
      const semi1 = updatedMatches.find((m) => m.id === "semi-1")
      const semi2 = updatedMatches.find((m) => m.id === "semi-2")
      const finalMatch = updatedMatches.find((m) => m.id === "final-1")
      const thirdMatch = updatedMatches.find((m) => m.id === "third-1")

      if (finalMatch && semi1 && semi2) {
        const winner1 = getWinner(semi1)
        const winner2 = getWinner(semi2)
        if (finalMatch.team1Id !== winner1 || finalMatch.team2Id !== winner2) {
          finalMatch.team1Id = winner1
          finalMatch.team2Id = winner2
          hasChanges = true
        }
      }

      // Third Place match (losers from Semi-finals)
      if (thirdMatch && semi1 && semi2) {
        const loser1 =
          semi1.team1Score === null || semi1.team2Score === null
            ? ""
            : semi1.team1Score > semi1.team2Score
              ? semi1.team2Id
              : semi1.team1Id
        const loser2 =
          semi2.team1Score === null || semi2.team2Score === null
            ? ""
            : semi2.team1Score > semi2.team2Score
              ? semi2.team2Id
              : semi2.team1Id
        if (thirdMatch.team1Id !== loser1 || thirdMatch.team2Id !== loser2) {
          thirdMatch.team1Id = loser1
          thirdMatch.team2Id = loser2
          hasChanges = true
        }
      }

      return hasChanges ? updatedMatches : currentMatches
    })
  }, [setMatches])

  const champion =
    final &&
    (() => {
      if (final.team1Score === null || final.team2Score === null) return ""
      if (final.team1Score > final.team2Score) return final.team1Id
      if (final.team2Score > final.team1Score) return final.team2Id
      return ""
    })()

  const matchHeight = 80
  const r32Gap = 16
  const r16Gap = matchHeight + r32Gap + 16
  const qfGap = (matchHeight + r32Gap) * 2 + r32Gap + 16
  const sfGap = (matchHeight + r32Gap) * 4 + r32Gap * 2 + 16
  const connectorWidth = 32

  // Calculate offsets for centering each round
  const r16Offset = (matchHeight + r32Gap) / 2
  const qfOffset = r16Offset + (matchHeight + r16Gap) / 2
  const sfOffset = qfOffset + (matchHeight + qfGap) / 2

  return (
    <div className="space-y-6">
      {/* Desktop View */}
      <div className="hidden lg:block">
        {/* Zoom Controls */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center text-slate-300">{Math.round(zoom * 100)}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
            className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(0.85)}
            className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div
          className="overflow-x-auto overflow-y-auto rounded-xl bg-slate-950 border border-slate-800"
          style={{ maxHeight: "calc(100vh - 280px)" }}
        >
          {/* Round Headers */}
          <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-8 py-3">
            <div
              className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400"
              style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
            >
              <span style={{ width: "200px", textAlign: "center" }}>Round of 32</span>
              <span style={{ width: "200px", textAlign: "center" }}>Round of 16</span>
              <span style={{ width: "200px", textAlign: "center" }}>Quarter-Finals</span>
              <span style={{ width: "200px", textAlign: "center" }}>Semi-Finals</span>
              <span style={{ width: "200px", textAlign: "center" }}>Final</span>
              <span style={{ width: "200px", textAlign: "center" }}>Semi-Finals</span>
              <span style={{ width: "200px", textAlign: "center" }}>Quarter-Finals</span>
              <span style={{ width: "200px", textAlign: "center" }}>Round of 16</span>
              <span style={{ width: "200px", textAlign: "center" }}>Round of 32</span>
            </div>
          </div>

          <div className="p-8">
            <div
              className="flex items-start justify-center min-w-max"
              style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
            >
              {/* LEFT BRACKET */}

              {/* Left R32 */}
              <div className="flex flex-col" style={{ gap: `${r32Gap}px` }}>
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

              {/* Connector R32 -> R16 */}
              <BracketConnector matchCount={8} matchHeight={matchHeight} gap={r32Gap} connectorWidth={connectorWidth} />

              {/* Left R16 */}
              <div className="flex flex-col" style={{ gap: `${r16Gap}px`, paddingTop: `${r16Offset}px` }}>
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

              {/* Connector R16 -> QF */}
              <div style={{ paddingTop: `${r16Offset}px` }}>
                <BracketConnector
                  matchCount={4}
                  matchHeight={matchHeight}
                  gap={r16Gap}
                  connectorWidth={connectorWidth}
                />
              </div>

              {/* Left QF */}
              <div className="flex flex-col" style={{ gap: `${qfGap}px`, paddingTop: `${qfOffset}px` }}>
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

              {/* Connector QF -> SF */}
              <div style={{ paddingTop: `${qfOffset}px` }}>
                <SingleConnector
                  matchHeight={matchHeight}
                  gap={qfGap}
                  connectorWidth={connectorWidth}
                  direction="right"
                />
              </div>

              {/* Left SF */}
              <div style={{ paddingTop: `${sfOffset}px` }}>
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

              {/* Connector SF -> Final (left) */}
              <div style={{ paddingTop: `${sfOffset}px` }}>
                <svg width={connectorWidth} height={matchHeight} className="shrink-0">
                  <line
                    x1={0}
                    y1={matchHeight / 2}
                    x2={connectorWidth}
                    y2={matchHeight / 2}
                    stroke="#4a5568"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* CENTER - Final & 3rd Place */}
              <div className="flex flex-col items-center gap-8" style={{ paddingTop: `${sfOffset - 60}px` }}>
                {/* Champion Display */}
                {champion && teamsMap[champion] && (
                  <div className="flex flex-col items-center gap-2 animate-in fade-in duration-500">
                    <Trophy className="h-10 w-10 text-amber-400" />
                    <div className="text-3xl">{teamsMap[champion].flag}</div>
                    <div className="text-lg font-bold text-amber-400">{teamsMap[champion].name}</div>
                    <div className="text-xs uppercase tracking-widest text-slate-500">World Champion</div>
                  </div>
                )}

                {/* Final Match */}
                {final && (
                  <MatchCard
                    match={final}
                    team1={teamsMap[final.team1Id]}
                    team2={teamsMap[final.team2Id]}
                    onScoreChange={onScoreChange}
                    isFinal
                  />
                )}

                {/* 3rd Place Match */}
                {third && (
                  <div className="mt-8">
                    <div className="text-xs uppercase tracking-widest text-slate-500 text-center mb-2">3rd Place</div>
                    <MatchCard
                      match={third}
                      team1={teamsMap[third.team1Id]}
                      team2={teamsMap[third.team2Id]}
                      onScoreChange={onScoreChange}
                      isThirdPlace
                    />
                  </div>
                )}
              </div>

              {/* Connector Final -> SF (right) */}
              <div style={{ paddingTop: `${sfOffset}px` }}>
                <svg width={connectorWidth} height={matchHeight} className="shrink-0">
                  <line
                    x1={0}
                    y1={matchHeight / 2}
                    x2={connectorWidth}
                    y2={matchHeight / 2}
                    stroke="#4a5568"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Right SF */}
              <div style={{ paddingTop: `${sfOffset}px` }}>
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

              {/* Connector SF -> QF (right) */}
              <div style={{ paddingTop: `${qfOffset}px` }}>
                <SingleConnector
                  matchHeight={matchHeight}
                  gap={qfGap}
                  connectorWidth={connectorWidth}
                  direction="left"
                />
              </div>

              {/* Right QF */}
              <div className="flex flex-col" style={{ gap: `${qfGap}px`, paddingTop: `${qfOffset}px` }}>
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

              {/* Connector QF -> R16 (right) */}
              <div style={{ paddingTop: `${r16Offset}px` }}>
                <BracketConnector
                  matchCount={4}
                  matchHeight={matchHeight}
                  gap={r16Gap}
                  connectorWidth={connectorWidth}
                  direction="left"
                />
              </div>

              {/* Right R16 */}
              <div className="flex flex-col" style={{ gap: `${r16Gap}px`, paddingTop: `${r16Offset}px` }}>
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

              {/* Connector R16 -> R32 (right) */}
              <BracketConnector
                matchCount={8}
                matchHeight={matchHeight}
                gap={r32Gap}
                connectorWidth={connectorWidth}
                direction="left"
              />

              {/* Right R32 */}
              <div className="flex flex-col" style={{ gap: `${r32Gap}px` }}>
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
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileRound(Math.max(0, mobileRound - 1))}
            disabled={mobileRound === 0}
            className="text-slate-400"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-slate-200">{mobileRounds[mobileRound].title}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileRound(Math.min(mobileRounds.length - 1, mobileRound + 1))}
            disabled={mobileRound === mobileRounds.length - 1}
            className="text-slate-400"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Round Dots */}
        <div className="flex justify-center gap-2 mb-4">
          {mobileRounds.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setMobileRound(idx)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                idx === mobileRound ? "bg-amber-500 w-6" : "bg-slate-600",
              )}
            />
          ))}
        </div>

        {/* Champion on mobile */}
        {mobileRound === 4 && champion && teamsMap[champion] && (
          <div className="flex flex-col items-center gap-2 mb-6 p-4 rounded-lg bg-slate-900 border border-amber-500/30">
            <Trophy className="h-8 w-8 text-amber-400" />
            <span className="text-2xl">{teamsMap[champion].flag}</span>
            <span className="font-bold text-amber-400">{teamsMap[champion].name}</span>
            <span className="text-xs uppercase tracking-widest text-slate-500">World Champion</span>
          </div>
        )}

        {/* Mobile Matches Grid */}
        <div className="grid gap-3">
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
      </div>
    </div>
  )
}
