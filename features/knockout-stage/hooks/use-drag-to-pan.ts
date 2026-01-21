import { useState, useCallback, RefObject } from "react"

interface DragToPanState {
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent) => void
  handleMouseMove: (e: React.MouseEvent) => void
  handleMouseUp: () => void
  handleMouseLeave: () => void
}

/**
 * Hook to handle drag-to-pan functionality for scrollable containers
 */
export function useDragToPan(containerRef: RefObject<HTMLDivElement | null>): DragToPanState {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start drag if clicking on the container background, not on inputs
    if ((e.target as HTMLElement).tagName === 'INPUT') return
    
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    if (containerRef.current) {
      setScrollStart({ 
        x: containerRef.current.scrollLeft, 
        y: containerRef.current.scrollTop 
      })
    }
  }, [containerRef])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    
    containerRef.current.scrollLeft = scrollStart.x - dx
    containerRef.current.scrollTop = scrollStart.y - dy
  }, [isDragging, dragStart, scrollStart, containerRef])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  return {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  }
}
