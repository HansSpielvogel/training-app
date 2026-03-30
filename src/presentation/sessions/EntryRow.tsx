import { useState } from 'react'
import type { ExerciseDefinition } from '@application/exercises'
import type { SessionEntry, Weight } from '@application/sessions'
import { VariationPicker } from './VariationPicker'
import { SetLogger } from './SetLogger'

export interface EntryExerciseData {
  recent: ExerciseDefinition[]
  all: ExerciseDefinition[]
}

interface EntryRowProps {
  entry: SessionEntry
  muscleGroupName: string
  exerciseName?: string
  exerciseData: EntryExerciseData | null
  onLoadExerciseData: () => void
  onAssign: (exerciseDefinitionId: string) => void
  onClearVariation: () => void
  onAddSet: (weight: Weight, reps: number) => void
  onRemoveLast: () => void
}

export function EntryRow({
  entry,
  muscleGroupName,
  exerciseName,
  exerciseData,
  onLoadExerciseData,
  onAssign,
  onClearVariation,
  onAddSet,
  onRemoveLast,
}: EntryRowProps) {
  const [expanded, setExpanded] = useState(false)
  const setCount = entry.sets.length

  function handleExpand() {
    if (!expanded && !exerciseData) onLoadExerciseData()
    setExpanded(!expanded)
  }

  return (
    <div className={`border-b border-gray-100 ${setCount > 0 ? 'border-l-2 border-l-blue-400' : ''}`}>
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer active:bg-gray-50"
        onClick={handleExpand}
      >
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-gray-800">{muscleGroupName}</span>
          {exerciseName && (
            <span className="ml-2 text-xs text-gray-500">{exerciseName}</span>
          )}
          {setCount > 0 && (
            <span className="ml-2 text-xs text-blue-600">{setCount} {setCount === 1 ? 'set' : 'sets'}</span>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          {entry.exerciseDefinitionId && (
            <button
              onClick={(e) => { e.stopPropagation(); onClearVariation() }}
              className="p-3 text-gray-400 hover:text-red-500"
              aria-label="Deselect exercise"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {!entry.exerciseDefinitionId ? (
            exerciseData ? (
              <VariationPicker
                recentVariations={exerciseData.recent}
                allExercises={exerciseData.all}
                onSelect={(id) => { onAssign(id) }}
              />
            ) : (
              <p className="text-sm text-gray-400">Loading exercises…</p>
            )
          ) : (
            <SetLogger
              sets={entry.sets}
              onAdd={onAddSet}
              onRemoveLast={onRemoveLast}
            />
          )}
        </div>
      )}
    </div>
  )
}
