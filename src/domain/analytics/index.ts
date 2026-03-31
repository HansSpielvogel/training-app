export interface ExerciseProgressionPoint {
  date: Date
  weight: number
  weightUnit: string
  avgRpe?: number
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
