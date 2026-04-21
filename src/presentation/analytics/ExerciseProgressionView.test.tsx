import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ExerciseProgressionView } from './ExerciseProgressionView'
import type { ExerciseProgressionPoint } from '@application/analytics'
import type { ExerciseDefinition } from '@application/exercises'

const ex: ExerciseDefinition = { id: 'ex-1', name: 'Bench Press', muscleGroupIds: ['mg-1'], defaultSets: 3 }

const points: ExerciseProgressionPoint[] = [
  {
    date: new Date('2024-01-01'), weight: 80, weightUnit: 'kg', avgReps: 10,
    sets: [
      { weight: { kind: 'single', value: 80 }, reps: 10 },
      { weight: { kind: 'single', value: 80 }, reps: 10 },
      { weight: { kind: 'single', value: 80 }, reps: 10 },
    ],
  },
  {
    date: new Date('2024-02-01'), weight: 85, weightUnit: 'kg', avgReps: 8,
    sets: [
      { weight: { kind: 'single', value: 80 }, reps: 10 },
      { weight: { kind: 'single', value: 85 }, reps: 8 },
    ],
  },
]

function setup(overrides: Partial<Parameters<typeof ExerciseProgressionView>[0]> = {}) {
  const getProgression = vi.fn().mockResolvedValue([...points])
  const getFullProgression = vi.fn().mockResolvedValue([...points])
  return render(
    <ExerciseProgressionView
      exercises={[ex]}
      muscleGroups={[]}
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

  it('shows list view by default after selecting an exercise', async () => {
    setup()
    fireEvent.click(screen.getByText('Bench Press'))
    await waitFor(() => expect(screen.getByText('80 kg × 10 (3 sets)')).toBeInTheDocument())
    expect(screen.getByText('Chart')).toBeInTheDocument()
    expect(screen.getByText('List')).toBeInTheDocument()
  })

  it('shows list with a single session recorded', async () => {
    const singlePoint = [points[0]]
    setup({ getProgression: vi.fn().mockResolvedValue(singlePoint), getFullProgression: vi.fn().mockResolvedValue(singlePoint) })
    fireEvent.click(screen.getByText('Bench Press'))
    await waitFor(() => expect(screen.getByText('80 kg × 10 (3 sets)')).toBeInTheDocument())
    expect(screen.getByText('Chart')).toBeInTheDocument()
  })

  it('shows list in most-recent-first order', async () => {
    setup()
    fireEvent.click(screen.getByText('Bench Press'))
    await waitFor(() => {
      const rows = screen.getAllByText(/kg/)
      expect(rows[0].textContent).toContain('85')
    })
  })

  it('switches to chart view when Chart is clicked', async () => {
    setup()
    fireEvent.click(screen.getByText('Bench Press'))
    await waitFor(() => screen.getByText('80 kg × 10 (3 sets)'))
    fireEvent.click(screen.getByText('Chart'))
    await waitFor(() => expect(screen.queryByText('80 kg × 10 (3 sets)')).not.toBeInTheDocument())
  })

  it('switches back to list view when List is clicked', async () => {
    setup()
    fireEvent.click(screen.getByText('Bench Press'))
    await waitFor(() => screen.getByText('80 kg × 10 (3 sets)'))
    fireEvent.click(screen.getByText('Chart'))
    await waitFor(() => expect(screen.queryByText('80 kg × 10 (3 sets)')).not.toBeInTheDocument())
    fireEvent.click(screen.getByText('List'))
    await waitFor(() => expect(screen.getByText('80 kg × 10 (3 sets)')).toBeInTheDocument())
  })

  it('shows no-data message when exercise has no progression', async () => {
    setup({ getProgression: vi.fn().mockResolvedValue([]), getFullProgression: vi.fn().mockResolvedValue([]) })
    fireEvent.click(screen.getByText('Bench Press'))
    await waitFor(() => expect(screen.getByText('No data for this exercise yet.')).toBeInTheDocument())
    expect(screen.queryByText('Chart')).not.toBeInTheDocument()
  })
})
