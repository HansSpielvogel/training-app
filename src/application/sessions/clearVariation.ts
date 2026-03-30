import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'

export async function clearVariation(
  repo: ITrainingSessionRepository,
  sessionId: string,
  entryIndex: number,
): Promise<void> {
  const session = await repo.getById(sessionId)
  if (!session) throw new Error(`Session not found: ${sessionId}`)

  const entries = session.entries.map((entry, i) =>
    i === entryIndex ? { ...entry, exerciseDefinitionId: undefined } : entry
  )

  await repo.save({ ...session, entries })
}
