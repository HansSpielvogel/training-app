import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import type { TrainingSession } from '@application/sessions'

const mockSession: TrainingSession = {
  id: 'session-1',
  planId: 'plan-1',
  planName: 'Push',
  status: 'in-progress',
  startedAt: new Date(),
  entries: [
    { muscleGroupId: 'chest', exerciseDefinitionId: undefined, sets: [], isTemp: false },
    { muscleGroupId: 'shoulders', exerciseDefinitionId: undefined, sets: [], isTemp: false },
    { muscleGroupId: 'triceps', exerciseDefinitionId: undefined, sets: [], isTemp: false },
  ],
}

const mockSave = vi.fn().mockResolvedValue(undefined)
const mockGetById = vi.fn().mockResolvedValue(mockSession)
const mockGetActiveSession = vi.fn().mockResolvedValue(mockSession)

vi.mock('@infrastructure/sessions/DexieTrainingSessionRepository', () => ({
  DexieTrainingSessionRepository: vi.fn().mockImplementation(() => ({
    getActiveSession: mockGetActiveSession,
    getById: mockGetById,
    save: mockSave,
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
  it('removes the specified entry from the session', async () => {
    mockGetActiveSession.mockResolvedValue({ ...mockSession, entries: [...mockSession.entries] })
    mockGetById.mockResolvedValue({ ...mockSession, entries: [...mockSession.entries] })

    const { result } = renderHook(() => useActiveSession())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => { await result.current.removePlanSlot(1) })

    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({
        entries: expect.arrayContaining([
          expect.objectContaining({ muscleGroupId: 'chest' }),
          expect.objectContaining({ muscleGroupId: 'triceps' }),
        ]),
      }),
    )
    const saved = mockSave.mock.calls[mockSave.mock.calls.length - 1][0]
    expect(saved.entries).toHaveLength(2)
    expect(saved.entries.find((e: { muscleGroupId: string }) => e.muscleGroupId === 'shoulders')).toBeUndefined()
  })

  it('removes the entry from session.entries after removal', async () => {
    const sessionWithTwo: TrainingSession = {
      ...mockSession,
      entries: [
        { muscleGroupId: 'chest', exerciseDefinitionId: undefined, sets: [], isTemp: false },
        { muscleGroupId: 'triceps', exerciseDefinitionId: undefined, sets: [], isTemp: false },
      ],
    }
    mockGetActiveSession
      .mockResolvedValueOnce({ ...mockSession })
      .mockResolvedValueOnce(sessionWithTwo)
    mockGetById.mockResolvedValue({ ...mockSession })

    const { result } = renderHook(() => useActiveSession())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => { await result.current.removePlanSlot(1) })

    await waitFor(() => expect(result.current.session?.entries).toHaveLength(2))
    expect(result.current.session?.entries.find((e) => e.muscleGroupId === 'shoulders')).toBeUndefined()
  })
})
