export interface ExerciseProgressionPoint {
  date: Date
  weight: number
  weightUnit: string
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
