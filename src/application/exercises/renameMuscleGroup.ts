import type { IMuscleGroupRepository } from '@domain/exercises/IMuscleGroupRepository'
import { DuplicateNameError } from '@domain/exercises/MuscleGroup'

export async function renameMuscleGroup(
  repo: IMuscleGroupRepository,
  id: string,
  newName: string,
): Promise<void> {
  const trimmed = newName.trim()
  if (!trimmed) throw new Error('Name cannot be empty')
  const existing = await repo.findByName(trimmed)
  if (existing && existing.id !== id) throw new DuplicateNameError(trimmed)
  const entity = await repo.findById(id)
  if (!entity) throw new Error(`Muscle group not found: ${id}`)
  await repo.save({ ...entity, name: trimmed })
}
