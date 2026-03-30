export { listMuscleGroups } from './listMuscleGroups'
export { createMuscleGroup } from './createMuscleGroup'
export { renameMuscleGroup } from './renameMuscleGroup'
export { deleteMuscleGroup } from './deleteMuscleGroup'

export { listExerciseDefinitions } from './listExerciseDefinitions'
export { createExerciseDefinition } from './createExerciseDefinition'
export { editExerciseDefinition } from './editExerciseDefinition'
export { deleteExerciseDefinition } from './deleteExerciseDefinition'

export { exportExerciseLibrary } from './exportExerciseLibrary'
export { importExerciseLibrary, InvalidImportError } from './importExerciseLibrary'
export { seedExerciseLibrary } from './seedExerciseLibrary'

// Re-export domain types so presentation doesn't import domain directly
export type { MuscleGroup } from '@domain/exercises/MuscleGroup'
export { DuplicateNameError, MuscleGroupInUseError } from '@domain/exercises/MuscleGroup'
export type { ExerciseDefinition } from '@domain/exercises/ExerciseDefinition'
export { DuplicateExerciseNameError, NoMuscleGroupError } from '@domain/exercises/ExerciseDefinition'
