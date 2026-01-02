export function BracketConnector({
  matchCount,
  matchHeight,
  gap,
  connectorWidth,
  direction = "right",
}: {
  matchCount: number
  matchHeight: number
  gap: number
  connectorWidth: number
  direction?: "left" | "right"
}) {
  const paths: React.ReactElement[] = []
  const pairCount = matchCount / 2

  for (let i = 0; i < pairCount; i++) {
    const matchIndex1 = i * 2
    const matchIndex2 = i * 2 + 1

    // Calculate Y positions at exact center of each match box
    const y1 = matchIndex1 * (matchHeight + gap) + matchHeight / 2
    const y2 = matchIndex2 * (matchHeight + gap) + matchHeight / 2
    const midY = (y1 + y2) / 2

    const midX = connectorWidth / 2
    const startX = direction === "right" ? 0 : connectorWidth
    const endX = direction === "right" ? connectorWidth : 0

    // Horizontal from first match to vertical line
    paths.push(<line key={`h1-${i}`} x1={startX} y1={y1} x2={midX} y2={y1} stroke="#94a3b8" strokeWidth="2" />)

    // Horizontal from second match to vertical line
    paths.push(<line key={`h2-${i}`} x1={startX} y1={y2} x2={midX} y2={y2} stroke="#94a3b8" strokeWidth="2" />)

    // Vertical line connecting the pair
    paths.push(<line key={`v-${i}`} x1={midX} y1={y1} x2={midX} y2={y2} stroke="#94a3b8" strokeWidth="2" />)

    // Horizontal from vertical line to next round
    paths.push(<line key={`h3-${i}`} x1={midX} y1={midY} x2={endX} y2={midY} stroke="#94a3b8" strokeWidth="2" />)
  }

  const totalHeight = matchCount * (matchHeight + gap) - gap

  return (
    <svg width={connectorWidth} height={totalHeight} className="shrink-0">
      {paths}
    </svg>
  )
}