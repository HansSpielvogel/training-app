import type { MuscleGroup } from './MuscleGroup'

export interface IMuscleGroupRepository {
  list(): Promise<MuscleGroup[]>
  findById(id: string): Promise<MuscleGroup | undefined>
  findByName(name: string): Promise<MuscleGroup | undefined>
  save(muscleGroup: MuscleGroup): Promise<void>
  delete(id: string): Promise<void>
  clear(): Promise<void>
}
