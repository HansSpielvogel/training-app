import type { IMuscleGroupRepository } from '@domain/exercises/IMuscleGroupRepository'
import { createMuscleGroup as createEntity, DuplicateNameError } from '@domain/exercises/MuscleGroup'

export async function createMuscleGroup(
  repo: IMuscleGroupRepository,
  name: string,
): Promise<void> {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Name cannot be empty')
  const existing = await repo.findByName(trimmed)
  if (existing) throw new DuplicateNameError(trimmed)
  await repo.save(createEntity(crypto.randomUUID(), trimmed))
}
