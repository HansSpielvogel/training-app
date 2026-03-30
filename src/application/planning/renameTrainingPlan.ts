import type { ITrainingPlanRepository } from '@domain/planning/ITrainingPlanRepository'
import { DuplicatePlanNameError } from '@domain/planning/TrainingPlan'

export async function renameTrainingPlan(
  repo: ITrainingPlanRepository,
  id: string,
  newName: string,
): Promise<void> {
  const trimmed = newName.trim()
  if (!trimmed) throw new Error('Name cannot be empty')
  const plan = await repo.findPlanById(id)
  if (!plan) throw new Error(`Training plan not found: ${id}`)
  const existing = await repo.findPlanByName(trimmed)
  if (existing && existing.id !== id) throw new DuplicatePlanNameError(trimmed)
  await repo.savePlan({ ...plan, name: trimmed })
}
