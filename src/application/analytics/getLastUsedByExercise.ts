import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'
import type { LastUsedEntry } from '@domain/analytics'
import type { Weight } from '@domain/shared/Weight'

function normalizeWeight(weight: Weight): { value: number; unit: string } {
  switch (weight.kind) {
    case 'single': return { value: weight.value, unit: 'kg' }
    case 'bilateral': return { value: weight.perSide, unit: 'kg/side' }
    case 'stacked': return { value: weight.base + weight.added, unit: 'kg' }
  }
}

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

      result[id] = { weight: maxWeight, weightUnit, reps: repsAtMax, sets: entry.sets }
    }
  }

  return result
}
