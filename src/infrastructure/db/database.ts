import Dexie, { type Table } from 'dexie'
import type { MuscleGroup } from '@domain/exercises/MuscleGroup'
import type { ExerciseDefinition } from '@domain/exercises/ExerciseDefinition'

export class TrainingDatabase extends Dexie {
  muscleGroups!: Table<MuscleGroup>
  exerciseDefinitions!: Table<ExerciseDefinition>

  constructor(options?: ConstructorParameters<typeof Dexie>[1]) {
    super('TrainingApp', options)
    this.version(1).stores({})
    this.version(2).stores({
      muscleGroups: 'id, name',
      exerciseDefinitions: 'id, name, *muscleGroupIds',
    })
  }
}

export const db = new TrainingDatabase()
