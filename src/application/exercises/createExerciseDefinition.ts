import type { IExerciseDefinitionRepository } from '@domain/exercises/IExerciseDefinitionRepository'
import {
  createExerciseDefinition as createEntity,
  DuplicateExerciseNameError,
} from '@domain/exercises/ExerciseDefinition'

export async function createExerciseDefinition(
  repo: IExerciseDefinitionRepository,
  name: string,
  muscleGroupIds: string[],
  notes?: string,
  defaultSets?: number,
): Promise<void> {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Name cannot be empty')
  const existing = await repo.findByName(trimmed)
  if (existing) throw new DuplicateExerciseNameError(trimmed)
  await repo.save(createEntity(crypto.randomUUID(), trimmed, muscleGroupIds, notes, defaultSets))
}
