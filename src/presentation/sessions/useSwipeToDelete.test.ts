import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSwipeToDelete } from './useSwipeToDelete'

function swipeLeft(result: { current: ReturnType<typeof useSwipeToDelete> }) {
  act(() => {
    result.current.handleTouchStart({ touches: [{ clientX: 100, clientY: 0 }] } as unknown as React.TouchEvent)
  })
  act(() => {
    result.current.handleTouchMove({ touches: [{ clientX: 30, clientY: 0 }] } as unknown as React.TouchEvent)
  })
}

describe('useSwipeToDelete resetKey', () => {
  it('resets swipeX, swiping, and swipeBlocked when resetKey changes', () => {
    const { result, rerender } = renderHook(
      ({ resetKey }) => useSwipeToDelete({ canSwipe: true, setCount: 0, resetKey }),
      { initialProps: { resetKey: 3 } },
    )

    swipeLeft(result)
    expect(result.current.swipeX).toBeGreaterThan(0)

    rerender({ resetKey: 2 })

    expect(result.current.swipeX).toBe(0)
    expect(result.current.swiping).toBe(false)
    expect(result.current.swipeBlocked).toBe(false)
  })

  it('does not reset swipe state when resetKey is unchanged', () => {
    const { result, rerender } = renderHook(
      ({ resetKey }) => useSwipeToDelete({ canSwipe: true, setCount: 0, resetKey }),
      { initialProps: { resetKey: 3 } },
    )

    swipeLeft(result)
    const swipedX = result.current.swipeX
    expect(swipedX).toBeGreaterThan(0)

    rerender({ resetKey: 3 })

    expect(result.current.swipeX).toBe(swipedX)
  })
})
