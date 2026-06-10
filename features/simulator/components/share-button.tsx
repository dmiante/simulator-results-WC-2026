"use client"

import { useEffect, useState } from "react"
import { Check, Copy, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Match, PredictionMode } from "@/lib/types"

import { TournamentTab } from "../types"
import { buildSharedTournamentUrl } from "../utils/share-state"

interface ShareButtonProps {
  groupMatches: Match[]
  knockoutMatches: Match[]
  positionKnockoutMatches: Match[]
  activeTab: TournamentTab
  groupPredictionMode: PredictionMode
  knockoutPredictionMode: PredictionMode
  groupPositionsByGroup: Record<string, string[]>
  thirdPlaceGroupOrder: string[]
}

type ShareStatus = "idle" | "copied" | "error"

export function ShareButton({
  groupMatches,
  knockoutMatches,
  positionKnockoutMatches,
  activeTab,
  groupPredictionMode,
  knockoutPredictionMode,
  groupPositionsByGroup,
  thirdPlaceGroupOrder,
}: ShareButtonProps) {
  const [status, setStatus] = useState<ShareStatus>("idle")

  useEffect(() => {
    if (status === "idle") {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setStatus("idle")
    }, 2500)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [status])

  const handleShare = async () => {
    const shareUrl = buildSharedTournamentUrl(window.location.href, {
      groupMatches,
      knockoutMatches,
      positionKnockoutMatches,
      activeTab,
      groupPredictionMode,
      knockoutPredictionMode,
      groupPositionsByGroup,
      thirdPlaceGroupOrder,
    })

    try {
      await navigator.clipboard.writeText(shareUrl)
      setStatus("copied")
    } catch {
      const copied = window.prompt("Copy this link", shareUrl)
      setStatus(copied === null ? "error" : "copied")
    }
  }

  const label =
    status === "copied" ? "Link Copied" : status === "error" ? "Copy Failed" : "Share Link"

  return (
    <Button onClick={handleShare} className="gap-2 cursor-pointer" variant="outline">
      {status === "copied" ? <Check className="h-4 w-4" /> : status === "error" ? <Copy className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {label}
    </Button>
  )
}
