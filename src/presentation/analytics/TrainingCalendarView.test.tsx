import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TrainingCalendarView } from './TrainingCalendarView'
import type { SessionSummaryItem } from '@application/analytics'
import type { TrainingSession } from '@application/sessions'
import type { ExerciseDefinition } from '@application/exercises'

const session: SessionSummaryItem = {
  id: 's1',
  date: new Date('2024-03-01'),
  planName: 'Push',
  exerciseCount: 1,
}

const fullSession: TrainingSession = {
  id: 's1',
  planId: 'p1',
  planName: 'Push',
  status: 'completed',
  startedAt: new Date('2024-03-01'),
  completedAt: new Date('2024-03-01'),
  entries: [{
    muscleGroupId: 'mg-1',
    exerciseDefinitionId: 'ex-bench',
    sets: [
      { weight: { kind: 'single', value: 80 }, reps: 10 },
      { weight: { kind: 'single', value: 85 }, reps: 8 },
    ],
  }],
}

const exercises: ExerciseDefinition[] = [
  { id: 'ex-bench', name: 'Bench Press', muscleGroupIds: ['mg-1'], defaultSets: 3 },
]

function setup(getSessionDetail = vi.fn().mockResolvedValue(fullSession)) {
  return render(
    <TrainingCalendarView sessions={[session]} exercises={exercises} getSessionDetail={getSessionDetail} />
  )
}

describe('TrainingCalendarView', () => {
  it('shows session summary cards', () => {
    setup()
    expect(screen.getByText('Push')).toBeInTheDocument()
    expect(screen.getByText(/1 exercise/)).toBeInTheDocument()
  })

  it('shows empty state when no sessions', () => {
    render(<TrainingCalendarView sessions={[]} exercises={[]} getSessionDetail={vi.fn()} />)
    expect(screen.getByText('No sessions yet.')).toBeInTheDocument()
  })

  it('expands a card to show exercise details on tap', async () => {
    setup()
    fireEvent.click(screen.getByText('Push'))
    await waitFor(() => expect(screen.getByText('Bench Press')).toBeInTheDocument())
    expect(screen.getByText('80 kg × 10, 85 kg × 8')).toBeInTheDocument()
  })

  it('collapses the card on second tap', async () => {
    setup()
    fireEvent.click(screen.getByText('Push'))
    await waitFor(() => screen.getByText('Bench Press'))
    fireEvent.click(screen.getByText('Push'))
    await waitFor(() => expect(screen.queryByText('Bench Press')).not.toBeInTheDocument())
  })

  it('fetches session detail only once (lazy, cached)', async () => {
    const getSessionDetail = vi.fn().mockResolvedValue(fullSession)
    setup(getSessionDetail)
    fireEvent.click(screen.getByText('Push'))
    await waitFor(() => screen.getByText('Bench Press'))
    fireEvent.click(screen.getByText('Push'))
    fireEvent.click(screen.getByText('Push'))
    await waitFor(() => screen.getByText('Bench Press'))
    expect(getSessionDetail).toHaveBeenCalledTimes(1)
  })
})
