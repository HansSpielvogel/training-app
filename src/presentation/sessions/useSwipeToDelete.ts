import { useState, useRef } from 'react'
import type React from 'react'

interface UseSwipeToDeleteOptions {
  canSwipe: boolean
  setCount: number
}

interface UseSwipeToDeleteResult {
  swipeX: number
  swiping: boolean
  swipeBlocked: boolean
  handleTouchStart: (e: React.TouchEvent) => void
  handleTouchMove: (e: React.TouchEvent) => void
  handleTouchEnd: () => void
}

export function useSwipeToDelete({ canSwipe, setCount }: UseSwipeToDeleteOptions): UseSwipeToDeleteResult {
  const [swipeX, setSwipeX] = useState(0)
  const [swiping, setSwiping] = useState(false)
  const [swipeBlocked, setSwipeBlocked] = useState(false)
  const touchRef = useRef({ startX: 0, startY: 0, startSwipeX: 0, activated: false })
  const blockAttempted = useRef(false)
  const blockTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleTouchStart(e: React.TouchEvent) {
    blockAttempted.current = false
    touchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, startSwipeX: swipeX, activated: false }
    if (canSwipe) setSwiping(true)
  }

  function handleTouchMove(e: React.TouchEvent) {
    const { startX, startY, startSwipeX } = touchRef.current
    const dx = startX - e.touches[0].clientX
    const dy = Math.abs(e.touches[0].clientY - startY)

    if (!canSwipe) {
      if (!blockAttempted.current && dx > 20 && dx > dy && setCount > 0) {
        blockAttempted.current = true
        setSwipeBlocked(true)
        if (blockTimer.current) clearTimeout(blockTimer.current)
        blockTimer.current = setTimeout(() => setSwipeBlocked(false), 2000)
      }
      return
    }

    if (!touchRef.current.activated) {
      const isLeftSwipe = dx > 5 && dx > dy
      const isRightSwipe = -dx > 5 && -dx > dy && startSwipeX > 0
      if (isLeftSwipe || isRightSwipe) {
        touchRef.current.activated = true
      } else {
        return
      }
    }
    setSwipeX(Math.min(Math.max(startSwipeX + dx, 0), 80))
  }

  function handleTouchEnd() {
    setSwiping(false)
    blockAttempted.current = false
    if (!touchRef.current.activated) return
    touchRef.current.activated = false
    setSwipeX(swipeX >= 40 ? 80 : 0)
  }

  return { swipeX, swiping, swipeBlocked, handleTouchStart, handleTouchMove, handleTouchEnd }
}
