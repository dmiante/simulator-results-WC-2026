"use client"

import { ExportImageButton } from "@/components/export-image-button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { MatchInput } from "@/features/group-stage/components/match-input"
import { StandingsTable } from "@/features/group-stage/components/standings-table"

import { GroupStageProps } from "../types"
import { GroupPositionList } from "./group-position-list"
import { ThirdPlaceTable } from "./third-place-table"
import { ThirdPlaceDndTable } from "./third-place-dnd-table"
import { Camera, Dices, RotateCcw } from "lucide-react"


export function GroupStage({
  groups,
  groupMatches,
  groupStandings,
  teamsMap,
  onScoreChange,
  qualifiedTeams,
  thirdPlaceRanking,
  simulateGroupStage,
  resetGroups,
  predictionMode,
  onPredictionModeChange,
  groupPositionsByGroup,
  thirdPlaceGroupOrder,
  onGroupPositionsChange,
  onThirdPlaceGroupOrderChange,
}: GroupStageProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={predictionMode} onValueChange={(value) => onPredictionModeChange(value === "positions" ? "positions" : "match")} className="w-full sm:w-auto">
          <TabsList className="grid h-11 w-full grid-cols-2 sm:w-fit">
            <TabsTrigger value="match">Scores</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end">
        {predictionMode === "match" && (
          <Button onClick={simulateGroupStage} className="min-h-11 w-full gap-2 cursor-pointer sm:w-auto" variant="default">
            <Dices className="h-4 w-4" />
            Simulate Groups
          </Button>
        )}
        <Button onClick={resetGroups} className="min-h-11 w-full gap-2 cursor-pointer sm:w-auto" variant="outline">
          <RotateCcw className="h-4 w-4" />
          Reset {predictionMode === "positions" ? "Positions" : "Groups"}
        </Button>
        </div>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold">Group Stage</h2>
        <p className="text-muted-foreground">
          {predictionMode === "positions"
            ? "Drag from each handle to set finishing positions and choose the best third-place teams"
            : "June 11–27, 2026 • Simulate results and determine the qualifiers"}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Qualified:</span>
          <Badge variant="default">
            {qualifiedTeams.first.length + qualifiedTeams.second.length + qualifiedTeams.thirdBest.length} / 32
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-muted-foreground">1st & 2nd Place</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs text-muted-foreground">Best 3rd</span>
        </div>
      </div>

      {/* Groups grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(groups).map(([groupName]) => {
          const matches = groupMatches.filter((m) => m.group === groupName)
          const standings = groupStandings[groupName] || []

          return (
            <Card key={groupName} className="overflow-hidden" id={`group-card-${groupName}`}>
              <CardHeader className="bg-muted/30 py-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {groupName}
                  </span>
                  Group {groupName}
                </CardTitle>
                <CardAction>
                  <ExportImageButton
                    getTarget={() => document.getElementById(`group-card-${groupName}`)}
                    filename={`Group ${groupName}.png`}
                    ariaLabel={`Screenshot group ${groupName}`}
                    showLabel={false}
                    icon={Camera}
                    size="icon-sm"
                    className="cursor-pointer"
                  />
                </CardAction>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {predictionMode === "positions" ? (
                  <GroupPositionList
                    teamIds={groupPositionsByGroup[groupName] || []}
                    teamsMap={teamsMap}
                    onReorder={(teamIds) => onGroupPositionsChange(groupName, teamIds)}
                  />
                ) : (
                  <>
                    {/* Standings */}
                    <StandingsTable standings={standings} teamsMap={teamsMap} qualifiedTeams={qualifiedTeams} />

                    {/* Matches */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Matches</h4>
                      <div className="space-y-2">
                        {matches.map((match) => (
                          <MatchInput
                            key={match.id}
                            match={match}
                            team1={teamsMap[match.team1Id]}
                            team2={teamsMap[match.team2Id]}
                            onScoreChange={onScoreChange}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
      {predictionMode === "positions" ? (
        <ThirdPlaceDndTable
          groupOrder={thirdPlaceGroupOrder}
          groupPositionsByGroup={groupPositionsByGroup}
          teamsMap={teamsMap}
          onReorder={onThirdPlaceGroupOrderChange}
        />
      ) : (
        <ThirdPlaceTable ranking={thirdPlaceRanking} teamsMap={teamsMap} />
      )}
    </div>
  )
}
