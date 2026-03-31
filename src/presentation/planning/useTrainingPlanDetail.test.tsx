import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import { useTrainingPlanDetail } from './useTrainingPlanDetail'

const mockSavePlan = vi.fn()
const mockDeleteSlotsByPlan = vi.fn()
const mockSaveSlots = vi.fn()
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('@infrastructure/planning/DexieTrainingPlanRepository', () => ({
  DexieTrainingPlanRepository: class {
    findPlanById = vi.fn().mockResolvedValue({ id: 'p1', name: 'Push Day', createdAt: new Date() })
    listSlotsByPlan = vi.fn().mockResolvedValue([
      { id: 's1', planId: 'p1', muscleGroupId: 'mg1', order: 1, optional: false },
    ])
    findPlanByName = vi.fn().mockResolvedValue(undefined)
    savePlan = mockSavePlan
    deleteSlotsByPlan = mockDeleteSlotsByPlan
    saveSlots = mockSaveSlots
  },
}))

vi.mock('@infrastructure/exercises/DexieMuscleGroupRepository', () => ({
  DexieMuscleGroupRepository: class {
    findById = vi.fn().mockResolvedValue({ id: 'mg1', name: 'Chest' })
  },
}))

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useTrainingPlanDetail draft mode', () => {
  it('loads plan from DB on mount', async () => {
    const { result } = renderHook(() => useTrainingPlanDetail('p1'), { wrapper })
    await waitFor(() => expect(result.current.plan).toBeDefined())
    expect(result.current.plan?.name).toBe('Push Day')
    expect(result.current.plan?.slots).toHaveLength(1)
  })

  it('addSlot updates draft but does not write to DB', async () => {
    const { result } = renderHook(() => useTrainingPlanDetail('p1'), { wrapper })
    await waitFor(() => expect(result.current.plan).toBeDefined())

    act(() => { result.current.addSlot('mg2') })

    expect(result.current.plan?.slots).toHaveLength(2)
    expect(mockSavePlan).not.toHaveBeenCalled()
    expect(mockSaveSlots).not.toHaveBeenCalled()
  })

  it('removeSlot updates draft but does not write to DB', async () => {
    const { result } = renderHook(() => useTrainingPlanDetail('p1'), { wrapper })
    await waitFor(() => expect(result.current.plan).toBeDefined())

    act(() => { result.current.removeSlot('s1') })

    expect(result.current.plan?.slots).toHaveLength(0)
    expect(mockSavePlan).not.toHaveBeenCalled()
  })

  it('renamePlan updates draft but does not write to DB', async () => {
    const { result } = renderHook(() => useTrainingPlanDetail('p1'), { wrapper })
    await waitFor(() => expect(result.current.plan).toBeDefined())

    act(() => { result.current.renamePlan('New Name') })

    expect(result.current.plan?.name).toBe('New Name')
    expect(mockSavePlan).not.toHaveBeenCalled()
  })

  it('save writes plan and slots to DB then navigates', async () => {
    const { result } = renderHook(() => useTrainingPlanDetail('p1'), { wrapper })
    await waitFor(() => expect(result.current.plan).toBeDefined())

    await act(async () => { await result.current.save() })

    expect(mockSavePlan).toHaveBeenCalledWith(expect.objectContaining({ id: 'p1', name: 'Push Day' }))
    expect(mockDeleteSlotsByPlan).toHaveBeenCalledWith('p1')
    expect(mockSaveSlots).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/training-plans')
  })

  it('discard navigates without writing to DB', async () => {
    const { result } = renderHook(() => useTrainingPlanDetail('p1'), { wrapper })
    await waitFor(() => expect(result.current.plan).toBeDefined())

    act(() => { result.current.discard() })

    expect(mockSavePlan).not.toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/training-plans')
  })
})
