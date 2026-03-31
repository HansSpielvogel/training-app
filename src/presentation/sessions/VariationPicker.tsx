import { useState } from 'react'
import type { ExerciseDefinition } from '@application/exercises'

interface Props {
  suggestion: ExerciseDefinition | null
  recentVariations: ExerciseDefinition[]
  allExercises: ExerciseDefinition[]
  onSelect: (exerciseDefinitionId: string) => void
}

export function VariationPicker({ suggestion, recentVariations, allExercises, onSelect }: Props) {
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
          <button
            key={ex.id}
            onClick={() => onSelect(ex.id)}
            className="w-full text-left px-3 py-3 text-sm text-gray-800 bg-gray-50 hover:bg-blue-50 rounded-md border border-gray-200"
          >
            {ex.name}
          </button>
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
        <button
          onClick={() => onSelect(suggestion.id)}
          className="px-3 py-2.5 text-sm bg-green-50 text-green-700 rounded-full border border-green-300 font-medium min-h-[44px] flex items-center gap-1"
        >
          <span className="text-base leading-none">💡</span>
          {suggestion.name}
        </button>
      )}
      {chips.map((ex) => (
        <button
          key={ex.id}
          onClick={() => onSelect(ex.id)}
          className="px-3 py-2.5 text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-200 font-medium min-h-[44px] flex items-center"
        >
          {ex.name}
        </button>
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
