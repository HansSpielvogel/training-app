import type { IMuscleGroupRepository } from '@domain/exercises/IMuscleGroupRepository'
import type { IExerciseDefinitionRepository } from '@domain/exercises/IExerciseDefinitionRepository'
import { MuscleGroupInUseError } from '@domain/exercises/MuscleGroup'

export async function deleteMuscleGroup(
  muscleGroupRepo: IMuscleGroupRepository,
  exerciseRepo: IExerciseDefinitionRepository,
  id: string,
): Promise<void> {
  const references = await exerciseRepo.listByMuscleGroup(id)
  if (references.length > 0) throw new MuscleGroupInUseError()
  await muscleGroupRepo.delete(id)
}
