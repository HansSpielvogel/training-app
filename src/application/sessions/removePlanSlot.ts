import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'

export async function removePlanSlot(
  repo: ITrainingSessionRepository,
  sessionId: string,
  entryIndex: number,
): Promise<void> {
  const session = await repo.getById(sessionId)
  if (!session) throw new Error(`Session not found: ${sessionId}`)

  const entry = session.entries[entryIndex]
  if (!entry) throw new Error(`Entry not found at index: ${entryIndex}`)

  const entries = session.entries.filter((_, i) => i !== entryIndex)
  await repo.save({ ...session, entries })
}
