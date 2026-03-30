import { useState, useEffect, useCallback } from 'react'
import {
  listTrainingPlans,
  createTrainingPlan,
  renameTrainingPlan,
  deleteTrainingPlan,
} from '@application/planning'
import type { TrainingPlanSummary } from '@application/planning'
import { DexieTrainingPlanRepository } from '@infrastructure/planning/DexieTrainingPlanRepository'

// Hooks are the composition root — they wire use cases to repositories
const repo = new DexieTrainingPlanRepository()

export function useTrainingPlans() {
  const [plans, setPlans] = useState<TrainingPlanSummary[]>([])

  const refresh = useCallback(async () => {
    setPlans(await listTrainingPlans(repo))
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const create = useCallback(async (name: string) => {
    await createTrainingPlan(repo, name)
    await refresh()
  }, [refresh])

  const rename = useCallback(async (id: string, newName: string) => {
    await renameTrainingPlan(repo, id, newName)
    await refresh()
  }, [refresh])

  const remove = useCallback(async (id: string) => {
    await deleteTrainingPlan(repo, id)
    await refresh()
  }, [refresh])

  return { plans, create, rename, remove }
}
