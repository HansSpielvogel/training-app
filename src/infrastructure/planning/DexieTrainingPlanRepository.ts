import type { ITrainingPlanRepository } from '@domain/planning/ITrainingPlanRepository'
import type { TrainingPlan } from '@domain/planning/TrainingPlan'
import type { PlanSlot } from '@domain/planning/PlanSlot'
import { TrainingDatabase, db as sharedDb } from '@infrastructure/db/database'

export class DexieTrainingPlanRepository implements ITrainingPlanRepository {
  constructor(private readonly db: TrainingDatabase = sharedDb) {}

  async listPlans(): Promise<TrainingPlan[]> {
    return this.db.trainingPlans.orderBy('name').toArray()
  }

  async findPlanById(id: string): Promise<TrainingPlan | undefined> {
    return this.db.trainingPlans.get(id)
  }

  async findPlanByName(name: string): Promise<TrainingPlan | undefined> {
    const lower = name.toLowerCase()
    const all = await this.db.trainingPlans.toArray()
    return all.find((p) => p.name.toLowerCase() === lower)
  }

  async savePlan(plan: TrainingPlan): Promise<void> {
    await this.db.trainingPlans.put(plan)
  }

  async deletePlan(id: string): Promise<void> {
    await this.db.trainingPlans.delete(id)
  }

  async countPlans(): Promise<number> {
    return this.db.trainingPlans.count()
  }

  async listSlotsByPlan(planId: string): Promise<PlanSlot[]> {
    return this.db.planSlots.where('planId').equals(planId).sortBy('order')
  }

  async findSlotById(id: string): Promise<PlanSlot | undefined> {
    return this.db.planSlots.get(id)
  }

  async saveSlot(slot: PlanSlot): Promise<void> {
    await this.db.planSlots.put(slot)
  }

  async saveSlots(slots: PlanSlot[]): Promise<void> {
    await this.db.planSlots.bulkPut(slots)
  }

  async deleteSlot(id: string): Promise<void> {
    await this.db.planSlots.delete(id)
  }

  async deleteSlotsByPlan(planId: string): Promise<void> {
    await this.db.planSlots.where('planId').equals(planId).delete()
  }

  async maxOrderByPlan(planId: string): Promise<number> {
    const slots = await this.listSlotsByPlan(planId)
    if (slots.length === 0) return -1
    return Math.max(...slots.map((s) => s.order))
  }
}
