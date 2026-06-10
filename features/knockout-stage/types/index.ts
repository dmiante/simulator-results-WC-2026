import { GroupStanding, Match, PredictionMode, Team } from "@/lib/types"

export interface KnockoutBracketProps {
  matches: Match[]
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>
  teamsMap: Record<string, Team>
  onScoreChange: (matchId: string, team: "team1" | "team2", score: number | null) => void
  onPenaltyWinner: (matchId: string, winnerId: string) => void
  onWinnerSelect: (matchId: string, winnerId: string) => void
  groupStandings: Record<string, GroupStanding[]>
  thirdPlaceRanking: {
    all: (GroupStanding & { group: string })[]
    qualified: (GroupStanding & { group: string })[]
    eliminated: (GroupStanding & { group: string })[]
  }
  groupsComplete: boolean
  simulateKnockoutStage: () => void
  simulatePositionKnockoutStage: () => void
  resetKnockoutStage: () => void
  predictionMode: PredictionMode
  onPredictionModeChange: (mode: PredictionMode) => void
}
