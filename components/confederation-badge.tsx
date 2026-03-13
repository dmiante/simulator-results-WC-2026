import { cn } from "@/lib/utils"

const confederationConfig: Record<string, { label: string; className: string }> = {
  UEFA: {
    label: "UEFA",
    className: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  },
  CONMEBOL: {
    label: "CSA",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  },
  CONCACAF: {
    label: "CCA",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  },
  CAF: {
    label: "CAF",
    className: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
  },
  AFC: {
    label: "AFC",
    className: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
  },
  OFC: {
    label: "OFC",
    className: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
  },
}

export function ConfederationBadge({
  confederation,
  className,
}: {
  confederation: string
  className?: string
}) {
  const config = confederationConfig[confederation]
  if (!config) return null

  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1 py-0.5 text-[9px] font-semibold leading-none tracking-wide",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
