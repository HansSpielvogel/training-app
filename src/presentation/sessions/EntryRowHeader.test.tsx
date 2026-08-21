import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { EntryRowHeader } from './EntryRowHeader'

const baseProps = {
  muscleGroupName: 'Chest',
  isOptional: false,
  isTemp: false,
  done: false,
  isExpanded: false,
  onToggle: vi.fn(),
  onClearVariation: vi.fn(),
}

describe('EntryRowHeader collapse arrow', () => {
  it('renders the arrow in default (non-green) state when no sets are logged', () => {
    const { container } = render(<EntryRowHeader {...baseProps} setCount={0} />)
    const arrow = container.querySelector('svg.text-gray-400')
    expect(arrow).toBeInTheDocument()
    expect(container.querySelector('svg.text-green-500')).not.toBeInTheDocument()
  })

  it('renders the arrow in green state once at least one set is logged', () => {
    const { container } = render(<EntryRowHeader {...baseProps} setCount={1} />)
    expect(container.querySelector('svg.text-green-500')).toBeInTheDocument()
  })
})
