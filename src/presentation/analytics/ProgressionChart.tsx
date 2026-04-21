import type { ExerciseProgressionPoint } from '@application/analytics'

const WIDTH = 300
const HEIGHT = 160
const PAD = { top: 10, right: 35, bottom: 30, left: 40 }

function rpeColor(rpe: number): string {
  // green (1) → yellow (5–6) → red (10)
  const t = (rpe - 1) / 9
  const r = Math.round(t * 220)
  const g = Math.round((1 - t) * 180)
  return `rgb(${r},${g},50)`
}

function formatDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

interface Props {
  points: ExerciseProgressionPoint[]
  metric?: 'weight' | 'reps' | 'volume'
}

export function ProgressionChart({ points, metric = 'weight' }: Props) {
  if (points.length === 0) return null

  const innerW = WIDTH - PAD.left - PAD.right
  const innerH = HEIGHT - PAD.top - PAD.bottom

  function toX(i: number) {
    return PAD.left + (i / (points.length - 1 || 1)) * innerW
  }

  const labelIndices =
    points.length <= 5
      ? points.map((_, i) => i)
      : [0, Math.floor((points.length - 1) / 2), points.length - 1]

  if (metric === 'reps') {
    const repsValues = points.map(p => p.avgReps ?? 0)
    const minR = Math.min(...repsValues)
    const maxR = Math.max(...repsValues)
    const repsRange = maxR - minR || 1
    function toYR(r: number) { return PAD.top + innerH - ((r - minR) / repsRange) * innerH }
    const polyline = points.map((p, i) => `${toX(i)},${toYR(p.avgReps ?? 0)}`).join(' ')
    return (
      <div>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" style={{ maxHeight: 180 }}>
          <text x={PAD.left - 4} y={PAD.top + 4} textAnchor="end" fontSize={10} fill="#f97316">{maxR}</text>
          <text x={PAD.left - 4} y={PAD.top + innerH + 4} textAnchor="end" fontSize={10} fill="#f97316">{minR}</text>
          <polyline points={polyline} fill="none" stroke="#f97316" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {points.map((p, i) => <circle key={i} cx={toX(i)} cy={toYR(p.avgReps ?? 0)} r={3} fill="#f97316" />)}
          {labelIndices.map(i => (
            <text key={i} x={toX(i)} y={HEIGHT - 6} textAnchor="middle" fontSize={9} fill="#9ca3af">{formatDate(points[i].date)}</text>
          ))}
        </svg>
        <div className="flex items-center justify-center gap-3 mt-1">
          <p className="text-xs text-orange-400">— avg reps</p>
        </div>
      </div>
    )
  }

  if (metric === 'volume') {
    const volValues = points.map(p => p.movedSum ?? 0)
    const minV = Math.min(...volValues)
    const maxV = Math.max(...volValues)
    const volRange = maxV - minV || 1
    function toYV(v: number) { return PAD.top + innerH - ((v - minV) / volRange) * innerH }
    const polyline = points.map((p, i) => `${toX(i)},${toYV(p.movedSum ?? 0)}`).join(' ')
    return (
      <div>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" style={{ maxHeight: 180 }}>
          <text x={PAD.left - 4} y={PAD.top + 4} textAnchor="end" fontSize={10} fill="#a855f7">{Math.round(maxV)}</text>
          <text x={PAD.left - 4} y={PAD.top + innerH + 4} textAnchor="end" fontSize={10} fill="#a855f7">{Math.round(minV)}</text>
          <text x={PAD.left - 4} y={PAD.top - 2} textAnchor="end" fontSize={8} fill="#a855f7">kg moved</text>
          <polyline points={polyline} fill="none" stroke="#a855f7" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {points.map((p, i) => <circle key={i} cx={toX(i)} cy={toYV(p.movedSum ?? 0)} r={3} fill="#a855f7" />)}
          {labelIndices.map(i => (
            <text key={i} x={toX(i)} y={HEIGHT - 6} textAnchor="middle" fontSize={9} fill="#9ca3af">{formatDate(points[i].date)}</text>
          ))}
        </svg>
        <div className="flex items-center justify-center gap-3 mt-1">
          <p className="text-xs text-purple-400">— kg moved</p>
        </div>
      </div>
    )
  }

  // metric === 'weight': existing dual-axis chart
  const weights = points.map(p => p.weight)
  const minW = Math.min(...weights)
  const maxW = Math.max(...weights)
  const weightRange = maxW - minW || 1

  const repsValues = points.map(p => p.avgReps ?? 0).filter(r => r > 0)
  const hasReps = repsValues.length > 0
  const minR = hasReps ? Math.min(...repsValues) : 0
  const maxR = hasReps ? Math.max(...repsValues) : 1
  const repsRange = maxR - minR || 1

  function toY(w: number) {
    return PAD.top + innerH - ((w - minW) / weightRange) * innerH
  }
  function toYReps(r: number) {
    return PAD.top + innerH - ((r - minR) / repsRange) * innerH
  }

  const weightPolyline = points.map((p, i) => `${toX(i)},${toY(p.weight)}`).join(' ')
  const repsPolyline = hasReps
    ? points.map((p, i) => p.avgReps !== undefined ? `${toX(i)},${toYReps(p.avgReps)}` : null)
      .filter(Boolean).join(' ')
    : ''

  const weightUnit = points[0].weightUnit

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        style={{ maxHeight: 180 }}
      >
        {/* Left Y-axis labels (weight) */}
        <text x={PAD.left - 4} y={PAD.top + 4} textAnchor="end" fontSize={10} fill="#2563eb">
          {maxW}
        </text>
        <text x={PAD.left - 4} y={PAD.top + innerH + 4} textAnchor="end" fontSize={10} fill="#2563eb">
          {minW}
        </text>

        {/* Right Y-axis labels (reps) */}
        {hasReps && (
          <>
            <text x={WIDTH - PAD.right + 4} y={PAD.top + 4} textAnchor="start" fontSize={10} fill="#f97316">
              {maxR}
            </text>
            <text x={WIDTH - PAD.right + 4} y={PAD.top + innerH + 4} textAnchor="start" fontSize={10} fill="#f97316">
              {minR}
            </text>
          </>
        )}

        {/* Weight polyline */}
        <polyline
          points={weightPolyline}
          fill="none"
          stroke="#2563eb"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Weight data point dots */}
        {points.map((p, i) => (
          <circle key={i} cx={toX(i)} cy={toY(p.weight)} r={3} fill="#2563eb" />
        ))}

        {/* Reps polyline */}
        {hasReps && repsPolyline && (
          <polyline
            points={repsPolyline}
            fill="none"
            stroke="#f97316"
            strokeWidth={1.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* Reps data point dots */}
        {hasReps && points.map((p, i) => p.avgReps !== undefined && (
          <circle key={`reps-${i}`} cx={toX(i)} cy={toYReps(p.avgReps)} r={2.5} fill="#f97316" />
        ))}

        {/* RPE indicator dots (below weight dot) */}
        {points.map((p, i) => p.avgRpe !== undefined && (
          <circle key={`rpe-${i}`} cx={toX(i)} cy={toY(p.weight) + 10} r={3} fill={rpeColor(p.avgRpe)} />
        ))}

        {/* X-axis date labels */}
        {labelIndices.map(i => (
          <text
            key={i}
            x={toX(i)}
            y={HEIGHT - 6}
            textAnchor="middle"
            fontSize={9}
            fill="#9ca3af"
          >
            {formatDate(points[i].date)}
          </text>
        ))}
      </svg>
      <div className="flex items-center justify-center gap-3 mt-1">
        <p className="text-xs text-blue-600">— {weightUnit}</p>
        {hasReps && <p className="text-xs text-orange-400">— reps</p>}
        {points.some(p => p.avgRpe !== undefined) && (
          <p className="text-xs text-gray-400">● RPE</p>
        )}
      </div>
    </div>
  )
}
