import type { RefCallback } from 'react'
import type { SessionEntry, SessionSet, SessionStatus, Weight } from '@application/sessions'
import { EntryRow } from './EntryRow'
import type { EntryExerciseData } from './EntryRow'

interface DragState {
  fromIndex: number
  toIndex: number
  startY: number
  currentY: number
}

interface Props {
  entry: SessionEntry
  index: number
  muscleGroupName: string
  exerciseName?: string
  exerciseData: EntryExerciseData | null
  lastSets: SessionSet[] | null
  defaultSets?: number
  done: boolean
  isExpanded: boolean
  anyExpanded: boolean
  sessionStatus: SessionStatus
  dragState: DragState | null
  exerciseNames: Record<string, string>
  setRef: RefCallback<HTMLDivElement>
  onToggle: () => void
  onMarkDone: () => void
  onLoadExerciseData: () => void
  onAssign: (id: string) => void
  onClearVariation: () => void
  onAddSet: (weight: Weight, reps: number, count: number, rpe?: number) => void
  onRemoveLast: () => void
  onRemoveEntry?: () => void
  onUpdateSetRpe: (setIndex: number, rpe: number | null) => void
  onDragHandleTouchStart: (e: React.TouchEvent) => void
}

export function ActiveSessionEntryItem({
  entry, index: i, muscleGroupName, exerciseName, exerciseData, lastSets, defaultSets,
  done, isExpanded, anyExpanded, sessionStatus, dragState, setRef,
  onToggle, onMarkDone, onLoadExerciseData, onAssign, onClearVariation,
  onAddSet, onRemoveLast, onRemoveEntry, onUpdateSetRpe, onDragHandleTouchStart,
}: Props) {
  const isDragged = dragState?.fromIndex === i
  const isDropTarget = dragState !== null && dragState.toIndex === i && !isDragged
  const spotlight = isExpanded && !!entry.exerciseDefinitionId
  const dimmed = !isExpanded && anyExpanded && !isDragged

  return (
    <div
      ref={setRef}
      className={[
        'transition-all duration-200',
        isExpanded ? 'mx-1' : '',
        spotlight ? 'z-10 shadow-md' : '',
        dimmed ? 'opacity-50' : '',
      ].join(' ')}
      style={isDragged ? {
        transform: `translateY(${dragState.currentY - dragState.startY}px)`,
        position: 'relative',
        zIndex: 10,
        opacity: 0.85,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      } : undefined}
    >
      {isDropTarget && dragState && dragState.fromIndex > i && (
        <div className="h-0.5 bg-blue-400" />
      )}
      <EntryRow
        entry={entry}
        muscleGroupName={muscleGroupName}
        exerciseName={exerciseName}
        exerciseData={exerciseData}
        lastSets={lastSets}
        done={done}
        isExpanded={isExpanded}
        sessionStatus={sessionStatus}
        isDraggable={sessionStatus === 'in-progress'}
        defaultSets={defaultSets}
        onToggle={onToggle}
        onMarkDone={onMarkDone}
        onLoadExerciseData={onLoadExerciseData}
        onAssign={onAssign}
        onClearVariation={onClearVariation}
        onAddSet={onAddSet}
        onRemoveLast={onRemoveLast}
        onRemoveEntry={onRemoveEntry}
        onUpdateSetRpe={onUpdateSetRpe}
        onDragHandleTouchStart={onDragHandleTouchStart}
      />
      {isDropTarget && dragState && dragState.fromIndex < i && (
        <div className="h-0.5 bg-blue-400" />
      )}
    </div>
  )
}
