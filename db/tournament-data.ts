import { GroupStanding, Match, Team } from "../lib/types"

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
  { id: "sco", name: "Scotland", code: "SCO", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", confederation: "UEFA" },
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
  { id: "eng", name: "England", code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", confederation: "UEFA" },
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
