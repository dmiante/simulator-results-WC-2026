import { deflate, inflate } from "pako"

import { Match, PredictionMode } from "@/lib/types"

import { TournamentTab } from "../types"

const SHARE_STATE_VERSION = 2
export const SHARE_STATE_PARAM = "s"

type SharedGroupMatch = [number | null, number | null]
type SharedKnockoutMatch = [string, string, number | null, number | null, string]

interface SharedTournamentState {
  v: number
  t: TournamentTab
  g: SharedGroupMatch[]
  k: SharedKnockoutMatch[]
  gm?: PredictionMode
  km?: PredictionMode
  gp?: Record<string, string[]>
  tg?: string[]
  pk?: SharedKnockoutMatch[]
}

interface SharedTournamentStateInput {
  groupMatches: Match[]
  knockoutMatches: Match[]
  positionKnockoutMatches: Match[]
  activeTab: TournamentTab
  groupPredictionMode: PredictionMode
  knockoutPredictionMode: PredictionMode
  groupPositionsByGroup: Record<string, string[]>
  thirdPlaceGroupOrder: string[]
}

export interface DecodedSharedTournamentState {
  groupMatches: Match[]
  knockoutMatches: Match[]
  positionKnockoutMatches: Match[]
  activeTab: TournamentTab
  groupPredictionMode?: PredictionMode
  knockoutPredictionMode?: PredictionMode
  groupPositionsByGroup?: Record<string, string[]>
  thirdPlaceGroupOrder?: string[]
}

function isValidTab(value: unknown): value is TournamentTab {
  return value === "playoffs" || value === "groups" || value === "knockout"
}

function isValidScore(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 99)
}

function isValidPredictionMode(value: unknown): value is PredictionMode {
  return value === "match" || value === "positions"
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}

function encodeKnockoutMatches(knockoutMatches: Match[]): SharedKnockoutMatch[] {
  return knockoutMatches.map((match) => [
    match.team1Id,
    match.team2Id,
    match.team1Score,
    match.team2Score,
    match.penaltyWinnerId ?? match.winnerId ?? "",
  ])
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ""

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000))
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=")
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

function normalizePenaltyWinner(
  team1Id: string,
  team2Id: string,
  team1Score: number | null,
  team2Score: number | null,
  penaltyWinnerId: string,
): string | undefined {
  if (team1Score === null || team2Score === null || team1Score !== team2Score) {
    return undefined
  }

  return penaltyWinnerId === team1Id || penaltyWinnerId === team2Id ? penaltyWinnerId : undefined
}

export function encodeSharedTournamentState({
  groupMatches,
  knockoutMatches,
  positionKnockoutMatches,
  activeTab,
  groupPredictionMode,
  knockoutPredictionMode,
  groupPositionsByGroup,
  thirdPlaceGroupOrder,
}: SharedTournamentStateInput): string {
  const payload: SharedTournamentState = {
    v: SHARE_STATE_VERSION,
    t: activeTab,
    g: groupMatches.map((match) => [match.team1Score, match.team2Score]),
    k: encodeKnockoutMatches(knockoutMatches),
    gm: groupPredictionMode,
    km: knockoutPredictionMode,
    gp: groupPositionsByGroup,
    tg: thirdPlaceGroupOrder,
    pk: encodeKnockoutMatches(positionKnockoutMatches),
  }

  const compressed = deflate(JSON.stringify(payload))
  return toBase64Url(compressed)
}

export function decodeSharedTournamentState(
  encoded: string,
  initialGroupMatches: Match[],
  initialKnockoutMatches: Match[],
  initialPositionKnockoutMatches: Match[] = initialKnockoutMatches,
): DecodedSharedTournamentState | null {
  try {
    const inflated = inflate(fromBase64Url(encoded), { to: "string" })
    const parsed = JSON.parse(inflated) as Partial<SharedTournamentState>

    if (
      (parsed.v !== 1 && parsed.v !== SHARE_STATE_VERSION) ||
      !isValidTab(parsed.t) ||
      !Array.isArray(parsed.g) ||
      !Array.isArray(parsed.k) ||
      parsed.g.length !== initialGroupMatches.length ||
      parsed.k.length !== initialKnockoutMatches.length
    ) {
      return null
    }

    const groupEntries = parsed.g
    const knockoutEntries = parsed.k
    const positionKnockoutEntries = parsed.pk

    const groupMatches = initialGroupMatches.map((match, index) => {
      const entry = groupEntries[index]

      if (!Array.isArray(entry) || entry.length !== 2) {
        throw new Error("Invalid shared group match")
      }

      const [team1Score, team2Score] = entry

      if (!isValidScore(team1Score) || !isValidScore(team2Score)) {
        throw new Error("Invalid shared group score")
      }

      return {
        ...match,
        team1Score,
        team2Score,
      }
    })

    const knockoutMatches = initialKnockoutMatches.map((match, index) => {
      const entry = knockoutEntries[index]

      if (!Array.isArray(entry) || entry.length !== 5) {
        throw new Error("Invalid shared knockout match")
      }

      const [team1Id, team2Id, team1Score, team2Score, penaltyWinnerId] = entry

      if (
        typeof team1Id !== "string" ||
        typeof team2Id !== "string" ||
        typeof penaltyWinnerId !== "string" ||
        !isValidScore(team1Score) ||
        !isValidScore(team2Score)
      ) {
        throw new Error("Invalid shared knockout score")
      }

      return {
        ...match,
        team1Id,
        team2Id,
        team1Score,
        team2Score,
        penaltyWinnerId: normalizePenaltyWinner(team1Id, team2Id, team1Score, team2Score, penaltyWinnerId),
      }
    })

    const positionKnockoutMatches = Array.isArray(positionKnockoutEntries) && positionKnockoutEntries.length === initialPositionKnockoutMatches.length
      ? initialPositionKnockoutMatches.map((match, index) => {
          const entry = positionKnockoutEntries[index]

          if (!Array.isArray(entry) || entry.length !== 5) {
            throw new Error("Invalid shared position knockout match")
          }

          const [team1Id, team2Id, team1Score, team2Score, winnerId] = entry

          if (
            typeof team1Id !== "string" ||
            typeof team2Id !== "string" ||
            typeof winnerId !== "string" ||
            !isValidScore(team1Score) ||
            !isValidScore(team2Score)
          ) {
            throw new Error("Invalid shared position knockout score")
          }

          return {
            ...match,
            team1Id,
            team2Id,
            team1Score,
            team2Score,
            winnerId: winnerId === team1Id || winnerId === team2Id ? winnerId : undefined,
          }
        })
      : initialPositionKnockoutMatches

    const groupPositionsByGroup = parsed.gp && typeof parsed.gp === "object"
      ? Object.fromEntries(
          Object.entries(parsed.gp).filter((entry): entry is [string, string[]] => typeof entry[0] === "string" && isStringArray(entry[1])),
        )
      : undefined

    return {
      groupMatches,
      knockoutMatches,
      positionKnockoutMatches,
      activeTab: parsed.t,
      groupPredictionMode: isValidPredictionMode(parsed.gm) ? parsed.gm : undefined,
      knockoutPredictionMode: isValidPredictionMode(parsed.km) ? parsed.km : undefined,
      groupPositionsByGroup,
      thirdPlaceGroupOrder: isStringArray(parsed.tg) ? parsed.tg : undefined,
    }
  } catch {
    return null
  }
}

export function buildSharedTournamentUrl(currentUrl: string, state: SharedTournamentStateInput): string {
  const url = new URL(currentUrl)
  url.searchParams.set(SHARE_STATE_PARAM, encodeSharedTournamentState(state))
  return url.toString()
}

export function stripSharedStateFromUrl(currentUrl: string): string {
  const url = new URL(currentUrl)
  url.searchParams.delete(SHARE_STATE_PARAM)
  return `${url.pathname}${url.search}${url.hash}`
}
