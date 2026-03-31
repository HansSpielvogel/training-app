import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'

export async function removeTempSlot(
  repo: ITrainingSessionRepository,
  sessionId: string,
  entryIndex: number,
): Promise<void> {
  const session = await repo.getById(sessionId)
  if (!session) throw new Error(`Session not found: ${sessionId}`)

  const entry = session.entries[entryIndex]
  if (!entry) throw new Error(`Entry not found at index: ${entryIndex}`)
  if (!entry.isTemp) throw new Error('Cannot remove a plan slot')
  if (entry.sets.length > 0) throw new Error('Cannot remove a temp slot with logged sets')

  const entries = session.entries.filter((_, i) => i !== entryIndex)
  await repo.save({ ...session, entries })
}
