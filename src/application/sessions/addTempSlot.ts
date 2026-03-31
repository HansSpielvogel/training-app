import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'

export async function addTempSlot(
  repo: ITrainingSessionRepository,
  sessionId: string,
  muscleGroupId: string,
): Promise<void> {
  const session = await repo.getById(sessionId)
  if (!session) throw new Error(`Session not found: ${sessionId}`)

  const entries = [...session.entries, { muscleGroupId, sets: [], isTemp: true }]
  await repo.save({ ...session, entries })
}
