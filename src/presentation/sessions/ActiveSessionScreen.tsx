import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Weight } from '@application/sessions'
import type { TrainingPlan } from '@application/planning'
import { useActiveSession } from './useActiveSession'
import { useSessionConfirm } from './useSessionConfirm'
import { useMuscleGroups } from '../exercises/useMuscleGroups'
import { EntryRow } from './EntryRow'
import { ConfirmAbandonBanner } from './ConfirmAbandonBanner'
import { SlotPickerPanel } from './SlotPickerPanel'

export function findNextIncomplete(current: number | null, doneIndices: Set<number>, total: number): number | null {
  const start = current !== null ? current + 1 : 0
  for (let i = start; i < total; i++) {
    if (!doneIndices.has(i)) return i
  }
  return null
}

export function ActiveSessionScreen() {
  const navigate = useNavigate()
  const {
    session, loading, clearVariation, addSet, removeLastSet, complete, abandon,
    addTempSlot, removeTempSlot, addPlanSlots, listPlans, removePlanSlot,
    exerciseDataMap, exerciseNames, lastSetsMap, loadExerciseData, handleAssign, clearLastSets,
  } = useActiveSession()
  const { muscleGroups } = useMuscleGroups()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [doneIndices, setDoneIndices] = useState<Set<number>>(new Set())
  const [showMuscleGroupPicker, setShowMuscleGroupPicker] = useState(false)
  const [showPlanPicker, setShowPlanPicker] = useState(false)
  const [availablePlans, setAvailablePlans] = useState<TrainingPlan[]>([])
  const [planPickerMessage, setPlanPickerMessage] = useState<string>()

  const { confirmFinish, setConfirmFinish, confirmAbandon, setConfirmAbandon, handleComplete, handleAbandon } =
    useSessionConfirm(complete, abandon, () => navigate('/sessions', { replace: true }))

  useEffect(() => {
    if (!loading && !session) navigate('/sessions', { replace: true })
  }, [session, loading, navigate])

  function expandAndPreload(nextIndex: number | null) {
    setExpandedIndex(nextIndex)
    if (nextIndex !== null && !exerciseDataMap[nextIndex] && session) {
      loadExerciseData(nextIndex, session.entries[nextIndex].muscleGroupId)
    }
  }

  function handleToggle(i: number) {
    const isCurrentlyExpanded = expandedIndex === i
    if (isCurrentlyExpanded) {
      const entry = session?.entries[i]
      const hasSets = (entry?.sets.length ?? 0) > 0
      if (hasSets) {
        const newDone = new Set(doneIndices).add(i)
        setDoneIndices(newDone)
        expandAndPreload(findNextIncomplete(i, newDone, session?.entries.length ?? 0))
      } else {
        setExpandedIndex(null)
      }
    } else {
      setExpandedIndex(i)
    }
  }

  function handleMarkDone(i: number) {
    const newDone = new Set(doneIndices).add(i)
    setDoneIndices(newDone)
    expandAndPreload(findNextIncomplete(i, newDone, session?.entries.length ?? 0))
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
        {session.entries.map((entry, i) => (
          <EntryRow
            key={i}
            entry={entry}
            muscleGroupName={muscleGroupMap[entry.muscleGroupId] ?? entry.muscleGroupId}
            exerciseName={entry.exerciseDefinitionId ? exerciseNames[entry.exerciseDefinitionId] : undefined}
            exerciseData={exerciseDataMap[i] ?? null}
            lastSets={lastSetsMap[i] ?? null}
            done={doneIndices.has(i)}
            isExpanded={expandedIndex === i}
            onToggle={() => handleToggle(i)}
            onMarkDone={() => handleMarkDone(i)}
            onLoadExerciseData={() => loadExerciseData(i, entry.muscleGroupId)}
            onAssign={(id) => handleAssign(i, id)}
            onClearVariation={() => { clearVariation(i); clearLastSets(i) }}
            defaultSets={exerciseDataMap[i]?.all.find((e) => e.id === entry.exerciseDefinitionId)?.defaultSets}
            onAddSet={(weight: Weight, reps: number, count: number, rpe?: number) => addSet(i, weight, reps, count, rpe)}
            onRemoveLast={() => removeLastSet(i)}
            onRemoveEntry={entry.isTemp ? () => removeTempSlot(i) : () => removePlanSlot(i)}
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

      <div className="border-t border-gray-200 bg-white">
        <div className="px-4 py-2">
          {confirmFinish ? (
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmFinish(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm"
              >
                Keep Going
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium text-sm"
              >
                Finish
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setConfirmFinish(true); setConfirmAbandon(false) }}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium text-sm"
            >
              Finish Workout
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
