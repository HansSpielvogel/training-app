export const DEFAULT_SET_COUNT = 3

export interface ExerciseDefinition {
  readonly id: string
  readonly name: string
  readonly muscleGroupIds: string[]
  readonly notes?: string
  readonly defaultSets?: number
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
  notes?: string,
  defaultSets?: number,
): ExerciseDefinition {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Name cannot be empty')
  if (muscleGroupIds.length === 0) throw new NoMuscleGroupError()
  if (defaultSets !== undefined && defaultSets < 1) throw new Error('defaultSets must be at least 1')
  return {
    id,
    name: trimmed,
    muscleGroupIds,
    ...(notes !== undefined && { notes }),
    ...(defaultSets !== undefined && { defaultSets }),
  }
}
