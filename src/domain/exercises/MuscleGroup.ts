export interface MuscleGroup {
  readonly id: string
  readonly name: string
}

export class DuplicateNameError extends Error {
  constructor(name: string) {
    super(`A muscle group named "${name}" already exists`)
    this.name = 'DuplicateNameError'
  }
}

export class MuscleGroupInUseError extends Error {
  constructor() {
    super('Muscle group is referenced by exercise definitions and cannot be deleted')
    this.name = 'MuscleGroupInUseError'
  }
}

export function createMuscleGroup(id: string, name: string): MuscleGroup {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Name cannot be empty')
  return { id, name: trimmed }
}
