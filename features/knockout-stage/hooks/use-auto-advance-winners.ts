import { useEffect } from "react"
import { Match, Team } from "@/lib/types"
import { getMatchWinner, getMatchLoser } from "../utils/bracket-utils"
import { ResolvedTeams } from "./use-bracket-layout"

interface UseAutoAdvanceWinnersParams {
  matches: Match[]
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>
  resolvedTeams: ResolvedTeams
}

/**
 * Hook to automatically advance winners to the next round
 * Also handles advancing losers to the third-place match
 */
export function useAutoAdvanceWinners({
  matches,
  setMatches,
  resolvedTeams,
}: UseAutoAdvanceWinnersParams) {
  useEffect(() => {
    // Helper to get the actual team ID, considering resolved teams from group stage
    const getActualTeamId = (match: Match, team: "team1" | "team2"): string => {
      const teamId = team === "team1" ? match.team1Id : match.team2Id
      if (teamId) return teamId
      
      // For R32 matches, check resolved teams
      if (match.stage === "round32") {
        const resolved = resolvedTeams[match.id]
        if (resolved) {
          const resolvedTeam = team === "team1" ? resolved.team1 : resolved.team2
          if (resolvedTeam) return resolvedTeam.id
        }
      }
      return ""
    }

    const getWinner = (match: Match): string => getMatchWinner(match, getActualTeamId)
    const getLoser = (match: Match): string => getMatchLoser(match, getActualTeamId)

    const updatedMatches = [...matches]
    let hasChanges = false

    // Helper to update a match's teams and reset scores if needed
    const updateMatchTeams = (
      targetMatch: Match | undefined,
      sourceMatch1: Match | undefined,
      sourceMatch2: Match | undefined,
      getTeam1: (m: Match) => string,
      getTeam2: (m: Match) => string
    ): boolean => {
      if (!targetMatch || !sourceMatch1 || !sourceMatch2) return false

      const newTeam1 = getTeam1(sourceMatch1)
      const newTeam2 = getTeam2(sourceMatch2)

      if (targetMatch.team1Id !== newTeam1 || targetMatch.team2Id !== newTeam2) {
        if (targetMatch.team1Id !== newTeam1) targetMatch.team1Score = null
        if (targetMatch.team2Id !== newTeam2) targetMatch.team2Score = null
        targetMatch.penaltyWinnerId = undefined
        targetMatch.team1Id = newTeam1
        targetMatch.team2Id = newTeam2
        return true
      }
      return false
    }

    // Round of 16 from Round of 32
    for (let i = 0; i < 8; i++) {
      const r16Match = updatedMatches.find((m) => m.id === `round16-${i + 1}`)
      const r32Match1 = updatedMatches.find((m) => m.id === `round32-${i * 2 + 1}`)
      const r32Match2 = updatedMatches.find((m) => m.id === `round32-${i * 2 + 2}`)
      
      if (updateMatchTeams(r16Match, r32Match1, r32Match2, getWinner, getWinner)) {
        hasChanges = true
      }
    }

    // Quarter-finals from Round of 16
    for (let i = 0; i < 4; i++) {
      const qMatch = updatedMatches.find((m) => m.id === `quarter-${i + 1}`)
      const r16Match1 = updatedMatches.find((m) => m.id === `round16-${i * 2 + 1}`)
      const r16Match2 = updatedMatches.find((m) => m.id === `round16-${i * 2 + 2}`)
      
      if (updateMatchTeams(qMatch, r16Match1, r16Match2, getWinner, getWinner)) {
        hasChanges = true
      }
    }

    // Semi-finals from Quarter-finals
    for (let i = 0; i < 2; i++) {
      const sMatch = updatedMatches.find((m) => m.id === `semi-${i + 1}`)
      const qMatch1 = updatedMatches.find((m) => m.id === `quarter-${i * 2 + 1}`)
      const qMatch2 = updatedMatches.find((m) => m.id === `quarter-${i * 2 + 2}`)
      
      if (updateMatchTeams(sMatch, qMatch1, qMatch2, getWinner, getWinner)) {
        hasChanges = true
      }
    }

    // Final from Semi-finals
    const semi1 = updatedMatches.find((m) => m.id === "semi-1")
    const semi2 = updatedMatches.find((m) => m.id === "semi-2")
    const finalMatch = updatedMatches.find((m) => m.id === "final-1")
    const thirdMatch = updatedMatches.find((m) => m.id === "third-1")

    if (updateMatchTeams(finalMatch, semi1, semi2, getWinner, getWinner)) {
      hasChanges = true
    }

    // Third Place match (losers from Semi-finals)
    if (updateMatchTeams(thirdMatch, semi1, semi2, getLoser, getLoser)) {
      hasChanges = true
    }

    if (hasChanges) {
      setMatches(updatedMatches)
    }
  }, [matches, resolvedTeams, setMatches])
}
