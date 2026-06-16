"use client"

import { Fragment } from "react"

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

import { useTranslations } from "@/components/language-provider"
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

interface SortableThirdPlaceRowProps {
  groupName: string
  index: number
  team: Team | null
}

function SortableThirdPlaceRow({ groupName, index, team }: SortableThirdPlaceRowProps) {
  const t = useTranslations()
  const { attributes, listeners, setActivatorNodeRef, setNodeRef, transform, transition, isDragging } = useSortable({
    id: groupName,
  })
  const qualified = index < 8

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "group grid grid-cols-[auto_auto_1fr_auto] items-center gap-2 px-3 py-2 transition sm:gap-3 sm:px-4 sm:py-3",
        qualified ? "bg-blue-500/10" : "bg-background",
        isDragging && "relative z-10 scale-[1.01] shadow-lg ring-2 ring-primary/25",
      )}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        className="flex h-11 w-11 touch-none cursor-grab items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground active:cursor-grabbing"
        aria-label={t.thirdPlaces.moveGroupThird(groupName)}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>
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
          <div className="truncate text-sm font-semibold text-foreground">{team?.name || t.common.tbd}</div>
          <div className="text-xs text-muted-foreground">{t.common.groupLabel(groupName)}</div>
        </div>
        {team?.confederation && <ConfederationBadge confederation={team.confederation} />}
      </div>
      <span className={cn("text-xs font-semibold", qualified ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground")}>
        {qualified ? t.common.qualified : t.common.eliminated}
      </span>
    </div>
  )
}

export function ThirdPlaceDndTable({
  groupOrder,
  groupPositionsByGroup,
  teamsMap,
  onReorder,
}: ThirdPlaceDndTableProps) {
  const t = useTranslations()

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

    const oldIndex = groupOrder.indexOf(String(active.id))
    const newIndex = groupOrder.indexOf(String(over.id))

    if (oldIndex === -1 || newIndex === -1) return

    onReorder(arrayMove(groupOrder, oldIndex, newIndex))
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border bg-muted/30 px-4 py-4 sm:px-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-sm font-bold text-amber-500">
            3
          </span>
          {t.thirdPlaces.bestTitle}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.thirdPlaces.bestDescription}
        </p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={groupOrder} strategy={verticalListSortingStrategy}>
          <div className="divide-y divide-border">
            {groupOrder.map((groupName, index) => {
              const teamId = groupPositionsByGroup[groupName]?.[2]
              const team = teamId ? teamsMap[teamId] : null

              return (
                <Fragment key={groupName}>
                  {index === 8 && (
                    <div className="bg-muted/40 px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {t.thirdPlaces.eliminatedThirdPlaces}
                    </div>
                  )}
                  <SortableThirdPlaceRow groupName={groupName} index={index} team={team} />
                </Fragment>
              )
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
