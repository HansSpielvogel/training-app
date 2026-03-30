import { useState, useEffect, useCallback, useRef } from 'react'
import type { TrainingSession, SessionSet } from '@application/sessions'
import type { Weight } from '@application/sessions'
import type { ExerciseDefinition } from '@application/exercises'
import {
  startSession,
  assignVariation,
  clearVariation,
  addSet,
  removeLastSet,
  completeSession,
  abandonSession,
  getLastVariationsForMuscleGroup,
  getLastSetsForExercise,
  computeRotationSuggestion,
} from '@application/sessions'
import { DexieTrainingSessionRepository } from '@infrastructure/sessions/DexieTrainingSessionRepository'
import { DexieTrainingPlanRepository } from '@infrastructure/planning/DexieTrainingPlanRepository'
import { DexieExerciseDefinitionRepository } from '@infrastructure/exercises/DexieExerciseDefinitionRepository'

// Hooks are the composition root — they wire use cases to repositories
export function useActiveSession() {
  const sessionRepo = useRef(new DexieTrainingSessionRepository()).current
  const planRepo = useRef(new DexieTrainingPlanRepository()).current
  const exerciseRepo = useRef(new DexieExerciseDefinitionRepository()).current

  const [session, setSession] = useState<TrainingSession | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const active = await sessionRepo.getActiveSession()
    setSession(active ?? null)
    setLoading(false)
  }, [sessionRepo])

  useEffect(() => { refresh() }, [refresh])

  const start = useCallback(async (planId: string) => {
    const s = await startSession(sessionRepo, planRepo, planId)
    setSession(s)
  }, [sessionRepo, planRepo])

  const assign = useCallback(async (entryIndex: number, exerciseDefinitionId: string) => {
    if (!session) return
    await assignVariation(sessionRepo, session.id, entryIndex, exerciseDefinitionId)
    await refresh()
  }, [session, sessionRepo, refresh])

  const clearVariationFn = useCallback(async (entryIndex: number) => {
    if (!session) return
    await clearVariation(sessionRepo, session.id, entryIndex)
    await refresh()
  }, [session, sessionRepo, refresh])

  const addSetFn = useCallback(async (entryIndex: number, weight: Weight, reps: number, count: number = 1) => {
    if (!session) return
    for (let i = 0; i < count; i++) await addSet(sessionRepo, session.id, entryIndex, weight, reps)
    await refresh()
  }, [session, sessionRepo, refresh])

  const removeLastSetFn = useCallback(async (entryIndex: number) => {
    if (!session) return
    await removeLastSet(sessionRepo, session.id, entryIndex)
    await refresh()
  }, [session, sessionRepo, refresh])

  const complete = useCallback(async () => {
    if (!session) return
    await completeSession(sessionRepo, session.id)
    setSession(null)
  }, [session, sessionRepo])

  const abandon = useCallback(async () => {
    if (!session) return
    await abandonSession(sessionRepo, session.id)
    setSession(null)
  }, [session, sessionRepo])

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
    [exerciseRepo]
  )

  return {
    session,
    loading,
    start,
    assign,
    clearVariation: clearVariationFn,
    addSet: addSetFn,
    removeLastSet: removeLastSetFn,
    complete,
    abandon,
    getRecentVariations,
    getRotationSuggestion,
    getLastSets,
    getExercisesForMuscleGroup,
  }
}
