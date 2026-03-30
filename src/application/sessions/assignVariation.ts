import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'

export async function assignVariation(
  repo: ITrainingSessionRepository,
  sessionId: string,
  entryIndex: number,
  exerciseDefinitionId: string,
): Promise<void> {
  const session = await repo.getById(sessionId)
  if (!session) throw new Error(`Session not found: ${sessionId}`)

  const entries = session.entries.map((entry, i) =>
    i === entryIndex ? { ...entry, exerciseDefinitionId } : entry
  )

  await repo.save({ ...session, entries })
}
