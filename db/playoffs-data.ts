import { PlayoffTeam, UEFAPlayoffPath, ICPlayoffPath, PlayoffsState } from "@/features/playoffs-stage/types"

// ============================================
// UEFA PLAYOFF TEAMS (16 teams in 4 paths)
// ============================================

export const uefaPlayoffTeams: PlayoffTeam[] = [
  // POT 1 (Seeded - Semi-final hosts)
  { id: "ita", name: "Italy", code: "IT", flag: "🇮🇹", confederation: "UEFA", playoffPath: "A", playoffType: "uefa", pot: 1 },
  { id: "ukr", name: "Ukraine", code: "UA", flag: "🇺🇦", confederation: "UEFA", playoffPath: "B", playoffType: "uefa", pot: 1 },
  { id: "tur", name: "Turkey", code: "TR", flag: "🇹🇷", confederation: "UEFA", playoffPath: "C", playoffType: "uefa", pot: 1 },
  { id: "den", name: "Denmark", code: "DK", flag: "🇩🇰", confederation: "UEFA", playoffPath: "D", playoffType: "uefa", pot: 1 },

  // POT 2 (Seeded - Semi-final hosts)
  { id: "wal", name: "Wales", code: "GB-WLS", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", confederation: "UEFA", playoffPath: "A", playoffType: "uefa", pot: 2 },
  { id: "pol", name: "Poland", code: "PL", flag: "🇵🇱", confederation: "UEFA", playoffPath: "B", playoffType: "uefa", pot: 2 },
  { id: "svk", name: "Slovakia", code: "SK", flag: "🇸🇰", confederation: "UEFA", playoffPath: "C", playoffType: "uefa", pot: 2 },
  { id: "cze", name: "Czech Republic", code: "CZ", flag: "🇨🇿", confederation: "UEFA", playoffPath: "D", playoffType: "uefa", pot: 2 },

  // POT 3 (Unseeded - Away teams for Pot 2)
  { id: "bih", name: "Bosnia and Herzegovina", code: "BA", flag: "🇧🇦", confederation: "UEFA", playoffPath: "A", playoffType: "uefa", pot: 3 },
  { id: "alb", name: "Albania", code: "AL", flag: "🇦🇱", confederation: "UEFA", playoffPath: "B", playoffType: "uefa", pot: 3 },
  { id: "kos", name: "Kosovo", code: "XK", flag: "🇽🇰", confederation: "UEFA", playoffPath: "C", playoffType: "uefa", pot: 3 },
  { id: "irl", name: "Republic of Ireland", code: "IE", flag: "🇮🇪", confederation: "UEFA", playoffPath: "D", playoffType: "uefa", pot: 3 },

  // POT 4 (Unseeded - Away teams for Pot 1, via Nations League)
  { id: "nir", name: "Northern Ireland", code: "GB-NIR", flag: "🇬🇧", confederation: "UEFA", playoffPath: "A", playoffType: "uefa", pot: 4 },
  { id: "swe", name: "Sweden", code: "SE", flag: "🇸🇪", confederation: "UEFA", playoffPath: "B", playoffType: "uefa", pot: 4 },
  { id: "rou", name: "Romania", code: "RO", flag: "🇷🇴", confederation: "UEFA", playoffPath: "C", playoffType: "uefa", pot: 4 },
  { id: "mkd", name: "North Macedonia", code: "MK", flag: "🇲🇰", confederation: "UEFA", playoffPath: "D", playoffType: "uefa", pot: 4 },
]

// ============================================
// INTER-CONFEDERATION PLAYOFF TEAMS (6 teams in 2 paths)
// ============================================

export const icPlayoffTeams: PlayoffTeam[] = [
  // Path 1 - Seeded
  { id: "cod", name: "DR Congo", code: "CD", flag: "🇨🇩", confederation: "CAF", playoffPath: "1", playoffType: "intercontinental" },
  // Path 1 - Unseeded (semi-final)
  { id: "ncl", name: "New Caledonia", code: "NC", flag: "🇳🇨", confederation: "OFC", playoffPath: "1", playoffType: "intercontinental" },
  { id: "jam", name: "Jamaica", code: "JM", flag: "🇯🇲", confederation: "CONCACAF", playoffPath: "1", playoffType: "intercontinental" },

  // Path 2 - Seeded
  { id: "irq", name: "Iraq", code: "IQ", flag: "🇮🇶", confederation: "AFC", playoffPath: "2", playoffType: "intercontinental" },
  // Path 2 - Unseeded (semi-final)
  { id: "bol", name: "Bolivia", code: "BO", flag: "🇧🇴", confederation: "CONMEBOL", playoffPath: "2", playoffType: "intercontinental" },
  { id: "sur", name: "Suriname", code: "SR", flag: "🇸🇷", confederation: "CONCACAF", playoffPath: "2", playoffType: "intercontinental" },
]

// ============================================
// UEFA PLAYOFF PATHS STRUCTURE
// ============================================

export const uefaPlayoffPaths: UEFAPlayoffPath[] = [
  {
    id: "A",
    name: "UEFA Path A",
    targetGroup: "B",
    targetSlotId: "uefaa",
    semifinal1: {
      id: "uefa-a-sf1",
      pathId: "A",
      stage: "semifinal",
      matchNumber: 1,
      team1Id: "ita", // Italy (Pot 1 - Host)
      team2Id: "nir", // Northern Ireland (Pot 4 - Away)
      team1Score: null,
      team2Score: null,
      date: "2026-03-26",
      venue: "Bergamo",
    },
    semifinal2: {
      id: "uefa-a-sf2",
      pathId: "A",
      stage: "semifinal",
      matchNumber: 2,
      team1Id: "wal", // Wales (Pot 2 - Host)
      team2Id: "bih", // Bosnia and Herzegovina (Pot 3 - Away)
      team1Score: null,
      team2Score: null,
      date: "2026-03-26",
      venue: "Cardiff",
    },
    final: {
      id: "uefa-a-final",
      pathId: "A",
      stage: "final",
      matchNumber: 3,
      team1Id: null,
      team2Id: null,
      team1Score: null,
      team2Score: null,
      date: "2026-03-31",
      venue: "Cardiff or Zenica",
      team1FromMatch: "Winner SF2",
      team2FromMatch: "Winner SF1",
    },
  },
  {
    id: "B",
    name: "UEFA Path B",
    targetGroup: "F",
    targetSlotId: "uefab",
    semifinal1: {
      id: "uefa-b-sf1",
      pathId: "B",
      stage: "semifinal",
      matchNumber: 1,
      team1Id: "ukr", // Ukraine (Pot 1 - Host, neutral venue)
      team2Id: "swe", // Sweden (Pot 4 - Away)
      team1Score: null,
      team2Score: null,
      date: "2026-03-26",
      venue: "Valencia (neutral)",
    },
    semifinal2: {
      id: "uefa-b-sf2",
      pathId: "B",
      stage: "semifinal",
      matchNumber: 2,
      team1Id: "pol", // Poland (Pot 2 - Host)
      team2Id: "alb", // Albania (Pot 3 - Away)
      team1Score: null,
      team2Score: null,
      date: "2026-03-26",
      venue: "Warsaw",
    },
    final: {
      id: "uefa-b-final",
      pathId: "B",
      stage: "final",
      matchNumber: 3,
      team1Id: null,
      team2Id: null,
      team1Score: null,
      team2Score: null,
      date: "2026-03-31",
      venue: "Valencia or Solna",
      team1FromMatch: "Winner SF1",
      team2FromMatch: "Winner SF2",
    },
  },
  {
    id: "C",
    name: "UEFA Path C",
    targetGroup: "D",
    targetSlotId: "uefac",
    semifinal1: {
      id: "uefa-c-sf1",
      pathId: "C",
      stage: "semifinal",
      matchNumber: 1,
      team1Id: "tur", // Turkey (Pot 1 - Host)
      team2Id: "rou", // Romania (Pot 4 - Away)
      team1Score: null,
      team2Score: null,
      date: "2026-03-26",
      venue: "Istanbul",
    },
    semifinal2: {
      id: "uefa-c-sf2",
      pathId: "C",
      stage: "semifinal",
      matchNumber: 2,
      team1Id: "svk", // Slovakia (Pot 2 - Host)
      team2Id: "kos", // Kosovo (Pot 3 - Away)
      team1Score: null,
      team2Score: null,
      date: "2026-03-26",
      venue: "Bratislava",
    },
    final: {
      id: "uefa-c-final",
      pathId: "C",
      stage: "final",
      matchNumber: 3,
      team1Id: null,
      team2Id: null,
      team1Score: null,
      team2Score: null,
      date: "2026-03-31",
      venue: "Bratislava or Pristina",
      team1FromMatch: "Winner SF2",
      team2FromMatch: "Winner SF1",
    },
  },
  {
    id: "D",
    name: "UEFA Path D",
    targetGroup: "A",
    targetSlotId: "uefad",
    semifinal1: {
      id: "uefa-d-sf1",
      pathId: "D",
      stage: "semifinal",
      matchNumber: 1,
      team1Id: "den", // Denmark (Pot 1 - Host)
      team2Id: "mkd", // North Macedonia (Pot 4 - Away)
      team1Score: null,
      team2Score: null,
      date: "2026-03-26",
      venue: "Copenhagen",
    },
    semifinal2: {
      id: "uefa-d-sf2",
      pathId: "D",
      stage: "semifinal",
      matchNumber: 2,
      team1Id: "cze", // Czech Republic (Pot 2 - Host)
      team2Id: "irl", // Republic of Ireland (Pot 3 - Away)
      team1Score: null,
      team2Score: null,
      date: "2026-03-26",
      venue: "Prague",
    },
    final: {
      id: "uefa-d-final",
      pathId: "D",
      stage: "final",
      matchNumber: 3,
      team1Id: null,
      team2Id: null,
      team1Score: null,
      team2Score: null,
      date: "2026-03-31",
      venue: "Prague or Dublin",
      team1FromMatch: "Winner SF2",
      team2FromMatch: "Winner SF1",
    },
  },
]

// ============================================
// INTER-CONFEDERATION PLAYOFF PATHS STRUCTURE
// ============================================

export const icPlayoffPaths: ICPlayoffPath[] = [
  {
    id: "1",
    name: "IC Path 1",
    targetGroup: "K",
    targetSlotId: "icp1",
    semifinal: {
      id: "ic-1-sf",
      pathId: "1",
      stage: "semifinal",
      matchNumber: 1,
      team1Id: "ncl", // New Caledonia
      team2Id: "jam", // Jamaica
      team1Score: null,
      team2Score: null,
      date: "2026-03-26",
      venue: "Guadalajara (Estadio Akron)",
    },
    final: {
      id: "ic-1-final",
      pathId: "1",
      stage: "final",
      matchNumber: 2,
      team1Id: "cod", // DR Congo (Seeded)
      team2Id: null,
      team1Score: null,
      team2Score: null,
      date: "2026-03-31",
      venue: "Guadalajara (Estadio Akron)",
      team2FromMatch: "Winner Match 1",
    },
  },
  {
    id: "2",
    name: "IC Path 2",
    targetGroup: "I",
    targetSlotId: "icp2",
    semifinal: {
      id: "ic-2-sf",
      pathId: "2",
      stage: "semifinal",
      matchNumber: 1,
      team1Id: "bol", // Bolivia
      team2Id: "sur", // Suriname
      team1Score: null,
      team2Score: null,
      date: "2026-03-26",
      venue: "Monterrey (Estadio BBVA)",
    },
    final: {
      id: "ic-2-final",
      pathId: "2",
      stage: "final",
      matchNumber: 2,
      team1Id: "irq", // Iraq (Seeded)
      team2Id: null,
      team1Score: null,
      team2Score: null,
      date: "2026-03-31",
      venue: "Monterrey (Estadio BBVA)",
      team2FromMatch: "Winner Match 2",
    },
  },
]

// ============================================
// ALL PLAYOFF TEAMS COMBINED
// ============================================

export const allPlayoffTeams: PlayoffTeam[] = [...uefaPlayoffTeams, ...icPlayoffTeams]

// ============================================
// INITIAL PLAYOFFS STATE
// ============================================

export const initialPlayoffsState: PlayoffsState = {
  uefaPaths: uefaPlayoffPaths,
  icPaths: icPlayoffPaths,
  playoffTeams: allPlayoffTeams,
  winners: {
    uefaa: null, // Winner of Path A → Group B
    uefab: null, // Winner of Path B → Group F
    uefac: null, // Winner of Path C → Group D
    uefad: null, // Winner of Path D → Group A
    icp1: null,  // Winner of IC Path 1 → Group K
    icp2: null,  // Winner of IC Path 2 → Group I
  },
}

// ============================================
// HELPER: Get team by ID from playoff teams
// ============================================

export function getPlayoffTeam(teamId: string): PlayoffTeam | undefined {
  return allPlayoffTeams.find((team) => team.id === teamId)
}

// ============================================
// HELPER: Get path winner destination info
// ============================================

export const playoffDestinations = {
  uefaa: { group: "B", description: "UEFA Path A → Group B" },
  uefab: { group: "F", description: "UEFA Path B → Group F" },
  uefac: { group: "D", description: "UEFA Path C → Group D" },
  uefad: { group: "A", description: "UEFA Path D → Group A" },
  icp1: { group: "K", description: "IC Path 1 → Group K" },
  icp2: { group: "I", description: "IC Path 2 → Group I" },
}
