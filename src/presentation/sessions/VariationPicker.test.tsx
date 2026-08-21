import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VariationPicker } from './VariationPicker'
import type { ExerciseDefinition } from '@application/exercises'

const suggestion: ExerciseDefinition = { id: 'ex-1', name: 'Bench Press', muscleGroupIds: ['mg-chest'], defaultSets: 3 }

describe('VariationPicker stats shortcut', () => {
  it('navigates via onViewStats without selecting the exercise', () => {
    const onSelect = vi.fn()
    const onViewStats = vi.fn()
    render(
      <VariationPicker
        suggestion={suggestion}
        recentVariations={[]}
        allExercises={[suggestion]}
        onSelect={onSelect}
        onViewStats={onViewStats}
      />,
    )
    fireEvent.click(screen.getAllByLabelText('View history/stats')[0])
    expect(onViewStats).toHaveBeenCalledWith('ex-1')
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('renders without the shortcut button when onViewStats is not provided', () => {
    render(
      <VariationPicker
        suggestion={suggestion}
        recentVariations={[]}
        allExercises={[suggestion]}
        onSelect={vi.fn()}
      />,
    )
    expect(screen.queryByLabelText('View history/stats')).not.toBeInTheDocument()
  })
})
