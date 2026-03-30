import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'

export async function getLastVariationsForMuscleGroup(
  repo: ITrainingSessionRepository,
  muscleGroupId: string,
  limit: number,
): Promise<string[]> {
  const sessions = await repo.listCompleted()
  const seen = new Set<string>()
  const result: string[] = []

  for (const session of sessions) {
    for (const entry of session.entries) {
      if (entry.muscleGroupId === muscleGroupId && entry.exerciseDefinitionId) {
        if (!seen.has(entry.exerciseDefinitionId)) {
          seen.add(entry.exerciseDefinitionId)
          result.push(entry.exerciseDefinitionId)
          if (result.length >= limit) return result
        }
      }
    }
  }

  return result
}
