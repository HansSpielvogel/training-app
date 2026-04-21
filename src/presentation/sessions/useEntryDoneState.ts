import { useState } from 'react'

function loadPersistedDone(sessionId: string): Set<number> {
  try {
    const raw = sessionStorage.getItem(`done-${sessionId}`)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as number[])
  } catch {
    return new Set()
  }
}

function persistDone(sessionId: string, done: Set<number>) {
  sessionStorage.setItem(`done-${sessionId}`, JSON.stringify([...done]))
}

interface UseEntryDoneStateResult {
  doneIndices: Set<number>
  setDoneIndicesRaw: React.Dispatch<React.SetStateAction<Set<number>>>
  setDone: (newDone: Set<number>, sessionId: string) => void
  updateDone: (updater: (prev: Set<number>) => Set<number>, sessionId: string) => void
  initFromSession: (sessionId: string) => Set<number>
  clearSession: (sessionId: string) => void
}

export function useEntryDoneState(): UseEntryDoneStateResult {
  const [doneIndices, setDoneIndicesRaw] = useState<Set<number>>(new Set())

  function setDone(newDone: Set<number>, sessionId: string) {
    setDoneIndicesRaw(newDone)
    persistDone(sessionId, newDone)
  }

  function updateDone(updater: (prev: Set<number>) => Set<number>, sessionId: string) {
    setDoneIndicesRaw(prev => {
      const next = updater(prev)
      persistDone(sessionId, next)
      return next
    })
  }

  function initFromSession(sessionId: string): Set<number> {
    const persisted = loadPersistedDone(sessionId)
    setDoneIndicesRaw(persisted)
    return persisted
  }

  function clearSession(sessionId: string) {
    sessionStorage.removeItem(`done-${sessionId}`)
  }

  return { doneIndices, setDoneIndicesRaw, setDone, updateDone, initFromSession, clearSession }
}
