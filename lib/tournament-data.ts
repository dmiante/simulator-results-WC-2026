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

// FIFA World Cup 2026 - 48 Teams (12 groups of 4)
export const teams: Team[] = [
  // Group A
  { id: "usa", name: "United States", code: "USA", flag: "🇺🇸", confederation: "CONCACAF" },
  { id: "ger", name: "Germany", code: "GER", flag: "🇩🇪", confederation: "UEFA" },
  { id: "mar", name: "Morocco", code: "MAR", flag: "🇲🇦", confederation: "CAF" },
  { id: "nzl", name: "New Zealand", code: "NZL", flag: "🇳🇿", confederation: "OFC" },
  // Group B
  { id: "mex", name: "Mexico", code: "MEX", flag: "🇲🇽", confederation: "CONCACAF" },
  { id: "eng", name: "England", code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", confederation: "UEFA" },
  { id: "sen", name: "Senegal", code: "SEN", flag: "🇸🇳", confederation: "CAF" },
  { id: "sau", name: "Saudi Arabia", code: "KSA", flag: "🇸🇦", confederation: "AFC" },
  // Group C
  { id: "can", name: "Canada", code: "CAN", flag: "🇨🇦", confederation: "CONCACAF" },
  { id: "fra", name: "France", code: "FRA", flag: "🇫🇷", confederation: "UEFA" },
  { id: "alg", name: "Algeria", code: "ALG", flag: "🇩🇿", confederation: "CAF" },
  { id: "jpn", name: "Japan", code: "JPN", flag: "🇯🇵", confederation: "AFC" },
  // Group D
  { id: "arg", name: "Argentina", code: "ARG", flag: "🇦🇷", confederation: "CONMEBOL" },
  { id: "ned", name: "Netherlands", code: "NED", flag: "🇳🇱", confederation: "UEFA" },
  { id: "ngr", name: "Nigeria", code: "NGA", flag: "🇳🇬", confederation: "CAF" },
  { id: "crc", name: "Costa Rica", code: "CRC", flag: "🇨🇷", confederation: "CONCACAF" },
  // Group E
  { id: "bra", name: "Brazil", code: "BRA", flag: "🇧🇷", confederation: "CONMEBOL" },
  { id: "esp", name: "Spain", code: "ESP", flag: "🇪🇸", confederation: "UEFA" },
  { id: "cmr", name: "Cameroon", code: "CMR", flag: "🇨🇲", confederation: "CAF" },
  { id: "kor", name: "South Korea", code: "KOR", flag: "🇰🇷", confederation: "AFC" },
  // Group F
  { id: "uru", name: "Uruguay", code: "URU", flag: "🇺🇾", confederation: "CONMEBOL" },
  { id: "por", name: "Portugal", code: "POR", flag: "🇵🇹", confederation: "UEFA" },
  { id: "gha", name: "Ghana", code: "GHA", flag: "🇬🇭", confederation: "CAF" },
  { id: "aus", name: "Australia", code: "AUS", flag: "🇦🇺", confederation: "AFC" },
  // Group G
  { id: "col", name: "Colombia", code: "COL", flag: "🇨🇴", confederation: "CONMEBOL" },
  { id: "ita", name: "Italy", code: "ITA", flag: "🇮🇹", confederation: "UEFA" },
  { id: "egy", name: "Egypt", code: "EGY", flag: "🇪🇬", confederation: "CAF" },
  { id: "irn", name: "Iran", code: "IRN", flag: "🇮🇷", confederation: "AFC" },
  // Group H
  { id: "chi", name: "Chile", code: "CHI", flag: "🇨🇱", confederation: "CONMEBOL" },
  { id: "bel", name: "Belgium", code: "BEL", flag: "🇧🇪", confederation: "UEFA" },
  { id: "civ", name: "Ivory Coast", code: "CIV", flag: "🇨🇮", confederation: "CAF" },
  { id: "qat", name: "Qatar", code: "QAT", flag: "🇶🇦", confederation: "AFC" },
  // Group I
  { id: "ecu", name: "Ecuador", code: "ECU", flag: "🇪🇨", confederation: "CONMEBOL" },
  { id: "cro", name: "Croatia", code: "CRO", flag: "🇭🇷", confederation: "UEFA" },
  { id: "tun", name: "Tunisia", code: "TUN", flag: "🇹🇳", confederation: "CAF" },
  { id: "ind", name: "Indonesia", code: "IDN", flag: "🇮🇩", confederation: "AFC" },
  // Group J
  { id: "per", name: "Peru", code: "PER", flag: "🇵🇪", confederation: "CONMEBOL" },
  { id: "den", name: "Denmark", code: "DEN", flag: "🇩🇰", confederation: "UEFA" },
  { id: "rsa", name: "South Africa", code: "RSA", flag: "🇿🇦", confederation: "CAF" },
  { id: "uae", name: "UAE", code: "UAE", flag: "🇦🇪", confederation: "AFC" },
  // Group K
  { id: "par", name: "Paraguay", code: "PAR", flag: "🇵🇾", confederation: "CONMEBOL" },
  { id: "sui", name: "Switzerland", code: "SUI", flag: "🇨🇭", confederation: "UEFA" },
  { id: "mli", name: "Mali", code: "MLI", flag: "🇲🇱", confederation: "CAF" },
  { id: "uzb", name: "Uzbekistan", code: "UZB", flag: "🇺🇿", confederation: "AFC" },
  // Group L
  { id: "ven", name: "Venezuela", code: "VEN", flag: "🇻🇪", confederation: "CONMEBOL" },
  { id: "pol", name: "Poland", code: "POL", flag: "🇵🇱", confederation: "UEFA" },
  { id: "drc", name: "DR Congo", code: "COD", flag: "🇨🇩", confederation: "CAF" },
  { id: "kuw", name: "Kuwait", code: "KUW", flag: "🇰🇼", confederation: "AFC" },
]

export const groups: Record<string, string[]> = {
  A: ["usa", "ger", "mar", "nzl"],
  B: ["mex", "eng", "sen", "sau"],
  C: ["can", "fra", "alg", "jpn"],
  D: ["arg", "ned", "ngr", "crc"],
  E: ["bra", "esp", "cmr", "kor"],
  F: ["uru", "por", "gha", "aus"],
  G: ["col", "ita", "egy", "irn"],
  H: ["chi", "bel", "civ", "qat"],
  I: ["ecu", "cro", "tun", "ind"],
  J: ["per", "den", "rsa", "uae"],
  K: ["par", "sui", "mli", "uzb"],
  L: ["ven", "pol", "drc", "kuw"],
}

export function generateGroupMatches(): Match[] {
  const matches: Match[] = []
  let matchNumber = 1

  Object.entries(groups).forEach(([groupName, teamIds]) => {
    // Each team plays against every other team in the group (round-robin)
    for (let i = 0; i < teamIds.length; i++) {
      for (let j = i + 1; j < teamIds.length; j++) {
        matches.push({
          id: `group-${groupName}-${matchNumber}`,
          team1Id: teamIds[i],
          team2Id: teamIds[j],
          team1Score: null,
          team2Score: null,
          stage: "group",
          group: groupName,
          matchNumber: matchNumber++,
        })
      }
    }
  })

  return matches
}

export function calculateStandings(groupTeams: string[], matches: Match[]): GroupStanding[] {
  const standings: Record<string, GroupStanding> = {}

  groupTeams.forEach((teamId) => {
    standings[teamId] = {
      teamId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    }
  })

  matches.forEach((match) => {
    if (match.team1Score === null || match.team2Score === null) return
    if (!standings[match.team1Id] || !standings[match.team2Id]) return

    const s1 = standings[match.team1Id]
    const s2 = standings[match.team2Id]

    s1.played++
    s2.played++
    s1.goalsFor += match.team1Score
    s1.goalsAgainst += match.team2Score
    s2.goalsFor += match.team2Score
    s2.goalsAgainst += match.team1Score

    if (match.team1Score > match.team2Score) {
      s1.won++
      s1.points += 3
      s2.lost++
    } else if (match.team1Score < match.team2Score) {
      s2.won++
      s2.points += 3
      s1.lost++
    } else {
      s1.drawn++
      s2.drawn++
      s1.points += 1
      s2.points += 1
    }

    s1.goalDifference = s1.goalsFor - s1.goalsAgainst
    s2.goalDifference = s2.goalsFor - s2.goalsAgainst
  })

  return Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
    return b.goalsFor - a.goalsFor
  })
}
