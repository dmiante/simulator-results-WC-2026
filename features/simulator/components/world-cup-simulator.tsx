"use client"

import { useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClipboardList, Users, GitBranch, Swords } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { GroupStage } from "@/features/group-stage/components/group-stage"
import { KnockoutBracket } from "@/features/knockout-stage/components/knockout-bracket"
import { SquadsSection } from "@/features/squads/components/squads-section"
import { TournamentHeader } from "@/components/layout/tournament-header"
import { Footer } from "@/components/layout/footer"
import { groups } from "@/db/tournament-data"
import { getTeamDisplayName, localizeTeamsMap } from "@/lib/i18n"
import { useTournament } from "../hooks/use-tournament"
import { TournamentTab } from "../types"
import ButtonSimulator from "./button-simulator"
import { PlayoffsStage } from "@/features/playoffs-stage/components/playoffs-stage"
import { usePlayoffs } from "@/features/playoffs-stage/hooks/use-playoffs"
import { Team } from "@/lib/types"

export function WorldCupSimulator() {
  const { locale, messages: t } = useLanguage()
  // Playoffs state (determines which teams go to groups)
  const {
    playoffsState,
    winners: playoffWinners,
  } = usePlayoffs()

  const {
    activeTab,
    groupMatches,
    groupStandings,
    knockoutMatches,
    positionKnockoutMatches,
    qualifiedTeams,
    positionQualifiedTeams,
    thirdPlaceRanking,
    positionThirdPlaceRanking,
    teamsMap: baseTeamsMap,
    positionGroupStandings,
    groupPredictionMode,
    knockoutPredictionMode,
    groupPositionsByGroup,
    thirdPlaceGroupOrder,
    handleKnockoutScoreChange,
    handleKnockoutPenaltyWinner,
    handleKnockoutPositionWinner,
    groupsComplete,
    positionGroupsComplete,
    handleScoreChange,
    setKnockoutMatches,
    setPositionKnockoutMatches,
    setActiveTab,
    setGroupPredictionMode,
    setKnockoutPredictionMode,
    handleGroupPositionsChange,
    handleThirdPlaceGroupOrderChange,
    generateKnockoutBracket,
    resetTournament: resetTournamentBase,
    simulateTournament: simulateTournamentBase,
    simulateGroupStage,
    simulateKnockoutStage,
    simulatePositionKnockoutStage,
    resetGroupStage,
    resetKnockoutStage
  } = useTournament()

  const activeGroupStandings = groupPredictionMode === "positions" ? positionGroupStandings : groupStandings
  const activeQualifiedTeams = groupPredictionMode === "positions" ? positionQualifiedTeams : qualifiedTeams
  const activeThirdPlaceRanking = groupPredictionMode === "positions" ? positionThirdPlaceRanking : thirdPlaceRanking
  const activeKnockoutMatches = knockoutPredictionMode === "positions" ? positionKnockoutMatches : knockoutMatches
  const activeSetKnockoutMatches = knockoutPredictionMode === "positions" ? setPositionKnockoutMatches : setKnockoutMatches
  const activeKnockoutGroupStandings = knockoutPredictionMode === "positions" ? positionGroupStandings : groupStandings
  const activeKnockoutThirdPlaceRanking = knockoutPredictionMode === "positions" ? positionThirdPlaceRanking : thirdPlaceRanking
  const activeGroupsComplete = knockoutPredictionMode === "positions" ? positionGroupsComplete : groupsComplete

  const localizedBaseTeamsMap = useMemo(() => localizeTeamsMap(baseTeamsMap, locale), [baseTeamsMap, locale])

  // Create a dynamic teamsMap that replaces placeholders with playoff winners
  const teamsMap = useMemo(() => {
    const map: Record<string, Team> = { ...localizedBaseTeamsMap }

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
          name: getTeamDisplayName(winnerTeam, locale),
          code: winnerTeam.code,
          flag: winnerTeam.flag,
          confederation: winnerTeam.confederation,
        }
      }
    })

    return map
  }, [localizedBaseTeamsMap, locale, playoffsState.playoffTeams, playoffWinners])

  // Combined reset function
  const resetTournament = () => {
    resetTournamentBase()
  }

  // Combined simulate function
  const simulateTournament = () => {
    simulateTournamentBase()
  }

  const handleTabChange = (value: string) => {
    if (value === "playoffs" || value === "groups" || value === "squads" || value === "knockout") {
      setActiveTab(value as TournamentTab)
    }
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
          groupsComplete={groupsComplete}
        />
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid h-11 w-full max-w-3xl grid-cols-4">
            <TabsTrigger value="playoffs" className="gap-2 text-xs sm:text-sm">
              <Swords className="h-4 w-4 hidden sm:inline" />
              {t.simulator.tabs.playoffs}
            </TabsTrigger>
            <TabsTrigger value="groups" className="gap-2 text-xs sm:text-sm">
              <Users className="h-4 w-4 hidden sm:inline" />
              {t.simulator.tabs.groups}
            </TabsTrigger>
            <TabsTrigger value="squads" className="gap-2 text-xs sm:text-sm">
              <ClipboardList className="h-4 w-4 hidden sm:inline" />
              {t.simulator.tabs.squads}
            </TabsTrigger>
            <TabsTrigger value="knockout" className="gap-2 text-xs sm:text-sm">
              <GitBranch className="h-4 w-4 hidden sm:inline" />
              {t.simulator.tabs.knockout}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playoffs" className="mt-6">
            <PlayoffsStage
              playoffsState={playoffsState}
            />
          </TabsContent>

          <TabsContent value="groups" className="mt-6">
            <GroupStage
              groups={groups}
              groupMatches={groupMatches}
              groupStandings={activeGroupStandings}
              teamsMap={teamsMap}
              onScoreChange={handleScoreChange}
              qualifiedTeams={activeQualifiedTeams}
              thirdPlaceRanking={activeThirdPlaceRanking}
              simulateGroupStage={simulateGroupStage}
              resetGroups={resetGroupStage}
              predictionMode={groupPredictionMode}
              onPredictionModeChange={setGroupPredictionMode}
              groupPositionsByGroup={groupPositionsByGroup}
              thirdPlaceGroupOrder={thirdPlaceGroupOrder}
              onGroupPositionsChange={handleGroupPositionsChange}
              onThirdPlaceGroupOrderChange={handleThirdPlaceGroupOrderChange}
            />
          </TabsContent>

          <TabsContent value="squads" className="mt-6">
            <SquadsSection groups={groups} teamsMap={teamsMap} playoffWinners={playoffWinners} />
          </TabsContent>

          <TabsContent value="knockout" className="mt-6">
            <KnockoutBracket
              matches={activeKnockoutMatches}
              setMatches={activeSetKnockoutMatches}
              teamsMap={teamsMap}
              onScoreChange={handleKnockoutScoreChange}
              onPenaltyWinner={handleKnockoutPenaltyWinner}
              onWinnerSelect={handleKnockoutPositionWinner}
              groupStandings={activeKnockoutGroupStandings}
              thirdPlaceRanking={activeKnockoutThirdPlaceRanking}
              groupsComplete={activeGroupsComplete}
              simulateKnockoutStage={simulateKnockoutStage}
              simulatePositionKnockoutStage={simulatePositionKnockoutStage}
              resetKnockoutStage={resetKnockoutStage}
              predictionMode={knockoutPredictionMode}
              onPredictionModeChange={setKnockoutPredictionMode}
            />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}
