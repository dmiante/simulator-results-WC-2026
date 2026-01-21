import { useMemo } from "react"
import { Match, Team, GroupStanding } from "@/lib/types"
import { r32Placeholders } from "@/db/tournament-data"
import { resolveQualifiedTeam } from "../utils/bracket-utils"

// Layout constants for the bracket
export const BRACKET_LAYOUT = {
  matchHeight: 80,
  r32Gap: 16,
  connectorWidth: 50,
} as const

// Derived layout values
export function getBracketLayoutValues() {
  const { matchHeight, r32Gap } = BRACKET_LAYOUT
  const r16Gap = matchHeight + r32Gap + 16
  const qfGap = (matchHeight + r32Gap) * 2 + r32Gap + 16
  const sfGap = (matchHeight + r32Gap) * 4 + r32Gap * 2 + 16

  // Calculate offsets for centering each round
  const r16Offset = (matchHeight + r32Gap) / 2
  const qfOffset = r16Offset + (matchHeight + r16Gap) / 2
  const sfOffset = qfOffset + (matchHeight + qfGap) / 2

  return {
    ...BRACKET_LAYOUT,
    r16Gap,
    qfGap,
    sfGap,
    r16Offset,
    qfOffset,
    sfOffset,
  }
}

export interface BracketMatches {
  round32: Match[]
  round16: Match[]
  quarters: Match[]
  semis: Match[]
  third: Match | undefined
  final: Match | undefined
  // Split for left/right bracket
  leftR32: Match[]
  rightR32: Match[]
  leftR16: Match[]
  rightR16: Match[]
  leftQF: Match[]
  rightQF: Match[]
  leftSF: Match[]
  rightSF: Match[]
  // Mobile rounds config
  mobileRounds: { title: string; matches: Match[] }[]
}

/**
 * Hook to organize matches by round and side of bracket
 */
export function useBracketMatches(matches: Match[]): BracketMatches {
  return useMemo(() => {
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

    return {
      round32,
      round16,
      quarters,
      semis,
      third,
      final,
      leftR32,
      rightR32,
      leftR16,
      rightR16,
      leftQF,
      rightQF,
      leftSF,
      rightSF,
      mobileRounds,
    }
  }, [matches])
}

export type ResolvedTeams = Record<string, { team1: Team | null; team2: Team | null }>

/**
 * Hook to resolve qualified teams for R32 placeholders in real-time
 */
export function useResolvedTeams(
  groupStandings: Record<string, GroupStanding[]>,
  thirdPlaceRanking: { qualified: (GroupStanding & { group: string })[] },
  teamsMap: Record<string, Team>
): ResolvedTeams {
  return useMemo(() => {
    const resolved: ResolvedTeams = {}
    
    Object.entries(r32Placeholders).forEach(([matchId, placeholders]) => {
      resolved[matchId] = {
        team1: resolveQualifiedTeam(placeholders.team1, matchId, groupStandings, thirdPlaceRanking, teamsMap),
        team2: resolveQualifiedTeam(placeholders.team2, matchId, groupStandings, thirdPlaceRanking, teamsMap),
      }
    })
    
    return resolved
  }, [groupStandings, thirdPlaceRanking, teamsMap])
}
