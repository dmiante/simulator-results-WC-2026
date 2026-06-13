"use client"

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
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

interface SortableTeamRowProps {
  teamId: string
  index: number
  team: Team | undefined
}

function SortableTeamRow({ teamId, index, team }: SortableTeamRowProps) {
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition, isDragging } = useSortable({
    id: teamId,
  })
  const status = index < 2 ? "direct" : index === 2 ? "third" : "out"

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "group flex items-center gap-2 rounded-lg border bg-card p-2 transition sm:gap-3 sm:p-3",
        status === "direct" && "border-blue-500/30 bg-blue-500/10",
        status === "third" && "border-amber-500/40 bg-amber-500/10",
        status === "out" && "border-border",
        isDragging && "relative z-10 scale-[1.01] shadow-lg ring-2 ring-primary/25",
      )}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        className="flex h-11 w-11 shrink-0 touch-none cursor-grab items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground active:cursor-grabbing"
        aria-label={`Move ${team?.name || teamId}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>
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
}

export function GroupPositionList({ teamIds, teamsMap, onReorder }: GroupPositionListProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 140,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = teamIds.indexOf(String(active.id))
    const newIndex = teamIds.indexOf(String(over.id))

    if (oldIndex === -1 || newIndex === -1) return

    onReorder(arrayMove(teamIds, oldIndex, newIndex))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={teamIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {teamIds.map((teamId, index) => (
            <SortableTeamRow key={teamId} teamId={teamId} index={index} team={teamsMap[teamId]} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
