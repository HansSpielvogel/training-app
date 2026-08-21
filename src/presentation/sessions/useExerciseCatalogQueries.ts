import { useCallback, useRef } from 'react'
import type { SessionSet } from '@application/sessions'
import {
  getLastVariationsForMuscleGroup,
  getLastSetsForExercise,
  computeRotationSuggestion,
} from '@application/sessions'
import type { ExerciseDefinition } from '@application/exercises'
import { DexieTrainingSessionRepository } from '@infrastructure/sessions/DexieTrainingSessionRepository'
import { DexieExerciseDefinitionRepository } from '@infrastructure/exercises/DexieExerciseDefinitionRepository'

// Read-only catalogue lookups used to populate the variation picker
export function useExerciseCatalogQueries() {
  const sessionRepo = useRef(new DexieTrainingSessionRepository()).current
  const exerciseRepo = useRef(new DexieExerciseDefinitionRepository()).current

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

  return { getRecentVariations, getRotationSuggestion, getLastSets, getExercisesForMuscleGroup }
}
