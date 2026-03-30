import type { ITrainingPlanRepository } from '@domain/planning/ITrainingPlanRepository'

export async function removePlanSlot(repo: ITrainingPlanRepository, slotId: string): Promise<void> {
  await repo.deleteSlot(slotId)
}
