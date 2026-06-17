import { Match } from "@/lib/types"

export type TournamentTab = "playoffs" | "groups" | "squads" | "knockout"

export interface TournamentSimulatorProps {
  simulateTournament: () => void
  simulateGroupStage: () => void
  simulateKnockoutStage: () => void
  groupsComplete: boolean
  generateKnockoutBracket: () => void
  resetTournament: () => void
  knockoutMatches: Match[]
}
