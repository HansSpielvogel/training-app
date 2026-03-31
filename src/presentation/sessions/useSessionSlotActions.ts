import { useCallback } from 'react'
import type { TrainingSession } from '@application/sessions'
import { addTempSlot, removeTempSlot, addPlanSlotsToSession } from '@application/sessions'
import type { TrainingPlan } from '@application/planning'
import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'
import type { ITrainingPlanRepository } from '@domain/planning/ITrainingPlanRepository'

export function useSessionSlotActions(
  session: TrainingSession | null,
  sessionRepo: ITrainingSessionRepository,
  planRepo: ITrainingPlanRepository,
  refresh: () => Promise<void>,
) {
  const addTempSlotFn = useCallback(async (muscleGroupId: string) => {
    if (!session) return
    await addTempSlot(sessionRepo, session.id, muscleGroupId)
    await refresh()
  }, [session, sessionRepo, refresh])

  const removeTempSlotFn = useCallback(async (entryIndex: number) => {
    if (!session) return
    await removeTempSlot(sessionRepo, session.id, entryIndex)
    await refresh()
  }, [session, sessionRepo, refresh])

  const addPlanSlotsFn = useCallback(async (planId: string): Promise<number> => {
    if (!session) return 0
    const added = await addPlanSlotsToSession(sessionRepo, planRepo, session.id, planId)
    await refresh()
    return added
  }, [session, sessionRepo, planRepo, refresh])

  const listPlans = useCallback((): Promise<TrainingPlan[]> => planRepo.listPlans(), [planRepo])

  return {
    addTempSlot: addTempSlotFn,
    removeTempSlot: removeTempSlotFn,
    addPlanSlots: addPlanSlotsFn,
    listPlans,
  }
}
