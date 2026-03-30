import type { IExerciseDefinitionRepository } from '@domain/exercises/IExerciseDefinitionRepository'
import {
  createExerciseDefinition as createEntity,
  DuplicateExerciseNameError,
} from '@domain/exercises/ExerciseDefinition'

export async function editExerciseDefinition(
  repo: IExerciseDefinitionRepository,
  id: string,
  name: string,
  muscleGroupIds: string[],
): Promise<void> {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Name cannot be empty')
  const existing = await repo.findByName(trimmed)
  if (existing && existing.id !== id) throw new DuplicateExerciseNameError(trimmed)
  const entity = await repo.findById(id)
  if (!entity) throw new Error(`Exercise definition not found: ${id}`)
  await repo.save(createEntity(id, trimmed, muscleGroupIds))
}
