import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'
import type { ExerciseProgressionPoint, SetSnapshot } from '@domain/analytics'
import { normalizeWeight } from './normalizeWeight'

export async function getExerciseProgression(
  sessionRepo: ITrainingSessionRepository,
  exerciseDefinitionId: string,
  limit = 20,
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

    const avgReps = Math.round(entry.sets.reduce((sum, s) => sum + s.reps, 0) / entry.sets.length)

    const rpeSets = entry.sets.filter((s): s is typeof s & { rpe: number } => s.rpe !== undefined)
    const avgRpe = rpeSets.length > 0
      ? Math.round(rpeSets.reduce((sum, s) => sum + s.rpe, 0) / rpeSets.length)
      : undefined

    const sets: SetSnapshot[] = entry.sets.map(s => ({ weight: s.weight, reps: s.reps, ...(s.rpe !== undefined ? { rpe: s.rpe } : {}) }))

    points.push({
      date: new Date(session.completedAt ?? session.startedAt),
      weight: maxWeight,
      weightUnit,
      avgReps,
      sets,
      ...(avgRpe !== undefined ? { avgRpe } : {}),
    })
  }

  points.sort((a, b) => a.date.getTime() - b.date.getTime())
  return points.slice(-limit)
}
