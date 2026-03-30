import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'
import type { TrainingSession } from '@domain/sessions/TrainingSession'
import seedData from '../../../openspec/seed/sessions-seed.json'

export async function seedSessions(repo: ITrainingSessionRepository): Promise<void> {
  const existing = await repo.listCompleted()
  if (existing.length > 0) return

  for (const s of seedData.sessions) {
    const session: TrainingSession = {
      ...(s as unknown as TrainingSession),
      startedAt: new Date(s.startedAt),
      completedAt: new Date(s.completedAt),
    }
    await repo.save(session)
  }
}
