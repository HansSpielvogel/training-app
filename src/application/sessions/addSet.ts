import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'
import type { Weight } from '@domain/shared/Weight'
import { createSessionSet } from '@domain/sessions/TrainingSession'

export async function addSet(
  repo: ITrainingSessionRepository,
  sessionId: string,
  entryIndex: number,
  weight: Weight,
  reps: number,
  rpe?: number,
): Promise<void> {
  const session = await repo.getById(sessionId)
  if (!session) throw new Error(`Session not found: ${sessionId}`)

  const entries = session.entries.map((entry, i) =>
    i === entryIndex ? { ...entry, sets: [...entry.sets, createSessionSet(weight, reps, rpe)] } : entry
  )

  await repo.save({ ...session, entries })
}
