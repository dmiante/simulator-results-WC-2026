import { Button } from "@/components/ui/button";
import { GitBranch, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { TournamentSimulatorProps } from "../types";


export default function TournamentSimulatorButton({
  simulateTournament,
  generateKnockoutBracket,
  groupsComplete,
  knockoutMatches,
  resetTournament
}: TournamentSimulatorProps) {
  
  return (
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
  )
}
