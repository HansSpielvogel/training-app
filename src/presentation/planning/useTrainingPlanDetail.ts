import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getTrainingPlan,
  addPlanSlot,
  removePlanSlot,
  movePlanSlot,
  updateSlotOptional,
  renameTrainingPlan,
  deleteTrainingPlan,
} from '@application/planning'
import type { TrainingPlanDetail } from '@application/planning'
import { DexieTrainingPlanRepository } from '@infrastructure/planning/DexieTrainingPlanRepository'
import { DexieMuscleGroupRepository } from '@infrastructure/exercises/DexieMuscleGroupRepository'

// Hooks are the composition root — they wire use cases to repositories
export function useTrainingPlanDetail(planId: string) {
  const repo = useRef(new DexieTrainingPlanRepository()).current
  const muscleGroupRepo = useRef(new DexieMuscleGroupRepository()).current
  const [plan, setPlan] = useState<TrainingPlanDetail | undefined>()

  const refresh = useCallback(async () => {
    setPlan(await getTrainingPlan(repo, muscleGroupRepo, planId))
  }, [repo, muscleGroupRepo, planId])

  useEffect(() => { refresh() }, [refresh])

  const addSlot = useCallback(async (muscleGroupId: string) => {
    await addPlanSlot(repo, planId, muscleGroupId)
    await refresh()
  }, [repo, planId, refresh])

  const removeSlot = useCallback(async (slotId: string) => {
    await removePlanSlot(repo, slotId)
    await refresh()
  }, [repo, refresh])

  const moveSlot = useCallback(async (slotId: string, direction: 'up' | 'down') => {
    await movePlanSlot(repo, planId, slotId, direction)
    await refresh()
  }, [repo, planId, refresh])

  const renamePlan = useCallback(async (newName: string) => {
    await renameTrainingPlan(repo, planId, newName)
    await refresh()
  }, [repo, planId, refresh])

  const toggleSlotOptional = useCallback(async (slotId: string, optional: boolean) => {
    await updateSlotOptional(repo, slotId, optional)
    await refresh()
  }, [repo, refresh])

  const deletePlan = useCallback(async () => {
    await deleteTrainingPlan(repo, planId)
  }, [repo, planId])

  return { plan, addSlot, removeSlot, moveSlot, toggleSlotOptional, renamePlan, deletePlan }
}
