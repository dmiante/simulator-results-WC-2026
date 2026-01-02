export function SingleConnector({
  matchHeight,
  gap,
  connectorWidth,
  direction = "right",
}: {
  matchHeight: number
  gap: number
  connectorWidth: number
  direction?: "left" | "right"
}) {
  const y1 = matchHeight / 2
  const y2 = matchHeight + gap + matchHeight / 2
  const midY = (y1 + y2) / 2
  const totalHeight = 2 * matchHeight + gap

  const midX = connectorWidth / 2
  const startX = direction === "right" ? 0 : connectorWidth
  const endX = direction === "right" ? connectorWidth : 0

  return (
    <svg width={connectorWidth} height={totalHeight} className="shrink-0">
      <line x1={startX} y1={y1} x2={midX} y2={y1} stroke="#94a3b8" strokeWidth="2" />
      <line x1={startX} y1={y2} x2={midX} y2={y2} stroke="#94a3b8" strokeWidth="2" />
      <line x1={midX} y1={y1} x2={midX} y2={y2} stroke="#94a3b8" strokeWidth="2" />
      <line x1={midX} y1={midY} x2={endX} y2={midY} stroke="#94a3b8" strokeWidth="2" />
    </svg>
  )
}