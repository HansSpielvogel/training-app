import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'
import type { SessionSummaryItem } from '@domain/analytics'

export async function getSessionSummaries(
  sessionRepo: ITrainingSessionRepository,
): Promise<SessionSummaryItem[]> {
  const sessions = await sessionRepo.listCompleted()
  return sessions
    .map(session => ({
      id: session.id,
      date: session.completedAt ?? session.startedAt,
      planName: session.planName,
      exerciseCount: session.entries.filter(e => e.sets.length > 0).length,
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
}
