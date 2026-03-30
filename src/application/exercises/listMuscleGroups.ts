import type { IMuscleGroupRepository } from '@domain/exercises/IMuscleGroupRepository'
import type { MuscleGroup } from '@domain/exercises/MuscleGroup'

export async function listMuscleGroups(repo: IMuscleGroupRepository): Promise<MuscleGroup[]> {
  return repo.list()
}
