import { useState } from 'react'
import type { ExerciseDefinition } from '@application/exercises'

interface Props {
  suggestion: ExerciseDefinition | null
  recentVariations: ExerciseDefinition[]
  allExercises: ExerciseDefinition[]
  onSelect: (exerciseDefinitionId: string) => void
  onViewStats?: (exerciseDefinitionId: string) => void
}

interface ViewStatsButtonProps {
  exerciseId: string
  onViewStats?: (id: string) => void
}

function ViewStatsButton({ exerciseId, onViewStats }: ViewStatsButtonProps) {
  if (!onViewStats) return null
  return (
    <button
      onClick={() => onViewStats(exerciseId)}
      className="w-[38px] h-[38px] -my-1 ml-1 pl-1 border-l flex items-center justify-center text-current opacity-70 border-current/20"
      aria-label="View history/stats"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </button>
  )
}

export function VariationPicker({ suggestion, recentVariations, allExercises, onSelect, onViewStats }: Props) {
  const [showFullList, setShowFullList] = useState(false)

  // Show up to 3 chips: recent first, then fill from the rest
  const recentIds = new Set(recentVariations.map((ex) => ex.id))
  const chips = [
    ...recentVariations,
    ...allExercises.filter((ex) => !recentIds.has(ex.id)),
  ].slice(0, 3)
  const hasMore = allExercises.length > chips.length

  if (showFullList) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-gray-500 mb-2">Pick exercise:</p>
        {allExercises.map((ex) => (
          <div
            key={ex.id}
            className="w-full flex items-center justify-between px-3 py-3 text-sm text-gray-800 bg-gray-50 hover:bg-blue-50 rounded-md border border-gray-200"
          >
            <button onClick={() => onSelect(ex.id)} className="flex-1 text-left">
              {ex.name}
            </button>
            <ViewStatsButton exerciseId={ex.id} onViewStats={onViewStats} />
          </div>
        ))}
        <button
          onClick={() => setShowFullList(false)}
          className="w-full py-2 text-sm text-gray-500"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {suggestion && (
        <div className="px-3 py-2.5 text-sm bg-green-50 text-green-700 rounded-full border border-green-300 font-medium min-h-[44px] flex items-center gap-1">
          <button onClick={() => onSelect(suggestion.id)} className="flex items-center gap-1">
            <span className="text-base leading-none">💡</span>
            {suggestion.name}
          </button>
          <ViewStatsButton exerciseId={suggestion.id} onViewStats={onViewStats} />
        </div>
      )}
      {chips.map((ex) => (
        <div
          key={ex.id}
          className="px-3 py-2.5 text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-200 font-medium min-h-[44px] flex items-center gap-1"
        >
          <button onClick={() => onSelect(ex.id)}>{ex.name}</button>
          <ViewStatsButton exerciseId={ex.id} onViewStats={onViewStats} />
        </div>
      ))}
      {hasMore && (
        <button
          onClick={() => setShowFullList(true)}
          className="px-3 py-2.5 text-sm bg-gray-100 text-gray-600 rounded-full border border-gray-200 min-h-[44px] flex items-center"
        >
          Other…
        </button>
      )}
    </div>
  )
}
