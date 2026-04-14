import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'
import type { LastUsedEntry, SetSnapshot } from '@domain/analytics'
import { normalizeWeight } from './normalizeWeight'

export async function getLastUsedByExercise(
  sessionRepo: ITrainingSessionRepository,
): Promise<Record<string, LastUsedEntry>> {
  const sessions = await sessionRepo.listCompleted()
  const result: Record<string, LastUsedEntry> = {}

  for (const session of sessions) {
    for (const entry of session.entries) {
      const id = entry.exerciseDefinitionId
      if (!id || result[id] || entry.sets.length === 0) continue

      let maxWeight = -Infinity
      let weightUnit = 'kg'
      let repsAtMax = 0
      for (const set of entry.sets) {
        const { value, unit } = normalizeWeight(set.weight)
        if (value > maxWeight) {
          maxWeight = value
          weightUnit = unit
          repsAtMax = set.reps
        }
      }

      const sets: SetSnapshot[] = entry.sets.map(s => ({ weight: s.weight, reps: s.reps, ...(s.rpe !== undefined ? { rpe: s.rpe } : {}) }))
      result[id] = { weight: maxWeight, weightUnit, reps: repsAtMax, sets }
    }
  }

  return result
}
