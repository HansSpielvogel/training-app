import { useState, useEffect, useRef } from 'react'
import type { TrainingSession } from '@application/sessions'
import type { EntryExerciseData } from './EntryRow'
import { findNextIncomplete, findActiveEntry } from './activeSessionHelpers'

// Tracks which entry row is expanded/active, and preloads its exercise data on expand
export function useEntryExpansion(
  session: TrainingSession | null,
  loading: boolean,
  exerciseDataMap: Record<number, EntryExerciseData>,
  loadExerciseData: (entryIndex: number, muscleGroupId: string) => Promise<void>,
  doneIndices: Set<number>,
  setDone: (done: Set<number>, sessionId: string) => void,
  initFromSession: (sessionId: string) => Set<number>,
) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [activeEntryIndex, setActiveEntryIndex] = useState<number | null>(null)
  const entryRefs = useRef<(HTMLDivElement | null)[]>([])

  // On mount: restore doneIndices from sessionStorage and focus the active entry
  useEffect(() => {
    if (loading || !session) return
    const persisted = initFromSession(session.id)
    const active = findActiveEntry(session.entries, persisted)
    if (active !== null) {
      setActiveEntryIndex(active)
      setExpandedIndex(active)
      if (!exerciseDataMap[active]) {
        loadExerciseData(active, session.entries[active].muscleGroupId)
      }
      setTimeout(() => {
        entryRefs.current[active]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  function expandAndPreload(nextIndex: number | null) {
    setExpandedIndex(nextIndex)
    setActiveEntryIndex(nextIndex)
    if (nextIndex !== null && !exerciseDataMap[nextIndex] && session) {
      loadExerciseData(nextIndex, session.entries[nextIndex].muscleGroupId)
    }
    if (nextIndex !== null) {
      setTimeout(() => {
        entryRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }

  function handleToggle(i: number) {
    if (!session) return
    const isCurrentlyExpanded = expandedIndex === i
    if (isCurrentlyExpanded) {
      const entry = session.entries[i]
      const hasSets = (entry?.sets.length ?? 0) > 0
      if (hasSets) {
        const newDone = new Set(doneIndices).add(i)
        setDone(newDone, session.id)
        setActiveEntryIndex(null)
        expandAndPreload(findNextIncomplete(i, newDone, session.entries.length))
      } else {
        setExpandedIndex(null)
        if (activeEntryIndex === i) setActiveEntryIndex(null)
      }
    } else {
      setExpandedIndex(i)
      setActiveEntryIndex(i)
      if (!exerciseDataMap[i] && session) {
        loadExerciseData(i, session.entries[i].muscleGroupId)
      }
    }
  }

  function handleMarkDone(i: number) {
    if (!session) return
    const newDone = new Set(doneIndices).add(i)
    setDone(newDone, session.id)
    setActiveEntryIndex(null)
    expandAndPreload(findNextIncomplete(i, newDone, session.entries.length))
  }

  return {
    expandedIndex, setExpandedIndex,
    activeEntryIndex, setActiveEntryIndex,
    entryRefs,
    expandAndPreload,
    handleToggle,
    handleMarkDone,
  }
}
