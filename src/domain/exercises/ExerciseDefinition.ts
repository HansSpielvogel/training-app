export interface ExerciseDefinition {
  readonly id: string
  readonly name: string
  readonly muscleGroupIds: string[]
}

export class DuplicateExerciseNameError extends Error {
  constructor(name: string) {
    super(`An exercise definition named "${name}" already exists`)
    this.name = 'DuplicateExerciseNameError'
  }
}

export class NoMuscleGroupError extends Error {
  constructor() {
    super('An exercise definition must have at least one muscle group')
    this.name = 'NoMuscleGroupError'
  }
}

export function createExerciseDefinition(
  id: string,
  name: string,
  muscleGroupIds: string[],
): ExerciseDefinition {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Name cannot be empty')
  if (muscleGroupIds.length === 0) throw new NoMuscleGroupError()
  return { id, name: trimmed, muscleGroupIds }
}
