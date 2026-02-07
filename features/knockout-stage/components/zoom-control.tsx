import { Button } from '@/components/ui/button'
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'

export default function ZoomControl({ zoom, setZoom }: { zoom: number; setZoom: (zoom: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium min-w-[60px] text-center text-slate-600 dark:text-slate-300">{Math.round(zoom * 100)}%</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setZoom(1)}
        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  )
}