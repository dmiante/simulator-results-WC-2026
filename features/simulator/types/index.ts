import { Match } from "@/lib/types";

export interface TournamentSimulatorProps {
  simulateTournament: () => void
  groupsComplete: boolean
  generateKnockoutBracket: () => void;
  resetTournament: () => void;
  knockoutMatches: Match[];
}