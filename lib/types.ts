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
}