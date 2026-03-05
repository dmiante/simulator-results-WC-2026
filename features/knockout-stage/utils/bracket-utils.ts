import { GroupStanding, Match, Team } from "@/lib/types"
import { r32Placeholders, THIRD_PLACE_COMBINATIONS } from "@/db/tournament-data"
import { GROUPS_VS_THIRD_PLACE, THIRD_PLACE_MATCH_MAP } from "@/features/simulator/utils/third-place-assignment"

/**
 * Get placeholder text for any match based on stage
 * Shows position references like "1A", "2B" for R32, or "WR32-1" for later rounds
 */
export function getMatchPlaceholders(match: Match): { team1: string; team2: string } {
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

/**
 * Resolve a placeholder like "1A", "2B" to the actual qualified team
 * Only returns the team if they have played all 3 group matches (fully qualified)
 */
export function resolveQualifiedTeam(
  placeholder: string,
  matchId: string,
  groupStandings: Record<string, GroupStanding[]>,
  thirdPlaceRanking: { qualified: (GroupStanding & { group: string })[] },
  teamsMap: Record<string, Team>
): Team | null {
  // Check if it's a third place placeholder (e.g., "3º ABCDF")
  if (placeholder.startsWith("3º")) {
    // Check if all groups have completed their matches
    const qualifiedThirds = thirdPlaceRanking.qualified
    if (qualifiedThirds.length !== 8) return null

    // Get the combination key (sorted group letters)
    const combinationKey = qualifiedThirds
      .map(t => t.group)
      .sort()
      .join("")

    // Look up the assignment in FIFA's official table
    const assignment = THIRD_PLACE_COMBINATIONS[combinationKey]
    if (!assignment) return null

    // Get which first-place group this match has
    const firstPlaceGroup = THIRD_PLACE_MATCH_MAP[matchId]
    if (!firstPlaceGroup) return null

    // Find the index in GROUPS_VS_THIRD_PLACE
    const index = GROUPS_VS_THIRD_PLACE.indexOf(firstPlaceGroup as typeof GROUPS_VS_THIRD_PLACE[number])
    if (index === -1) return null

    // Get which third-place group should play in this match
    const thirdPlaceGroup = assignment[index]
    
    // Find the third-place team from that group
    const thirdTeam = qualifiedThirds.find(t => t.group === thirdPlaceGroup)
    if (!thirdTeam) return null

    return teamsMap[thirdTeam.teamId] || null
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

/**
 * Get the winner of a match (returns team ID or empty string)
 * For knockout matches with a draw, uses penaltyWinnerId to determine the winner
 */
export function getMatchWinner(
  match: Match,
  getActualTeamId: (match: Match, team: "team1" | "team2") => string
): string {
  if (match.team1Score === null || match.team2Score === null) return ""
  const team1Id = getActualTeamId(match, "team1")
  const team2Id = getActualTeamId(match, "team2")
  if (match.team1Score > match.team2Score) return team1Id
  if (match.team2Score > match.team1Score) return team2Id
  
  // Draw - check for penalty winner (knockout stages only)
  if (match.stage !== "group" && match.penaltyWinnerId) {
    return match.penaltyWinnerId
  }
  return ""
}

/**
 * Get the loser of a match (returns team ID or empty string)
 * For knockout matches with a draw, uses penaltyWinnerId to determine the loser
 */
export function getMatchLoser(
  match: Match,
  getActualTeamId: (match: Match, team: "team1" | "team2") => string
): string {
  if (match.team1Score === null || match.team2Score === null) return ""
  const team1Id = getActualTeamId(match, "team1")
  const team2Id = getActualTeamId(match, "team2")
  if (match.team1Score > match.team2Score) return team2Id
  if (match.team2Score > match.team1Score) return team1Id
  
  // Draw - check for penalty winner (knockout stages only)
  if (match.stage !== "group" && match.penaltyWinnerId) {
    // Return the team that is NOT the penalty winner (the loser)
    return match.penaltyWinnerId === team1Id ? team2Id : team1Id
  }
  return ""
}

/**
 * Get the champion from the final match
 */
export function getChampion(final: Match | undefined): string {
  if (!final) return ""
  if (final.team1Score === null || final.team2Score === null) return ""
  if (final.team1Score > final.team2Score) return final.team1Id
  if (final.team2Score > final.team1Score) return final.team2Id
  // Draw in the final - check for penalty winner
  if (final.penaltyWinnerId) return final.penaltyWinnerId
  return ""
}
