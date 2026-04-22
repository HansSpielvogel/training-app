import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Weight } from '@application/sessions'
import type { TrainingPlan } from '@application/planning'
import { useActiveSession } from './useActiveSession'
import { useSessionConfirm } from './useSessionConfirm'
import { useMuscleGroups } from '../exercises/useMuscleGroups'
import { useEntryDoneState } from './useEntryDoneState'
import { useDragReorder } from './useDragReorder'
import { ConfirmAbandonBanner } from './ConfirmAbandonBanner'
import { SlotPickerPanel } from './SlotPickerPanel'
import { SessionFooter } from './SessionFooter'
import { SessionHeader } from './SessionHeader'
import { ActiveSessionEntryItem } from './ActiveSessionEntryItem'
import { findNextIncomplete, findActiveEntry, remapDoneIndices, remapSingleIndex, shiftSetAfterRemoval } from './activeSessionHelpers'

export function ActiveSessionScreen() {
  const navigate = useNavigate()
  const {
    session, loading, clearVariation, addSet, removeLastSet, complete, abandon,
    addTempSlot, removeTempSlot, addPlanSlots, listPlans, removePlanSlot,
    exerciseDataMap, exerciseNames, lastSetsMap, loadExerciseData, handleAssign, clearLastSets,
    remapExerciseMaps, shiftExerciseMapsAfterRemoval,
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
      remapExerciseMaps(fromIndex, toIndex)
      if (expandedIndex !== null) setExpandedIndex(remapSingleIndex(expandedIndex, fromIndex, toIndex))
      if (activeEntryIndex !== null) setActiveEntryIndex(remapSingleIndex(activeEntryIndex, fromIndex, toIndex))
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
    if (!session) return
    const isCurrentlyExpanded = expandedIndex === i
    if (isCurrentlyExpanded) {
      const entry = session.entries[i]
      const hasSets = (entry?.sets.length ?? 0) > 0
      if (hasSets) {
        const newDone = new Set(doneIndices).add(i)
        setDone(newDone, session.id)
        setActiveEntryIndex(null)
        expandAndPreload(findNextIncomplete(i, newDone, session.entries.length))
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
    if (!session) return
    const newDone = new Set(doneIndices).add(i)
    setDone(newDone, session.id)
    setActiveEntryIndex(null)
    expandAndPreload(findNextIncomplete(i, newDone, session.entries.length))
  }

  function handleAssignWithActive(i: number, id: string) {
    setActiveEntryIndex(i)
    handleAssign(i, id)
  }

  function handleAddSetWithActive(i: number, weight: Weight, reps: number, count: number, rpe?: number) {
    if (activeEntryIndex !== i) setActiveEntryIndex(i)
    addSet(i, weight, reps, count, rpe)
  }

  async function handleRemoveEntry(i: number, isTemp: boolean) {
    shiftExerciseMapsAfterRemoval(i)
    if (session) updateDone(prev => shiftSetAfterRemoval(prev, i), session.id)
    setExpandedIndex(prev => prev === null ? null : prev === i ? null : prev > i ? prev - 1 : prev)
    setActiveEntryIndex(prev => prev === null ? null : prev === i ? null : prev > i ? prev - 1 : prev)
    if (isTemp) await removeTempSlot(i)
    else await removePlanSlot(i)
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
      <SessionHeader
        planName={session.planName}
        doneCount={doneIndices.size}
        totalEntries={session.entries.length}
        hasAnyActivity={hasAnyActivity}
        onAbandon={() => { setConfirmAbandon(true); setConfirmFinish(false) }}
      />

      {confirmAbandon && (
        <ConfirmAbandonBanner
          onAbandon={handleAbandon}
          onCancel={() => setConfirmAbandon(false)}
        />
      )}

      <div className="flex-1 overflow-y-auto">
        {session.entries.map((entry, i) => (
          <ActiveSessionEntryItem
            key={`entry-${i}`}
            entry={entry}
            index={i}
            muscleGroupName={muscleGroupMap[entry.muscleGroupId] ?? entry.muscleGroupId}
            exerciseName={entry.exerciseDefinitionId ? exerciseNames[entry.exerciseDefinitionId] : undefined}
            exerciseData={exerciseDataMap[i] ?? null}
            lastSets={lastSetsMap[i] ?? null}
            defaultSets={exerciseDataMap[i]?.all.find((e) => e.id === entry.exerciseDefinitionId)?.defaultSets}
            done={doneIndices.has(i)}
            isExpanded={expandedIndex === i}
            sessionStatus={session.status}
            dragState={dragState}
            exerciseNames={exerciseNames}
            setRef={(el) => { entryRefs.current[i] = el }}
            onToggle={() => handleToggle(i)}
            onMarkDone={() => handleMarkDone(i)}
            onLoadExerciseData={() => loadExerciseData(i, entry.muscleGroupId)}
            onAssign={(id) => handleAssignWithActive(i, id)}
            onClearVariation={() => { clearVariation(i); clearLastSets(i) }}
            onAddSet={(weight: Weight, reps: number, count: number, rpe?: number) => handleAddSetWithActive(i, weight, reps, count, rpe)}
            onRemoveLast={() => removeLastSet(i)}
            onRemoveEntry={() => handleRemoveEntry(i, !!entry.isTemp)}
            onUpdateSetRpe={(setIndex, rpe) => updateRpe(i, setIndex, rpe)}
            onDragHandleTouchStart={(e) => handleDragHandleTouchStart(i, e)}
          />
        ))}
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
