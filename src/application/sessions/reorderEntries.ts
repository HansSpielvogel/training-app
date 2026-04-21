import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'

export async function reorderEntries(
  repo: ITrainingSessionRepository,
  sessionId: string,
  fromIndex: number,
  toIndex: number,
): Promise<void> {
  if (fromIndex === toIndex) return
  const session = await repo.getById(sessionId)
  if (!session) throw new Error(`Session not found: ${sessionId}`)

  const entries = [...session.entries]
  const [moved] = entries.splice(fromIndex, 1)
  entries.splice(toIndex, 0, moved)
  await repo.save({ ...session, entries })
}
