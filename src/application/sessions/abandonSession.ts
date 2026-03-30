import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'

export async function abandonSession(repo: ITrainingSessionRepository, sessionId: string): Promise<void> {
  await repo.delete(sessionId)
}
