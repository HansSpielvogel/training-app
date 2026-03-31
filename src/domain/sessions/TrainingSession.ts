import type { Weight } from '@domain/shared/Weight'

export interface SessionSet {
  readonly weight: Weight
  readonly reps: number
  readonly rpe?: number
}

export function createSessionSet(weight: Weight, reps: number, rpe?: number): SessionSet {
  if (rpe !== undefined && (!Number.isInteger(rpe) || rpe < 1 || rpe > 10)) {
    throw new Error(`RPE must be an integer between 1 and 10, got: ${rpe}`)
  }
  return { weight, reps, ...(rpe !== undefined ? { rpe } : {}) }
}

export interface SessionEntry {
  readonly muscleGroupId: string
  readonly optional?: boolean
  readonly isTemp?: boolean
  readonly exerciseDefinitionId?: string
  readonly sets: readonly SessionSet[]
}

export type SessionStatus = 'in-progress' | 'completed'

export interface TrainingSession {
  readonly id: string
  readonly planId: string
  readonly planName: string
  readonly status: SessionStatus
  readonly startedAt: Date
  readonly completedAt?: Date
  readonly entries: readonly SessionEntry[]
}
