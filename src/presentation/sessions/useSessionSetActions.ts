import { useCallback } from 'react'
import type { TrainingSession, Weight } from '@application/sessions'
import {
  addSet,
  removeLastSet,
  updateSetRpe,
  reorderEntries as reorderEntriesUseCase,
} from '@application/sessions'
import type { DexieTrainingSessionRepository } from '@infrastructure/sessions/DexieTrainingSessionRepository'

// Set-level mutations on an active session's entries
export function useSessionSetActions(
  session: TrainingSession | null,
  sessionRepo: DexieTrainingSessionRepository,
  refresh: () => Promise<void>,
) {
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

  const updateRpe = useCallback(async (entryIndex: number, setIndex: number, newRpe: number | null) => {
    if (!session) return
    await updateSetRpe(sessionRepo, session.id, entryIndex, setIndex, newRpe)
    await refresh()
  }, [session, sessionRepo, refresh])

  const reorderEntries = useCallback(async (fromIndex: number, toIndex: number) => {
    if (!session) return
    await reorderEntriesUseCase(sessionRepo, session.id, fromIndex, toIndex)
    await refresh()
  }, [session, sessionRepo, refresh])

  return { addSet: addSetFn, removeLastSet: removeLastSetFn, updateRpe, reorderEntries }
}
