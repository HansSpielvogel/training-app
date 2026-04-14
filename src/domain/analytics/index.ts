import type { Weight } from '@domain/shared/Weight'

export interface SetSnapshot {
  readonly weight: Weight
  readonly reps: number
  readonly rpe?: number
}

export interface ExerciseProgressionPoint {
  date: Date
  weight: number
  weightUnit: string
  avgReps?: number
  avgRpe?: number
  sets: readonly SetSnapshot[]
}

export interface LastUsedEntry {
  weight: number
  weightUnit: string
  reps: number
  sets: readonly SetSnapshot[]
}

export interface MuscleGroupVolume {
  muscleGroupId: string
  muscleGroupName: string
  setCount: number
}

export interface SessionSummaryItem {
  id: string
  date: Date
  planName: string
  exerciseCount: number
}
