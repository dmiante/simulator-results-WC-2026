import { Team } from "@/lib/types"

// Playoff path identifiers
export type UEFAPathId = "A" | "B" | "C" | "D"
export type ICPathId = "1" | "2"

// Match types for playoffs
export type PlayoffMatchStage = "semifinal" | "final"

export interface PlayoffMatch {
  id: string
  pathId: UEFAPathId | ICPathId
  stage: PlayoffMatchStage
  matchNumber: number // 1-2 for semifinals, 3 for final
  team1Id: string | null // null if depends on semifinal result
  team2Id: string | null // null if depends on semifinal result
  team1Score: number | null
  team2Score: number | null
  date: string
  venue?: string
  penaltyWinnerId?: string
  team1FromMatch?: string // e.g., "Winner SF1"
  team2FromMatch?: string // e.g., "Winner SF2"
}

export interface UEFAPlayoffPath {
  id: UEFAPathId
  name: string
  targetGroup: string // Group where winner goes
  targetSlotId: string // Team ID slot to replace (e.g., "uefaa")
  semifinal1: PlayoffMatch
  semifinal2: PlayoffMatch
  final: PlayoffMatch
}

export interface ICPlayoffPath {
  id: ICPathId
  name: string
  targetGroup: string
  targetSlotId: string // Team ID slot to replace (e.g., "icp1")
  semifinal: PlayoffMatch
  final: PlayoffMatch
}

export interface PlayoffTeam extends Team {
  playoffPath: UEFAPathId | ICPathId
  playoffType: "uefa" | "intercontinental"
  pot?: number // For UEFA playoffs: 1-4
  confederation: string
}

export interface PlayoffsState {
  uefaPaths: UEFAPlayoffPath[]
  icPaths: ICPlayoffPath[]
  playoffTeams: PlayoffTeam[]
  winners: {
    uefaa: string | null
    uefab: string | null
    uefac: string | null
    uefad: string | null
    icp1: string | null
    icp2: string | null
  }
}

export interface PlayoffsStageProps {
  playoffsState: PlayoffsState
  onMatchScoreChange: (matchId: string, team: "team1" | "team2", score: number | null) => void
  onPenaltyWinner: (matchId: string, winnerId: string) => void
}
