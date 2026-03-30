import { useState, useEffect, useCallback, useRef } from 'react'
import {
  listTrainingPlans,
  createTrainingPlan,
  renameTrainingPlan,
  deleteTrainingPlan,
} from '@application/planning'
import type { TrainingPlanSummary } from '@application/planning'
import { DexieTrainingPlanRepository } from '@infrastructure/planning/DexieTrainingPlanRepository'

// Hooks are the composition root — they wire use cases to repositories
export function useTrainingPlans() {
  const repo = useRef(new DexieTrainingPlanRepository()).current
  const [plans, setPlans] = useState<TrainingPlanSummary[]>([])

  const refresh = useCallback(async () => {
    setPlans(await listTrainingPlans(repo))
  }, [repo])

  useEffect(() => { refresh() }, [refresh])

  const create = useCallback(async (name: string) => {
    await createTrainingPlan(repo, name)
    await refresh()
  }, [repo, refresh])

  const rename = useCallback(async (id: string, newName: string) => {
    await renameTrainingPlan(repo, id, newName)
    await refresh()
  }, [repo, refresh])

  const remove = useCallback(async (id: string) => {
    await deleteTrainingPlan(repo, id)
    await refresh()
  }, [repo, refresh])

  return { plans, create, rename, remove }
}
