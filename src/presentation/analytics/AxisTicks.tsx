import { computeNiceTicks } from './chartTicks'

interface Props {
  min: number
  max: number
  toY: (v: number) => number
  color: string
  chartWidth: number
  chartLeftPad: number
  chartRightPad: number
  side?: 'left' | 'right'
}

const MIN_LABEL_GAP_PX = 12

export function AxisTicks({ min, max, toY, color, chartWidth, chartLeftPad, chartRightPad, side = 'left' }: Props) {
  const minY = toY(min)
  const maxY = toY(max)
  const ticks = computeNiceTicks(min, max, 6)
    .filter((t) => t > min && t < max)
    .filter((t) => Math.abs(toY(t) - minY) >= MIN_LABEL_GAP_PX && Math.abs(toY(t) - maxY) >= MIN_LABEL_GAP_PX)
  const x = side === 'left' ? chartLeftPad - 4 : chartWidth - chartRightPad + 4
  const anchor = side === 'left' ? 'end' : 'start'
  return (
    <>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={chartLeftPad} x2={chartWidth - chartRightPad} y1={toY(t)} y2={toY(t)} stroke="#e5e7eb" strokeWidth={1} />
          <text x={x} y={toY(t) + 3} textAnchor={anchor} fontSize={9} fill={color} opacity={0.7}>
            {Number.isInteger(t) ? t : t.toFixed(1)}
          </text>
        </g>
      ))}
    </>
  )
}
