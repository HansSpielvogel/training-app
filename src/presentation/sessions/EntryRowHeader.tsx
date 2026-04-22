interface Props {
  muscleGroupName: string
  exerciseName?: string
  isOptional: boolean
  isTemp: boolean
  setCount: number
  done: boolean
  isExpanded: boolean
  isDraggable?: boolean
  onToggle: () => void
  onClearVariation: () => void
  onDragHandleTouchStart?: (e: React.TouchEvent) => void
}

export function EntryRowHeader({
  muscleGroupName, exerciseName, isOptional, isTemp, setCount, done, isExpanded,
  isDraggable, onToggle, onClearVariation, onDragHandleTouchStart,
}: Props) {
  const hasExercise = !!exerciseName
  return (
    <div
      className="flex items-center justify-between px-4 py-2.5 cursor-pointer active:bg-gray-50"
      onClick={onToggle}
    >
      {isDraggable && (
        <div
          className="mr-2 flex items-center self-stretch touch-none"
          onTouchStart={(e) => {
            e.stopPropagation()
            onDragHandleTouchStart?.(e)
          }}
          aria-label="Drag to reorder"
        >
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="7" cy="5" r="1.5" />
            <circle cx="13" cy="5" r="1.5" />
            <circle cx="7" cy="10" r="1.5" />
            <circle cx="13" cy="10" r="1.5" />
            <circle cx="7" cy="15" r="1.5" />
            <circle cx="13" cy="15" r="1.5" />
          </svg>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-gray-800">{muscleGroupName}</span>
        {isOptional && (
          <span className="ml-2 px-1.5 py-0.5 text-xs font-medium text-amber-800 bg-amber-100 border border-amber-300 rounded">Evtl</span>
        )}
        {isTemp && (
          <span className="ml-2 px-1.5 py-0.5 text-xs font-medium text-purple-700 bg-purple-100 border border-purple-300 rounded">Temp</span>
        )}
        {exerciseName && (
          <span className="ml-2 text-xs text-gray-500">{exerciseName}</span>
        )}
        {setCount > 0 && (
          <span className="ml-2 text-xs text-blue-600">{setCount} {setCount === 1 ? 'set' : 'sets'}</span>
        )}
      </div>
      <div className="flex items-center gap-1 ml-2">
        {done && (
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-green-500 text-white text-xs">✓</span>
        )}
        {hasExercise && !done && (
          <button
            onClick={(e) => { e.stopPropagation(); onClearVariation() }}
            className="px-3 min-w-[44px] self-stretch flex items-center justify-center text-gray-400 hover:text-red-500"
            aria-label="Deselect exercise"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
