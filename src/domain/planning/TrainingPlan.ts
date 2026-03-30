export interface TrainingPlan {
  readonly id: string
  readonly name: string
  readonly createdAt: Date
}

export class DuplicatePlanNameError extends Error {
  constructor(name: string) {
    super(`A training plan named "${name}" already exists`)
    this.name = 'DuplicatePlanNameError'
  }
}

export function createTrainingPlan(id: string, name: string, createdAt: Date = new Date()): TrainingPlan {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Name cannot be empty')
  return { id, name: trimmed, createdAt }
}
