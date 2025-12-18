"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Trophy, Users, GitBranch, RotateCcw, Sparkles } from "lucide-react"
import { GroupStage } from "@/components/group-stage"
import { KnockoutBracket } from "@/components/knockout-bracket"
import { TournamentHeader } from "@/components/tournament-header"
import { teams, groups, generateGroupMatches, calculateStandings, type Match, type Team } from "@/lib/tournament-data"

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

export function WorldCupSimulator() {
  const [groupMatches, setGroupMatches] = useState<Match[]>(() => generateGroupMatches())
  const [knockoutMatches, setKnockoutMatches] = useState<Match[]>([])
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

  const qualifiedTeams = useMemo(() => {
    const qualified: { first: string[]; second: string[]; thirdBest: string[] } = {
      first: [],
      second: [],
      thirdBest: [],
    }

    Object.entries(groupStandings).forEach(([, standings]) => {
      if (standings[0]?.played === 3) {
        qualified.first.push(standings[0].teamId)
        qualified.second.push(standings[1].teamId)
      }
    })

    // Get best 8 third-placed teams
    const thirdPlaced = Object.values(groupStandings)
      .map((s) => s[2])
      .filter((s) => s?.played === 3)
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
        return b.goalsFor - a.goalsFor
      })
      .slice(0, 8)
      .map((s) => s.teamId)

    qualified.thirdBest = thirdPlaced

    return qualified
  }, [groupStandings])

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

  const simulateTournament = () => {
    // Step 1: Simulate all group matches
    const simulatedGroupMatches = groupMatches.map((match) => ({
      ...match,
      team1Score: generateRandomScore(),
      team2Score: generateRandomScore(),
    }))
    setGroupMatches(simulatedGroupMatches)

    // Step 2: Calculate standings from simulated matches
    const simulatedStandings: Record<string, ReturnType<typeof calculateStandings>> = {}
    Object.entries(groups).forEach(([groupName, teamIds]) => {
      const groupMatchList = simulatedGroupMatches.filter((m) => m.group === groupName)
      simulatedStandings[groupName] = calculateStandings(teamIds, groupMatchList)
    })

    // Step 3: Get qualified teams
    const first: string[] = []
    const second: string[] = []
    Object.values(simulatedStandings).forEach((standings) => {
      first.push(standings[0].teamId)
      second.push(standings[1].teamId)
    })

    const thirdBest = Object.values(simulatedStandings)
      .map((s) => s[2])
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
        return b.goalsFor - a.goalsFor
      })
      .slice(0, 8)
      .map((s) => s.teamId)

    const allQualified = [...first, ...second, ...thirdBest]

    // Step 4: Generate and simulate Round of 32
    const round32Matches: Match[] = []
    for (let i = 0; i < 16; i++) {
      const score1 = generateRandomScore()
      const score2 = generateRandomScore()
      round32Matches.push({
        id: `round32-${i + 1}`,
        team1Id: allQualified[i] || "",
        team2Id: allQualified[31 - i] || "",
        team1Score: score1,
        team2Score: score2,
        stage: "round32",
        matchNumber: i + 1,
      })
    }

    // Step 5: Generate and simulate Round of 16
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

    // Step 6: Generate and simulate Quarter-finals
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

    // Step 7: Generate and simulate Semi-finals
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

    // Step 8: Determine finalists and 3rd place contestants
    const semi1 = semiMatches[0]
    const semi2 = semiMatches[1]
    const finalist1 = getWinner(semi1.team1Id, semi1.team2Id, semi1.team1Score!, semi1.team2Score!)
    const finalist2 = getWinner(semi2.team1Id, semi2.team2Id, semi2.team1Score!, semi2.team2Score!)
    const thirdPlace1 = semi1.team1Id === finalist1 ? semi1.team2Id : semi1.team1Id
    const thirdPlace2 = semi2.team1Id === finalist2 ? semi2.team2Id : semi2.team1Id

    // Step 9: Generate Third Place match
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

    // Step 10: Generate Final match
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

  const generateKnockoutBracket = () => {
    const { first, second, thirdBest } = qualifiedTeams
    if (first.length !== 12 || second.length !== 12 || thirdBest.length !== 8) return

    const allQualified = [...first, ...second, ...thirdBest]
    const round32Matches: Match[] = []

    // Generate Round of 32 matchups (simplified bracket)
    for (let i = 0; i < 16; i++) {
      round32Matches.push({
        id: `round32-${i + 1}`,
        team1Id: allQualified[i] || "",
        team2Id: allQualified[31 - i] || "",
        team1Score: null,
        team2Score: null,
        stage: "round32",
        matchNumber: i + 1,
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
    setKnockoutMatches([])
    setActiveTab("groups")
  }

  const groupsComplete =
    qualifiedTeams.first.length === 12 && qualifiedTeams.second.length === 12 && qualifiedTeams.thirdBest.length === 8

  return (
    <div className="min-h-screen bg-background">
      <TournamentHeader />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Tournament Simulator</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={simulateTournament} className="gap-2" variant="default">
              <Sparkles className="h-4 w-4" />
              Simulate
            </Button>
            {groupsComplete && knockoutMatches.length === 0 && (
              <Button onClick={generateKnockoutBracket} className="gap-2" variant="secondary">
                <GitBranch className="h-4 w-4" />
                Generate Knockout
              </Button>
            )}
            <Button variant="outline" onClick={resetTournament} className="gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="groups" className="gap-2">
              <Users className="h-4 w-4" />
              Group Stage
            </TabsTrigger>
            <TabsTrigger value="knockout" className="gap-2" disabled={knockoutMatches.length === 0}>
              <GitBranch className="h-4 w-4" />
              Knockout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="mt-6">
            <GroupStage
              groups={groups}
              groupMatches={groupMatches}
              groupStandings={groupStandings}
              teamsMap={teamsMap}
              onScoreChange={handleScoreChange}
              qualifiedTeams={qualifiedTeams}
            />
          </TabsContent>

          <TabsContent value="knockout" className="mt-6">
            <KnockoutBracket
              matches={knockoutMatches}
              setMatches={setKnockoutMatches}
              teamsMap={teamsMap}
              onScoreChange={handleKnockoutScoreChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
