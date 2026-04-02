import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ExerciseRow } from './ExerciseRow'

const ed = { id: 'ex-1', name: 'Bench Press', muscleGroupIds: ['mg-1'], defaultSets: 3 }

describe('ExerciseRow', () => {
  it('renders exercise name and muscle group names', () => {
    render(<ExerciseRow ed={ed} muscleGroupNames="Chest" onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Bench Press')).toBeInTheDocument()
    expect(screen.getByText('Chest')).toBeInTheDocument()
  })

  it('does not show last-used row when lastUsed is not provided', () => {
    render(<ExerciseRow ed={ed} muscleGroupNames="Chest" onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText(/reps/)).not.toBeInTheDocument()
  })

  it('shows last-used weight and reps when lastUsed is provided', () => {
    render(
      <ExerciseRow
        ed={ed}
        muscleGroupNames="Chest"
        lastUsed={{ weight: 80, weightUnit: 'kg', reps: 10 }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    expect(screen.getByText('80 kg · 10 reps')).toBeInTheDocument()
  })

  it('shows kg/side unit for bilateral exercises', () => {
    render(
      <ExerciseRow
        ed={ed}
        muscleGroupNames="Biceps"
        lastUsed={{ weight: 15, weightUnit: 'kg/side', reps: 12 }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )
    expect(screen.getByText('15 kg/side · 12 reps')).toBeInTheDocument()
  })
})
