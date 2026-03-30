import type { ExerciseProgressionPoint } from '@application/analytics'

const WIDTH = 300
const HEIGHT = 160
const PAD = { top: 10, right: 10, bottom: 30, left: 40 }

function formatDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

interface Props {
  points: ExerciseProgressionPoint[]
}

export function ProgressionChart({ points }: Props) {
  if (points.length === 0) return null

  const weights = points.map(p => p.weight)
  const minW = Math.min(...weights)
  const maxW = Math.max(...weights)
  const weightRange = maxW - minW || 1

  const innerW = WIDTH - PAD.left - PAD.right
  const innerH = HEIGHT - PAD.top - PAD.bottom

  function toX(i: number) {
    return PAD.left + (i / (points.length - 1 || 1)) * innerW
  }
  function toY(w: number) {
    return PAD.top + innerH - ((w - minW) / weightRange) * innerH
  }

  const polyline = points.map((p, i) => `${toX(i)},${toY(p.weight)}`).join(' ')

  const labelIndices =
    points.length <= 5
      ? points.map((_, i) => i)
      : [0, Math.floor((points.length - 1) / 2), points.length - 1]

  const weightUnit = points[0].weightUnit

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        style={{ maxHeight: 180 }}
      >
        {/* Y-axis labels */}
        <text x={PAD.left - 4} y={PAD.top + 4} textAnchor="end" fontSize={10} fill="#9ca3af">
          {maxW}
        </text>
        <text x={PAD.left - 4} y={PAD.top + innerH + 4} textAnchor="end" fontSize={10} fill="#9ca3af">
          {minW}
        </text>

        {/* Polyline */}
        <polyline
          points={polyline}
          fill="none"
          stroke="#2563eb"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data point dots */}
        {points.map((p, i) => (
          <circle key={i} cx={toX(i)} cy={toY(p.weight)} r={3} fill="#2563eb" />
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
      <p className="text-xs text-gray-400 text-center mt-1">{weightUnit}</p>
    </div>
  )
}
