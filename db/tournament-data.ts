import { Team } from "../lib/types"

// FIFA World Cup 2026 - 48 Teams (12 groups of 4)
// Official draw results from FIFA - December 2024
// Note: 6 spots TBD (4 UEFA playoffs + 2 intercontinental playoffs)
export const teams: Team[] = [
  // Group A
  { id: "mex", name: "Mexico", code: "MEX", flag: "🇲🇽", confederation: "CONCACAF" },
  { id: "rsa", name: "South Africa", code: "RSA", flag: "🇿🇦", confederation: "CAF" },
  { id: "kor", name: "South Korea", code: "KOR", flag: "🇰🇷", confederation: "AFC" },
  { id: "uefad", name: "UEFA Path D Winner", code: "TBD", flag: "🏳️", confederation: "UEFA" },
  // Group B
  { id: "can", name: "Canada", code: "CAN", flag: "🇨🇦", confederation: "CONCACAF" },
  { id: "uefaa", name: "UEFA Path A Winner", code: "TBD", flag: "🏳️", confederation: "UEFA" },
  { id: "qat", name: "Qatar", code: "QAT", flag: "🇶🇦", confederation: "AFC" },
  { id: "sui", name: "Switzerland", code: "SUI", flag: "🇨🇭", confederation: "UEFA" },
  // Group C
  { id: "bra", name: "Brazil", code: "BRA", flag: "🇧🇷", confederation: "CONMEBOL" },
  { id: "mar", name: "Morocco", code: "MAR", flag: "🇲🇦", confederation: "CAF" },
  { id: "hai", name: "Haiti", code: "HAI", flag: "🇭🇹", confederation: "CONCACAF" },
  { id: "sco", name: "Scotland", code: "SCO", flag: "🏴", confederation: "UEFA" },
  // Group D
  { id: "usa", name: "United States", code: "USA", flag: "🇺🇸", confederation: "CONCACAF" },
  { id: "par", name: "Paraguay", code: "PAR", flag: "🇵🇾", confederation: "CONMEBOL" },
  { id: "aus", name: "Australia", code: "AUS", flag: "🇦🇺", confederation: "AFC" },
  { id: "uefac", name: "UEFA Path C Winner", code: "TBD", flag: "🏳️", confederation: "UEFA" },
  // Group E
  { id: "ger", name: "Germany", code: "GER", flag: "🇩🇪", confederation: "UEFA" },
  { id: "cur", name: "Curaçao", code: "CUW", flag: "🇨🇼", confederation: "CONCACAF" },
  { id: "civ", name: "Ivory Coast", code: "CIV", flag: "🇨🇮", confederation: "CAF" },
  { id: "ecu", name: "Ecuador", code: "ECU", flag: "🇪🇨", confederation: "CONMEBOL" },
  // Group F
  { id: "ned", name: "Netherlands", code: "NED", flag: "🇳🇱", confederation: "UEFA" },
  { id: "jpn", name: "Japan", code: "JPN", flag: "🇯🇵", confederation: "AFC" },
  { id: "uefab", name: "UEFA Path B Winner", code: "TBD", flag: "🏳️", confederation: "UEFA" },
  { id: "tun", name: "Tunisia", code: "TUN", flag: "🇹🇳", confederation: "CAF" },
  // Group G
  { id: "bel", name: "Belgium", code: "BEL", flag: "🇧🇪", confederation: "UEFA" },
  { id: "egy", name: "Egypt", code: "EGY", flag: "🇪🇬", confederation: "CAF" },
  { id: "irn", name: "Iran", code: "IRN", flag: "🇮🇷", confederation: "AFC" },
  { id: "nzl", name: "New Zealand", code: "NZL", flag: "🇳🇿", confederation: "OFC" },
  // Group H
  { id: "esp", name: "Spain", code: "ESP", flag: "🇪🇸", confederation: "UEFA" },
  { id: "cpv", name: "Cape Verde", code: "CPV", flag: "🇨🇻", confederation: "CAF" },
  { id: "sau", name: "Saudi Arabia", code: "KSA", flag: "🇸🇦", confederation: "AFC" },
  { id: "uru", name: "Uruguay", code: "URU", flag: "🇺🇾", confederation: "CONMEBOL" },
  // Group I
  { id: "fra", name: "France", code: "FRA", flag: "🇫🇷", confederation: "UEFA" },
  { id: "sen", name: "Senegal", code: "SEN", flag: "🇸🇳", confederation: "CAF" },
  { id: "icp2", name: "IC Path 2 Winner", code: "TBD", flag: "🏳️", confederation: "TBD" },
  { id: "nor", name: "Norway", code: "NOR", flag: "🇳🇴", confederation: "UEFA" },
  // Group J
  { id: "arg", name: "Argentina", code: "ARG", flag: "🇦🇷", confederation: "CONMEBOL" },
  { id: "alg", name: "Algeria", code: "ALG", flag: "🇩🇿", confederation: "CAF" },
  { id: "aut", name: "Austria", code: "AUT", flag: "🇦🇹", confederation: "UEFA" },
  { id: "jor", name: "Jordan", code: "JOR", flag: "🇯🇴", confederation: "AFC" },
  // Group K
  { id: "por", name: "Portugal", code: "POR", flag: "🇵🇹", confederation: "UEFA" },
  { id: "icp1", name: "IC Path 1 Winner", code: "TBD", flag: "🏳️", confederation: "TBD" },
  { id: "uzb", name: "Uzbekistan", code: "UZB", flag: "🇺🇿", confederation: "AFC" },
  { id: "col", name: "Colombia", code: "COL", flag: "🇨🇴", confederation: "CONMEBOL" },
  // Group L
  { id: "eng", name: "England", code: "ENG", flag: "🏴", confederation: "UEFA" },
  { id: "cro", name: "Croatia", code: "CRO", flag: "🇭🇷", confederation: "UEFA" },
  { id: "gha", name: "Ghana", code: "GHA", flag: "🇬🇭", confederation: "CAF" },
  { id: "pan", name: "Panama", code: "PAN", flag: "🇵🇦", confederation: "CONCACAF" },
]

export const groups: Record<string, string[]> = {
  A: ["mex", "rsa", "kor", "uefad"],
  B: ["can", "uefaa", "qat", "sui"],
  C: ["bra", "mar", "hai", "sco"],
  D: ["usa", "par", "aus", "uefac"],
  E: ["ger", "cur", "civ", "ecu"],
  F: ["ned", "jpn", "uefab", "tun"],
  G: ["bel", "egy", "irn", "nzl"],
  H: ["esp", "cpv", "sau", "uru"],
  I: ["fra", "sen", "icp2", "nor"],
  J: ["arg", "alg", "aut", "jor"],
  K: ["por", "icp1", "uzb", "col"],
  L: ["eng", "cro", "gha", "pan"],
}

export const officialMatches: Array<{
  team1Id: string
  team2Id: string
  group: string
  date: string
  matchNumber: number
}> = [
  // Jornada 1 - 11 de junio 2026
  { team1Id: "mex", team2Id: "rsa", group: "A", date: "2026-06-11", matchNumber: 1 },
  // Jornada 1 - 12 de junio 2026
  { team1Id: "kor", team2Id: "uefad", group: "A", date: "2026-06-12", matchNumber: 2 },
  { team1Id: "can", team2Id: "uefaa", group: "B", date: "2026-06-12", matchNumber: 3 },
  { team1Id: "qat", team2Id: "sui", group: "B", date: "2026-06-12", matchNumber: 4 },
  { team1Id: "bra", team2Id: "mar", group: "C", date: "2026-06-12", matchNumber: 5 },
  { team1Id: "hai", team2Id: "sco", group: "C", date: "2026-06-12", matchNumber: 6 },
  // Jornada 1 - 13 de junio 2026
  { team1Id: "usa", team2Id: "par", group: "D", date: "2026-06-13", matchNumber: 7 },
  { team1Id: "aus", team2Id: "uefac", group: "D", date: "2026-06-13", matchNumber: 8 },
  { team1Id: "ger", team2Id: "cur", group: "E", date: "2026-06-13", matchNumber: 9 },
  { team1Id: "civ", team2Id: "ecu", group: "E", date: "2026-06-13", matchNumber: 10 },
  { team1Id: "ned", team2Id: "jpn", group: "F", date: "2026-06-13", matchNumber: 11 },
  { team1Id: "uefab", team2Id: "tun", group: "F", date: "2026-06-13", matchNumber: 12 },
  // Jornada 1 - 14 de junio 2026
  { team1Id: "bel", team2Id: "egy", group: "G", date: "2026-06-14", matchNumber: 13 },
  { team1Id: "irn", team2Id: "nzl", group: "G", date: "2026-06-14", matchNumber: 14 },
  { team1Id: "esp", team2Id: "cpv", group: "H", date: "2026-06-14", matchNumber: 15 },
  { team1Id: "sau", team2Id: "uru", group: "H", date: "2026-06-14", matchNumber: 16 },
  { team1Id: "fra", team2Id: "sen", group: "I", date: "2026-06-14", matchNumber: 17 },
  { team1Id: "icp2", team2Id: "nor", group: "I", date: "2026-06-14", matchNumber: 18 },
  // Jornada 1 - 15 de junio 2026
  { team1Id: "arg", team2Id: "alg", group: "J", date: "2026-06-15", matchNumber: 19 },
  { team1Id: "aut", team2Id: "jor", group: "J", date: "2026-06-15", matchNumber: 20 },
  { team1Id: "por", team2Id: "icp1", group: "K", date: "2026-06-15", matchNumber: 21 },
  { team1Id: "uzb", team2Id: "col", group: "K", date: "2026-06-15", matchNumber: 22 },
  { team1Id: "eng", team2Id: "cro", group: "L", date: "2026-06-15", matchNumber: 23 },
  { team1Id: "gha", team2Id: "pan", group: "L", date: "2026-06-15", matchNumber: 24 },

  // Jornada 2 - 16 de junio 2026
  { team1Id: "mex", team2Id: "kor", group: "A", date: "2026-06-16", matchNumber: 25 },
  { team1Id: "rsa", team2Id: "uefad", group: "A", date: "2026-06-16", matchNumber: 26 },
  { team1Id: "can", team2Id: "qat", group: "B", date: "2026-06-16", matchNumber: 27 },
  { team1Id: "uefaa", team2Id: "sui", group: "B", date: "2026-06-16", matchNumber: 28 },
  { team1Id: "bra", team2Id: "hai", group: "C", date: "2026-06-16", matchNumber: 29 },
  { team1Id: "mar", team2Id: "sco", group: "C", date: "2026-06-16", matchNumber: 30 },
  // Jornada 2 - 17 de junio 2026
  { team1Id: "usa", team2Id: "aus", group: "D", date: "2026-06-17", matchNumber: 31 },
  { team1Id: "par", team2Id: "uefac", group: "D", date: "2026-06-17", matchNumber: 32 },
  { team1Id: "ger", team2Id: "civ", group: "E", date: "2026-06-17", matchNumber: 33 },
  { team1Id: "cur", team2Id: "ecu", group: "E", date: "2026-06-17", matchNumber: 34 },
  { team1Id: "ned", team2Id: "uefab", group: "F", date: "2026-06-17", matchNumber: 35 },
  { team1Id: "jpn", team2Id: "tun", group: "F", date: "2026-06-17", matchNumber: 36 },
  // Jornada 2 - 18 de junio 2026
  { team1Id: "bel", team2Id: "irn", group: "G", date: "2026-06-18", matchNumber: 37 },
  { team1Id: "egy", team2Id: "nzl", group: "G", date: "2026-06-18", matchNumber: 38 },
  { team1Id: "esp", team2Id: "sau", group: "H", date: "2026-06-18", matchNumber: 39 },
  { team1Id: "cpv", team2Id: "uru", group: "H", date: "2026-06-18", matchNumber: 40 },
  { team1Id: "fra", team2Id: "icp2", group: "I", date: "2026-06-18", matchNumber: 41 },
  { team1Id: "sen", team2Id: "nor", group: "I", date: "2026-06-18", matchNumber: 42 },
  // Jornada 2 - 19 de junio 2026
  { team1Id: "arg", team2Id: "aut", group: "J", date: "2026-06-19", matchNumber: 43 },
  { team1Id: "alg", team2Id: "jor", group: "J", date: "2026-06-19", matchNumber: 44 },
  { team1Id: "por", team2Id: "uzb", group: "K", date: "2026-06-19", matchNumber: 45 },
  { team1Id: "icp1", team2Id: "col", group: "K", date: "2026-06-19", matchNumber: 46 },
  { team1Id: "eng", team2Id: "gha", group: "L", date: "2026-06-19", matchNumber: 47 },
  { team1Id: "cro", team2Id: "pan", group: "L", date: "2026-06-19", matchNumber: 48 },

  // Jornada 3 - 20 de junio 2026
  { team1Id: "mex", team2Id: "uefad", group: "A", date: "2026-06-20", matchNumber: 49 },
  { team1Id: "rsa", team2Id: "kor", group: "A", date: "2026-06-20", matchNumber: 50 },
  { team1Id: "can", team2Id: "sui", group: "B", date: "2026-06-20", matchNumber: 51 },
  { team1Id: "uefaa", team2Id: "qat", group: "B", date: "2026-06-20", matchNumber: 52 },
  { team1Id: "bra", team2Id: "sco", group: "C", date: "2026-06-20", matchNumber: 53 },
  { team1Id: "mar", team2Id: "hai", group: "C", date: "2026-06-20", matchNumber: 54 },
  // Jornada 3 - 21 de junio 2026
  { team1Id: "usa", team2Id: "uefac", group: "D", date: "2026-06-21", matchNumber: 55 },
  { team1Id: "par", team2Id: "aus", group: "D", date: "2026-06-21", matchNumber: 56 },
  { team1Id: "ger", team2Id: "ecu", group: "E", date: "2026-06-21", matchNumber: 57 },
  { team1Id: "cur", team2Id: "civ", group: "E", date: "2026-06-21", matchNumber: 58 },
  { team1Id: "ned", team2Id: "tun", group: "F", date: "2026-06-21", matchNumber: 59 },
  { team1Id: "jpn", team2Id: "uefab", group: "F", date: "2026-06-21", matchNumber: 60 },
  // Jornada 3 - 22 de junio 2026
  { team1Id: "bel", team2Id: "nzl", group: "G", date: "2026-06-22", matchNumber: 61 },
  { team1Id: "egy", team2Id: "irn", group: "G", date: "2026-06-22", matchNumber: 62 },
  { team1Id: "esp", team2Id: "uru", group: "H", date: "2026-06-22", matchNumber: 63 },
  { team1Id: "cpv", team2Id: "sau", group: "H", date: "2026-06-22", matchNumber: 64 },
  { team1Id: "fra", team2Id: "nor", group: "I", date: "2026-06-22", matchNumber: 65 },
  { team1Id: "sen", team2Id: "icp2", group: "I", date: "2026-06-22", matchNumber: 66 },
  // Jornada 3 - 23 de junio 2026
  { team1Id: "arg", team2Id: "jor", group: "J", date: "2026-06-23", matchNumber: 67 },
  { team1Id: "alg", team2Id: "aut", group: "J", date: "2026-06-23", matchNumber: 68 },
  { team1Id: "por", team2Id: "col", group: "K", date: "2026-06-23", matchNumber: 69 },
  { team1Id: "icp1", team2Id: "uzb", group: "K", date: "2026-06-23", matchNumber: 70 },
  { team1Id: "eng", team2Id: "pan", group: "L", date: "2026-06-23", matchNumber: 71 },
  { team1Id: "cro", team2Id: "gha", group: "L", date: "2026-06-23", matchNumber: 72 },
]

