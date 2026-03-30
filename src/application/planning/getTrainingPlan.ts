import type { ITrainingPlanRepository } from '@domain/planning/ITrainingPlanRepository'
import type { IMuscleGroupRepository } from '@domain/exercises/IMuscleGroupRepository'
import type { TrainingPlan } from '@domain/planning/TrainingPlan'

export interface PlanSlotDetail {
  id: string
  muscleGroupId: string
  muscleGroupName: string
  order: number
  optional: boolean
}

export interface TrainingPlanDetail extends TrainingPlan {
  slots: PlanSlotDetail[]
}

export async function getTrainingPlan(
  repo: ITrainingPlanRepository,
  muscleGroupRepo: IMuscleGroupRepository,
  id: string,
): Promise<TrainingPlanDetail | undefined> {
  const plan = await repo.findPlanById(id)
  if (!plan) return undefined
  const slots = await repo.listSlotsByPlan(id)
  const slotDetails: PlanSlotDetail[] = await Promise.all(
    slots.map(async (slot) => {
      const mg = await muscleGroupRepo.findById(slot.muscleGroupId)
      return {
        id: slot.id,
        muscleGroupId: slot.muscleGroupId,
        muscleGroupName: mg?.name ?? slot.muscleGroupId,
        order: slot.order,
        optional: slot.optional ?? false,
      }
    }),
  )
  return { ...plan, slots: slotDetails }
}
