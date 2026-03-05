"use client"

import { useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, GitBranch, Swords } from "lucide-react"
import { GroupStage } from "@/features/group-stage/components/group-stage"
import { KnockoutBracket } from "@/features/knockout-stage/components/knockout-bracket"
import { TournamentHeader } from "@/components/layout/tournament-header"
import { groups } from "@/db/tournament-data"
import { useTournament } from "../hooks/use-tournament"
import ButtonSimulator from "./button-simulator"
import { PlayoffsStage } from "@/features/playoffs-stage/components/playoffs-stage"
import { usePlayoffs } from "@/features/playoffs-stage/hooks/use-playoffs"
import { Team } from "@/lib/types"

export function WorldCupSimulator() {
  // Playoffs state (determines which teams go to groups)
  const {
    playoffsState,
    handleMatchScoreChange: handlePlayoffScoreChange,
    handlePenaltyWinner: handlePlayoffPenaltyWinner,
    simulatePlayoffs,
    resetPlayoffs,
    winners: playoffWinners,
  } = usePlayoffs()

  const {
    activeTab,
    groupMatches,
    groupStandings,
    knockoutMatches,
    qualifiedTeams,
    thirdPlaceRanking,
    teamsMap: baseTeamsMap,
    handleKnockoutScoreChange,
    handleKnockoutPenaltyWinner,
    groupsComplete,
    handleScoreChange,
    setKnockoutMatches,
    setActiveTab,
    generateKnockoutBracket,
    resetTournament: resetTournamentBase,
    simulateTournament: simulateTournamentBase,
    simulateGroupStage,
    simulateKnockoutStage,
    resetGroupStage,
    resetKnockoutStage
  } = useTournament()

  // Create a dynamic teamsMap that replaces placeholders with playoff winners
  const teamsMap = useMemo(() => {
    const map: Record<string, Team> = { ...baseTeamsMap }

    // Map playoff slot IDs to their winner team data
    const playoffTeamsById: Record<string, Team> = {}
    playoffsState.playoffTeams.forEach((team) => {
      playoffTeamsById[team.id] = team
    })

    // Replace placeholder teams with actual winners
    Object.entries(playoffWinners).forEach(([slotId, winnerId]) => {
      if (winnerId && playoffTeamsById[winnerId]) {
        const winnerTeam = playoffTeamsById[winnerId]
        // Update the placeholder entry with the winner's info
        map[slotId] = {
          id: slotId, // Keep the slot ID for group stage compatibility
          name: winnerTeam.name,
          code: winnerTeam.code,
          flag: winnerTeam.flag,
          confederation: winnerTeam.confederation,
        }
      }
    })

    return map
  }, [baseTeamsMap, playoffsState.playoffTeams, playoffWinners])

  // Combined reset function
  const resetTournament = () => {
    resetTournamentBase()
    resetPlayoffs()
  }

  // Combined simulate function
  const simulateTournament = () => {
    simulatePlayoffs()
    simulateTournamentBase()
  }

  return (
    <div className="min-h-screen bg-background">
      <TournamentHeader />
      <div className="container mx-auto px-4 py-6">
        <ButtonSimulator
          generateKnockoutBracket={generateKnockoutBracket}
          resetTournament={resetTournament}
          simulateTournament={simulateTournament}
          simulateGroupStage={simulateGroupStage}
          simulateKnockoutStage={simulateKnockoutStage}
          knockoutMatches={knockoutMatches}
          simulatePlayoffs={simulatePlayoffs}
          groupsComplete={groupsComplete}
        />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-xl grid-cols-3">
            <TabsTrigger value="playoffs" className="gap-2">
              <Swords className="h-4 w-4" />
              PlayOffs
            </TabsTrigger>
            <TabsTrigger value="groups" className="gap-2">
              <Users className="h-4 w-4" />
              Group Stage
            </TabsTrigger>
            <TabsTrigger value="knockout" className="gap-2">
              <GitBranch className="h-4 w-4" />
              Knockout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playoffs" className="mt-6">
            <PlayoffsStage
              playoffsState={playoffsState}
              onMatchScoreChange={handlePlayoffScoreChange}
              onPenaltyWinner={handlePlayoffPenaltyWinner}
              simulatePlayoffs={simulatePlayoffs}
              resetPlayoffs={resetPlayoffs}
            />
          </TabsContent>

          <TabsContent value="groups" className="mt-6">
            <GroupStage
              groups={groups}
              groupMatches={groupMatches}
              groupStandings={groupStandings}
              teamsMap={teamsMap}
              onScoreChange={handleScoreChange}
              qualifiedTeams={qualifiedTeams}
              thirdPlaceRanking={thirdPlaceRanking}
              simulateGroupStage={simulateGroupStage}
              resetGroups={resetGroupStage}
            />
          </TabsContent>

          <TabsContent value="knockout" className="mt-6">
            <KnockoutBracket
              matches={knockoutMatches}
              setMatches={setKnockoutMatches}
              teamsMap={teamsMap}
              onScoreChange={handleKnockoutScoreChange}
              onPenaltyWinner={handleKnockoutPenaltyWinner}
              groupStandings={groupStandings}
              thirdPlaceRanking={thirdPlaceRanking}
              groupsComplete={groupsComplete}
              simulateKnockoutStage={simulateKnockoutStage}
              resetKnockoutStage={resetKnockoutStage}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
