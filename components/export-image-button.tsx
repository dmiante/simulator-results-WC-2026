"use client"

import { useEffect, useState } from "react"
import { Check, Download, LoaderCircle, TriangleAlert } from "lucide-react"
import { domToPng, type Options } from "modern-screenshot"

import { Button } from "@/components/ui/button"

type ButtonProps = React.ComponentProps<typeof Button>

interface ExportImageButtonProps {
  getTarget: () => HTMLElement | null
  getOptions?: (target: HTMLElement) => Partial<Options>
  filename: string
  label?: string
  ariaLabel?: string
  showLabel?: boolean
  icon?: React.ComponentType<{ className?: string }>
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  className?: string
}

type ExportStatus = "idle" | "exporting" | "success" | "error"

function getBackgroundColor(): string {
  const rootBackground = getComputedStyle(document.documentElement).getPropertyValue("--background").trim()
  return rootBackground || getComputedStyle(document.body).backgroundColor || "#ffffff"
}

function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement("a")
  link.download = filename
  link.href = dataUrl
  link.click()
}

export function ExportImageButton({
  getTarget,
  getOptions,
  filename,
  label = "Export Image",
  ariaLabel,
  showLabel = true,
  icon: Icon,
  variant = "outline",
  size,
  className,
}: ExportImageButtonProps) {
  const [status, setStatus] = useState<ExportStatus>("idle")

  useEffect(() => {
    if (status === "idle" || status === "exporting") {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setStatus("idle")
    }, 2500)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [status])

  const handleExport = async () => {
    const target = getTarget()

    if (!target) {
      setStatus("error")
      return
    }

    setStatus("exporting")

    try {
      const dataUrl = await domToPng(target, {
        width: Math.ceil(target.scrollWidth || target.clientWidth),
        height: Math.ceil(target.scrollHeight || target.clientHeight),
        scale: 2,
        maximumCanvasSize: 16384,
        backgroundColor: getBackgroundColor(),
        filter: (node) => !(node instanceof HTMLElement && node.dataset.exportIgnore === "true"),
        ...getOptions?.(target),
      })

      downloadImage(dataUrl, filename)
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  const buttonLabel =
    status === "exporting"
      ? "Exporting..."
      : status === "success"
        ? "Downloaded"
        : status === "error"
          ? "Try Again"
          : label

  const accessibleLabel = ariaLabel ?? buttonLabel

  return (
    <Button
      onClick={handleExport}
      className={className}
      variant={variant}
      size={size}
      disabled={status === "exporting"}
      data-export-ignore="true"
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      {status === "exporting" ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : status === "success" ? (
        <Check className="h-4 w-4" />
      ) : status === "error" ? (
        <TriangleAlert className="h-4 w-4" />
      ) : Icon ? (
        <Icon className="h-4 w-4" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {showLabel ? buttonLabel : null}
    </Button>
  )
}
