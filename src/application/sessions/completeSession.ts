import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'

export async function completeSession(
  repo: ITrainingSessionRepository,
  sessionId: string,
): Promise<void> {
  const session = await repo.getById(sessionId)
  if (!session) throw new Error(`Session not found: ${sessionId}`)

  await repo.save({ ...session, status: 'completed', completedAt: new Date() })
}
