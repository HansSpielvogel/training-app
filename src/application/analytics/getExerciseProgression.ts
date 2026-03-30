import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'
import type { ExerciseProgressionPoint } from '@domain/analytics'
import type { Weight } from '@domain/shared/Weight'

function normalizeWeight(weight: Weight): { value: number; unit: string } {
  switch (weight.kind) {
    case 'single': return { value: weight.value, unit: 'kg' }
    case 'bilateral': return { value: weight.perSide, unit: 'kg/side' }
    case 'stacked': return { value: weight.base + weight.added, unit: 'kg' }
  }
}

export async function getExerciseProgression(
  sessionRepo: ITrainingSessionRepository,
  exerciseDefinitionId: string,
): Promise<ExerciseProgressionPoint[]> {
  const sessions = await sessionRepo.listCompleted()
  const points: ExerciseProgressionPoint[] = []

  for (const session of sessions) {
    const entry = session.entries.find(e => e.exerciseDefinitionId === exerciseDefinitionId)
    if (!entry || entry.sets.length === 0) continue

    let maxWeight = -Infinity
    let weightUnit = 'kg'
    for (const set of entry.sets) {
      const { value, unit } = normalizeWeight(set.weight)
      if (value > maxWeight) {
        maxWeight = value
        weightUnit = unit
      }
    }

    points.push({
      date: session.completedAt ?? session.startedAt,
      weight: maxWeight,
      weightUnit,
    })
  }

  points.sort((a, b) => a.date.getTime() - b.date.getTime())
  return points.slice(-20)
}
