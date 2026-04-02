import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressionChart } from './ProgressionChart'
import type { ExerciseProgressionPoint } from '@application/analytics'

function makePoint(overrides: Partial<ExerciseProgressionPoint> = {}): ExerciseProgressionPoint {
  return {
    date: new Date('2024-01-01'),
    weight: 80,
    weightUnit: 'kg',
    avgReps: 10,
    ...overrides,
  }
}

describe('ProgressionChart', () => {
  it('renders nothing when points is empty', () => {
    const { container } = render(<ProgressionChart points={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders weight axis labels', () => {
    const points = [makePoint({ weight: 80 }), makePoint({ weight: 90, date: new Date('2024-02-01') })]
    render(<ProgressionChart points={points} />)
    expect(screen.getByText('90')).toBeInTheDocument()
    expect(screen.getByText('80')).toBeInTheDocument()
  })

  it('renders reps axis labels when avgReps is present', () => {
    const points = [
      makePoint({ avgReps: 8 }),
      makePoint({ avgReps: 10, date: new Date('2024-02-01') }),
    ]
    render(<ProgressionChart points={points} />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('— reps')).toBeInTheDocument()
  })

  it('does not render reps axis when no point has avgReps', () => {
    const points = [makePoint({ avgReps: undefined })]
    render(<ProgressionChart points={points} />)
    expect(screen.queryByText('— reps')).not.toBeInTheDocument()
  })

  it('renders weight unit legend', () => {
    const points = [makePoint({ weightUnit: 'kg/side' })]
    render(<ProgressionChart points={points} />)
    expect(screen.getByText('— kg/side')).toBeInTheDocument()
  })
})
