import { useState, useCallback, useRef } from 'react'
import type { TrainingSession, SessionSet } from '@application/sessions'
import {
  getLastVariationsForMuscleGroup,
  getLastSetsForExercise,
  computeRotationSuggestion,
} from '@application/sessions'
import type { ExerciseDefinition } from '@application/exercises'
import { DexieTrainingSessionRepository } from '@infrastructure/sessions/DexieTrainingSessionRepository'
import { DexieExerciseDefinitionRepository } from '@infrastructure/exercises/DexieExerciseDefinitionRepository'
import type { EntryExerciseData } from './EntryRow'
import { remapIndexedMap, shiftIndexedMapAfterRemoval } from './activeSessionHelpers'

export function useSessionExerciseData(
  session: TrainingSession | null,
  assign: (entryIndex: number, exerciseDefinitionId: string) => Promise<void>,
) {
  const sessionRepo = useRef(new DexieTrainingSessionRepository()).current
  const exerciseRepo = useRef(new DexieExerciseDefinitionRepository()).current

  const [exerciseDataMap, setExerciseDataMap] = useState<Record<number, EntryExerciseData>>({})
  const [exerciseNames, setExerciseNames] = useState<Record<string, string>>({})
  const [lastSetsMap, setLastSetsMap] = useState<Record<number, SessionSet[] | null>>({})

  const getRecentVariations = useCallback(async (muscleGroupId: string): Promise<ExerciseDefinition[]> => {
    const ids = await getLastVariationsForMuscleGroup(sessionRepo, muscleGroupId, 4)
    const exercises = await Promise.all(ids.map((id) => exerciseRepo.findById(id)))
    return exercises.filter((e): e is ExerciseDefinition => e !== undefined)
  }, [sessionRepo, exerciseRepo])

  const getRotationSuggestion = useCallback(async (muscleGroupId: string): Promise<ExerciseDefinition | null> => {
    const sessions = await sessionRepo.listCompleted()
    const suggestionId = computeRotationSuggestion(muscleGroupId, sessions)
    if (!suggestionId) return null
    return (await exerciseRepo.findById(suggestionId)) ?? null
  }, [sessionRepo, exerciseRepo])

  const getLastSets = useCallback(
    (exerciseDefinitionId: string): Promise<SessionSet[] | null> =>
      getLastSetsForExercise(sessionRepo, exerciseDefinitionId),
    [sessionRepo],
  )

  const getExercisesForMuscleGroup = useCallback(
    (muscleGroupId: string): Promise<ExerciseDefinition[]> =>
      exerciseRepo.listByMuscleGroup(muscleGroupId),
    [exerciseRepo],
  )

  const loadExerciseData = useCallback(async (entryIndex: number, muscleGroupId: string) => {
    const exerciseDefinitionId = session?.entries[entryIndex]?.exerciseDefinitionId
    const [recent, all, suggestion, lastSets] = await Promise.all([
      getRecentVariations(muscleGroupId),
      getExercisesForMuscleGroup(muscleGroupId),
      getRotationSuggestion(muscleGroupId),
      exerciseDefinitionId ? getLastSets(exerciseDefinitionId) : Promise.resolve(null),
    ])
    setExerciseDataMap((prev) => ({ ...prev, [entryIndex]: { recent, all, suggestion } }))
    setLastSetsMap((prev) => ({ ...prev, [entryIndex]: lastSets }))
    const nameMap: Record<string, string> = {}
    for (const ex of [...recent, ...all]) nameMap[ex.id] = ex.name
    setExerciseNames((prev) => ({ ...prev, ...nameMap }))
  }, [session, getRecentVariations, getExercisesForMuscleGroup, getRotationSuggestion, getLastSets])

  const handleAssign = useCallback(async (entryIndex: number, exerciseDefinitionId: string) => {
    await assign(entryIndex, exerciseDefinitionId)
    const entry = session?.entries[entryIndex]
    if (entry) {
      const [allExercises, lastSets] = await Promise.all([
        getExercisesForMuscleGroup(entry.muscleGroupId),
        getLastSets(exerciseDefinitionId),
      ])
      const ex = allExercises.find((e) => e.id === exerciseDefinitionId)
      if (ex) setExerciseNames((prev) => ({ ...prev, [ex.id]: ex.name }))
      setLastSetsMap((prev) => ({ ...prev, [entryIndex]: lastSets }))
    }
  }, [assign, session, getExercisesForMuscleGroup, getLastSets])

  const clearLastSets = useCallback((entryIndex: number) => {
    setLastSetsMap((prev) => ({ ...prev, [entryIndex]: null }))
  }, [])

  const remapExerciseMaps = useCallback((fromIndex: number, toIndex: number) => {
    setExerciseDataMap((prev) => remapIndexedMap(prev, fromIndex, toIndex))
    setLastSetsMap((prev) => remapIndexedMap(prev, fromIndex, toIndex))
  }, [])

  const shiftExerciseMapsAfterRemoval = useCallback((removedIndex: number) => {
    setExerciseDataMap((prev) => shiftIndexedMapAfterRemoval(prev, removedIndex))
    setLastSetsMap((prev) => shiftIndexedMapAfterRemoval(prev, removedIndex))
  }, [])

  return {
    exerciseDataMap,
    exerciseNames,
    lastSetsMap,
    loadExerciseData,
    handleAssign,
    clearLastSets,
    remapExerciseMaps,
    shiftExerciseMapsAfterRemoval,
  }
}
