"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Download, LoaderCircle, Share2, TriangleAlert } from "lucide-react"
import { domToBlob, type Options } from "modern-screenshot"

import { Button } from "@/components/ui/button"

type ButtonProps = React.ComponentProps<typeof Button>

interface ExportImageButtonProps {
  getTarget: () => HTMLElement | null
  getOptions?: (target: HTMLElement) => Partial<Options>
  filename: string
  label?: string
  shareLabel?: string
  ariaLabel?: string
  shareAriaLabel?: string
  showLabel?: boolean
  icon?: React.ComponentType<{ className?: string }>
  shareIcon?: React.ComponentType<{ className?: string }>
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  className?: string
}

type ExportStatus = "idle" | "exporting" | "downloaded" | "shared" | "error"

function getBackgroundColor(): string {
  const rootBackground = getComputedStyle(document.documentElement).getPropertyValue("--background").trim()
  return rootBackground || getComputedStyle(document.body).backgroundColor || "#ffffff"
}

function getExportOptions(target: HTMLElement, getOptions?: (target: HTMLElement) => Partial<Options>): Options {
  return {
    width: Math.ceil(target.scrollWidth || target.clientWidth),
    height: Math.ceil(target.scrollHeight || target.clientHeight),
    scale: 2,
    maximumCanvasSize: 16384,
    backgroundColor: getBackgroundColor(),
    filter: (node) => !(node instanceof HTMLElement && node.dataset.exportIgnore === "true"),
    ...getOptions?.(target),
  }
}

function exportTargetToBlob(target: HTMLElement, getOptions?: (target: HTMLElement) => Partial<Options>) {
  return domToBlob(target, getExportOptions(target, getOptions))
}

function downloadImage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.download = filename
  link.href = url
  link.click()
  window.setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 0)
}

function createImageFile(blob: Blob, filename: string) {
  return new File([blob], filename, { type: blob.type || "image/png" })
}

function canShareFile(file: File) {
  if (typeof navigator === "undefined") {
    return false
  }

  if (typeof navigator.share !== "function") {
    return false
  }

  if (typeof navigator.canShare !== "function") {
    return false
  }

  try {
    return navigator.canShare({ files: [file] })
  } catch {
    return false
  }
}

function supportsFileShare() {
  if (typeof File === "undefined") {
    return false
  }

  return canShareFile(new File([new Uint8Array([0])], "share-test.png", { type: "image/png" }))
}

function isShareAbort(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError"
}

export function ExportImageButton({
  getTarget,
  getOptions,
  filename,
  label = "Export Image",
  shareLabel,
  ariaLabel,
  shareAriaLabel,
  showLabel = true,
  icon: Icon,
  shareIcon: ShareIcon,
  variant = "outline",
  size,
  className,
}: ExportImageButtonProps) {
  const [status, setStatus] = useState<ExportStatus>("idle")
  const [canShareFiles, setCanShareFiles] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const preparedExportRef = useRef<{ target: HTMLElement; blobPromise: Promise<Blob> } | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)")
    const updateMobileViewport = () => {
      setIsMobileViewport(mediaQuery.matches)
      setCanShareFiles(supportsFileShare())
    }

    updateMobileViewport()
    mediaQuery.addEventListener("change", updateMobileViewport)

    return () => {
      mediaQuery.removeEventListener("change", updateMobileViewport)
    }
  }, [])

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

  const prepareExport = () => {
    const target = getTarget()

    if (!target) {
      preparedExportRef.current = null
      return
    }

    preparedExportRef.current = {
      target,
      blobPromise: exportTargetToBlob(target, getOptions),
    }
  }

  const getExportBlob = (target: HTMLElement) => {
    const preparedExport = preparedExportRef.current
    preparedExportRef.current = null

    if (preparedExport?.target === target) {
      return preparedExport.blobPromise
    }

    return exportTargetToBlob(target, getOptions)
  }

  const handleExport = async () => {
    const target = getTarget()

    if (!target) {
      setStatus("error")
      return
    }

    setStatus("exporting")

    try {
      const blob = await getExportBlob(target)
      const file = createImageFile(blob, filename)

      if (shouldUseNativeShare && canShareFile(file)) {
        try {
          await navigator.share({
            files: [file],
            title: filename,
          })
          setStatus("shared")
          return
        } catch (error) {
          if (isShareAbort(error)) {
            setStatus("idle")
            return
          }
        }
      }

      downloadImage(file, filename)
      setStatus("downloaded")
    } catch {
      setStatus("error")
    }
  }

  const shouldUseNativeShare = isMobileViewport && canShareFiles
  const idleLabel = shouldUseNativeShare ? shareLabel ?? label : label
  const idleAccessibleLabel = shouldUseNativeShare ? shareAriaLabel ?? idleLabel : ariaLabel ?? idleLabel
  const IdleIcon = shouldUseNativeShare ? ShareIcon ?? Share2 : Icon

  const buttonLabel =
    status === "exporting"
      ? "Preparing..."
      : status === "shared"
        ? "Shared"
        : status === "downloaded"
        ? "Downloaded"
        : status === "error"
          ? "Try Again"
          : idleLabel

  const accessibleLabel = status === "idle" ? idleAccessibleLabel : buttonLabel

  return (
    <Button
      onPointerDown={prepareExport}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          prepareExport()
        }
      }}
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
      ) : status === "shared" || status === "downloaded" ? (
        <Check className="h-4 w-4" />
      ) : status === "error" ? (
        <TriangleAlert className="h-4 w-4" />
      ) : IdleIcon ? (
        <IdleIcon className="h-4 w-4" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {showLabel ? buttonLabel : null}
    </Button>
  )
}
