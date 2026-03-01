import { GroupStanding, Match } from "@/lib/types"
import { officialMatches } from "./tournament-data"

export function generateGroupMatches(): Match[] {
  return officialMatches.map((match) => ({
    id: `group-${match.group}-${match.matchNumber}`,
    team1Id: match.team1Id,
    team2Id: match.team2Id,
    team1Score: null,
    team2Score: null,
    stage: "group" as const,
    group: match.group,
    matchNumber: match.matchNumber,
    dateTime: match.dateTime,
    venue: match.venue,
  }))
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