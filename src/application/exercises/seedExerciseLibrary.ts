import type { IMuscleGroupRepository } from '@domain/exercises/IMuscleGroupRepository'
import type { IExerciseDefinitionRepository } from '@domain/exercises/IExerciseDefinitionRepository'
import seedData from '../../../openspec/seed/exercise-library.json'

export async function seedExerciseLibrary(
  muscleGroupRepo: IMuscleGroupRepository,
  exerciseRepo: IExerciseDefinitionRepository,
): Promise<void> {
  const count = await muscleGroupRepo.list().then((mgs) => mgs.length)
  if (count > 0) return

  for (const mg of seedData.muscleGroups) await muscleGroupRepo.save(mg)
  for (const ed of seedData.exerciseDefinitions) await exerciseRepo.save(ed)
}
