export type { MuscleGroup } from './MuscleGroup'
export { createMuscleGroup, DuplicateNameError, MuscleGroupInUseError } from './MuscleGroup'
export type { IMuscleGroupRepository } from './IMuscleGroupRepository'

export type { ExerciseDefinition } from './ExerciseDefinition'
export {
  createExerciseDefinition,
  DuplicateExerciseNameError,
  NoMuscleGroupError,
} from './ExerciseDefinition'
export type { IExerciseDefinitionRepository } from './IExerciseDefinitionRepository'
