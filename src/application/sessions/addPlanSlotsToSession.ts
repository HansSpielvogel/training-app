import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'
import type { ITrainingPlanRepository } from '@domain/planning/ITrainingPlanRepository'

export async function addPlanSlotsToSession(
  sessionRepo: ITrainingSessionRepository,
  planRepo: ITrainingPlanRepository,
  sessionId: string,
  planId: string,
): Promise<number> {
  const session = await sessionRepo.getById(sessionId)
  if (!session) throw new Error(`Session not found: ${sessionId}`)

  const plan = await planRepo.findPlanById(planId)
  if (!plan) throw new Error(`Plan not found: ${planId}`)

  const slots = await planRepo.listSlotsByPlan(planId)
  const existingMuscleGroups = new Set(session.entries.map(e => e.muscleGroupId))

  const newEntries = slots
    .filter(slot => !existingMuscleGroups.has(slot.muscleGroupId))
    .map(slot => ({ muscleGroupId: slot.muscleGroupId, sets: [], isTemp: true as const }))

  if (newEntries.length > 0) {
    await sessionRepo.save({ ...session, entries: [...session.entries, ...newEntries] })
  }
  return newEntries.length
}
