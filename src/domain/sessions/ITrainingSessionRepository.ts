import type { TrainingSession } from './TrainingSession'

export interface ITrainingSessionRepository {
  save(session: TrainingSession): Promise<void>
  getById(id: string): Promise<TrainingSession | undefined>
  getActiveSession(): Promise<TrainingSession | undefined>
  listCompleted(): Promise<TrainingSession[]>
}
