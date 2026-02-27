"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { PlayoffsState, PlayoffMatch, UEFAPlayoffPath, ICPlayoffPath } from "../types"
import { initialPlayoffsState } from "@/db/playoffs-data"

function getMatchWinner(match: PlayoffMatch): string | null {
  if (match.team1Score === null || match.team2Score === null) return null
  if (!match.team1Id || !match.team2Id) return null
  
  if (match.team1Score > match.team2Score) return match.team1Id
  if (match.team2Score > match.team1Score) return match.team2Id
  
  // Draw - check penalty winner
  if (match.penaltyWinnerId) return match.penaltyWinnerId
  
  return null
}

function generateRandomScore(): number {
  const weights = [20, 30, 25, 15, 7, 3] // 0, 1, 2, 3, 4, 5 goals
  const total = weights.reduce((a, b) => a + b, 0)
  let random = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    random -= weights[i]
    if (random <= 0) return i
  }
  return 0
}

function simulatePlayoffMatch(team1Id: string | null, team2Id: string | null): { 
  score1: number; 
  score2: number; 
  penaltyWinnerId?: string 
} {
  if (!team1Id || !team2Id) return { score1: 0, score2: 0 }
  
  const score1 = generateRandomScore()
  const score2 = generateRandomScore()
  
  if (score1 === score2) {
    return { score1, score2, penaltyWinnerId: Math.random() > 0.5 ? team1Id : team2Id }
  }
  
  return { score1, score2 }
}

// localStorage key for persistence
const STORAGE_KEY_PLAYOFFS = "wc2026-playoffs-state"

export function usePlayoffs() {
  const [playoffsState, setPlayoffsState] = useState<PlayoffsState>(initialPlayoffsState)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage after hydration (client-side only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAYOFFS)
      if (saved) {
        setPlayoffsState(JSON.parse(saved))
      }
    } catch {
      // Si hay error de parsing, mantener datos por defecto
    }
    setIsHydrated(true)
  }, [])

  // Persist playoffsState to localStorage (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY_PLAYOFFS, JSON.stringify(playoffsState))
    }
  }, [playoffsState, isHydrated])

  // Calculate winners based on current match results
  const calculatedWinners = useMemo(() => {
    const winners = { ...playoffsState.winners }

    // Calculate UEFA path winners
    playoffsState.uefaPaths.forEach((path) => {
      const finalWinner = getMatchWinner(path.final)
      const slotKey = path.targetSlotId as keyof typeof winners
      winners[slotKey] = finalWinner
    })

    // Calculate IC path winners
    playoffsState.icPaths.forEach((path) => {
      const finalWinner = getMatchWinner(path.final)
      const slotKey = path.targetSlotId as keyof typeof winners
      winners[slotKey] = finalWinner
    })

    return winners
  }, [playoffsState.uefaPaths, playoffsState.icPaths])

  // Update finals with semifinal winners
  const updateFinalsWithWinners = useCallback((
    uefaPaths: UEFAPlayoffPath[],
    icPaths: ICPlayoffPath[]
  ): { uefaPaths: UEFAPlayoffPath[]; icPaths: ICPlayoffPath[] } => {
    // Update UEFA paths
    const updatedUefaPaths = uefaPaths.map((path) => {
      const sf1Winner = getMatchWinner(path.semifinal1)
      const sf2Winner = getMatchWinner(path.semifinal2)

      // Determine final teams based on path structure
      // Path A, C, D: SF2 winner hosts vs SF1 winner
      // Path B: SF1 winner hosts vs SF2 winner
      let finalTeam1Id: string | null = null
      let finalTeam2Id: string | null = null

      if (path.id === "B") {
        finalTeam1Id = sf1Winner
        finalTeam2Id = sf2Winner
      } else {
        finalTeam1Id = sf2Winner
        finalTeam2Id = sf1Winner
      }

      return {
        ...path,
        final: {
          ...path.final,
          team1Id: finalTeam1Id,
          team2Id: finalTeam2Id,
          // Reset scores if teams changed
          ...(path.final.team1Id !== finalTeam1Id || path.final.team2Id !== finalTeam2Id
            ? { team1Score: null, team2Score: null, penaltyWinnerId: undefined }
            : {}),
        },
      }
    })

    // Update IC paths
    const updatedIcPaths = icPaths.map((path) => {
      const sfWinner = getMatchWinner(path.semifinal)

      return {
        ...path,
        final: {
          ...path.final,
          team2Id: sfWinner, // Semifinal winner faces the seeded team
          // Reset scores if team changed
          ...(path.final.team2Id !== sfWinner
            ? { team1Score: null, team2Score: null, penaltyWinnerId: undefined }
            : {}),
        },
      }
    })

    return { uefaPaths: updatedUefaPaths, icPaths: updatedIcPaths }
  }, [])

  const handleMatchScoreChange = useCallback((
    matchId: string,
    team: "team1" | "team2",
    score: number | null
  ) => {
    setPlayoffsState((prev) => {
      // Find and update the match in UEFA paths
      let updatedUefaPaths = prev.uefaPaths.map((path) => {
        if (path.semifinal1.id === matchId) {
          return {
            ...path,
            semifinal1: {
              ...path.semifinal1,
              [team === "team1" ? "team1Score" : "team2Score"]: score,
              // Clear penalty winner if score changes
              penaltyWinnerId: undefined,
            },
          }
        }
        if (path.semifinal2.id === matchId) {
          return {
            ...path,
            semifinal2: {
              ...path.semifinal2,
              [team === "team1" ? "team1Score" : "team2Score"]: score,
              penaltyWinnerId: undefined,
            },
          }
        }
        if (path.final.id === matchId) {
          return {
            ...path,
            final: {
              ...path.final,
              [team === "team1" ? "team1Score" : "team2Score"]: score,
              penaltyWinnerId: undefined,
            },
          }
        }
        return path
      })

      // Find and update the match in IC paths
      let updatedIcPaths = prev.icPaths.map((path) => {
        if (path.semifinal.id === matchId) {
          return {
            ...path,
            semifinal: {
              ...path.semifinal,
              [team === "team1" ? "team1Score" : "team2Score"]: score,
              penaltyWinnerId: undefined,
            },
          }
        }
        if (path.final.id === matchId) {
          return {
            ...path,
            final: {
              ...path.final,
              [team === "team1" ? "team1Score" : "team2Score"]: score,
              penaltyWinnerId: undefined,
            },
          }
        }
        return path
      })

      // Update finals with semifinal winners
      const { uefaPaths: finalUefaPaths, icPaths: finalIcPaths } = updateFinalsWithWinners(
        updatedUefaPaths,
        updatedIcPaths
      )

      return {
        ...prev,
        uefaPaths: finalUefaPaths,
        icPaths: finalIcPaths,
      }
    })
  }, [updateFinalsWithWinners])

  const handlePenaltyWinner = useCallback((matchId: string, winnerId: string) => {
    setPlayoffsState((prev) => {
      // Find and update the match in UEFA paths
      let updatedUefaPaths = prev.uefaPaths.map((path) => {
        if (path.semifinal1.id === matchId) {
          return { ...path, semifinal1: { ...path.semifinal1, penaltyWinnerId: winnerId } }
        }
        if (path.semifinal2.id === matchId) {
          return { ...path, semifinal2: { ...path.semifinal2, penaltyWinnerId: winnerId } }
        }
        if (path.final.id === matchId) {
          return { ...path, final: { ...path.final, penaltyWinnerId: winnerId } }
        }
        return path
      })

      // Find and update the match in IC paths
      let updatedIcPaths = prev.icPaths.map((path) => {
        if (path.semifinal.id === matchId) {
          return { ...path, semifinal: { ...path.semifinal, penaltyWinnerId: winnerId } }
        }
        if (path.final.id === matchId) {
          return { ...path, final: { ...path.final, penaltyWinnerId: winnerId } }
        }
        return path
      })

      // Update finals with semifinal winners (in case penalty decided a semifinal)
      const { uefaPaths: finalUefaPaths, icPaths: finalIcPaths } = updateFinalsWithWinners(
        updatedUefaPaths,
        updatedIcPaths
      )

      return {
        ...prev,
        uefaPaths: finalUefaPaths,
        icPaths: finalIcPaths,
      }
    })
  }, [updateFinalsWithWinners])

const resetPlayoffs = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_PLAYOFFS)
    setPlayoffsState(initialPlayoffsState)
  }, [])

  // Simulate all playoff matches
  const simulatePlayoffs = useCallback(() => {
    setPlayoffsState((prev) => {
      // Simulate UEFA paths
      const simulatedUefaPaths = prev.uefaPaths.map((path) => {
        // Simulate semifinals
        const sf1Result = simulatePlayoffMatch(path.semifinal1.team1Id, path.semifinal1.team2Id)
        const sf2Result = simulatePlayoffMatch(path.semifinal2.team1Id, path.semifinal2.team2Id)

        const updatedSf1: PlayoffMatch = {
          ...path.semifinal1,
          team1Score: sf1Result.score1,
          team2Score: sf1Result.score2,
          penaltyWinnerId: sf1Result.penaltyWinnerId,
        }

        const updatedSf2: PlayoffMatch = {
          ...path.semifinal2,
          team1Score: sf2Result.score1,
          team2Score: sf2Result.score2,
          penaltyWinnerId: sf2Result.penaltyWinnerId,
        }

        // Determine final teams
        const sf1Winner = getMatchWinner(updatedSf1)
        const sf2Winner = getMatchWinner(updatedSf2)

        let finalTeam1Id: string | null
        let finalTeam2Id: string | null

        if (path.id === "B") {
          finalTeam1Id = sf1Winner
          finalTeam2Id = sf2Winner
        } else {
          finalTeam1Id = sf2Winner
          finalTeam2Id = sf1Winner
        }

        // Simulate final
        const finalResult = simulatePlayoffMatch(finalTeam1Id, finalTeam2Id)

        return {
          ...path,
          semifinal1: updatedSf1,
          semifinal2: updatedSf2,
          final: {
            ...path.final,
            team1Id: finalTeam1Id,
            team2Id: finalTeam2Id,
            team1Score: finalResult.score1,
            team2Score: finalResult.score2,
            penaltyWinnerId: finalResult.penaltyWinnerId,
          },
        }
      })

      // Simulate IC paths
      const simulatedIcPaths = prev.icPaths.map((path) => {
        // Simulate semifinal
        const sfResult = simulatePlayoffMatch(path.semifinal.team1Id, path.semifinal.team2Id)

        const updatedSf: PlayoffMatch = {
          ...path.semifinal,
          team1Score: sfResult.score1,
          team2Score: sfResult.score2,
          penaltyWinnerId: sfResult.penaltyWinnerId,
        }

        // Determine final team2 (semifinal winner)
        const sfWinner = getMatchWinner(updatedSf)

        // Simulate final (team1 is the seeded team, already set)
        const finalResult = simulatePlayoffMatch(path.final.team1Id, sfWinner)

        return {
          ...path,
          semifinal: updatedSf,
          final: {
            ...path.final,
            team2Id: sfWinner,
            team1Score: finalResult.score1,
            team2Score: finalResult.score2,
            penaltyWinnerId: finalResult.penaltyWinnerId,
          },
        }
      })

      return {
        ...prev,
        uefaPaths: simulatedUefaPaths,
        icPaths: simulatedIcPaths,
      }
    })
  }, [])

  // Check if all playoffs are complete
  const isComplete = useMemo(() => {
    return Object.values(calculatedWinners).every((winner) => winner !== null)
  }, [calculatedWinners])

  // Get the current state with calculated winners
  const currentState: PlayoffsState = useMemo(() => ({
    ...playoffsState,
    winners: calculatedWinners,
  }), [playoffsState, calculatedWinners])

  return {
    playoffsState: currentState,
    handleMatchScoreChange,
    handlePenaltyWinner,
    resetPlayoffs,
    simulatePlayoffs,
    isComplete,
    winners: calculatedWinners,
  }
}
