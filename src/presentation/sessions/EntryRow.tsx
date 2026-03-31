import { useState } from 'react'
import type { ExerciseDefinition } from '@application/exercises'
import type { SessionEntry, SessionSet, Weight } from '@application/sessions'
import { VariationPicker } from './VariationPicker'
import { SetLogger } from './SetLogger'

export interface EntryExerciseData {
  recent: ExerciseDefinition[]
  all: ExerciseDefinition[]
  suggestion: ExerciseDefinition | null
}

interface EntryRowProps {
  entry: SessionEntry
  muscleGroupName: string
  exerciseName?: string
  exerciseData: EntryExerciseData | null
  lastSets: SessionSet[] | null
  defaultSets?: number
  isExpanded: boolean
  onToggle: () => void
  onMarkDone: () => void
  onLoadExerciseData: () => void
  onAssign: (exerciseDefinitionId: string) => void
  onClearVariation: () => void
  onAddSet: (weight: Weight, reps: number, count: number) => void
  onRemoveLast: () => void
}

export function EntryRow({
  entry,
  muscleGroupName,
  exerciseName,
  exerciseData,
  lastSets,
  defaultSets,
  isExpanded,
  onToggle,
  onMarkDone,
  onLoadExerciseData,
  onAssign,
  onClearVariation,
  onAddSet,
  onRemoveLast,
}: EntryRowProps) {
  const [done, setDone] = useState(false)
  const setCount = entry.sets.length

  function handleToggle() {
    if (!isExpanded && !exerciseData) onLoadExerciseData()
    onToggle()
  }

  function handleMarkDone() {
    setDone(true)
    onMarkDone()
  }

  return (
    <div className={`border-b border-gray-100 ${setCount > 0 ? 'border-l-2 border-l-blue-400' : ''}`}>
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer active:bg-gray-50"
        onClick={handleToggle}
      >
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-gray-800">{muscleGroupName}</span>
          {entry.optional && (
            <span className="ml-2 px-1.5 py-0.5 text-xs font-medium text-amber-800 bg-amber-100 border border-amber-300 rounded">Evtl</span>
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
          {entry.exerciseDefinitionId && !done && (
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
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {!entry.exerciseDefinitionId ? (
            exerciseData ? (
              <VariationPicker
                suggestion={exerciseData.suggestion}
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
              lastSets={lastSets}
              defaultSets={defaultSets}
              onAdd={onAddSet}
              onRemoveLast={onRemoveLast}
            />
          )}
          <button
            onClick={handleMarkDone}
            disabled={done}
            className="w-full py-2 bg-green-600 text-white text-sm rounded-md font-medium disabled:opacity-40"
          >
            {done ? 'Done' : 'Done'}
          </button>
        </div>
      )}
    </div>
  )
}
