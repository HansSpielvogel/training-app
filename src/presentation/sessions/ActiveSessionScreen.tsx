import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Weight } from '@application/sessions'
import type { TrainingPlan } from '@application/planning'
import { useActiveSession } from './useActiveSession'
import { useSessionConfirm } from './useSessionConfirm'
import { useMuscleGroups } from '../exercises/useMuscleGroups'
import { useEntryDoneState } from './useEntryDoneState'
import { useDragReorder } from './useDragReorder'
import { EntryRow } from './EntryRow'
import { ConfirmAbandonBanner } from './ConfirmAbandonBanner'
import { SlotPickerPanel } from './SlotPickerPanel'
import { SessionFooter } from './SessionFooter'

export function findNextIncomplete(current: number | null, doneIndices: Set<number>, total: number): number | null {
  const start = current !== null ? current + 1 : 0
  for (let i = start; i < total; i++) {
    if (!doneIndices.has(i)) return i
  }
  return null
}

export function findActiveEntry(entries: readonly { sets: readonly unknown[]; exerciseDefinitionId?: string }[], doneIndices: Set<number>): number | null {
  for (let i = 0; i < entries.length; i++) {
    if (doneIndices.has(i)) continue
    const e = entries[i]
    if (e.exerciseDefinitionId || e.sets.length > 0) return i
  }
  return null
}

export function remapDoneIndices(done: Set<number>, fromIndex: number, toIndex: number): Set<number> {
  if (fromIndex === toIndex) return done
  const result = new Set<number>()
  for (const idx of done) {
    if (idx === fromIndex) {
      result.add(toIndex)
    } else if (fromIndex < toIndex && idx > fromIndex && idx <= toIndex) {
      result.add(idx - 1)
    } else if (fromIndex > toIndex && idx >= toIndex && idx < fromIndex) {
      result.add(idx + 1)
    } else {
      result.add(idx)
    }
  }
  return result
}

export function ActiveSessionScreen() {
  const navigate = useNavigate()
  const {
    session, loading, clearVariation, addSet, removeLastSet, complete, abandon,
    addTempSlot, removeTempSlot, addPlanSlots, listPlans, removePlanSlot,
    exerciseDataMap, exerciseNames, lastSetsMap, loadExerciseData, handleAssign, clearLastSets,
    updateRpe, reorderEntries,
  } = useActiveSession()
  const { muscleGroups } = useMuscleGroups()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [activeEntryIndex, setActiveEntryIndex] = useState<number | null>(null)
  const { doneIndices, setDone, updateDone, initFromSession, clearSession } = useEntryDoneState()
  const [showMuscleGroupPicker, setShowMuscleGroupPicker] = useState(false)
  const [showPlanPicker, setShowPlanPicker] = useState(false)
  const [availablePlans, setAvailablePlans] = useState<TrainingPlan[]>([])
  const [planPickerMessage, setPlanPickerMessage] = useState<string>()
  const entryRefs = useRef<(HTMLDivElement | null)[]>([])

  const { dragState, handleDragHandleTouchStart } = useDragReorder(
    entryRefs,
    reorderEntries,
    (fromIndex, toIndex) => {
      if (session) updateDone(prev => remapDoneIndices(prev, fromIndex, toIndex), session.id)
    },
  )

  const { confirmFinish, setConfirmFinish, confirmAbandon, setConfirmAbandon, handleComplete, handleAbandon } =
    useSessionConfirm(complete, abandon, () => {
      if (session) clearSession(session.id)
      navigate('/sessions', { replace: true })
    })

  useEffect(() => {
    if (!loading && !session) navigate('/sessions', { replace: true })
  }, [session, loading, navigate])

  // On mount: restore doneIndices from sessionStorage and focus the active entry
  useEffect(() => {
    if (loading || !session) return
    const persisted = initFromSession(session.id)
    const active = findActiveEntry(session.entries, persisted)
    if (active !== null) {
      setActiveEntryIndex(active)
      setExpandedIndex(active)
      if (!exerciseDataMap[active]) {
        loadExerciseData(active, session.entries[active].muscleGroupId)
      }
      setTimeout(() => {
        entryRefs.current[active]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  function expandAndPreload(nextIndex: number | null) {
    setExpandedIndex(nextIndex)
    setActiveEntryIndex(nextIndex)
    if (nextIndex !== null && !exerciseDataMap[nextIndex] && session) {
      loadExerciseData(nextIndex, session.entries[nextIndex].muscleGroupId)
    }
    if (nextIndex !== null) {
      setTimeout(() => {
        entryRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }

  function handleToggle(i: number) {
    const isCurrentlyExpanded = expandedIndex === i
    if (isCurrentlyExpanded) {
      const entry = session?.entries[i]
      const hasSets = (entry?.sets.length ?? 0) > 0
      if (hasSets) {
        const newDone = new Set(doneIndices).add(i)
        setDone(newDone, session!.id)
        setActiveEntryIndex(null)
        expandAndPreload(findNextIncomplete(i, newDone, session?.entries.length ?? 0))
      } else {
        setExpandedIndex(null)
        if (activeEntryIndex === i) setActiveEntryIndex(null)
      }
    } else {
      setExpandedIndex(i)
      setActiveEntryIndex(i)
      if (!exerciseDataMap[i] && session) {
        loadExerciseData(i, session.entries[i].muscleGroupId)
      }
    }
  }

  function handleMarkDone(i: number) {
    const newDone = new Set(doneIndices).add(i)
    setDone(newDone, session!.id)
    setActiveEntryIndex(null)
    expandAndPreload(findNextIncomplete(i, newDone, session?.entries.length ?? 0))
  }

  function handleAssignWithActive(i: number, id: string) {
    setActiveEntryIndex(i)
    handleAssign(i, id)
  }

  function handleAddSetWithActive(i: number, weight: Weight, reps: number, count: number, rpe?: number) {
    if (activeEntryIndex !== i) setActiveEntryIndex(i)
    addSet(i, weight, reps, count, rpe)
  }

  async function handleAddTempSlot(muscleGroupId: string) {
    setShowMuscleGroupPicker(false)
    await addTempSlot(muscleGroupId)
  }

  async function handleOpenPlanPicker() {
    const plans = await listPlans()
    setAvailablePlans(plans.filter(p => p.id !== session?.planId))
    setShowPlanPicker(true)
    setPlanPickerMessage(undefined)
  }

  async function handleAddPlanSlots(planId: string) {
    const added = await addPlanSlots(planId)
    if (added === 0) {
      setPlanPickerMessage('All muscle groups from that plan are already in this session.')
    } else {
      setShowPlanPicker(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return null

  const muscleGroupMap = Object.fromEntries(muscleGroups.map((mg) => [mg.id, mg.name]))
  const hasAnyActivity = session.entries.some((e) => e.exerciseDefinitionId || e.sets.length > 0)

  return (
    <div className="flex flex-col h-full">
      <header
        className="px-4 py-4 border-b border-gray-200 bg-white"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
      >
        <div className="flex items-center justify-between">
          <h1 className="flex-1 min-w-0 truncate text-xl font-semibold text-gray-900">{session.planName}</h1>
          <button
            onClick={() => { setConfirmAbandon(true); setConfirmFinish(false) }}
            className="ml-3 p-2 text-sm text-red-500 min-h-[44px] flex items-center"
          >
            Abandon
          </button>
        </div>
        {!hasAnyActivity && (
          <p className="text-sm text-gray-500 mt-0.5">Tap a slot to log sets</p>
        )}
      </header>

      {confirmAbandon && (
        <ConfirmAbandonBanner
          onAbandon={handleAbandon}
          onCancel={() => setConfirmAbandon(false)}
        />
      )}

      <div className="flex-1 overflow-y-auto">
        {session.entries.map((entry, i) => {
          const isDragged = dragState?.fromIndex === i
          const isDropTarget = dragState !== null && dragState.toIndex === i && !isDragged

          return (
            <div
              key={i}
              ref={(el) => { entryRefs.current[i] = el }}
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
                muscleGroupName={muscleGroupMap[entry.muscleGroupId] ?? entry.muscleGroupId}
                exerciseName={entry.exerciseDefinitionId ? exerciseNames[entry.exerciseDefinitionId] : undefined}
                exerciseData={exerciseDataMap[i] ?? null}
                lastSets={lastSetsMap[i] ?? null}
                done={doneIndices.has(i)}
                isExpanded={expandedIndex === i}
                sessionStatus={session.status}
                isDraggable={session.status === 'in-progress'}
                onToggle={() => handleToggle(i)}
                onMarkDone={() => handleMarkDone(i)}
                onLoadExerciseData={() => loadExerciseData(i, entry.muscleGroupId)}
                onAssign={(id) => handleAssignWithActive(i, id)}
                onClearVariation={() => { clearVariation(i); clearLastSets(i) }}
                defaultSets={exerciseDataMap[i]?.all.find((e) => e.id === entry.exerciseDefinitionId)?.defaultSets}
                onAddSet={(weight: Weight, reps: number, count: number, rpe?: number) => handleAddSetWithActive(i, weight, reps, count, rpe)}
                onRemoveLast={() => removeLastSet(i)}
                onRemoveEntry={entry.isTemp ? () => removeTempSlot(i) : () => removePlanSlot(i)}
                onUpdateSetRpe={(setIndex, rpe) => updateRpe(i, setIndex, rpe)}
                onDragHandleTouchStart={(e) => handleDragHandleTouchStart(i, e)}
              />
              {isDropTarget && dragState && dragState.fromIndex < i && (
                <div className="h-0.5 bg-blue-400" />
              )}
            </div>
          )
        })}
        <SlotPickerPanel
          showMuscleGroupPicker={showMuscleGroupPicker}
          showPlanPicker={showPlanPicker}
          muscleGroups={muscleGroups}
          availablePlans={availablePlans}
          planPickerMessage={planPickerMessage}
          onAddTempSlot={handleAddTempSlot}
          onAddPlanSlots={handleAddPlanSlots}
          onOpenMuscleGroupPicker={() => { setShowMuscleGroupPicker(true); setShowPlanPicker(false) }}
          onOpenPlanPicker={() => { handleOpenPlanPicker(); setShowMuscleGroupPicker(false) }}
          onCancelMuscleGroupPicker={() => setShowMuscleGroupPicker(false)}
          onCancelPlanPicker={() => setShowPlanPicker(false)}
        />
      </div>

      <SessionFooter
        confirmFinish={confirmFinish}
        onKeepGoing={() => setConfirmFinish(false)}
        onConfirmFinish={handleComplete}
        onRequestFinish={() => { setConfirmFinish(true); setConfirmAbandon(false) }}
      />
    </div>
  )
}
