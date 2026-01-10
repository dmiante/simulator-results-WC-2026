import { calculateStandings, generateGroupMatches } from "@/db/matches"
import { groups, teams, r32Placeholders } from "@/db/tournament-data"
import { GroupStanding, Match, Team } from "@/lib/types"
import { useMemo, useState } from "react"
import { 
  assignThirdPlaceTeams, 
  buildThirdPlaceTeams,
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

function getWinner(team1Id: string, team2Id: string, score1: number, score2: number): string {
  if (score1 > score2) return team1Id
  if (score2 > score1) return team2Id
  // For knockout matches, randomly pick a winner (simulating penalties)
  return Math.random() > 0.5 ? team1Id : team2Id
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


export function useTournament() {

  const [groupMatches, setGroupMatches] = useState<Match[]>(() => generateGroupMatches())
  const [knockoutMatches, setKnockoutMatches] = useState<Match[]>(() => generateEmptyKnockoutBracket())
  const [activeTab, setActiveTab] = useState("groups")

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
      prev.map((m) => (m.id === matchId ? { ...m, [team === "team1" ? "team1Score" : "team2Score"]: score } : m)),
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

    // Build Round of 32 matchups according to r32Placeholders structure
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
        // Find which first-place group this match has
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
      
      const score1 = generateRandomScore()
      const score2 = generateRandomScore()
      round32Matches.push({
        id: matchId,
        team1Id,
        team2Id,
        team1Score: score1,
        team2Score: score2,
        stage: "round32",
        matchNumber: i,
      })
    }

    // Step 2: Generate and simulate Round of 16
    const round16Matches: Match[] = []
    for (let i = 0; i < 8; i++) {
      const match1 = round32Matches[i * 2]
      const match2 = round32Matches[i * 2 + 1]
      const team1 = getWinner(match1.team1Id, match1.team2Id, match1.team1Score!, match1.team2Score!)
      const team2 = getWinner(match2.team1Id, match2.team2Id, match2.team1Score!, match2.team2Score!)
      const score1 = generateRandomScore()
      const score2 = generateRandomScore()
      round16Matches.push({
        id: `round16-${i + 1}`,
        team1Id: team1,
        team2Id: team2,
        team1Score: score1,
        team2Score: score2,
        stage: "round16",
        matchNumber: i + 1,
      })
    }

    // Step 3: Generate and simulate Quarter-finals
    const quarterMatches: Match[] = []
    for (let i = 0; i < 4; i++) {
      const match1 = round16Matches[i * 2]
      const match2 = round16Matches[i * 2 + 1]
      const team1 = getWinner(match1.team1Id, match1.team2Id, match1.team1Score!, match1.team2Score!)
      const team2 = getWinner(match2.team1Id, match2.team2Id, match2.team1Score!, match2.team2Score!)
      const score1 = generateRandomScore()
      const score2 = generateRandomScore()
      quarterMatches.push({
        id: `quarter-${i + 1}`,
        team1Id: team1,
        team2Id: team2,
        team1Score: score1,
        team2Score: score2,
        stage: "quarter",
        matchNumber: i + 1,
      })
    }

    // Step 4: Generate and simulate Semi-finals
    const semiMatches: Match[] = []
    for (let i = 0; i < 2; i++) {
      const match1 = quarterMatches[i * 2]
      const match2 = quarterMatches[i * 2 + 1]
      const team1 = getWinner(match1.team1Id, match1.team2Id, match1.team1Score!, match1.team2Score!)
      const team2 = getWinner(match2.team1Id, match2.team2Id, match2.team1Score!, match2.team2Score!)
      const score1 = generateRandomScore()
      const score2 = generateRandomScore()
      semiMatches.push({
        id: `semi-${i + 1}`,
        team1Id: team1,
        team2Id: team2,
        team1Score: score1,
        team2Score: score2,
        stage: "semi",
        matchNumber: i + 1,
      })
    }

    // Step 5: Determine finalists and 3rd place contestants
    const semi1 = semiMatches[0]
    const semi2 = semiMatches[1]
    const finalist1 = getWinner(semi1.team1Id, semi1.team2Id, semi1.team1Score!, semi1.team2Score!)
    const finalist2 = getWinner(semi2.team1Id, semi2.team2Id, semi2.team1Score!, semi2.team2Score!)
    const thirdPlace1 = semi1.team1Id === finalist1 ? semi1.team2Id : semi1.team1Id
    const thirdPlace2 = semi2.team1Id === finalist2 ? semi2.team2Id : semi2.team1Id

    // Step 6: Generate Third Place match
    const thirdPlaceScore1 = generateRandomScore()
    const thirdPlaceScore2 = generateRandomScore()
    const thirdPlaceMatch: Match = {
      id: "third-1",
      team1Id: thirdPlace1,
      team2Id: thirdPlace2,
      team1Score: thirdPlaceScore1,
      team2Score: thirdPlaceScore2,
      stage: "third",
      matchNumber: 1,
    }

    // Step 7: Generate Final match
    const finalScore1 = generateRandomScore()
    const finalScore2 = generateRandomScore()
    const finalMatch: Match = {
      id: "final-1",
      team1Id: finalist1,
      team2Id: finalist2,
      team1Score: finalScore1,
      team2Score: finalScore2,
      stage: "final",
      matchNumber: 1,
    }

    setKnockoutMatches([
      ...round32Matches,
      ...round16Matches,
      ...quarterMatches,
      ...semiMatches,
      thirdPlaceMatch,
      finalMatch,
    ])
    setActiveTab("knockout")
  }

  const simulateTournament = () => {
    // Calculate standings from current group matches after simulation
    const simulatedGroupMatches = groupMatches.map((match) => ({
      ...match,
      team1Score: generateRandomScore(),
      team2Score: generateRandomScore(),
    }))
    setGroupMatches(simulatedGroupMatches)

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

    // Build Round of 32 matchups according to r32Placeholders structure
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
      
      const score1 = generateRandomScore()
      const score2 = generateRandomScore()
      round32Matches.push({
        id: matchId,
        team1Id,
        team2Id,
        team1Score: score1,
        team2Score: score2,
        stage: "round32",
        matchNumber: i,
      })
    }

    const round16Matches: Match[] = []
    for (let i = 0; i < 8; i++) {
      const match1 = round32Matches[i * 2]
      const match2 = round32Matches[i * 2 + 1]
      const team1 = getWinner(match1.team1Id, match1.team2Id, match1.team1Score!, match1.team2Score!)
      const team2 = getWinner(match2.team1Id, match2.team2Id, match2.team1Score!, match2.team2Score!)
      const score1 = generateRandomScore()
      const score2 = generateRandomScore()
      round16Matches.push({
        id: `round16-${i + 1}`,
        team1Id: team1,
        team2Id: team2,
        team1Score: score1,
        team2Score: score2,
        stage: "round16",
        matchNumber: i + 1,
      })
    }

    const quarterMatches: Match[] = []
    for (let i = 0; i < 4; i++) {
      const match1 = round16Matches[i * 2]
      const match2 = round16Matches[i * 2 + 1]
      const team1 = getWinner(match1.team1Id, match1.team2Id, match1.team1Score!, match1.team2Score!)
      const team2 = getWinner(match2.team1Id, match2.team2Id, match2.team1Score!, match2.team2Score!)
      const score1 = generateRandomScore()
      const score2 = generateRandomScore()
      quarterMatches.push({
        id: `quarter-${i + 1}`,
        team1Id: team1,
        team2Id: team2,
        team1Score: score1,
        team2Score: score2,
        stage: "quarter",
        matchNumber: i + 1,
      })
    }

    const semiMatches: Match[] = []
    for (let i = 0; i < 2; i++) {
      const match1 = quarterMatches[i * 2]
      const match2 = quarterMatches[i * 2 + 1]
      const team1 = getWinner(match1.team1Id, match1.team2Id, match1.team1Score!, match1.team2Score!)
      const team2 = getWinner(match2.team1Id, match2.team2Id, match2.team1Score!, match2.team2Score!)
      const score1 = generateRandomScore()
      const score2 = generateRandomScore()
      semiMatches.push({
        id: `semi-${i + 1}`,
        team1Id: team1,
        team2Id: team2,
        team1Score: score1,
        team2Score: score2,
        stage: "semi",
        matchNumber: i + 1,
      })
    }

    const semi1 = semiMatches[0]
    const semi2 = semiMatches[1]
    const finalist1 = getWinner(semi1.team1Id, semi1.team2Id, semi1.team1Score!, semi1.team2Score!)
    const finalist2 = getWinner(semi2.team1Id, semi2.team2Id, semi2.team1Score!, semi2.team2Score!)
    const thirdPlace1 = semi1.team1Id === finalist1 ? semi1.team2Id : semi1.team1Id
    const thirdPlace2 = semi2.team1Id === finalist2 ? semi2.team2Id : semi2.team1Id

    const thirdPlaceMatch: Match = {
      id: "third-1",
      team1Id: thirdPlace1,
      team2Id: thirdPlace2,
      team1Score: generateRandomScore(),
      team2Score: generateRandomScore(),
      stage: "third",
      matchNumber: 1,
    }

    const finalMatch: Match = {
      id: "final-1",
      team1Id: finalist1,
      team2Id: finalist2,
      team1Score: generateRandomScore(),
      team2Score: generateRandomScore(),
      stage: "final",
      matchNumber: 1,
    }

    setKnockoutMatches([
      ...round32Matches,
      ...round16Matches,
      ...quarterMatches,
      ...semiMatches,
      thirdPlaceMatch,
      finalMatch,
    ])
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

    // Build Round of 32 matchups according to r32Placeholders structure
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

    // Generate placeholder matches for later rounds
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

    setKnockoutMatches([
      ...round32Matches,
      ...round16Matches,
      ...quarterMatches,
      ...semiMatches,
      thirdPlace,
      finalMatch,
    ])
    setActiveTab("knockout")
  }

  const resetTournament = () => {
    setGroupMatches(generateGroupMatches())
    setKnockoutMatches(generateEmptyKnockoutBracket())
    setActiveTab("groups")
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
    resetTournament
  }
}




