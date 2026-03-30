import type { ITrainingPlanRepository } from '@domain/planning/ITrainingPlanRepository'
import type { TrainingPlan } from '@domain/planning/TrainingPlan'

export interface TrainingPlanSummary extends TrainingPlan {
  slotCount: number
}

export async function listTrainingPlans(repo: ITrainingPlanRepository): Promise<TrainingPlanSummary[]> {
  const plans = await repo.listPlans()
  return Promise.all(
    plans.map(async (plan) => {
      const slots = await repo.listSlotsByPlan(plan.id)
      return { ...plan, slotCount: slots.length }
    }),
  )
}
