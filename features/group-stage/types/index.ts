import { GroupStanding, Match, Team } from "@/lib/types"

export interface GroupStageProps {
  groups: Record<string, string[]>
  groupMatches: Match[]
  groupStandings: Record<string, GroupStanding[]>
  teamsMap: Record<string, Team>
  onScoreChange: (matchId: string, team: "team1" | "team2", score: number | null) => void
  qualifiedTeams: { first: string[]; second: string[]; thirdBest: string[] }
  thirdPlaceRanking: {
    all: (GroupStanding & { group: string })[]
    qualified: (GroupStanding & { group: string })[]
    eliminated: (GroupStanding & { group: string })[]
  }
}

export interface MatchInputProps {
  match: Match
  team1: Team | undefined
  team2: Team | undefined
  onScoreChange: (matchId: string, team: "team1" | "team2", score: number | null) => void
  compact?: boolean
}

export interface StandingsTableProps {
  standings: GroupStanding[]
  teamsMap: Record<string, Team>
  qualifiedTeams: { first: string[]; second: string[]; thirdBest: string[] }
}