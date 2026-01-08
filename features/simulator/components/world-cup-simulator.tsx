"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, GitBranch } from "lucide-react"
import { GroupStage } from "@/features/group-stage/components/group-stage"
import { KnockoutBracket } from "@/features/knockout-stage/components/knockout-bracket"
import { TournamentHeader } from "@/components/layout/tournament-header"
import { groups } from "@/db/tournament-data"
import { useTournament } from "../hooks/use-tournament"
import TournamentSimulatorButton from "./tournament-simulator"

export function WorldCupSimulator() {

  const {
    activeTab,
    groupMatches,
    groupStandings,
    knockoutMatches,
    qualifiedTeams,
    thirdPlaceRanking,
    teamsMap,
    handleKnockoutScoreChange,
    groupsComplete,
    handleScoreChange,
    setKnockoutMatches,
    setActiveTab,
    generateKnockoutBracket,
    resetTournament,
    simulateTournament
  } = useTournament()
  

  return (
    <div className="min-h-screen bg-background">
      <TournamentHeader />
      <div className="container mx-auto px-4 py-6">
        <TournamentSimulatorButton 
          generateKnockoutBracket={generateKnockoutBracket}
          groupsComplete={groupsComplete}
          resetTournament={resetTournament}
          simulateTournament={simulateTournament}
          knockoutMatches={knockoutMatches}
        />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="groups" className="gap-2">
              <Users className="h-4 w-4" />
              Group Stage
            </TabsTrigger>
            <TabsTrigger value="knockout" className="gap-2">
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
              thirdPlaceRanking={thirdPlaceRanking}
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
