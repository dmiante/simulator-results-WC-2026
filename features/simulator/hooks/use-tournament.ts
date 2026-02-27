import { calculateStandings, generateGroupMatches } from "@/db/matches"
import { groups, teams, r32Placeholders } from "@/db/tournament-data"
import { GroupStanding, Match, Team } from "@/lib/types"
import { useMemo, useState, useEffect } from "react"
import { 
  assignThirdPlaceTeams,
  type ThirdPlaceTeam 
} from "../utils/third-place-assignment"

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

// localStorage keys for persistence
const STORAGE_KEY_GROUP = "wc2026-group-matches"
const STORAGE_KEY_KNOCKOUT = "wc2026-knockout-matches"

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


export function useTournament() {

  const [groupMatches, setGroupMatches] = useState<Match[]>(() => generateGroupMatches())
  const [knockoutMatches, setKnockoutMatches] = useState<Match[]>(() => generateEmptyKnockoutBracket())
  const [activeTab, setActiveTab] = useState("playoffs")
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage after hydration (client-side only)
  useEffect(() => {
    try {
      const savedGroup = localStorage.getItem(STORAGE_KEY_GROUP)
      if (savedGroup) {
        setGroupMatches(JSON.parse(savedGroup))
      }
      const savedKnockout = localStorage.getItem(STORAGE_KEY_KNOCKOUT)
      if (savedKnockout) {
        setKnockoutMatches(JSON.parse(savedKnockout))
      }
    } catch {
      // Si hay error de parsing, mantener datos por defecto
    }
    setIsHydrated(true)
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

  const qualifiedTeams = useMemo(() => {
    const firstByGroup = new Map<string, string>()
    const secondByGroup = new Map<string, string>()

    Object.entries(groupStandings).forEach(([groupName, standings]) => {
      if (standings[0]?.played === 3) {
        firstByGroup.set(groupName, standings[0].teamId)
        secondByGroup.set(groupName, standings[1].teamId)
      }
    })

    // Build third place teams with group info for FIFA assignment
    const thirdPlaceTeams: ThirdPlaceTeam[] = thirdPlaceRanking.qualified.map(t => ({
      teamId: t.teamId,
      group: t.group,
      points: t.points,
      goalDifference: t.goalDifference,
      goalsFor: t.goalsFor,
    }))

    return {
      first: Array.from(firstByGroup.values()),
      second: Array.from(secondByGroup.values()),
      thirdBest: thirdPlaceTeams.map(t => t.teamId),
      // New structured data for FIFA bracket rules
      firstByGroup,
      secondByGroup,
      thirdPlaceTeams,
    }
  }, [groupStandings, thirdPlaceRanking])

  const handleScoreChange = (matchId: string, team: "team1" | "team2", score: number | null) => {
    setGroupMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, [team === "team1" ? "team1Score" : "team2Score"]: score } : m)),
    )
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
          // It's a draw - assign a random penalty winner if not already set
          // Use team IDs if available, otherwise keep empty
          const team1Id = m.team1Id
          const team2Id = m.team2Id
          if (team1Id && team2Id) {
            updatedMatch.penaltyWinnerId = Math.random() > 0.5 ? team1Id : team2Id
          }
        } else if (newTeam1Score !== null && newTeam2Score !== null) {
          // Not a draw - clear any existing penalty winner
          updatedMatch.penaltyWinnerId = undefined
        }
        
        return updatedMatch
      }),
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

const resetTournament = () => {
    localStorage.removeItem(STORAGE_KEY_GROUP)
    localStorage.removeItem(STORAGE_KEY_KNOCKOUT)
    setGroupMatches(generateGroupMatches())
    setKnockoutMatches(generateEmptyKnockoutBracket())
    setActiveTab("playoffs")
  }

  const resetGroupStage = () => {
    localStorage.removeItem(STORAGE_KEY_GROUP)
    setGroupMatches(generateGroupMatches())
    setActiveTab("groups")
  }

  const resetKnockoutStage = () => {
    localStorage.removeItem(STORAGE_KEY_KNOCKOUT)
    setKnockoutMatches(generateEmptyKnockoutBracket())
    setActiveTab("knockout")
  }

  const groupsComplete =
    qualifiedTeams.first.length === 12 && qualifiedTeams.second.length === 12 && qualifiedTeams.thirdBest.length === 8


  return {
    groupMatches,
    knockoutMatches,
    activeTab,
    teamsMap,
    groupStandings,
    thirdPlaceRanking,
    qualifiedTeams,
    groupsComplete,
    setKnockoutMatches,
    setActiveTab,
    handleKnockoutScoreChange,
    handleScoreChange,
    simulateGroupStage,
    simulateKnockoutStage,
    simulateTournament,
    generateKnockoutBracket,
    resetTournament,
    resetGroupStage,
    resetKnockoutStage
  }
}




