export interface PlanSlot {
  readonly id: string
  readonly planId: string
  readonly muscleGroupId: string
  readonly order: number
  readonly optional?: boolean
}

export function createPlanSlot(id: string, planId: string, muscleGroupId: string, order: number, optional?: boolean): PlanSlot {
  const slot: PlanSlot = { id, planId, muscleGroupId, order }
  if (optional) return { ...slot, optional: true }
  return slot
}
