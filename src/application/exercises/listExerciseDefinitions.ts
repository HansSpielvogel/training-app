import type { IExerciseDefinitionRepository } from '@domain/exercises/IExerciseDefinitionRepository'
import type { ExerciseDefinition } from '@domain/exercises/ExerciseDefinition'

export async function listExerciseDefinitions(
  repo: IExerciseDefinitionRepository,
  muscleGroupId?: string,
): Promise<ExerciseDefinition[]> {
  if (muscleGroupId) return repo.listByMuscleGroup(muscleGroupId)
  return repo.list()
}
