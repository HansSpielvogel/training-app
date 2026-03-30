export interface PlanSlot {
  readonly id: string
  readonly planId: string
  readonly muscleGroupId: string
  readonly order: number
}

export function createPlanSlot(id: string, planId: string, muscleGroupId: string, order: number): PlanSlot {
  return { id, planId, muscleGroupId, order }
}
