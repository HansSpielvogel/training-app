import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'

export async function removeLastSet(
  repo: ITrainingSessionRepository,
  sessionId: string,
  entryIndex: number,
): Promise<void> {
  const session = await repo.getById(sessionId)
  if (!session) throw new Error(`Session not found: ${sessionId}`)

  const entries = session.entries.map((entry, i) =>
    i === entryIndex ? { ...entry, sets: entry.sets.slice(0, -1) } : entry
  )

  await repo.save({ ...session, entries })
}
