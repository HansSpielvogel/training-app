import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Weight } from '@application/sessions'
import { useActiveSession } from './useActiveSession'
import { useMuscleGroups } from '../exercises/useMuscleGroups'
import { EntryRow } from './EntryRow'
import type { EntryExerciseData } from './EntryRow'

export function ActiveSessionScreen() {
  const navigate = useNavigate()
  const { session, loading, assign, clearVariation, addSet, removeLastSet, complete, abandon, getRecentVariations, getExercisesForMuscleGroup } =
    useActiveSession()
  const { muscleGroups } = useMuscleGroups()
  const [exerciseDataMap, setExerciseDataMap] = useState<Record<number, EntryExerciseData>>({})
  const [exerciseNames, setExerciseNames] = useState<Record<string, string>>({})
  const [confirmFinish, setConfirmFinish] = useState(false)
  const [confirmAbandon, setConfirmAbandon] = useState(false)

  useEffect(() => {
    if (!loading && !session) navigate('/sessions', { replace: true })
  }, [session, loading, navigate])

  async function loadExerciseData(entryIndex: number, muscleGroupId: string) {
    const [recent, all] = await Promise.all([
      getRecentVariations(muscleGroupId),
      getExercisesForMuscleGroup(muscleGroupId),
    ])
    setExerciseDataMap((prev) => ({ ...prev, [entryIndex]: { recent, all } }))

    const nameMap: Record<string, string> = {}
    for (const ex of [...recent, ...all]) nameMap[ex.id] = ex.name
    setExerciseNames((prev) => ({ ...prev, ...nameMap }))
  }

  async function handleAssign(entryIndex: number, exerciseDefinitionId: string) {
    await assign(entryIndex, exerciseDefinitionId)
    const entry = session?.entries[entryIndex]
    if (entry) {
      const allExercises = await getExercisesForMuscleGroup(entry.muscleGroupId)
      const ex = allExercises.find((e) => e.id === exerciseDefinitionId)
      if (ex) setExerciseNames((prev) => ({ ...prev, [ex.id]: ex.name }))
    }
  }

  async function handleComplete() {
    await complete()
    navigate('/sessions', { replace: true })
  }

  async function handleAbandon() {
    await abandon()
    navigate('/sessions', { replace: true })
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
          <h1 className="text-xl font-semibold text-gray-900">{session.planName}</h1>
          <button
            onClick={() => { setConfirmAbandon(true); setConfirmFinish(false) }}
            className="text-sm text-gray-400 hover:text-red-500"
          >
            Abandon
          </button>
        </div>
        {!hasAnyActivity && (
          <p className="text-xs text-gray-400 mt-0.5">Tap a slot to log sets</p>
        )}
      </header>

      {confirmAbandon && (
        <div className="px-4 py-3 bg-red-50 border-b border-red-200">
          <p className="text-sm font-medium text-red-800 mb-0.5">Abandon this session?</p>
          <p className="text-xs text-red-600 mb-3">All logged sets will be lost.</p>
          <div className="flex gap-2">
            <button
              onClick={handleAbandon}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg font-medium"
            >
              Abandon
            </button>
            <button
              onClick={() => setConfirmAbandon(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg font-medium"
            >
              Keep Going
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {session.entries.map((entry, i) => (
          <EntryRow
            key={entry.muscleGroupId}
            entry={entry}
            muscleGroupName={muscleGroupMap[entry.muscleGroupId] ?? entry.muscleGroupId}
            exerciseName={entry.exerciseDefinitionId ? exerciseNames[entry.exerciseDefinitionId] : undefined}
            exerciseData={exerciseDataMap[i] ?? null}
            onLoadExerciseData={() => loadExerciseData(i, entry.muscleGroupId)}
            onAssign={(id) => handleAssign(i, id)}
            onClearVariation={() => clearVariation(i)}
            onAddSet={(weight: Weight, reps: number) => addSet(i, weight, reps)}
            onRemoveLast={() => removeLastSet(i)}
          />
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
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
  )
}
