"use client"

import { useEffect, useMemo } from "react"
import { PlayoffMatch, PlayoffsState } from "../types"
import { initialPlayoffsState } from "@/db/playoffs-data"

const STORAGE_KEY_PLAYOFFS = "wc2026-playoffs-state"

function getMatchWinner(match: PlayoffMatch): string | null {
  if (match.team1Score === null || match.team2Score === null) return null
  if (!match.team1Id || !match.team2Id) return null

  if (match.team1Score > match.team2Score) return match.team1Id
  if (match.team2Score > match.team1Score) return match.team2Id

  return match.penaltyWinnerId ?? null
}

export function usePlayoffs() {
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY_PLAYOFFS)
  }, [])

  const winners = useMemo(() => {
    const calculatedWinners = { ...initialPlayoffsState.winners }

    initialPlayoffsState.uefaPaths.forEach((path) => {
      const slotKey = path.targetSlotId as keyof typeof calculatedWinners
      calculatedWinners[slotKey] = getMatchWinner(path.final)
    })

    initialPlayoffsState.icPaths.forEach((path) => {
      const slotKey = path.targetSlotId as keyof typeof calculatedWinners
      calculatedWinners[slotKey] = getMatchWinner(path.final)
    })

    return calculatedWinners
  }, [])

  const playoffsState: PlayoffsState = useMemo(() => {
    return {
      ...initialPlayoffsState,
      winners,
    }
  }, [winners])

  const isComplete = useMemo(() => {
    return Object.values(winners).every((winner) => winner !== null)
  }, [winners])

  return {
    playoffsState,
    isComplete,
    winners,
  }
}
