import { useState, useEffect, useRef } from 'react'
import type React from 'react'

export interface DragState {
  fromIndex: number
  toIndex: number
  startY: number
  currentY: number
}

interface UseDragReorderResult {
  dragState: DragState | null
  handleDragHandleTouchStart: (index: number, e: React.TouchEvent) => void
}

export function useDragReorder(
  entryRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
  reorderEntries: (fromIndex: number, toIndex: number) => Promise<void>,
  onDropped: (fromIndex: number, toIndex: number) => void,
): UseDragReorderResult {
  const [dragState, setDragStateRaw] = useState<DragState | null>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reorderEntriesRef = useRef(reorderEntries)
  const onDroppedRef = useRef(onDropped)

  useEffect(() => { reorderEntriesRef.current = reorderEntries }, [reorderEntries])
  useEffect(() => { onDroppedRef.current = onDropped }, [onDropped])

  function setDragState(s: DragState | null) {
    dragStateRef.current = s
    setDragStateRaw(s)
  }

  function calculateDropIndex(touchY: number): number {
    const refs = entryRefs.current
    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i]
      if (!ref) continue
      const rect = ref.getBoundingClientRect()
      if (touchY < rect.top + rect.height / 2) return i
    }
    return Math.max(refs.length - 1, 0)
  }

  useEffect(() => {
    function handleGlobalTouchMove(e: TouchEvent) {
      if (!dragStateRef.current) return
      e.preventDefault()
      const currentY = e.touches[0].clientY
      const ds = dragStateRef.current
      const toIndex = calculateDropIndex(currentY)
      const newState = { ...ds, currentY, toIndex }
      dragStateRef.current = newState
      setDragStateRaw(newState)
    }

    function handleGlobalTouchEnd() {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
      const ds = dragStateRef.current
      if (!ds) return
      dragStateRef.current = null
      setDragStateRaw(null)

      if (ds.fromIndex !== ds.toIndex) {
        reorderEntriesRef.current(ds.fromIndex, ds.toIndex).then(() => {
          onDroppedRef.current(ds.fromIndex, ds.toIndex)
        })
      }
    }

    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
    document.addEventListener('touchend', handleGlobalTouchEnd)
    return () => {
      document.removeEventListener('touchmove', handleGlobalTouchMove)
      document.removeEventListener('touchend', handleGlobalTouchEnd)
    }
  }, [])

  function handleDragHandleTouchStart(index: number, e: React.TouchEvent) {
    const y = e.touches[0].clientY
    const timer = setTimeout(() => {
      longPressTimer.current = null
      setDragState({ fromIndex: index, toIndex: index, startY: y, currentY: y })
    }, 400)
    longPressTimer.current = timer
  }

  return { dragState, handleDragHandleTouchStart }
}
