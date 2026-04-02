import type { SessionSet } from '@domain/sessions/TrainingSession'

export interface ExerciseProgressionPoint {
  date: Date
  weight: number
  weightUnit: string
  avgReps?: number
  avgRpe?: number
  sets: readonly SessionSet[]
}

export interface LastUsedEntry {
  weight: number
  weightUnit: string
  reps: number
  sets: readonly SessionSet[]
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
