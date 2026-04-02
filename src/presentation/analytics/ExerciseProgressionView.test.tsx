import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ExerciseProgressionView } from './ExerciseProgressionView'
import type { ExerciseProgressionPoint } from '@application/analytics'
import type { ExerciseDefinition } from '@application/exercises'

const ex: ExerciseDefinition = { id: 'ex-1', name: 'Bench Press', muscleGroupIds: ['mg-1'], defaultSets: 3 }

const points: ExerciseProgressionPoint[] = [
  { date: new Date('2024-01-01'), weight: 80, weightUnit: 'kg', avgReps: 10 },
  { date: new Date('2024-02-01'), weight: 85, weightUnit: 'kg', avgReps: 8 },
]

function setup(overrides: Partial<Parameters<typeof ExerciseProgressionView>[0]> = {}) {
  const getProgression = vi.fn().mockResolvedValue([...points])
  const getFullProgression = vi.fn().mockResolvedValue([...points])
  return render(
    <ExerciseProgressionView
      exercises={[ex]}
      getProgression={getProgression}
      getFullProgression={getFullProgression}
      {...overrides}
    />
  )
}

describe('ExerciseProgressionView', () => {
  it('shows exercise list initially', () => {
    setup()
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
  })

  it('shows chart view after selecting an exercise', async () => {
    setup()
    fireEvent.click(screen.getByText('Bench Press'))
    await waitFor(() => expect(screen.getByText('Chart')).toBeInTheDocument())
    expect(screen.getByText('List')).toBeInTheDocument()
  })

  it('switches to list view when List is clicked', async () => {
    setup()
    fireEvent.click(screen.getByText('Bench Press'))
    await waitFor(() => expect(screen.getByText('List')).toBeInTheDocument())
    fireEvent.click(screen.getByText('List'))
    await waitFor(() => expect(screen.getByText('85 kg')).toBeInTheDocument())
    expect(screen.getByText('8 reps')).toBeInTheDocument()
  })

  it('shows list in most-recent-first order', async () => {
    setup()
    fireEvent.click(screen.getByText('Bench Press'))
    await waitFor(() => screen.getByText('List'))
    fireEvent.click(screen.getByText('List'))
    await waitFor(() => {
      const weights = screen.getAllByText(/\d+ kg$/)
      expect(weights[0].textContent).toBe('85 kg')
      expect(weights[1].textContent).toBe('80 kg')
    })
  })

  it('switches back to chart view when Chart is clicked', async () => {
    setup()
    fireEvent.click(screen.getByText('Bench Press'))
    await waitFor(() => screen.getByText('List'))
    fireEvent.click(screen.getByText('List'))
    await waitFor(() => screen.getByText('85 kg'))
    fireEvent.click(screen.getByText('Chart'))
    expect(screen.queryByText('85 kg')).not.toBeInTheDocument()
  })

  it('shows no-data message when exercise has no progression', async () => {
    setup({ getProgression: vi.fn().mockResolvedValue([]), getFullProgression: vi.fn().mockResolvedValue([]) })
    fireEvent.click(screen.getByText('Bench Press'))
    await waitFor(() => expect(screen.getByText('No data for this exercise yet.')).toBeInTheDocument())
    expect(screen.queryByText('Chart')).not.toBeInTheDocument()
  })
})
