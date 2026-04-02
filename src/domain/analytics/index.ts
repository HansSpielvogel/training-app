export interface ExerciseProgressionPoint {
  date: Date
  weight: number
  weightUnit: string
  avgReps?: number
  avgRpe?: number
}

export interface LastUsedEntry {
  weight: number
  weightUnit: string
  reps: number
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
