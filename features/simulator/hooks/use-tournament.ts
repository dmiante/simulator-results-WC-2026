import { calculateStandings, generateGroupMatches } from "@/db/matches"
import { groups, teams, r32Placeholders } from "@/db/tournament-data"
import { GroupStanding, Match, PredictionMode, Team } from "@/lib/types"
import { useMemo, useState, useEffect } from "react"
import { 
  assignThirdPlaceTeams,
  type ThirdPlaceTeam 
} from "../utils/third-place-assignment"
import { TournamentTab } from "../types"
import {
  decodeSharedTournamentState,
  SHARE_STATE_PARAM,
  stripSharedStateFromUrl,
} from "../utils/share-state"

function generateRandomScore(): number {
  const weights = [25, 30, 25, 12, 5, 3] // 0, 1, 2, 3, 4, 5 goals
  const total = weights.reduce((a, b) => a + b, 0)
  let random = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i]
    if (random <= 0) return i
  }
  return 0
}

// Get the winner from a knockout match, considering penaltyWinnerId for draws
function getMatchWinnerFromSimulated(match: Match): string {
  if (match.team1Score === null || match.team2Score === null) return ""
  if (match.team1Score > match.team2Score) return match.team1Id
  if (match.team2Score > match.team1Score) return match.team2Id
  // Draw - use penaltyWinnerId
  return match.penaltyWinnerId || ""
}

// Get the loser from a knockout match, considering penaltyWinnerId for draws
function getMatchLoserFromSimulated(match: Match): string {
  if (match.team1Score === null || match.team2Score === null) return ""
  if (match.team1Score > match.team2Score) return match.team2Id
  if (match.team2Score > match.team1Score) return match.team1Id
  // Draw - the loser is the one who is NOT the penalty winner
  if (match.penaltyWinnerId) {
    return match.penaltyWinnerId === match.team1Id ? match.team2Id : match.team1Id
  }
  return ""
}

// Simulate a knockout match - returns scores and penaltyWinnerId if there's a draw
function simulateKnockoutMatch(
  team1Id: string,
  team2Id: string
): { score1: number; score2: number; penaltyWinnerId?: string } {
  const score1 = generateRandomScore()
  const score2 = generateRandomScore()
  
  // If it's a draw, determine a penalty winner
  if (score1 === score2) {
    const penaltyWinnerId = Math.random() > 0.5 ? team1Id : team2Id
    return { score1, score2, penaltyWinnerId }
  }
  
  return { score1, score2 }
}

// Resolve Round 32 teams based on group standings and third-place assignments
function resolveRound32Teams(
  firstByGroup: Map<string, string>,
  secondByGroup: Map<string, string>,
  thirdPlaceAssignments: Record<string, string>
): Match[] {
  const round32Matches: Match[] = []
  
  for (let i = 1; i <= 16; i++) {
    const matchId = `round32-${i}`
    const placeholder = r32Placeholders[matchId]
    
    let team1Id = ""
    let team2Id = ""
    
    // Resolve team1 (always a first or second place)
    const team1Match = placeholder.team1.match(/^(\d)([A-L])$/)
    if (team1Match) {
      const position = parseInt(team1Match[1])
      const group = team1Match[2]
      team1Id = position === 1 ? (firstByGroup.get(group) || "") : (secondByGroup.get(group) || "")
    }
    
    // Resolve team2 (can be first, second, or third place)
    if (placeholder.team2.startsWith("3º")) {
      // This is a third place - get from FIFA assignment
      const firstPlaceMatch = placeholder.team1.match(/^1([A-L])$/)
      if (firstPlaceMatch) {
        const firstPlaceGroup = firstPlaceMatch[1]
        team2Id = thirdPlaceAssignments[firstPlaceGroup] || ""
      }
    } else {
      // Regular first or second place
      const team2Match = placeholder.team2.match(/^(\d)([A-L])$/)
      if (team2Match) {
        const position = parseInt(team2Match[1])
        const group = team2Match[2]
        team2Id = position === 1 ? (firstByGroup.get(group) || "") : (secondByGroup.get(group) || "")
      }
    }
    
    round32Matches.push({
      id: matchId,
      team1Id,
      team2Id,
      team1Score: null,
      team2Score: null,
      stage: "round32",
      matchNumber: i,
    })
  }
  
  return round32Matches
}

// Simulate all knockout matches from Round 32 to Final
function simulateAllKnockoutMatches(round32Matches: Match[]): Match[] {
  // Simulate Round 32 scores
  const simulatedR32 = round32Matches.map(match => {
    const { score1, score2, penaltyWinnerId } = simulateKnockoutMatch(match.team1Id, match.team2Id)
    return { ...match, team1Score: score1, team2Score: score2, penaltyWinnerId }
  })

  // Generate and simulate Round of 16
  const round16Matches: Match[] = []
  for (let i = 0; i < 8; i++) {
    const match1 = simulatedR32[i * 2]
    const match2 = simulatedR32[i * 2 + 1]
    const team1 = getMatchWinnerFromSimulated(match1)
    const team2 = getMatchWinnerFromSimulated(match2)
    const { score1, score2, penaltyWinnerId } = simulateKnockoutMatch(team1, team2)
    round16Matches.push({
      id: `round16-${i + 1}`,
      team1Id: team1,
      team2Id: team2,
      team1Score: score1,
      team2Score: score2,
      stage: "round16",
      matchNumber: i + 1,
      penaltyWinnerId,
    })
  }

  // Generate and simulate Quarter-finals
  const quarterMatches: Match[] = []
  for (let i = 0; i < 4; i++) {
    const match1 = round16Matches[i * 2]
    const match2 = round16Matches[i * 2 + 1]
    const team1 = getMatchWinnerFromSimulated(match1)
    const team2 = getMatchWinnerFromSimulated(match2)
    const { score1, score2, penaltyWinnerId } = simulateKnockoutMatch(team1, team2)
    quarterMatches.push({
      id: `quarter-${i + 1}`,
      team1Id: team1,
      team2Id: team2,
      team1Score: score1,
      team2Score: score2,
      stage: "quarter",
      matchNumber: i + 1,
      penaltyWinnerId,
    })
  }

  // Generate and simulate Semi-finals
  const semiMatches: Match[] = []
  for (let i = 0; i < 2; i++) {
    const match1 = quarterMatches[i * 2]
    const match2 = quarterMatches[i * 2 + 1]
    const team1 = getMatchWinnerFromSimulated(match1)
    const team2 = getMatchWinnerFromSimulated(match2)
    const { score1, score2, penaltyWinnerId } = simulateKnockoutMatch(team1, team2)
    semiMatches.push({
      id: `semi-${i + 1}`,
      team1Id: team1,
      team2Id: team2,
      team1Score: score1,
      team2Score: score2,
      stage: "semi",
      matchNumber: i + 1,
      penaltyWinnerId,
    })
  }

  // Determine finalists and 3rd place contestants
  const semi1 = semiMatches[0]
  const semi2 = semiMatches[1]
  const finalist1 = getMatchWinnerFromSimulated(semi1)
  const finalist2 = getMatchWinnerFromSimulated(semi2)
  const thirdPlace1 = getMatchLoserFromSimulated(semi1)
  const thirdPlace2 = getMatchLoserFromSimulated(semi2)

  // Generate Third Place match
  const thirdPlaceResult = simulateKnockoutMatch(thirdPlace1, thirdPlace2)
  const thirdPlaceMatch: Match = {
    id: "third-1",
    team1Id: thirdPlace1,
    team2Id: thirdPlace2,
    team1Score: thirdPlaceResult.score1,
    team2Score: thirdPlaceResult.score2,
    stage: "third",
    matchNumber: 1,
    penaltyWinnerId: thirdPlaceResult.penaltyWinnerId,
  }

  // Generate Final match
  const finalResult = simulateKnockoutMatch(finalist1, finalist2)
  const finalMatch: Match = {
    id: "final-1",
    team1Id: finalist1,
    team2Id: finalist2,
    team1Score: finalResult.score1,
    team2Score: finalResult.score2,
    stage: "final",
    matchNumber: 1,
    penaltyWinnerId: finalResult.penaltyWinnerId,
  }

  return [
    ...simulatedR32,
    ...round16Matches,
    ...quarterMatches,
    ...semiMatches,
    thirdPlaceMatch,
    finalMatch,
  ]
}

function getPositionMatchWinner(match: Match): string {
  if (!match.team1Id || !match.team2Id) return ""
  return Math.random() > 0.5 ? match.team1Id : match.team2Id
}

function getPositionMatchLoser(match: Match): string {
  if (!match.winnerId) return ""
  if (match.winnerId === match.team1Id) return match.team2Id
  if (match.winnerId === match.team2Id) return match.team1Id
  return ""
}

function simulatePositionMatch(match: Match): Match {
  const winnerId = getPositionMatchWinner(match)

  return {
    ...match,
    team1Score: null,
    team2Score: null,
    penaltyWinnerId: undefined,
    winnerId: winnerId || undefined,
  }
}

function simulatePositionKnockoutMatches(round32Matches: Match[]): Match[] {
  const simulatedR32 = round32Matches.map(simulatePositionMatch)

  const round16Matches: Match[] = []
  for (let i = 0; i < 8; i++) {
    const team1Id = simulatedR32[i * 2]?.winnerId || ""
    const team2Id = simulatedR32[i * 2 + 1]?.winnerId || ""
    round16Matches.push(simulatePositionMatch({
      id: `round16-${i + 1}`,
      team1Id,
      team2Id,
      team1Score: null,
      team2Score: null,
      stage: "round16",
      matchNumber: i + 1,
    }))
  }

  const quarterMatches: Match[] = []
  for (let i = 0; i < 4; i++) {
    const team1Id = round16Matches[i * 2]?.winnerId || ""
    const team2Id = round16Matches[i * 2 + 1]?.winnerId || ""
    quarterMatches.push(simulatePositionMatch({
      id: `quarter-${i + 1}`,
      team1Id,
      team2Id,
      team1Score: null,
      team2Score: null,
      stage: "quarter",
      matchNumber: i + 1,
    }))
  }

  const semiMatches: Match[] = []
  for (let i = 0; i < 2; i++) {
    const team1Id = quarterMatches[i * 2]?.winnerId || ""
    const team2Id = quarterMatches[i * 2 + 1]?.winnerId || ""
    semiMatches.push(simulatePositionMatch({
      id: `semi-${i + 1}`,
      team1Id,
      team2Id,
      team1Score: null,
      team2Score: null,
      stage: "semi",
      matchNumber: i + 1,
    }))
  }

  const finalist1 = semiMatches[0]?.winnerId || ""
  const finalist2 = semiMatches[1]?.winnerId || ""
  const thirdPlace1 = getPositionMatchLoser(semiMatches[0])
  const thirdPlace2 = getPositionMatchLoser(semiMatches[1])

  const thirdPlaceMatch = simulatePositionMatch({
    id: "third-1",
    team1Id: thirdPlace1,
    team2Id: thirdPlace2,
    team1Score: null,
    team2Score: null,
    stage: "third",
    matchNumber: 1,
  })

  const finalMatch = simulatePositionMatch({
    id: "final-1",
    team1Id: finalist1,
    team2Id: finalist2,
    team1Score: null,
    team2Score: null,
    stage: "final",
    matchNumber: 1,
  })

  return [
    ...simulatedR32,
    ...round16Matches,
    ...quarterMatches,
    ...semiMatches,
    thirdPlaceMatch,
    finalMatch,
  ]
}

// localStorage keys for persistence
const STORAGE_KEY_GROUP = "wc2026-group-matches"
const STORAGE_KEY_KNOCKOUT = "wc2026-knockout-matches"
const STORAGE_KEY_GROUP_MODE = "wc2026-group-prediction-mode"
const STORAGE_KEY_GROUP_POSITIONS = "wc2026-group-positions"
const STORAGE_KEY_THIRD_PLACE_GROUP_ORDER = "wc2026-third-place-group-order"
const STORAGE_KEY_KNOCKOUT_MODE = "wc2026-knockout-prediction-mode"
const STORAGE_KEY_KNOCKOUT_POSITIONS = "wc2026-knockout-position-matches"

function createInitialGroupPositions(): Record<string, string[]> {
  return Object.fromEntries(Object.entries(groups).map(([groupName, teamIds]) => [groupName, [...teamIds]]))
}

function createInitialThirdPlaceGroupOrder(): string[] {
  return Object.keys(groups)
}

function isPredictionMode(value: string | null): value is PredictionMode {
  return value === "match" || value === "positions"
}

function normalizeGroupPositions(value: unknown): Record<string, string[]> | null {
  if (!value || typeof value !== "object") return null

  const parsed = value as Record<string, unknown>
  const normalized: Record<string, string[]> = {}

  for (const [groupName, teamIds] of Object.entries(groups)) {
    const savedIds = parsed[groupName]
    if (!Array.isArray(savedIds)) return null

    const validIds = savedIds.filter((teamId): teamId is string => typeof teamId === "string" && teamIds.includes(teamId))
    const missingIds = teamIds.filter((teamId) => !validIds.includes(teamId))
    normalized[groupName] = [...validIds, ...missingIds].slice(0, teamIds.length)
  }

  return normalized
}

function normalizeThirdPlaceGroupOrder(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null

  const groupNames = Object.keys(groups)
  const validGroups = value.filter((groupName): groupName is string => typeof groupName === "string" && groupNames.includes(groupName))
  const missingGroups = groupNames.filter((groupName) => !validGroups.includes(groupName))

  return [...validGroups, ...missingGroups].slice(0, groupNames.length)
}

function loadStoredGroupMatches(): Match[] | null {
  try {
    const savedGroup = localStorage.getItem(STORAGE_KEY_GROUP)
    if (!savedGroup) return null

    const parsed: Match[] = JSON.parse(savedGroup)
    // Migrate stale localStorage data: backfill dateTime/venue from fresh match data
    const freshMatches = generateGroupMatches()
    const freshById = new Map(freshMatches.map((match) => [match.id, match]))

    return parsed.map((match) => {
      const fresh = freshById.get(match.id)
      if (fresh && !match.dateTime) {
        return { ...match, dateTime: fresh.dateTime, venue: fresh.venue }
      }

      return match
    })
  } catch {
    return null
  }
}

function loadStoredKnockoutMatches(): Match[] | null {
  try {
    const savedKnockout = localStorage.getItem(STORAGE_KEY_KNOCKOUT)
    return savedKnockout ? JSON.parse(savedKnockout) : null
  } catch {
    return null
  }
}

function loadStoredGroupPositions(): Record<string, string[]> | null {
  try {
    const savedPositions = localStorage.getItem(STORAGE_KEY_GROUP_POSITIONS)
    return savedPositions ? normalizeGroupPositions(JSON.parse(savedPositions)) : null
  } catch {
    return null
  }
}

function loadStoredThirdPlaceGroupOrder(): string[] | null {
  try {
    const savedOrder = localStorage.getItem(STORAGE_KEY_THIRD_PLACE_GROUP_ORDER)
    return savedOrder ? normalizeThirdPlaceGroupOrder(JSON.parse(savedOrder)) : null
  } catch {
    return null
  }
}

function loadStoredPositionKnockoutMatches(): Match[] | null {
  try {
    const savedKnockout = localStorage.getItem(STORAGE_KEY_KNOCKOUT_POSITIONS)
    return savedKnockout ? JSON.parse(savedKnockout) : null
  } catch {
    return null
  }
}

// Generate empty knockout bracket structure
function generateEmptyKnockoutBracket(): Match[] {
  const round32Matches: Match[] = Array.from({ length: 16 }, (_, i) => ({
    id: `round32-${i + 1}`,
    team1Id: "",
    team2Id: "",
    team1Score: null,
    team2Score: null,
    stage: "round32" as const,
    matchNumber: i + 1,
  }))

  const round16Matches: Match[] = Array.from({ length: 8 }, (_, i) => ({
    id: `round16-${i + 1}`,
    team1Id: "",
    team2Id: "",
    team1Score: null,
    team2Score: null,
    stage: "round16" as const,
    matchNumber: i + 1,
  }))

  const quarterMatches: Match[] = Array.from({ length: 4 }, (_, i) => ({
    id: `quarter-${i + 1}`,
    team1Id: "",
    team2Id: "",
    team1Score: null,
    team2Score: null,
    stage: "quarter" as const,
    matchNumber: i + 1,
  }))

  const semiMatches: Match[] = Array.from({ length: 2 }, (_, i) => ({
    id: `semi-${i + 1}`,
    team1Id: "",
    team2Id: "",
    team1Score: null,
    team2Score: null,
    stage: "semi" as const,
    matchNumber: i + 1,
  }))

  const thirdPlace: Match = {
    id: "third-1",
    team1Id: "",
    team2Id: "",
    team1Score: null,
    team2Score: null,
    stage: "third",
    matchNumber: 1,
  }

  const finalMatch: Match = {
    id: "final-1",
    team1Id: "",
    team2Id: "",
    team1Score: null,
    team2Score: null,
    stage: "final",
    matchNumber: 1,
  }

  return [
    ...round32Matches,
    ...round16Matches,
    ...quarterMatches,
    ...semiMatches,
    thirdPlace,
    finalMatch,
  ]
}

function buildPositionStandings(groupPositions: Record<string, string[]>): Record<string, GroupStanding[]> {
  const standings: Record<string, GroupStanding[]> = {}

  Object.entries(groups).forEach(([groupName, teamIds]) => {
    const orderedIds = groupPositions[groupName] ?? teamIds
    standings[groupName] = orderedIds.map((teamId, index) => ({
      teamId,
      played: 3,
      won: Math.max(3 - index, 0),
      drawn: 0,
      lost: index,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: Math.max(9 - index * 3, 0),
      group: groupName,
    }))
  })

  return standings
}

function buildPositionThirdPlaceRanking(
  groupPositions: Record<string, string[]>,
  thirdPlaceGroupOrder: string[],
): {
  all: (GroupStanding & { group: string })[]
  qualified: (GroupStanding & { group: string })[]
  eliminated: (GroupStanding & { group: string })[]
} {
  const all = thirdPlaceGroupOrder
    .map((groupName) => {
      const teamId = groupPositions[groupName]?.[2]
      if (!teamId) return null

      return {
        teamId,
        played: 3,
        won: 1,
        drawn: 0,
        lost: 2,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 3,
        group: groupName,
      }
    })
    .filter((standing): standing is GroupStanding & { group: string } => standing !== null)

  return {
    all,
    qualified: all.slice(0, 8),
    eliminated: all.slice(8),
  }
}

function buildQualifiedTeamsFromStandings(
  standingsByGroup: Record<string, GroupStanding[]>,
  thirdPlaceRanking: { qualified: (GroupStanding & { group: string })[] },
) {
  const firstByGroup = new Map<string, string>()
  const secondByGroup = new Map<string, string>()

  Object.entries(standingsByGroup).forEach(([groupName, standings]) => {
    if (standings[0]?.played === 3) {
      firstByGroup.set(groupName, standings[0].teamId)
      secondByGroup.set(groupName, standings[1].teamId)
    }
  })

  const thirdPlaceTeams: ThirdPlaceTeam[] = thirdPlaceRanking.qualified.map((team) => ({
    teamId: team.teamId,
    group: team.group,
    points: team.points,
    goalDifference: team.goalDifference,
    goalsFor: team.goalsFor,
  }))

  return {
    first: Array.from(firstByGroup.values()),
    second: Array.from(secondByGroup.values()),
    thirdBest: thirdPlaceTeams.map((team) => team.teamId),
    firstByGroup,
    secondByGroup,
    thirdPlaceTeams,
  }
}


export function useTournament() {

  const [groupMatches, setGroupMatches] = useState<Match[]>(() => generateGroupMatches())
  const [knockoutMatches, setKnockoutMatches] = useState<Match[]>(() => generateEmptyKnockoutBracket())
  const [positionKnockoutMatches, setPositionKnockoutMatches] = useState<Match[]>(() => generateEmptyKnockoutBracket())
  const [groupPredictionMode, setGroupPredictionMode] = useState<PredictionMode>("match")
  const [knockoutPredictionMode, setKnockoutPredictionMode] = useState<PredictionMode>("match")
  const [groupPositionsByGroup, setGroupPositionsByGroup] = useState<Record<string, string[]>>(() => createInitialGroupPositions())
  const [thirdPlaceGroupOrder, setThirdPlaceGroupOrder] = useState<string[]>(() => createInitialThirdPlaceGroupOrder())
  const [activeTab, setActiveTab] = useState<TournamentTab>("groups")
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage after hydration (client-side only)
  useEffect(() => {
    queueMicrotask(() => {
      const sharedStateParam = new URLSearchParams(window.location.search).get(SHARE_STATE_PARAM)

      if (sharedStateParam) {
        const sharedState = decodeSharedTournamentState(
          sharedStateParam,
          generateGroupMatches(),
          generateEmptyKnockoutBracket(),
          generateEmptyKnockoutBracket(),
        )

        window.history.replaceState({}, "", stripSharedStateFromUrl(window.location.href))

        if (sharedState) {
          setGroupMatches(sharedState.groupMatches)
          setKnockoutMatches(sharedState.knockoutMatches)
          setPositionKnockoutMatches(sharedState.positionKnockoutMatches)
          setActiveTab(sharedState.activeTab)
          if (sharedState.groupPredictionMode) {
            setGroupPredictionMode(sharedState.groupPredictionMode)
          }
          if (sharedState.knockoutPredictionMode) {
            setKnockoutPredictionMode(sharedState.knockoutPredictionMode)
          }
          const sharedGroupPositions = normalizeGroupPositions(sharedState.groupPositionsByGroup)
          if (sharedGroupPositions) {
            setGroupPositionsByGroup(sharedGroupPositions)
          }
          const sharedThirdPlaceGroupOrder = normalizeThirdPlaceGroupOrder(sharedState.thirdPlaceGroupOrder)
          if (sharedThirdPlaceGroupOrder) {
            setThirdPlaceGroupOrder(sharedThirdPlaceGroupOrder)
          }
          setIsHydrated(true)
          return
        }
      }

      const storedGroupMatches = loadStoredGroupMatches()
      const storedKnockoutMatches = loadStoredKnockoutMatches()
      const storedGroupMode = localStorage.getItem(STORAGE_KEY_GROUP_MODE)
      const storedKnockoutMode = localStorage.getItem(STORAGE_KEY_KNOCKOUT_MODE)
      const storedGroupPositions = loadStoredGroupPositions()
      const storedThirdPlaceGroupOrder = loadStoredThirdPlaceGroupOrder()
      const storedPositionKnockoutMatches = loadStoredPositionKnockoutMatches()

      if (storedGroupMatches) {
        setGroupMatches(storedGroupMatches)
      }

      if (storedKnockoutMatches) {
        setKnockoutMatches(storedKnockoutMatches)
      }

      if (isPredictionMode(storedGroupMode)) {
        setGroupPredictionMode(storedGroupMode)
      }

      if (isPredictionMode(storedKnockoutMode)) {
        setKnockoutPredictionMode(storedKnockoutMode)
      }

      if (storedGroupPositions) {
        setGroupPositionsByGroup(storedGroupPositions)
      }

      if (storedThirdPlaceGroupOrder) {
        setThirdPlaceGroupOrder(storedThirdPlaceGroupOrder)
      }

      if (storedPositionKnockoutMatches) {
        setPositionKnockoutMatches(storedPositionKnockoutMatches)
      }

      setIsHydrated(true)
    })
  }, [])

  // Persist groupMatches to localStorage (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_GROUP, JSON.stringify(groupMatches))
    }
  }, [groupMatches, isHydrated])

  // Persist knockoutMatches to localStorage (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_KNOCKOUT, JSON.stringify(knockoutMatches))
    }
  }, [knockoutMatches, isHydrated])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_GROUP_MODE, groupPredictionMode)
    }
  }, [groupPredictionMode, isHydrated])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_KNOCKOUT_MODE, knockoutPredictionMode)
    }
  }, [knockoutPredictionMode, isHydrated])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_GROUP_POSITIONS, JSON.stringify(groupPositionsByGroup))
    }
  }, [groupPositionsByGroup, isHydrated])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_THIRD_PLACE_GROUP_ORDER, JSON.stringify(thirdPlaceGroupOrder))
    }
  }, [thirdPlaceGroupOrder, isHydrated])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_KNOCKOUT_POSITIONS, JSON.stringify(positionKnockoutMatches))
    }
  }, [positionKnockoutMatches, isHydrated])

  const teamsMap = useMemo(() => {
    const map: Record<string, Team> = {}
    teams.forEach((t) => (map[t.id] = t))
    return map
  }, [])

  const groupStandings = useMemo(() => {
    const standings: Record<string, ReturnType<typeof calculateStandings>> = {}
    Object.entries(groups).forEach(([groupName, teamIds]) => {
      const groupMatchList = groupMatches.filter((m) => m.group === groupName)
      standings[groupName] = calculateStandings(teamIds, groupMatchList)
    })
    return standings
  }, [groupMatches])

  const thirdPlaceRanking = useMemo(() => {
    const allThirdPlaces: (GroupStanding & { group: string })[] = []

    Object.entries(groupStandings).forEach(([groupName, standings]) => {
      const third = standings[2]
      if (third) {
        allThirdPlaces.push({
          teamId: third.teamId,
          points: third.points,
          goalDifference: third.goalDifference,
          goalsFor: third.goalsFor,
          goalsAgainst: third.goalsAgainst,
          played: third.played,
          won: third.won,
          drawn: third.drawn,
          lost: third.lost,
          group: groupName,
        })
      }
    })

    // Ordenar según criterios FIFA
    const sorted = allThirdPlaces.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
      return b.goalsFor - a.goalsFor
    })

    return {
      all: sorted,
      qualified: sorted.filter(t => t.played === 3).slice(0, 8),
      eliminated: sorted.filter(t => t.played === 3).slice(8),
    }
  }, [groupStandings])

  const qualifiedTeams = useMemo(
    () => buildQualifiedTeamsFromStandings(groupStandings, thirdPlaceRanking),
    [groupStandings, thirdPlaceRanking],
  )

  const positionGroupStandings = useMemo(
    () => buildPositionStandings(groupPositionsByGroup),
    [groupPositionsByGroup],
  )

  const positionThirdPlaceRanking = useMemo(
    () => buildPositionThirdPlaceRanking(groupPositionsByGroup, thirdPlaceGroupOrder),
    [groupPositionsByGroup, thirdPlaceGroupOrder],
  )

  const positionQualifiedTeams = useMemo(
    () => buildQualifiedTeamsFromStandings(positionGroupStandings, positionThirdPlaceRanking),
    [positionGroupStandings, positionThirdPlaceRanking],
  )

  const handleScoreChange = (matchId: string, team: "team1" | "team2", score: number | null) => {
    setGroupMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, [team === "team1" ? "team1Score" : "team2Score"]: score } : m)),
    )
  }

  const handleGroupPositionsChange = (groupName: string, orderedTeamIds: string[]) => {
    setGroupPositionsByGroup((prev) => ({
      ...prev,
      [groupName]: orderedTeamIds,
    }))
  }

  const handleThirdPlaceGroupOrderChange = (orderedGroupNames: string[]) => {
    setThirdPlaceGroupOrder(orderedGroupNames)
  }

  const handleKnockoutScoreChange = (matchId: string, team: "team1" | "team2", score: number | null) => {
    setKnockoutMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m
        
        const updatedMatch = { 
          ...m, 
          [team === "team1" ? "team1Score" : "team2Score"]: score 
        }
        
        // Check if the new scores result in a draw
        const newTeam1Score = team === "team1" ? score : m.team1Score
        const newTeam2Score = team === "team2" ? score : m.team2Score
        
        if (newTeam1Score !== null && newTeam2Score !== null && newTeam1Score === newTeam2Score) {
          // It's a draw - clear penalty winner so the user can choose via the UI
          updatedMatch.penaltyWinnerId = undefined
        } else if (newTeam1Score !== null && newTeam2Score !== null) {
          // Not a draw - clear any existing penalty winner
          updatedMatch.penaltyWinnerId = undefined
        }
        
        return updatedMatch
      }),
    )
  }

  const handleKnockoutPenaltyWinner = (matchId: string, winnerId: string) => {
    setKnockoutMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, penaltyWinnerId: winnerId } : m)),
    )
  }

  const handleKnockoutPositionWinner = (matchId: string, winnerId: string) => {
    setPositionKnockoutMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, winnerId: m.winnerId === winnerId ? undefined : winnerId } : m)),
    )
  }

  const simulateGroupStage = () => {
    // Simulate all group matches
    const simulatedGroupMatches = groupMatches.map((match) => ({
      ...match,
      team1Score: generateRandomScore(),
      team2Score: generateRandomScore(),
    }))
    setGroupMatches(simulatedGroupMatches)
  }

  const simulateKnockoutStage = () => {
    const { firstByGroup, secondByGroup, thirdPlaceTeams } = qualifiedTeams
    if (firstByGroup.size !== 12 || secondByGroup.size !== 12 || thirdPlaceTeams.length !== 8) return

    // Get third-place assignments using FIFA rules
    const thirdPlaceAssignments = assignThirdPlaceTeams(thirdPlaceTeams)
    if (!thirdPlaceAssignments) {
      console.error("Could not determine third-place assignments")
      return
    }

    // Resolve Round 32 teams and simulate all knockout matches
    const round32Matches = resolveRound32Teams(firstByGroup, secondByGroup, thirdPlaceAssignments)
    const allKnockoutMatches = simulateAllKnockoutMatches(round32Matches)

    setKnockoutMatches(allKnockoutMatches)
    setActiveTab("knockout")
  }

  const simulatePositionKnockoutStage = () => {
    const { firstByGroup, secondByGroup, thirdPlaceTeams } = positionQualifiedTeams
    if (firstByGroup.size !== 12 || secondByGroup.size !== 12 || thirdPlaceTeams.length !== 8) return

    const thirdPlaceAssignments = assignThirdPlaceTeams(thirdPlaceTeams)
    if (!thirdPlaceAssignments) {
      console.error("Could not determine third-place assignments")
      return
    }

    const round32Matches = resolveRound32Teams(firstByGroup, secondByGroup, thirdPlaceAssignments)
    const allKnockoutMatches = simulatePositionKnockoutMatches(round32Matches)

    setPositionKnockoutMatches(allKnockoutMatches)
    setActiveTab("knockout")
  }

  const simulateTournament = () => {
    // Simulate group matches
    const simulatedGroupMatches = groupMatches.map((match) => ({
      ...match,
      team1Score: generateRandomScore(),
      team2Score: generateRandomScore(),
    }))
    setGroupMatches(simulatedGroupMatches)

    // Calculate standings from simulated group matches
    const simulatedStandings: Record<string, ReturnType<typeof calculateStandings>> = {}
    Object.entries(groups).forEach(([groupName, teamIds]) => {
      const groupMatchList = simulatedGroupMatches.filter((m) => m.group === groupName)
      simulatedStandings[groupName] = calculateStandings(teamIds, groupMatchList)
    })

    // Build firstByGroup and secondByGroup maps
    const firstByGroup = new Map<string, string>()
    const secondByGroup = new Map<string, string>()
    Object.entries(simulatedStandings).forEach(([groupName, standings]) => {
      firstByGroup.set(groupName, standings[0].teamId)
      secondByGroup.set(groupName, standings[1].teamId)
    })

    // Build third place teams with group info
    const thirdPlaceTeamsWithGroup: ThirdPlaceTeam[] = Object.entries(simulatedStandings)
      .map(([groupName, standings]) => ({
        teamId: standings[2].teamId,
        group: groupName,
        points: standings[2].points,
        goalDifference: standings[2].goalDifference,
        goalsFor: standings[2].goalsFor,
      }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
        return b.goalsFor - a.goalsFor
      })
      .slice(0, 8)

    // Get third-place assignments using FIFA rules
    const thirdPlaceAssignments = assignThirdPlaceTeams(thirdPlaceTeamsWithGroup)
    if (!thirdPlaceAssignments) {
      console.error("Could not determine third-place assignments")
      return
    }

    // Resolve Round 32 teams and simulate all knockout matches
    const round32Matches = resolveRound32Teams(firstByGroup, secondByGroup, thirdPlaceAssignments)
    const allKnockoutMatches = simulateAllKnockoutMatches(round32Matches)

    setKnockoutMatches(allKnockoutMatches)
    setActiveTab("knockout")
  }


  const generateKnockoutBracket = () => {
    const { firstByGroup, secondByGroup, thirdPlaceTeams } = qualifiedTeams
    if (firstByGroup.size !== 12 || secondByGroup.size !== 12 || thirdPlaceTeams.length !== 8) return

    // Get third-place assignments using FIFA rules
    const thirdPlaceAssignments = assignThirdPlaceTeams(thirdPlaceTeams)
    if (!thirdPlaceAssignments) {
      console.error("Could not determine third-place assignments")
      return
    }

    // Build Round 32 with resolved teams (without scores)
    const round32Matches = resolveRound32Teams(firstByGroup, secondByGroup, thirdPlaceAssignments)

    // Generate empty matches for later rounds
    const emptyLaterRounds = generateEmptyKnockoutBracket().filter(
      m => m.stage !== "round32"
    )

    setKnockoutMatches([...round32Matches, ...emptyLaterRounds])
    setActiveTab("knockout")
  }

  useEffect(() => {
    const { firstByGroup, secondByGroup, thirdPlaceTeams } = positionQualifiedTeams
    if (firstByGroup.size !== 12 || secondByGroup.size !== 12 || thirdPlaceTeams.length !== 8) return

    const thirdPlaceAssignments = assignThirdPlaceTeams(thirdPlaceTeams)
    if (!thirdPlaceAssignments) return

    const round32Matches = resolveRound32Teams(firstByGroup, secondByGroup, thirdPlaceAssignments)
    const nextSeed = round32Matches.map((match) => `${match.id}:${match.team1Id}:${match.team2Id}`).join("|")

    queueMicrotask(() => {
      setPositionKnockoutMatches((prev) => {
        const currentRound32 = prev.filter((match) => match.stage === "round32")
        const currentSeed = currentRound32.map((match) => `${match.id}:${match.team1Id}:${match.team2Id}`).join("|")
        if (currentSeed === nextSeed) return prev

        const emptyLaterRounds = generateEmptyKnockoutBracket().filter((match) => match.stage !== "round32")
        return [...round32Matches, ...emptyLaterRounds]
      })
    })
  }, [positionQualifiedTeams])

const resetTournament = () => {
    localStorage.removeItem(STORAGE_KEY_GROUP)
    localStorage.removeItem(STORAGE_KEY_KNOCKOUT)
    localStorage.removeItem(STORAGE_KEY_GROUP_MODE)
    localStorage.removeItem(STORAGE_KEY_GROUP_POSITIONS)
    localStorage.removeItem(STORAGE_KEY_THIRD_PLACE_GROUP_ORDER)
    localStorage.removeItem(STORAGE_KEY_KNOCKOUT_MODE)
    localStorage.removeItem(STORAGE_KEY_KNOCKOUT_POSITIONS)
    setGroupMatches(generateGroupMatches())
    setKnockoutMatches(generateEmptyKnockoutBracket())
    setPositionKnockoutMatches(generateEmptyKnockoutBracket())
    setGroupPredictionMode("match")
    setKnockoutPredictionMode("match")
    setGroupPositionsByGroup(createInitialGroupPositions())
    setThirdPlaceGroupOrder(createInitialThirdPlaceGroupOrder())
    setActiveTab("groups")
  }

  const resetGroupStage = () => {
    if (groupPredictionMode === "match") {
      localStorage.removeItem(STORAGE_KEY_GROUP)
      setGroupMatches(generateGroupMatches())
    } else {
      localStorage.removeItem(STORAGE_KEY_GROUP_POSITIONS)
      localStorage.removeItem(STORAGE_KEY_THIRD_PLACE_GROUP_ORDER)
      setGroupPositionsByGroup(createInitialGroupPositions())
      setThirdPlaceGroupOrder(createInitialThirdPlaceGroupOrder())
      setPositionKnockoutMatches(generateEmptyKnockoutBracket())
    }
    setActiveTab("groups")
  }

  const resetKnockoutStage = () => {
    if (knockoutPredictionMode === "match") {
      localStorage.removeItem(STORAGE_KEY_KNOCKOUT)
      setKnockoutMatches(generateEmptyKnockoutBracket())
    } else {
      localStorage.removeItem(STORAGE_KEY_KNOCKOUT_POSITIONS)
      setPositionKnockoutMatches(generateEmptyKnockoutBracket())
    }
    setActiveTab("knockout")
  }

  const groupsComplete =
    qualifiedTeams.first.length === 12 && qualifiedTeams.second.length === 12 && qualifiedTeams.thirdBest.length === 8

  const positionGroupsComplete =
    positionQualifiedTeams.first.length === 12 && positionQualifiedTeams.second.length === 12 && positionQualifiedTeams.thirdBest.length === 8


  return {
    groupMatches,
    knockoutMatches,
    positionKnockoutMatches,
    activeTab,
    teamsMap,
    groupStandings,
    positionGroupStandings,
    thirdPlaceRanking,
    positionThirdPlaceRanking,
    qualifiedTeams,
    positionQualifiedTeams,
    groupsComplete,
    positionGroupsComplete,
    groupPredictionMode,
    knockoutPredictionMode,
    groupPositionsByGroup,
    thirdPlaceGroupOrder,
    setKnockoutMatches,
    setPositionKnockoutMatches,
    setActiveTab,
    setGroupPredictionMode,
    setKnockoutPredictionMode,
    handleKnockoutScoreChange,
    handleKnockoutPenaltyWinner,
    handleKnockoutPositionWinner,
    handleScoreChange,
    handleGroupPositionsChange,
    handleThirdPlaceGroupOrderChange,
    simulateGroupStage,
    simulateKnockoutStage,
    simulatePositionKnockoutStage,
    simulateTournament,
    generateKnockoutBracket,
    resetTournament,
    resetGroupStage,
    resetKnockoutStage
  }
}




