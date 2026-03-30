import type { Weight } from '@domain/shared/Weight'

export interface SessionSet {
  readonly weight: Weight
  readonly reps: number
}

export interface SessionEntry {
  readonly muscleGroupId: string
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
