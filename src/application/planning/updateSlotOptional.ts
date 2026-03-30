import type { ITrainingPlanRepository } from '@domain/planning/ITrainingPlanRepository'

export async function updateSlotOptional(
  repo: ITrainingPlanRepository,
  slotId: string,
  optional: boolean,
): Promise<void> {
  const slot = await repo.findSlotById(slotId)
  if (!slot) throw new Error('Slot not found')
  await repo.saveSlot({ ...slot, optional })
}
