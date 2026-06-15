import { Button } from "@/components/ui/button"
import { RotateCcw, Sparkles, Trophy } from "lucide-react"

import { TournamentSimulatorProps } from "../types"


export default function ButtonSimulator({
  simulateTournament,
  resetTournament,
}: TournamentSimulatorProps) {

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Trophy className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Tournament Simulator</h2>
      </div>
      <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
        <Button onClick={simulateTournament} className="min-h-11 w-full gap-2 cursor-pointer sm:w-auto" variant="default">
          <Sparkles className="h-4 w-4" />
          Simulate All
        </Button>
        <Button variant="outline" onClick={resetTournament} className="min-h-11 w-full gap-2 bg-transparent cursor-pointer sm:w-auto">
          <RotateCcw className="h-4 w-4" />
          Reset All
        </Button>
      </div>
    </div>
  )
}
