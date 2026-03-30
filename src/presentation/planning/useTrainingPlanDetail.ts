import { useState, useEffect, useCallback } from 'react'
import {
  getTrainingPlan,
  addPlanSlot,
  removePlanSlot,
  movePlanSlot,
  renameTrainingPlan,
  deleteTrainingPlan,
} from '@application/planning'
import type { TrainingPlanDetail } from '@application/planning'
import { DexieTrainingPlanRepository } from '@infrastructure/planning/DexieTrainingPlanRepository'
import { DexieMuscleGroupRepository } from '@infrastructure/exercises/DexieMuscleGroupRepository'

// Hooks are the composition root — they wire use cases to repositories
const repo = new DexieTrainingPlanRepository()
const muscleGroupRepo = new DexieMuscleGroupRepository()

export function useTrainingPlanDetail(planId: string) {
  const [plan, setPlan] = useState<TrainingPlanDetail | undefined>()

  const refresh = useCallback(async () => {
    setPlan(await getTrainingPlan(repo, muscleGroupRepo, planId))
  }, [planId])

  useEffect(() => { refresh() }, [refresh])

  const addSlot = useCallback(async (muscleGroupId: string) => {
    await addPlanSlot(repo, planId, muscleGroupId)
    await refresh()
  }, [planId, refresh])

  const removeSlot = useCallback(async (slotId: string) => {
    await removePlanSlot(repo, slotId)
    await refresh()
  }, [refresh])

  const moveSlot = useCallback(async (slotId: string, direction: 'up' | 'down') => {
    await movePlanSlot(repo, planId, slotId, direction)
    await refresh()
  }, [planId, refresh])

  const renamePlan = useCallback(async (newName: string) => {
    await renameTrainingPlan(repo, planId, newName)
    await refresh()
  }, [planId, refresh])

  const deletePlan = useCallback(async () => {
    await deleteTrainingPlan(repo, planId)
  }, [planId])

  return { plan, addSlot, removeSlot, moveSlot, renamePlan, deletePlan }
}
