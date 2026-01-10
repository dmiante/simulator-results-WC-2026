import { GroupStanding, Match, Team } from "@/lib/types"

export interface KnockoutBracketProps {
  matches: Match[]
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>
  teamsMap: Record<string, Team>
  onScoreChange: (matchId: string, team: "team1" | "team2", score: number | null) => void
  groupStandings: Record<string, GroupStanding[]>
  thirdPlaceRanking: {
    all: (GroupStanding & { group: string })[]
    qualified: (GroupStanding & { group: string })[]
    eliminated: (GroupStanding & { group: string })[]
  }
}