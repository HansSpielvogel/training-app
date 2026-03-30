import type { ExerciseDefinition } from './ExerciseDefinition'

export interface IExerciseDefinitionRepository {
  list(): Promise<ExerciseDefinition[]>
  listByMuscleGroup(muscleGroupId: string): Promise<ExerciseDefinition[]>
  findById(id: string): Promise<ExerciseDefinition | undefined>
  findByName(name: string): Promise<ExerciseDefinition | undefined>
  save(exerciseDefinition: ExerciseDefinition): Promise<void>
  delete(id: string): Promise<void>
  clear(): Promise<void>
}
