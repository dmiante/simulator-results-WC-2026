"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"

import { Button } from "@/components/ui/button"
import { Trophy, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { KnockoutBracketProps } from "../types"
import { GroupStanding, Match, Team } from "@/lib/types"
import { MatchCard } from "./match-card"
import { BracketConnector } from "./bracket-connector"
import { SingleConnector } from "./single-connector"

const r32Placeholders: Record<string, { team1: string; team2: string }> = {
  "round32-1": { team1: "1E", team2: "3º ABCDF" },
  "round32-2": { team1: "1I", team2: "3º CDFGH" },
  "round32-3": { team1: "2A", team2: "2B" },
  "round32-4": { team1: "1F", team2: "2C" },
  "round32-5": { team1: "2K", team2: "2L" },
  "round32-6": { team1: "1H", team2: "2J" },
  "round32-7": { team1: "1D", team2: "3º BEFIJ" },
  "round32-8": { team1: "1G", team2: "3º AEHIJ" },
  "round32-9": { team1: "1C", team2: "2F" },
  "round32-10": { team1: "2E", team2: "2I" },
  "round32-11": { team1: "1A", team2: "3º CEFHI" },
  "round32-12": { team1: "1L", team2: "3º EHIJK" },
  "round32-13": { team1: "1J", team2: "2H" },
  "round32-14": { team1: "2D", team2: "2G" },
  "round32-15": { team1: "1B", team2: "3º EFGIJ" },
  "round32-16": { team1: "1K", team2: "3º DEIJL" },
}

// Function to get placeholder for any match based on stage
function getMatchPlaceholders(match: Match): { team1: string; team2: string } {
  if (match.stage === "round32") {
    return r32Placeholders[match.id] || { team1: "TBD", team2: "TBD" }
  }
  
  // For later rounds, show winner references
  const matchNum = parseInt(match.id.split("-")[1])
  
  if (match.stage === "round16") {
    const r32Match1 = `R32-${matchNum * 2 - 1}`
    const r32Match2 = `R32-${matchNum * 2}`
    return { team1: `W${r32Match1}`, team2: `W${r32Match2}` }
  }
  
  if (match.stage === "quarter") {
    const r16Match1 = `R16-${matchNum * 2 - 1}`
    const r16Match2 = `R16-${matchNum * 2}`
    return { team1: `W${r16Match1}`, team2: `W${r16Match2}` }
  }
  
  if (match.stage === "semi") {
    const qfMatch1 = `QF${matchNum * 2 - 1}`
    const qfMatch2 = `QF${matchNum * 2}`
    return { team1: `W${qfMatch1}`, team2: `W${qfMatch2}` }
  }
  
  if (match.stage === "final") {
    return { team1: "WSF1", team2: "WSF2" }
  }
  
  if (match.stage === "third") {
    return { team1: "LSF1", team2: "LSF2" }
  }
  
  return { team1: "TBD", team2: "TBD" }
}

// Function to resolve a placeholder like "1A", "2B" to the actual qualified team
// Only returns the team if they have played all 3 group matches (fully qualified)
function resolveQualifiedTeam(
  placeholder: string,
  groupStandings: Record<string, GroupStanding[]>,
  thirdPlaceRanking: { qualified: GroupStanding[] },
  teamsMap: Record<string, Team>
): Team | null {
  // Check if it's a third place placeholder (e.g., "3º ABCDF")
  if (placeholder.startsWith("3º")) {
    // Only show third place teams that are fully qualified (played all 3 matches)
    const qualifiedThirds = thirdPlaceRanking.qualified
    if (qualifiedThirds.length > 0) {
      // Get groups that could provide this third place
      const possibleGroups = placeholder.replace("3º ", "").split("")
      
      // Find a qualified third from one of these groups
      for (const third of qualifiedThirds) {
        // Only show if played all 3 matches
        if (third.played !== 3) continue
        
        const teamInfo = teamsMap[third.teamId]
        if (teamInfo) {
          // Check if this team's group is in the possible groups
          for (const [groupName, standings] of Object.entries(groupStandings)) {
            const thirdInGroup = standings[2]
            if (thirdInGroup && thirdInGroup.teamId === third.teamId && possibleGroups.includes(groupName)) {
              return teamInfo
            }
          }
        }
      }
    }
    return null
  }

  // Parse position and group (e.g., "1A" -> position 1, group A)
  const match = placeholder.match(/^(\d)([A-L])$/)
  if (!match) return null

  const position = parseInt(match[1]) - 1 // 0-indexed
  const group = match[2]

  const standings = groupStandings[group]
  if (!standings || !standings[position]) return null

  // Only show if the team has played all 3 matches (fully qualified)
  const standing = standings[position]
  if (standing.played !== 3) {
    return null // Don't show provisional - only fully qualified
  }

  return teamsMap[standing.teamId] || null
}


export function KnockoutBracket({ matches, setMatches, teamsMap, onScoreChange, groupStandings, thirdPlaceRanking }: KnockoutBracketProps) {
  const [zoom, setZoom] = useState(1)
  const [mobileRound, setMobileRound] = useState(0)
  const bracketRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [bracketSize, setBracketSize] = useState({ width: 0, height: 0 })
  
  // Drag to pan state
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 })

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

  // Resolve qualified teams for R32 placeholders in real-time
  const resolvedTeams = useMemo(() => {
    const resolved: Record<string, { team1: Team | null; team2: Team | null }> = {}
    
    Object.entries(r32Placeholders).forEach(([matchId, placeholders]) => {
      resolved[matchId] = {
        team1: resolveQualifiedTeam(placeholders.team1, groupStandings, thirdPlaceRanking, teamsMap),
        team2: resolveQualifiedTeam(placeholders.team2, groupStandings, thirdPlaceRanking, teamsMap),
      }
    })
    
    return resolved
  }, [groupStandings, thirdPlaceRanking, teamsMap])

  // Auto-advance winners
  useEffect(() => {
    const getWinner = (match: Match): string => {
      if (match.team1Score === null || match.team2Score === null) return ""
      if (match.team1Score > match.team2Score) return match.team1Id
      if (match.team2Score > match.team1Score) return match.team2Id
      return ""
    }

    setMatches((currentMatches: Match[]) => {
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

  // Measure bracket size for proper scrolling when zoomed
  useEffect(() => {
    if (bracketRef.current) {
      const { scrollWidth, scrollHeight } = bracketRef.current
      setBracketSize({ width: scrollWidth, height: scrollHeight })
    }
  }, [matches])

  // Drag to pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start drag if clicking on the container background, not on inputs
    if ((e.target as HTMLElement).tagName === 'INPUT') return
    
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    if (containerRef.current) {
      setScrollStart({ 
        x: containerRef.current.scrollLeft, 
        y: containerRef.current.scrollTop 
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    
    containerRef.current.scrollLeft = scrollStart.x - dx
    containerRef.current.scrollTop = scrollStart.y - dy
  }

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
            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center text-slate-600">{Math.round(zoom * 100)}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(1)}
            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div
          ref={containerRef}
          className={cn(
            "overflow-auto rounded-xl bg-slate-50 border border-slate-200",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          style={{ maxHeight: "85vh" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          {/* Wrapper that reserves space for scaled content */}
          <div 
            style={{ 
              width: bracketSize.width > 0 ? `${bracketSize.width * zoom}px` : "auto",
              height: bracketSize.height > 0 ? `${bracketSize.height * zoom}px` : "auto",
              minWidth: "fit-content",
              minHeight: "fit-content"
            }}
          >
            <div
              ref={bracketRef}
              className="flex items-start justify-start min-w-max p-4"
              style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
            >
              {/* LEFT BRACKET */}

              {/* Left R32 */}
              <div className="flex flex-col">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center mb-3 py-2">
                  Round of 32
                </div>
                <div className="flex flex-col" style={{ gap: `${r32Gap}px` }}>
                  {leftR32.map((match) => {
                    const placeholders = getMatchPlaceholders(match)
                    const resolved = resolvedTeams[match.id]
                    return (
                      <MatchCard
                        key={match.id}
                        match={match}
                        team1={teamsMap[match.team1Id]}
                        team2={teamsMap[match.team2Id]}
                        onScoreChange={onScoreChange}
                        placeholder1={placeholders.team1}
                        placeholder2={placeholders.team2}
                        resolvedTeam1={resolved?.team1}
                        resolvedTeam2={resolved?.team2}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Connector R32 -> R16 */}
              <div style={{ paddingTop: "36px" }}>
                <BracketConnector matchCount={8} matchHeight={matchHeight} gap={r32Gap} connectorWidth={connectorWidth} />
              </div>

              {/* Left R16 */}
              <div className="flex flex-col">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center mb-3 py-2">
                  Round of 16
                </div>
                <div className="flex flex-col" style={{ gap: `${r16Gap}px`, paddingTop: `${r16Offset}px` }}>
                  {leftR16.map((match) => {
                    const placeholders = getMatchPlaceholders(match)
                    return (
                      <MatchCard
                        key={match.id}
                        match={match}
                        team1={teamsMap[match.team1Id]}
                        team2={teamsMap[match.team2Id]}
                        onScoreChange={onScoreChange}
                        placeholder1={placeholders.team1}
                        placeholder2={placeholders.team2}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Connector R16 -> QF */}
              <div style={{ paddingTop: `${r16Offset + 36}px` }}>
                <BracketConnector
                  matchCount={4}
                  matchHeight={matchHeight}
                  gap={r16Gap}
                  connectorWidth={connectorWidth}
                />
              </div>

              {/* Left QF */}
              <div className="flex flex-col">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center mb-3 py-2">
                  Quarter-Finals
                </div>
                <div className="flex flex-col" style={{ gap: `${qfGap + 80}px`, paddingTop: `${qfOffset}px` }}>
                  {leftQF.map((match) => {
                    const placeholders = getMatchPlaceholders(match)
                    return (
                      <MatchCard
                        key={match.id}
                        match={match}
                        team1={teamsMap[match.team1Id]}
                        team2={teamsMap[match.team2Id]}
                        onScoreChange={onScoreChange}
                        placeholder1={placeholders.team1}
                        placeholder2={placeholders.team2}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Connector QF -> SF */}
              <div style={{ paddingTop: `${qfOffset + 36}px` }}>
                <SingleConnector
                  matchHeight={matchHeight}
                  gap={qfGap + 80}
                  connectorWidth={connectorWidth}
                  direction="right"
                />
              </div>

              {/* Left SF */}
              <div className="flex flex-col">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center mb-3 py-2">
                  Semi-Finals
                </div>
                <div style={{ paddingTop: `${sfOffset + 40}px` }}>
                  {leftSF.map((match) => {
                    const placeholders = getMatchPlaceholders(match)
                    return (
                      <MatchCard
                        key={match.id}
                        match={match}
                        team1={teamsMap[match.team1Id]}
                        team2={teamsMap[match.team2Id]}
                        onScoreChange={onScoreChange}
                        placeholder1={placeholders.team1}
                        placeholder2={placeholders.team2}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Connector SF -> Final (left) */}
              <div style={{ paddingTop: `${sfOffset + 40 + 36}px` }}>
                <svg width={connectorWidth} height={matchHeight} className="shrink-0">
                  <line
                    x1={0}
                    y1={matchHeight / 2}
                    x2={connectorWidth}
                    y2={matchHeight / 2}
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* CENTER - Final & 3rd Place */}
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center mb-3 py-2">
                  Final
                </div>
                <div className="flex flex-col items-center gap-8" style={{ paddingTop: `${sfOffset + 40}px` }}>
                  {/* Champion Display */}
                  {champion && teamsMap[champion] && (
                    <div className="flex flex-col items-center gap-2 animate-in fade-in duration-500">
                      <Trophy className="h-10 w-10 text-amber-500" />
                      <div className="text-3xl">{teamsMap[champion].flag}</div>
                      <div className="text-lg font-bold text-amber-600">{teamsMap[champion].name}</div>
                      <div className="text-xs uppercase tracking-widest text-slate-500">World Champion</div>
                    </div>
                  )}

                  {/* Final Match */}
                  {final && (() => {
                    const placeholders = getMatchPlaceholders(final)
                    return (
                      <MatchCard
                        match={final}
                        team1={teamsMap[final.team1Id]}
                        team2={teamsMap[final.team2Id]}
                        onScoreChange={onScoreChange}
                        isFinal
                        placeholder1={placeholders.team1}
                        placeholder2={placeholders.team2}
                      />
                    )
                  })()}

                  {/* 3rd Place Match */}
                  {third && (() => {
                    const placeholders = getMatchPlaceholders(third)
                    return (
                      <div className="mt-8">
                        <div className="text-xs uppercase tracking-widest text-slate-400 text-center mb-2">3rd Place</div>
                        <MatchCard
                          match={third}
                          team1={teamsMap[third.team1Id]}
                          team2={teamsMap[third.team2Id]}
                          onScoreChange={onScoreChange}
                          isThirdPlace
                          placeholder1={placeholders.team1}
                          placeholder2={placeholders.team2}
                        />
                      </div>
                    )
                  })()}
                </div>
              </div>

              {/* Connector Final -> SF (right) */}
              <div style={{ paddingTop: `${sfOffset + 40 + 36}px` }}>
                <svg width={connectorWidth} height={matchHeight} className="shrink-0">
                  <line
                    x1={0}
                    y1={matchHeight / 2}
                    x2={connectorWidth}
                    y2={matchHeight / 2}
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Right SF */}
              <div className="flex flex-col">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center mb-3 py-2">
                  Semi-Finals
                </div>
                <div style={{ paddingTop: `${sfOffset + 40}px` }}>
                  {rightSF.map((match) => {
                    const placeholders = getMatchPlaceholders(match)
                    return (
                      <MatchCard
                        key={match.id}
                        match={match}
                        team1={teamsMap[match.team1Id]}
                        team2={teamsMap[match.team2Id]}
                        onScoreChange={onScoreChange}
                        placeholder1={placeholders.team1}
                        placeholder2={placeholders.team2}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Connector SF -> QF (right) */}
              <div style={{ paddingTop: `${qfOffset + 36}px` }}>
                <SingleConnector
                  matchHeight={matchHeight}
                  gap={qfGap + 80}
                  connectorWidth={connectorWidth}
                  direction="left"
                />
              </div>

              {/* Right QF */}
              <div className="flex flex-col">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center mb-3 py-2">
                  Quarter-Finals
                </div>
                <div className="flex flex-col" style={{ gap: `${qfGap + 80}px`, paddingTop: `${qfOffset}px` }}>
                  {rightQF.map((match) => {
                    const placeholders = getMatchPlaceholders(match)
                    return (
                      <MatchCard
                        key={match.id}
                        match={match}
                        team1={teamsMap[match.team1Id]}
                        team2={teamsMap[match.team2Id]}
                        onScoreChange={onScoreChange}
                        placeholder1={placeholders.team1}
                        placeholder2={placeholders.team2}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Connector QF -> R16 (right) */}
              <div style={{ paddingTop: `${r16Offset + 36}px` }}>
                <BracketConnector
                  matchCount={4}
                  matchHeight={matchHeight}
                  gap={r16Gap}
                  connectorWidth={connectorWidth}
                  direction="left"
                />
              </div>

              {/* Right R16 */}
              <div className="flex flex-col">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center mb-3 py-2">
                  Round of 16
                </div>
                <div className="flex flex-col" style={{ gap: `${r16Gap}px`, paddingTop: `${r16Offset}px` }}>
                  {rightR16.map((match) => {
                    const placeholders = getMatchPlaceholders(match)
                    return (
                      <MatchCard
                        key={match.id}
                        match={match}
                        team1={teamsMap[match.team1Id]}
                        team2={teamsMap[match.team2Id]}
                        onScoreChange={onScoreChange}
                        placeholder1={placeholders.team1}
                        placeholder2={placeholders.team2}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Connector R16 -> R32 (right) */}
              <div style={{ paddingTop: "36px" }}>
                <BracketConnector
                  matchCount={8}
                  matchHeight={matchHeight}
                  gap={r32Gap}
                  connectorWidth={connectorWidth}
                  direction="left"
                />
              </div>

              {/* Right R32 */}
              <div className="flex flex-col">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center mb-3 py-2">
                  Round of 32
                </div>
                <div className="flex flex-col" style={{ gap: `${r32Gap}px` }}>
                  {rightR32.map((match) => {
                    const placeholders = getMatchPlaceholders(match)
                    const resolved = resolvedTeams[match.id]
                    return (
                      <MatchCard
                        key={match.id}
                        match={match}
                        team1={teamsMap[match.team1Id]}
                        team2={teamsMap[match.team2Id]}
                        onScoreChange={onScoreChange}
                        placeholder1={placeholders.team1}
                        placeholder2={placeholders.team2}
                        resolvedTeam1={resolved?.team1}
                        resolvedTeam2={resolved?.team2}
                      />
                    )
                  })}
                </div>
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
            className="text-slate-500"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-slate-700">{mobileRounds[mobileRound].title}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileRound(Math.min(mobileRounds.length - 1, mobileRound + 1))}
            disabled={mobileRound === mobileRounds.length - 1}
            className="text-slate-500"
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
                idx === mobileRound ? "bg-amber-500 w-6" : "bg-slate-300",
              )}
            />
          ))}
        </div>

        {/* Champion on mobile */}
        {mobileRound === 4 && champion && teamsMap[champion] && (
          <div className="flex flex-col items-center gap-2 mb-6 p-4 rounded-lg bg-amber-50 border border-amber-400/50">
            <Trophy className="h-8 w-8 text-amber-500" />
            <span className="text-2xl">{teamsMap[champion].flag}</span>
            <span className="font-bold text-amber-600">{teamsMap[champion].name}</span>
            <span className="text-xs uppercase tracking-widest text-slate-500">World Champion</span>
          </div>
        )}

        {/* Mobile Matches Grid */}
        <div className="grid gap-3">
          {mobileRounds[mobileRound].matches.map((match) => {
            const placeholders = getMatchPlaceholders(match)
            const resolved = match.stage === "round32" ? resolvedTeams[match.id] : undefined
            return (
              <MatchCard
                key={match.id}
                match={match}
                team1={teamsMap[match.team1Id]}
                team2={teamsMap[match.team2Id]}
                onScoreChange={onScoreChange}
                isFinal={match.stage === "final"}
                isThirdPlace={match.stage === "third"}
                placeholder1={placeholders.team1}
                placeholder2={placeholders.team2}
                resolvedTeam1={resolved?.team1}
                resolvedTeam2={resolved?.team2}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
