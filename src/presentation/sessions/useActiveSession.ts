import { useState, useEffect, useCallback, useRef } from 'react'
import type { TrainingSession } from '@application/sessions'
import type { Weight } from '@application/sessions'
import {
  startSession,
  assignVariation,
  clearVariation,
  addSet,
  removeLastSet,
  completeSession,
  abandonSession,
  removePlanSlot as removePlanSlotUseCase,
  updateSetRpe,
} from '@application/sessions'
import { DexieTrainingSessionRepository } from '@infrastructure/sessions/DexieTrainingSessionRepository'
import { DexieTrainingPlanRepository } from '@infrastructure/planning/DexieTrainingPlanRepository'
import { useSessionSlotActions } from './useSessionSlotActions'
import { useSessionExerciseData } from './useSessionExerciseData'

// Hooks are the composition root — they wire use cases to repositories
export function useActiveSession() {
  const sessionRepo = useRef(new DexieTrainingSessionRepository()).current
  const planRepo = useRef(new DexieTrainingPlanRepository()).current

  const [session, setSession] = useState<TrainingSession | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const active = await sessionRepo.getActiveSession()
    setSession(active ?? null)
    setLoading(false)
  }, [sessionRepo])

  useEffect(() => { refresh() }, [refresh])

  const start = useCallback(async (planId: string) => {
    const s = await startSession(sessionRepo, planRepo, planId)
    setSession(s)
  }, [sessionRepo, planRepo])

  const assign = useCallback(async (entryIndex: number, exerciseDefinitionId: string) => {
    if (!session) return
    await assignVariation(sessionRepo, session.id, entryIndex, exerciseDefinitionId)
    await refresh()
  }, [session, sessionRepo, refresh])

  const clearVariationFn = useCallback(async (entryIndex: number) => {
    if (!session) return
    await clearVariation(sessionRepo, session.id, entryIndex)
    await refresh()
  }, [session, sessionRepo, refresh])

  const addSetFn = useCallback(async (entryIndex: number, weight: Weight, reps: number, count: number = 1, rpe?: number) => {
    if (!session) return
    for (let i = 0; i < count; i++) await addSet(sessionRepo, session.id, entryIndex, weight, reps, rpe)
    await refresh()
  }, [session, sessionRepo, refresh])

  const removeLastSetFn = useCallback(async (entryIndex: number) => {
    if (!session) return
    await removeLastSet(sessionRepo, session.id, entryIndex)
    await refresh()
  }, [session, sessionRepo, refresh])

  const complete = useCallback(async () => {
    if (!session) return
    await completeSession(sessionRepo, session.id)
    setSession(null)
  }, [session, sessionRepo])

  const abandon = useCallback(async () => {
    if (!session) return
    await abandonSession(sessionRepo, session.id)
    setSession(null)
  }, [session, sessionRepo])

  const removePlanSlot = useCallback(async (index: number) => {
    if (!session) return
    await removePlanSlotUseCase(sessionRepo, session.id, index)
    await refresh()
  }, [session, sessionRepo, refresh])

  const updateRpe = useCallback(async (entryIndex: number, setIndex: number, newRpe: number | null) => {
    if (!session) return
    await updateSetRpe(sessionRepo, session.id, entryIndex, setIndex, newRpe)
    await refresh()
  }, [session, sessionRepo, refresh])

  const slotActions = useSessionSlotActions(session, sessionRepo, planRepo, refresh)
  const exerciseData = useSessionExerciseData(session, assign)

  return {
    session,
    loading,
    removePlanSlot,
    updateRpe,
    start,
    assign,
    clearVariation: clearVariationFn,
    addSet: addSetFn,
    removeLastSet: removeLastSetFn,
    complete,
    abandon,
    ...slotActions,
    ...exerciseData,
  }
}
