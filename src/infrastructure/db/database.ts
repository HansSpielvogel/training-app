import Dexie, { type Table } from 'dexie'
import type { MuscleGroup } from '@domain/exercises/MuscleGroup'
import type { ExerciseDefinition } from '@domain/exercises/ExerciseDefinition'
import type { TrainingPlan } from '@domain/planning/TrainingPlan'
import type { PlanSlot } from '@domain/planning/PlanSlot'
import type { TrainingSession } from '@domain/sessions/TrainingSession'

export class TrainingDatabase extends Dexie {
  muscleGroups!: Table<MuscleGroup>
  exerciseDefinitions!: Table<ExerciseDefinition>
  trainingPlans!: Table<TrainingPlan>
  planSlots!: Table<PlanSlot>
  trainingSessions!: Table<TrainingSession>

  constructor(options?: ConstructorParameters<typeof Dexie>[1]) {
    super('TrainingApp', options)
    this.version(1).stores({})
    this.version(2).stores({
      muscleGroups: 'id, name',
      exerciseDefinitions: 'id, name, *muscleGroupIds',
    })
    this.version(3).stores({
      trainingPlans: 'id, name',
      planSlots: 'id, planId, order',
    })
    this.version(4).stores({
      trainingSessions: 'id, status',
    })
    this.version(5).stores({})
  }
}

export const db = new TrainingDatabase()
