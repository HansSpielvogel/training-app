import type { IMuscleGroupRepository } from '@domain/exercises/IMuscleGroupRepository'
import type { MuscleGroup } from '@domain/exercises/MuscleGroup'
import { TrainingDatabase, db as sharedDb } from '@infrastructure/db/database'

export class DexieMuscleGroupRepository implements IMuscleGroupRepository {
  constructor(private readonly db: TrainingDatabase = sharedDb) {}

  async list(): Promise<MuscleGroup[]> {
    return this.db.muscleGroups.orderBy('name').toArray()
  }

  async findById(id: string): Promise<MuscleGroup | undefined> {
    return this.db.muscleGroups.get(id)
  }

  async findByName(name: string): Promise<MuscleGroup | undefined> {
    const lower = name.toLowerCase()
    const all = await this.db.muscleGroups.toArray()
    return all.find((mg) => mg.name.toLowerCase() === lower)
  }

  async save(muscleGroup: MuscleGroup): Promise<void> {
    await this.db.muscleGroups.put(muscleGroup)
  }

  async delete(id: string): Promise<void> {
    await this.db.muscleGroups.delete(id)
  }

  async clear(): Promise<void> {
    await this.db.muscleGroups.clear()
  }
}
