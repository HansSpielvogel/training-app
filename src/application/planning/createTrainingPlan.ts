import type { ITrainingPlanRepository } from '@domain/planning/ITrainingPlanRepository'
import { createTrainingPlan as createEntity, DuplicatePlanNameError } from '@domain/planning/TrainingPlan'

export async function createTrainingPlan(repo: ITrainingPlanRepository, name: string): Promise<void> {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Name cannot be empty')
  const existing = await repo.findPlanByName(trimmed)
  if (existing) throw new DuplicatePlanNameError(trimmed)
  await repo.savePlan(createEntity(crypto.randomUUID(), trimmed))
}
