import { TeamSquad } from "@/features/squads/types"

export const teamSquads: TeamSquad[] = [
  {
    teamId: "mex",
    source: "Initial example structure",
    lastUpdated: "2026-06-17",
    players: [
      { id: "mex-1", name: "Jugador ejemplo 1", position: "goalkeeper", shirtNumber: 1, club: "Club ejemplo" },
      { id: "mex-2", name: "Jugador ejemplo 2", position: "defender", shirtNumber: 2, club: "Club ejemplo" },
      { id: "mex-3", name: "Jugador ejemplo 3", position: "midfielder", shirtNumber: 8, club: "Club ejemplo" },
      { id: "mex-4", name: "Jugador ejemplo 4", position: "forward", shirtNumber: 9, club: "Club ejemplo" },
    ],
  },
  {
    teamId: "arg",
    source: "Initial example structure",
    lastUpdated: "2026-06-17",
    players: [
      { id: "arg-1", name: "Jugador ejemplo 1", position: "goalkeeper", shirtNumber: 1, club: "Club ejemplo" },
      { id: "arg-2", name: "Jugador ejemplo 2", position: "defender", shirtNumber: 4, club: "Club ejemplo" },
      { id: "arg-3", name: "Jugador ejemplo 3", position: "midfielder", shirtNumber: 10, club: "Club ejemplo" },
      { id: "arg-4", name: "Jugador ejemplo 4", position: "forward", shirtNumber: 11, club: "Club ejemplo" },
    ],
  },
  {
    teamId: "bih",
    source: "Initial example structure",
    lastUpdated: "2026-06-17",
    players: [],
  },
  {
    teamId: "swe",
    source: "Initial example structure",
    lastUpdated: "2026-06-17",
    players: [],
  },
  {
    teamId: "tur",
    source: "Initial example structure",
    lastUpdated: "2026-06-17",
    players: [],
  },
  {
    teamId: "cze",
    source: "Initial example structure",
    lastUpdated: "2026-06-17",
    players: [],
  },
  {
    teamId: "cod",
    source: "Initial example structure",
    lastUpdated: "2026-06-17",
    players: [],
  },
  {
    teamId: "irq",
    source: "Initial example structure",
    lastUpdated: "2026-06-17",
    players: [],
  },
]

export const teamSquadsMap: Record<string, TeamSquad> = Object.fromEntries(
  teamSquads.map((squad) => [squad.teamId, squad]),
)
