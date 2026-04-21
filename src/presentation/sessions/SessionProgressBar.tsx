interface Props {
  done: number
  total: number
}

export function SessionProgressBar({ done, total }: Props) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 shrink-0">{done} / {total}</span>
    </div>
  )
}
