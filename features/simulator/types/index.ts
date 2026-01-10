import { Match } from "@/lib/types";

export interface TournamentSimulatorProps {
  simulateTournament: () => void
  simulateGroupStage: () => void
  simulateKnockoutStage: () => void
  groupsComplete: boolean
  generateKnockoutBracket: () => void;
  resetTournament: () => void;
  knockoutMatches: Match[];
}