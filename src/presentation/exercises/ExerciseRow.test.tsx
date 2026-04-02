import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ExerciseRow } from './ExerciseRow'

const ed = { id: 'ex-1', name: 'Bench Press', muscleGroupIds: ['mg-1'], defaultSets: 3 }

const makeSets = (weight: number, reps: number, count = 1) =>
  Array.from({ length: count }, () => ({ weight: { kind: 'single' as const, value: weight }, reps }))

describe('ExerciseRow', () => {
  it('renders exercise name and muscle group names', () => {
    render(<ExerciseRow ed={ed} muscleGroupNames="Chest" onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
    expect(screen.getByText('Chest')).toBeInTheDocument()
  })

  it('does not show last-used row when lastUsed is not provided', () => {
    render(<ExerciseRow ed={ed} muscleGroupNames="Chest" onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText(/kg/)).not.toBeInTheDocument()
  })

  it('shows single set as weight × reps', () => {
    render(
      <ExerciseRow
        ed={ed}
        muscleGroupNames="Chest"
        lastUsed={{ weight: 80, weightUnit: 'kg', reps: 10, sets: makeSets(80, 10) }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    expect(screen.getByText('80 kg × 10')).toBeInTheDocument()
  })

  it('collapses identical sets to (N sets) format', () => {
    render(
      <ExerciseRow
        ed={ed}
        muscleGroupNames="Chest"
        lastUsed={{ weight: 80, weightUnit: 'kg', reps: 10, sets: makeSets(80, 10, 3) }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    expect(screen.getByText('80 kg × 10 (3 sets)')).toBeInTheDocument()
  })

  it('shows bilateral sets using kg/side format', () => {
    render(
      <ExerciseRow
        ed={ed}
        muscleGroupNames="Biceps"
        lastUsed={{
          weight: 15, weightUnit: 'kg/side', reps: 12,
          sets: [{ weight: { kind: 'bilateral', perSide: 15 }, reps: 12 }],
        }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    expect(screen.getByText('15 kg/side × 12')).toBeInTheDocument()
  })
})
