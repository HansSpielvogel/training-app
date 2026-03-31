import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

vi.mock('@infrastructure/sessions/DexieTrainingSessionRepository', () => ({
  DexieTrainingSessionRepository: vi.fn().mockImplementation(() => ({
    getActiveSession: vi.fn().mockResolvedValue(undefined),
  })),
}))

vi.mock('@infrastructure/planning/DexieTrainingPlanRepository', () => ({
  DexieTrainingPlanRepository: vi.fn().mockImplementation(() => ({})),
}))

vi.mock('@infrastructure/exercises/DexieExerciseDefinitionRepository', () => ({
  DexieExerciseDefinitionRepository: vi.fn().mockImplementation(() => ({})),
}))

import { useActiveSession } from './useActiveSession'

describe('removePlanSlot', () => {
  it('adds the plan slot index to removedPlanSlotIndices', async () => {
    const { result } = renderHook(() => useActiveSession())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.removedPlanSlotIndices.has(2)).toBe(false)
    act(() => { result.current.removePlanSlot(2) })
    expect(result.current.removedPlanSlotIndices.has(2)).toBe(true)
  })

  it('can remove multiple plan slots', async () => {
    const { result } = renderHook(() => useActiveSession())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => {
      result.current.removePlanSlot(0)
      result.current.removePlanSlot(3)
    })
    expect(result.current.removedPlanSlotIndices.has(0)).toBe(true)
    expect(result.current.removedPlanSlotIndices.has(3)).toBe(true)
    expect(result.current.removedPlanSlotIndices.has(1)).toBe(false)
  })

  it('does not affect other indices', async () => {
    const { result } = renderHook(() => useActiveSession())
    await waitFor(() => expect(result.current.loading).toBe(false))
    act(() => { result.current.removePlanSlot(1) })
    expect(result.current.removedPlanSlotIndices.has(0)).toBe(false)
    expect(result.current.removedPlanSlotIndices.has(2)).toBe(false)
  })
})
