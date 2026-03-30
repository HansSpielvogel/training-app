import type { TrainingPlan } from './TrainingPlan'
import type { PlanSlot } from './PlanSlot'

export interface ITrainingPlanRepository {
  listPlans(): Promise<TrainingPlan[]>
  findPlanById(id: string): Promise<TrainingPlan | undefined>
  findPlanByName(name: string): Promise<TrainingPlan | undefined>
  savePlan(plan: TrainingPlan): Promise<void>
  deletePlan(id: string): Promise<void>
  countPlans(): Promise<number>

  listSlotsByPlan(planId: string): Promise<PlanSlot[]>
  findSlotById(id: string): Promise<PlanSlot | undefined>
  saveSlot(slot: PlanSlot): Promise<void>
  saveSlots(slots: PlanSlot[]): Promise<void>
  deleteSlot(id: string): Promise<void>
  deleteSlotsByPlan(planId: string): Promise<void>
  maxOrderByPlan(planId: string): Promise<number>
}
