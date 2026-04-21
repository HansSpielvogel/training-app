import { forwardRef } from 'react'
import type { ExerciseDefinition } from '@application/exercises'
import type { SessionEntry, SessionSet, SessionStatus, Weight } from '@application/sessions'
import { VariationPicker } from './VariationPicker'
import { SetLogger } from './SetLogger'
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
  entry,
  muscleGroupName,
  exerciseName,
  exerciseData,
  lastSets,
  defaultSets,
  done,
  isExpanded,
  sessionStatus,
  isDraggable,
  onToggle,
  onMarkDone,
  onLoadExerciseData,
  onAssign,
  onClearVariation,
  onAddSet,
  onRemoveLast,
  onRemoveEntry,
  onUpdateSetRpe,
  onDragHandleTouchStart,
}, ref) {
  const setCount = entry.sets.length
  const canSwipe = setCount === 0 && !!onRemoveEntry

  const { swipeX, swiping, swipeBlocked, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useSwipeToDelete({ canSwipe, setCount, onRemoveEntry })

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
        <div className="absolute inset-y-0 right-0 w-20 bg-red-500 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      )}
      <div
        className={`border-b border-gray-100 bg-white ${setCount > 0 ? 'border-l-2 border-l-blue-400' : ''}`}
        style={{
          transform: `translateX(-${swipeX}px)`,
          transition: swiping ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 cursor-pointer active:bg-gray-50"
          onClick={handleToggle}
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
            {entry.optional && (
              <span className="ml-2 px-1.5 py-0.5 text-xs font-medium text-amber-800 bg-amber-100 border border-amber-300 rounded">Evtl</span>
            )}
            {entry.isTemp && (
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
            {entry.exerciseDefinitionId && !done && (
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

        {isExpanded && (
          <div
            className="px-4 pb-4 space-y-3 transition-[min-height] duration-200 ease-out"
            style={{ minHeight: entry.exerciseDefinitionId ? '200px' : '0' }}
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
