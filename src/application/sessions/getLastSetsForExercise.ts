import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'
import type { SessionSet } from '@domain/sessions/TrainingSession'

export async function getLastSetsForExercise(
  repo: ITrainingSessionRepository,
  exerciseDefinitionId: string,
): Promise<SessionSet[] | null> {
  const sessions = await repo.listCompleted()
  for (const session of sessions) {
    for (const entry of session.entries) {
      if (entry.exerciseDefinitionId === exerciseDefinitionId && entry.sets.length > 0) {
        return [...entry.sets]
      }
    }
  }
  return null
}
