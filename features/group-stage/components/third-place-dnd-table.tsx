"use client"

import { GripVertical } from "lucide-react"

import { ConfederationBadge } from "@/components/confederation-badge"
import { TeamFlag } from "@/components/team-flag"
import { Team } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ThirdPlaceDndTableProps {
  groupOrder: string[]
  groupPositionsByGroup: Record<string, string[]>
  teamsMap: Record<string, Team>
  onReorder: (groupOrder: string[]) => void
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

export function ThirdPlaceDndTable({
  groupOrder,
  groupPositionsByGroup,
  teamsMap,
  onReorder,
}: ThirdPlaceDndTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border bg-muted/30 px-4 py-4 sm:px-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-sm font-bold text-amber-500">
            3
          </span>
          Best Third Places
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">Drag the third-place teams. The top 8 qualify to Round of 32.</p>
      </div>

      <div className="divide-y divide-border">
        {groupOrder.map((groupName, index) => {
          const teamId = groupPositionsByGroup[groupName]?.[2]
          const team = teamId ? teamsMap[teamId] : null
          const qualified = index < 8

          return (
            <div key={groupName}>
              {index === 8 && (
                <div className="bg-muted/40 px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Eliminated Third Places
                </div>
              )}
              <div
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData("text/plain", groupName)
                  event.dataTransfer.effectAllowed = "move"
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault()
                  const draggedGroup = event.dataTransfer.getData("text/plain")
                  onReorder(reorderItems(groupOrder, draggedGroup, groupName))
                }}
                className={cn(
                  "group grid cursor-grab grid-cols-[auto_auto_1fr_auto] items-center gap-3 px-4 py-3 transition active:cursor-grabbing",
                  qualified ? "bg-blue-500/10" : "bg-background",
                )}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                    qualified ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  {index + 1}
                </div>
                <div className="flex min-w-0 items-center gap-2">
                  {team && <TeamFlag code={team.code} name={team.name} />}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-foreground">{team?.name || "TBD"}</div>
                    <div className="text-xs text-muted-foreground">Group {groupName}</div>
                  </div>
                  {team?.confederation && <ConfederationBadge confederation={team.confederation} />}
                </div>
                <span className={cn("text-xs font-semibold", qualified ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground")}>
                  {qualified ? "Qualified" : "Eliminated"}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
