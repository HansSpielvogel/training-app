import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ExerciseDefinition } from '@application/exercises'
import type { SessionEntry } from '@application/sessions'
import { useActiveSession } from './useActiveSession'
import { useMuscleGroups } from '../exercises/useMuscleGroups'
import { VariationPicker } from './VariationPicker'
import { SetLogger } from './SetLogger'

interface EntryExerciseData {
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
  onAddSet: (weight: import('@application/sessions').Weight, reps: number) => void
  onRemoveLast: () => void
}

function EntryRow({
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

export function ActiveSessionScreen() {
  const navigate = useNavigate()
  const { session, loading, assign, clearVariation, addSet, removeLastSet, complete, getRecentVariations, getExercisesForMuscleGroup } =
    useActiveSession()
  const { muscleGroups } = useMuscleGroups()
  const [exerciseDataMap, setExerciseDataMap] = useState<Record<number, EntryExerciseData>>({})
  const [exerciseNames, setExerciseNames] = useState<Record<string, string>>({})
  const [confirmFinish, setConfirmFinish] = useState(false)

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
        <h1 className="text-xl font-semibold text-gray-900">{session.planName}</h1>
        {!hasAnyActivity && (
          <p className="text-xs text-gray-400 mt-0.5">Tap a slot to log sets</p>
        )}
      </header>

      <div className="flex-1 overflow-y-auto">
        {session.entries.map((entry, i) => (
          <EntryRow
            key={i}
            entry={entry}
            muscleGroupName={muscleGroupMap[entry.muscleGroupId] ?? entry.muscleGroupId}
            exerciseName={entry.exerciseDefinitionId ? exerciseNames[entry.exerciseDefinitionId] : undefined}
            exerciseData={exerciseDataMap[i] ?? null}
            onLoadExerciseData={() => loadExerciseData(i, entry.muscleGroupId)}
            onAssign={(id) => handleAssign(i, id)}
            onClearVariation={() => clearVariation(i)}
            onAddSet={(weight, reps) => addSet(i, weight, reps)}
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
            onClick={() => setConfirmFinish(true)}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium text-sm"
          >
            Finish Workout
          </button>
        )}
      </div>
    </div>
  )
}
