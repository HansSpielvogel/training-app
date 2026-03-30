import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'
import type { TrainingSession } from '@domain/sessions/TrainingSession'
import { TrainingDatabase, db as sharedDb } from '@infrastructure/db/database'

export class DexieTrainingSessionRepository implements ITrainingSessionRepository {
  constructor(private readonly db: TrainingDatabase = sharedDb) {}

  async save(session: TrainingSession): Promise<void> {
    await this.db.trainingSessions.put(session)
  }

  async delete(id: string): Promise<void> {
    await this.db.trainingSessions.delete(id)
  }

  async getById(id: string): Promise<TrainingSession | undefined> {
    return this.db.trainingSessions.get(id)
  }

  async getActiveSession(): Promise<TrainingSession | undefined> {
    return this.db.trainingSessions.where('status').equals('in-progress').first()
  }

  async listCompleted(): Promise<TrainingSession[]> {
    const sessions = await this.db.trainingSessions.where('status').equals('completed').toArray()
    return sessions.sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    )
  }
}
