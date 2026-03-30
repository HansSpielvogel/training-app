import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'
import type { TrainingSession } from '@domain/sessions/TrainingSession'
import type { ITrainingPlanRepository } from '@domain/planning/ITrainingPlanRepository'

export async function startSession(
  sessionRepo: ITrainingSessionRepository,
  planRepo: ITrainingPlanRepository,
  planId: string,
): Promise<TrainingSession> {
  const plan = await planRepo.findPlanById(planId)
  if (!plan) throw new Error(`Plan not found: ${planId}`)
  const slots = await planRepo.listSlotsByPlan(planId)

  const session: TrainingSession = {
    id: crypto.randomUUID(),
    planId: plan.id,
    planName: plan.name,
    status: 'in-progress',
    startedAt: new Date(),
    entries: slots.map((slot) => ({
      muscleGroupId: slot.muscleGroupId,
      sets: [],
    })),
  }

  await sessionRepo.save(session)
  return session
}
