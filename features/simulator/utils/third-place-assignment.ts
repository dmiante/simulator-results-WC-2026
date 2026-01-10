import { THIRD_PLACE_COMBINATIONS, r32Placeholders } from "@/db/tournament-data"
import { GroupStanding, Team } from "@/lib/types"

export interface ThirdPlaceTeam {
  teamId: string
  group: string
  points: number
  goalDifference: number
  goalsFor: number
}

/**
 * Groups whose winners play against third-place teams (in FIFA table order)
 * The THIRD_PLACE_COMBINATIONS array values correspond to:
 * [vs1A, vs1B, vs1D, vs1E, vs1G, vs1I, vs1K, vs1L]
 */
export const GROUPS_VS_THIRD_PLACE = ["A", "B", "D", "E", "G", "I", "K", "L"] as const

/**
 * Map from match ID to which first-place group plays in that match (for third-place assignments)
 */
export const THIRD_PLACE_MATCH_MAP: Record<string, string> = {
  "round32-1": "E",   // 1E vs 3rd
  "round32-2": "I",   // 1I vs 3rd
  "round32-7": "D",   // 1D vs 3rd
  "round32-8": "G",   // 1G vs 3rd
  "round32-11": "A",  // 1A vs 3rd
  "round32-12": "L",  // 1L vs 3rd
  "round32-15": "B",  // 1B vs 3rd
  "round32-16": "K",  // 1K vs 3rd
}

/**
 * Matches in Round 32 that have a third-place team
 */
export const MATCHES_WITH_THIRD_PLACE = Object.keys(THIRD_PLACE_MATCH_MAP)

/**
 * Given the 8 qualified third-place teams, determines which specific third-place team
 * plays against each first-place team based on FIFA's combination table.
 * 
 * @param qualifiedThirds - Array of 8 best third-placed teams with their group info
 * @returns Map where key is the first-place group (E, I, D, G, A, L, B, K) and value is the third-place teamId
 */
export function assignThirdPlaceTeams(
  qualifiedThirds: ThirdPlaceTeam[]
): Record<string, string> | null {
  if (qualifiedThirds.length !== 8) {
    console.warn(`Expected 8 qualified thirds, got ${qualifiedThirds.length}`)
    return null
  }

  // Get the combination key: sorted group letters of qualified thirds
  const combinationKey = qualifiedThirds
    .map(t => t.group)
    .sort()
    .join("")

  // Look up the assignment in FIFA's official table
  const assignment = THIRD_PLACE_COMBINATIONS[combinationKey]

  if (!assignment) {
    console.warn(`No FIFA assignment found for combination: ${combinationKey}`)
    return null
  }

  // Create a map from group letter to teamId for quick lookup
  const thirdsByGroup = new Map<string, string>()
  qualifiedThirds.forEach(t => {
    thirdsByGroup.set(t.group, t.teamId)
  })

  // Build the result: which third-place team plays against each first-place group
  // The assignment array order corresponds to: [vs1E, vs1I, vs1D, vs1G, vs1A, vs1L, vs1B, vs1K]
  // (matching GROUPS_VS_THIRD_PLACE order)
  const result: Record<string, string> = {}

  GROUPS_VS_THIRD_PLACE.forEach((winnerGroup, index) => {
    const thirdPlaceGroup = assignment[index]
    const thirdPlaceTeamId = thirdsByGroup.get(thirdPlaceGroup)
    
    if (thirdPlaceTeamId) {
      result[winnerGroup] = thirdPlaceTeamId
    } else {
      console.warn(`Could not find third-place team from group ${thirdPlaceGroup}`)
    }
  })

  return result
}

/**
 * Get the third-place team for a specific Round of 32 match
 * 
 * @param matchId - The match ID (e.g., "round32-1")
 * @param qualifiedThirds - Array of 8 best third-placed teams
 * @returns The teamId of the third-place team for this match, or null
 */
export function getThirdPlaceTeamForMatch(
  matchId: string,
  qualifiedThirds: ThirdPlaceTeam[]
): string | null {
  const firstPlaceGroup = THIRD_PLACE_MATCH_MAP[matchId]
  if (!firstPlaceGroup) return null // Not a match with third-place opponent

  const assignments = assignThirdPlaceTeams(qualifiedThirds)
  if (!assignments) return null

  return assignments[firstPlaceGroup] || null
}

/**
 * Build ThirdPlaceTeam array from group standings
 */
export function buildThirdPlaceTeams(
  groupStandings: Record<string, GroupStanding[]>
): ThirdPlaceTeam[] {
  const thirdPlaceTeams: ThirdPlaceTeam[] = []
  
  Object.entries(groupStandings).forEach(([groupName, standings]) => {
    const third = standings[2]
    if (third && third.played === 3) {
      thirdPlaceTeams.push({
        teamId: third.teamId,
        group: groupName,
        points: third.points,
        goalDifference: third.goalDifference,
        goalsFor: third.goalsFor,
      })
    }
  })

  // Sort by FIFA criteria to get the best 8
  return thirdPlaceTeams
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
      return b.goalsFor - a.goalsFor
    })
    .slice(0, 8)
}

/**
 * Resolve a third-place placeholder to the actual team based on current standings
 * This is used by the knockout bracket component
 */
export function resolveThirdPlaceTeam(
  matchId: string,
  groupStandings: Record<string, GroupStanding[]>,
  teamsMap: Record<string, Team>
): Team | null {
  const qualifiedThirds = buildThirdPlaceTeams(groupStandings)

  if (qualifiedThirds.length !== 8) return null

  const teamId = getThirdPlaceTeamForMatch(matchId, qualifiedThirds)
  if (!teamId) return null

  return teamsMap[teamId] || null
}

/**
 * Get the group of a third-place team for a specific match
 * Useful for displaying which group the third-place team came from
 */
export function getThirdPlaceGroupForMatch(
  matchId: string,
  qualifiedThirds: ThirdPlaceTeam[]
): string | null {
  const firstPlaceGroup = THIRD_PLACE_MATCH_MAP[matchId]
  if (!firstPlaceGroup) return null

  if (qualifiedThirds.length !== 8) return null

  const combinationKey = qualifiedThirds
    .map(t => t.group)
    .sort()
    .join("")

  const assignment = THIRD_PLACE_COMBINATIONS[combinationKey]
  if (!assignment) return null

  const index = GROUPS_VS_THIRD_PLACE.indexOf(firstPlaceGroup as typeof GROUPS_VS_THIRD_PLACE[number])
  if (index === -1) return null

  return assignment[index]
}
