import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MuscleGroupFilterChips } from './MuscleGroupFilterChips'
import type { MuscleGroup } from '@application/exercises'

const groups: MuscleGroup[] = [
  { id: 'mg-1', name: 'Chest' },
  { id: 'mg-2', name: 'Back' },
  { id: 'mg-3', name: 'Legs' },
]

describe('MuscleGroupFilterChips', () => {
  it('renders no chips when groups is empty', () => {
    const { container } = render(<MuscleGroupFilterChips groups={[]} selected={null} onSelect={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders one chip per group', () => {
    render(<MuscleGroupFilterChips groups={groups} selected={null} onSelect={vi.fn()} />)
    expect(screen.getByText('Chest')).toBeInTheDocument()
    expect(screen.getByText('Back')).toBeInTheDocument()
    expect(screen.getByText('Legs')).toBeInTheDocument()
  })

  it('calls onSelect with the group id when a chip is clicked', () => {
    const onSelect = vi.fn()
    render(<MuscleGroupFilterChips groups={groups} selected={null} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Chest'))
    expect(onSelect).toHaveBeenCalledWith('mg-1')
  })

  it('calls onSelect with null when the active chip is clicked again', () => {
    const onSelect = vi.fn()
    render(<MuscleGroupFilterChips groups={groups} selected="mg-2" onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Back'))
    expect(onSelect).toHaveBeenCalledWith(null)
  })

  it('only shows relevant groups (only-relevant-groups-shown contract)', () => {
    const subset: MuscleGroup[] = [{ id: 'mg-1', name: 'Chest' }]
    render(<MuscleGroupFilterChips groups={subset} selected={null} onSelect={vi.fn()} />)
    expect(screen.getByText('Chest')).toBeInTheDocument()
    expect(screen.queryByText('Back')).not.toBeInTheDocument()
    expect(screen.queryByText('Legs')).not.toBeInTheDocument()
  })
})
