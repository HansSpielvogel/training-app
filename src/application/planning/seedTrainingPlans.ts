import type { ITrainingPlanRepository } from '@domain/planning/ITrainingPlanRepository'
import { createTrainingPlan } from '@domain/planning/TrainingPlan'
import { createPlanSlot } from '@domain/planning/PlanSlot'
import seedData from '../../../openspec/seed/training-plans.json'

export async function seedTrainingPlans(repo: ITrainingPlanRepository): Promise<void> {
  const count = await repo.countPlans()
  if (count > 0) return

  const now = new Date()
  for (const planData of seedData.trainingPlans) {
    const plan = createTrainingPlan(planData.id, planData.name, now)
    await repo.savePlan(plan)
    const slots = planData.slots.map((s) => createPlanSlot(s.id, plan.id, s.muscleGroupId, s.order))
    await repo.saveSlots(slots)
  }
}
