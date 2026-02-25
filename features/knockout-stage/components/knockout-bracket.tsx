"use client"

import { useState, useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Trophy, ChevronLeft, ChevronRight, Dices, RotateCcw, Swords } from "lucide-react"

import { cn } from "@/lib/utils"
import { KnockoutBracketProps } from "../types"
import { MatchCard } from "./match-card"
import { BracketConnector } from "./bracket-connector"
import ZoomControl from "./zoom-control"

import { useDragToPan } from "../hooks/use-drag-to-pan"
import { useBracketMatches, useResolvedTeams, getBracketLayoutValues } from "../hooks/use-bracket-layout"
import { useAutoAdvanceWinners } from "../hooks/use-auto-advance-winners"

import { getMatchPlaceholders, getChampion } from "../utils/bracket-utils"
import { TeamFlag } from "@/components/team-flag"


export function KnockoutBracket({ matches, setMatches, teamsMap, onScoreChange, groupStandings, thirdPlaceRanking, groupsComplete, resetKnockoutStage, simulateKnockoutStage }: KnockoutBracketProps) {
  const [zoom, setZoom] = useState(1)
  const [mobileRound, setMobileRound] = useState(0)
  const bracketRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [bracketSize, setBracketSize] = useState({ width: 0, height: 0 })

  const { isDragging, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave } = useDragToPan(containerRef)
  const bracketMatches = useBracketMatches(matches)
  const resolvedTeams = useResolvedTeams(groupStandings, thirdPlaceRanking, teamsMap)

  useAutoAdvanceWinners({ matches, setMatches, resolvedTeams })

  const { matchHeight, r32Gap, r16Gap, qfGap, connectorWidth, r16Offset, qfOffset, sfOffset } = getBracketLayoutValues()

  // Destructure bracket matches for easier access
  const {
    leftR32, rightR32, leftR16, rightR16, leftQF, rightQF, leftSF, rightSF,
    third, final, mobileRounds
  } = bracketMatches

  // Measure bracket size for proper scrolling when zoomed
  useEffect(() => {
    if (bracketRef.current) {
      const { scrollWidth, scrollHeight } = bracketRef.current
      setBracketSize({ width: scrollWidth, height: scrollHeight })
    }
  }, [matches])

  const champion = getChampion(final)

  return (
    <div className="space-y-6">
      <div className="gap-2 flex flex-wrap justify-end min-h-[40px]">
        {groupsComplete && (
          <Button onClick={simulateKnockoutStage} className="gap-2 cursor-pointer" variant="default">
            <Swords className="h-4 w-4" />
            Simulate Knockout
          </Button>
        )}
        <Button onClick={resetKnockoutStage} className="gap-2 cursor-pointer" variant="outline">
          <RotateCcw className="h-4 w-4" />
          Reset Knockout
        </Button>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Knockout Stage</h2>
        <p className="text-muted-foreground">
          June 28-July 19, 2026 - Simulate results and determine the champion
        </p>
      </div>
      {/* Desktop View */}
      <div className="hidden lg:block">
        <ZoomControl zoom={zoom} setZoom={setZoom} />
        <div
          ref={containerRef}
          className={cn(
            "overflow-auto rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-700",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          style={{ maxHeight: "85vh" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
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
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center mb-3 py-2">
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
              <div style={{ paddingTop: "44px" }}>
                <BracketConnector matchCount={8} matchHeight={matchHeight} gap={r32Gap} connectorWidth={connectorWidth} />
              </div>

              {/* Left R16 */}
              <div className="flex flex-col">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center mb-3 py-2">
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
              <div style={{ paddingTop: `${r16Offset + 43}px` }}>
                <BracketConnector
                  matchCount={4}
                  matchHeight={matchHeight}
                  gap={r16Gap}
                  connectorWidth={connectorWidth}
                />
              </div>

              {/* Left QF */}
              <div className="flex flex-col">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center mb-3 py-2">
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
              <div style={{ paddingTop: `${qfOffset + 43}px` }}>
                <BracketConnector
                  matchCount={2}
                  matchHeight={matchHeight}
                  gap={qfGap + 80}
                  connectorWidth={connectorWidth}
                />
              </div>

              {/* Left SF */}
              <div className="flex flex-col">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center mb-3 py-2">
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
              <div style={{ paddingTop: `${sfOffset + 83}px` }}>
                <svg width={connectorWidth} height={matchHeight} className="shrink-0">
                  <line
                    x1={0}
                    y1={matchHeight / 2}
                    x2={connectorWidth}
                    y2={matchHeight / 2}
                    className="stroke-slate-400 dark:stroke-slate-500"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* CENTER - Final & 3rd Place */}
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center mb-3 py-2">
                  Final
                </div>
                <div className="flex flex-col items-center gap-8" style={{ paddingTop: `${sfOffset - 230}px` }}>
                  {/* Champion Display - always reserve space to prevent layout shift */}
                  <div className="flex flex-col items-center gap-2" style={{ height: "237px", minHeight: "120px" }}>
                    {champion && teamsMap[champion] && (
                      <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
                        <Trophy className="h-10 w-10 text-amber-500" />
                        <TeamFlag code={teamsMap[champion].code} name={teamsMap[champion].name} width={160} height={50} widthImg={160} />
                        <div className="text-center">
                          <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{teamsMap[champion].name.toUpperCase()}</div>
                          <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">World Champion</div>
                        </div>
                      </div>
                    )}
                  </div>

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
                        <div className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 text-center mb-2">3rd Place</div>
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
              <div style={{ paddingTop: `${sfOffset + 83}px` }}>
                <svg width={connectorWidth} height={matchHeight} className="shrink-0">
                  <line
                    x1={0}
                    y1={matchHeight / 2}
                    x2={connectorWidth}
                    y2={matchHeight / 2}
                    className="stroke-slate-400 dark:stroke-slate-500"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Right SF */}
              <div className="flex flex-col">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center mb-3 py-2">
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
              <div style={{ paddingTop: `${qfOffset + 44}px` }}>
                <BracketConnector
                  matchCount={2}
                  matchHeight={matchHeight}
                  gap={qfGap + 80}
                  connectorWidth={connectorWidth}
                  direction="left"
                />
              </div>

              {/* Right QF */}
              <div className="flex flex-col">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center mb-3 py-2">
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
              <div style={{ paddingTop: `${r16Offset + 44}px` }}>
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
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center mb-3 py-2">
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
              <div style={{ paddingTop: "44px" }}>
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
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center mb-3 py-2">
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
            className="text-slate-500 dark:text-slate-400 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-slate-700 dark:text-slate-200">{mobileRounds[mobileRound].title}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileRound(Math.min(mobileRounds.length - 1, mobileRound + 1))}
            disabled={mobileRound === mobileRounds.length - 1}
            className="text-slate-500 dark:text-slate-400 cursor-pointer"
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
                idx === mobileRound ? "bg-amber-500 w-6" : "bg-slate-300 dark:bg-slate-600",
              )}
            />
          ))}
        </div>

        {/* Champion on mobile */}
        {mobileRound === 4 && champion && teamsMap[champion] && (
          <div className="flex flex-col items-center gap-2 mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-400/50 dark:border-amber-500/30">
            <Trophy className="h-8 w-8 text-amber-500" />
            <span className="text-2xl">{teamsMap[champion].flag}</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{teamsMap[champion].name}</span>
            <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">World Champion</span>
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
