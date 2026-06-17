export type PlayerPosition = "goalkeeper" | "defender" | "midfielder" | "forward"

export interface SquadPlayer {
  id: string
  name: string
  position: PlayerPosition
  club?: string
  shirtNumber?: number
  birthDate?: string
}

export interface TeamSquad {
  teamId: string
  source?: string
  lastUpdated?: string
  players: SquadPlayer[]
}
