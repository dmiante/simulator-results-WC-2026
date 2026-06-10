"use client"

import { GripVertical } from "lucide-react"

import { ConfederationBadge } from "@/components/confederation-badge"
import { TeamFlag } from "@/components/team-flag"
import { Team } from "@/lib/types"
import { cn } from "@/lib/utils"

interface GroupPositionListProps {
  teamIds: string[]
  teamsMap: Record<string, Team>
  onReorder: (teamIds: string[]) => void
}

function reorderItems(items: string[], draggedId: string, targetId: string): string[] {
  const draggedIndex = items.indexOf(draggedId)
  const targetIndex = items.indexOf(targetId)

  if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) return items

  const nextItems = [...items]
  const [draggedItem] = nextItems.splice(draggedIndex, 1)
  nextItems.splice(targetIndex, 0, draggedItem)

  return nextItems
}

export function GroupPositionList({ teamIds, teamsMap, onReorder }: GroupPositionListProps) {
  return (
    <div className="space-y-2">
      {teamIds.map((teamId, index) => {
        const team = teamsMap[teamId]
        const status = index < 2 ? "direct" : index === 2 ? "third" : "out"

        return (
          <div
            key={teamId}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("text/plain", teamId)
              event.dataTransfer.effectAllowed = "move"
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              const draggedId = event.dataTransfer.getData("text/plain")
              onReorder(reorderItems(teamIds, draggedId, teamId))
            }}
            className={cn(
              "group flex cursor-grab items-center gap-3 rounded-lg border bg-card p-3 transition active:cursor-grabbing",
              status === "direct" && "border-blue-500/30 bg-blue-500/10",
              status === "third" && "border-amber-500/40 bg-amber-500/10",
              status === "out" && "border-border",
            )}
          >
            <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" />
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                status === "direct" && "bg-blue-500 text-white",
                status === "third" && "bg-amber-500 text-white",
                status === "out" && "bg-muted text-muted-foreground",
              )}
            >
              {index + 1}
            </div>
            <TeamFlag code={team?.code || "xx"} name={team?.name || teamId} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-foreground">{team?.name || teamId}</div>
              <div className="text-xs text-muted-foreground">
                {status === "direct" ? "Direct qualifier" : status === "third" ? "Third-place pool" : "Eliminated"}
              </div>
            </div>
            {team?.confederation && <ConfederationBadge confederation={team.confederation} />}
          </div>
        )
      })}
    </div>
  )
}
