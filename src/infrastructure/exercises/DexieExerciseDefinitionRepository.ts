import type { IExerciseDefinitionRepository } from '@domain/exercises/IExerciseDefinitionRepository'
import type { ExerciseDefinition } from '@domain/exercises/ExerciseDefinition'
import { TrainingDatabase, db as sharedDb } from '@infrastructure/db/database'

export class DexieExerciseDefinitionRepository implements IExerciseDefinitionRepository {
  constructor(private readonly db: TrainingDatabase = sharedDb) {}

  async list(): Promise<ExerciseDefinition[]> {
    return this.db.exerciseDefinitions.orderBy('name').toArray()
  }

  async listByMuscleGroup(muscleGroupId: string): Promise<ExerciseDefinition[]> {
    return this.db.exerciseDefinitions
      .where('muscleGroupIds')
      .equals(muscleGroupId)
      .sortBy('name')
  }

  async findById(id: string): Promise<ExerciseDefinition | undefined> {
    return this.db.exerciseDefinitions.get(id)
  }

  async findByName(name: string): Promise<ExerciseDefinition | undefined> {
    const lower = name.toLowerCase()
    const all = await this.db.exerciseDefinitions.toArray()
    return all.find((ed) => ed.name.toLowerCase() === lower)
  }

  async save(exerciseDefinition: ExerciseDefinition): Promise<void> {
    await this.db.exerciseDefinitions.put(exerciseDefinition)
  }

  async delete(id: string): Promise<void> {
    await this.db.exerciseDefinitions.delete(id)
  }

  async clear(): Promise<void> {
    await this.db.exerciseDefinitions.clear()
  }
}
