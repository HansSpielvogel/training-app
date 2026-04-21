import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'
import { createSessionSet } from '@domain/sessions/TrainingSession'

export async function updateSetRpe(
  repo: ITrainingSessionRepository,
  sessionId: string,
  entryIndex: number,
  setIndex: number,
  newRpe: number | null,
): Promise<void> {
  const session = await repo.getById(sessionId)
  if (!session) throw new Error(`Session not found: ${sessionId}`)

  const entries = session.entries.map((entry, i) => {
    if (i !== entryIndex) return entry
    const sets = entry.sets.map((set, j) => {
      if (j !== setIndex) return set
      return newRpe !== null
        ? createSessionSet(set.weight, set.reps, newRpe)
        : createSessionSet(set.weight, set.reps)
    })
    return { ...entry, sets }
  })

  await repo.save({ ...session, entries })
}
