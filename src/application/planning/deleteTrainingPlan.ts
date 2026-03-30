import type { ITrainingPlanRepository } from '@domain/planning/ITrainingPlanRepository'

export async function deleteTrainingPlan(repo: ITrainingPlanRepository, id: string): Promise<void> {
  await repo.deleteSlotsByPlan(id)
  await repo.deletePlan(id)
}
