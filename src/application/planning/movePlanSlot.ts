import type { ITrainingPlanRepository } from '@domain/planning/ITrainingPlanRepository'

export async function movePlanSlot(
  repo: ITrainingPlanRepository,
  planId: string,
  slotId: string,
  direction: 'up' | 'down',
): Promise<void> {
  const slots = await repo.listSlotsByPlan(planId)
  const index = slots.findIndex((s) => s.id === slotId)
  if (index === -1) return

  const swapIndex = direction === 'up' ? index - 1 : index + 1
  if (swapIndex < 0 || swapIndex >= slots.length) return

  const a = slots[index]
  const b = slots[swapIndex]
  await repo.saveSlots([
    { ...a, order: b.order },
    { ...b, order: a.order },
  ])
}
