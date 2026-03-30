import type { IMuscleGroupRepository } from '@domain/exercises/IMuscleGroupRepository'
import type { IExerciseDefinitionRepository } from '@domain/exercises/IExerciseDefinitionRepository'
import type { MuscleGroup } from '@domain/exercises/MuscleGroup'
import type { ExerciseDefinition } from '@domain/exercises/ExerciseDefinition'

export interface ExerciseLibraryExport {
  version: 1
  muscleGroups: MuscleGroup[]
  exerciseDefinitions: ExerciseDefinition[]
}

export async function exportExerciseLibrary(
  muscleGroupRepo: IMuscleGroupRepository,
  exerciseRepo: IExerciseDefinitionRepository,
): Promise<ExerciseLibraryExport> {
  const [muscleGroups, exerciseDefinitions] = await Promise.all([
    muscleGroupRepo.list(),
    exerciseRepo.list(),
  ])
  return { version: 1, muscleGroups, exerciseDefinitions }
}
