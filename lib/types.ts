export interface Team {
  id: string
  name: string
  code: string
  flag: string
  confederation: string
}

export interface Match {
  id: string
  team1Id: string
  team2Id: string
  team1Score: number | null
  team2Score: number | null
  stage: "group" | "round32" | "round16" | "quarter" | "semi" | "third" | "final"
  group?: string
  matchNumber: number
  dateTime?: string // ISO 8601 datetime in UTC (ej: "2026-06-12T01:00:00Z")
  venue?: string // Ciudad y estadio (ej: "Mexico City, Estadio Azteca")
  penaltyWinnerId?: string // ID del equipo ganador en caso de empate (penales) - solo para fase de eliminación
}

export interface GroupStanding {
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  group?: string
}

export type ThirdPlaceCombination = {
  [key: string]: string[];
};

// Playoff types
export type PlayoffSlotId = "uefaa" | "uefab" | "uefac" | "uefad" | "icp1" | "icp2"

export interface PlayoffWinners {
  uefaa: string | null  // Winner goes to Group B
  uefab: string | null  // Winner goes to Group F
  uefac: string | null  // Winner goes to Group D
  uefad: string | null  // Winner goes to Group A
  icp1: string | null   // Winner goes to Group K
  icp2: string | null   // Winner goes to Group I
}