import type { ITrainingPlanRepository } from '@domain/planning/ITrainingPlanRepository'
import { createPlanSlot } from '@domain/planning/PlanSlot'

export async function addPlanSlot(
  repo: ITrainingPlanRepository,
  planId: string,
  muscleGroupId: string,
): Promise<void> {
  const maxOrder = await repo.maxOrderByPlan(planId)
  const slot = createPlanSlot(crypto.randomUUID(), planId, muscleGroupId, maxOrder + 1)
  await repo.saveSlot(slot)
}
