import { forwardRef } from 'react'
import type { ExerciseDefinition } from '@application/exercises'
import type { SessionEntry, SessionSet, SessionStatus, Weight } from '@application/sessions'
import { VariationPicker } from './VariationPicker'
import { SetLogger } from './SetLogger'
import { EntryRowHeader } from './EntryRowHeader'
import { useSwipeToDelete } from './useSwipeToDelete'

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
  done: boolean
  isExpanded: boolean
  sessionStatus: SessionStatus
  isDraggable?: boolean
  onToggle: () => void
  onMarkDone: () => void
  onLoadExerciseData: () => void
  onAssign: (exerciseDefinitionId: string) => void
  onClearVariation: () => void
  onAddSet: (weight: Weight, reps: number, count: number, rpe?: number) => void
  onRemoveLast: () => void
  onRemoveEntry?: () => void
  onUpdateSetRpe: (setIndex: number, rpe: number | null) => void
  onDragHandleTouchStart?: (e: React.TouchEvent) => void
}

export const EntryRow = forwardRef<HTMLDivElement, EntryRowProps>(function EntryRow({
  entry, muscleGroupName, exerciseName, exerciseData, lastSets, defaultSets,
  done, isExpanded, sessionStatus, isDraggable,
  onToggle, onMarkDone, onLoadExerciseData, onAssign, onClearVariation,
  onAddSet, onRemoveLast, onRemoveEntry, onUpdateSetRpe, onDragHandleTouchStart,
}, ref) {
  const setCount = entry.sets.length
  const canSwipe = setCount === 0 && !!onRemoveEntry

  const { swipeX, swiping, swipeBlocked, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useSwipeToDelete({ canSwipe, setCount })

  function handleToggle() {
    if (!isExpanded && !exerciseData) onLoadExerciseData()
    onToggle()
  }

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {swipeBlocked && (
        <div className="absolute inset-x-0 top-0 z-20 px-4 py-1 bg-red-50 border-b border-red-200">
          <p className="text-xs text-red-600">Remove sets before removing this slot</p>
        </div>
      )}
      {canSwipe && (
        <button
          className="absolute inset-y-0 right-0 w-20 bg-red-500 flex items-center justify-center"
          onTouchEnd={(e) => { e.stopPropagation(); onRemoveEntry?.() }}
          onClick={onRemoveEntry}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
      <div
        className={`border-b border-gray-200 bg-white ${isExpanded ? 'border-l-4 border-l-blue-500' : setCount > 0 ? 'border-l-2 border-l-blue-400' : ''}`}
        style={{
          transform: `translateX(-${swipeX}px)`,
          transition: swiping ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        <EntryRowHeader
          muscleGroupName={muscleGroupName}
          exerciseName={exerciseName}
          isOptional={!!entry.optional}
          isTemp={!!entry.isTemp}
          setCount={setCount}
          done={done}
          isExpanded={isExpanded}
          isDraggable={isDraggable}
          onToggle={handleToggle}
          onClearVariation={onClearVariation}
          onDragHandleTouchStart={onDragHandleTouchStart}
        />

        {isExpanded && (
          <div
            className="px-4 pb-3 space-y-2 transition-[min-height] duration-200 ease-out"
            style={{ minHeight: entry.exerciseDefinitionId ? '160px' : '0' }}
          >
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
              <div style={{ animation: 'fadeIn 150ms ease-out' }}>
                <SetLogger
                  sets={entry.sets}
                  lastSets={lastSets}
                  defaultSets={defaultSets}
                  exerciseName={exerciseName}
                  sessionStatus={sessionStatus}
                  onAdd={(weight, reps, count, rpe) => onAddSet(weight, reps, count, rpe)}
                  onRemoveLast={onRemoveLast}
                  onUpdateSetRpe={onUpdateSetRpe}
                />
              </div>
            )}
            {setCount > 0 && (
              <button
                onClick={onMarkDone}
                disabled={done}
                className="w-full py-2 min-h-[44px] bg-green-600 text-white text-sm rounded-md font-medium disabled:opacity-40"
              >
                Done
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
})
