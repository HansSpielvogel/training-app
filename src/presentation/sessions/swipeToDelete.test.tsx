import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EntryRow } from './EntryRow'
import type { SessionEntry } from '@application/sessions'

const baseEntry: SessionEntry = {
  muscleGroupId: 'mg-chest',
  sets: [],
  isTemp: false,
}

const defaultProps = {
  entry: baseEntry,
  muscleGroupName: 'Chest',
  exerciseData: null,
  lastSets: null,
  done: false,
  isExpanded: false,
  sessionStatus: 'in-progress' as const,
  onToggle: vi.fn(),
  onMarkDone: vi.fn(),
  onLoadExerciseData: vi.fn(),
  onAssign: vi.fn(),
  onClearVariation: vi.fn(),
  onAddSet: vi.fn(),
  onRemoveLast: vi.fn(),
  onUpdateSetRpe: vi.fn(),
}

function touch(x: number, y = 200) {
  return { touches: [{ clientX: x, clientY: y }] }
}

describe('EntryRow swipe-to-delete', () => {
  it('calls onRemoveEntry when swipe exceeds 60px threshold', () => {
    const onRemoveEntry = vi.fn()
    render(<EntryRow {...defaultProps} onRemoveEntry={onRemoveEntry} />)
    const row = screen.getByText('Chest').closest('.relative') as Element

    fireEvent.touchStart(row, touch(200))
    fireEvent.touchMove(row, touch(130))  // dx=70 > 60
    fireEvent.touchEnd(row)

    expect(onRemoveEntry).toHaveBeenCalled()
  })

  it('does not call onRemoveEntry when swipe is below 60px threshold (snap back)', () => {
    const onRemoveEntry = vi.fn()
    render(<EntryRow {...defaultProps} onRemoveEntry={onRemoveEntry} />)
    const row = screen.getByText('Chest').closest('.relative') as Element

    fireEvent.touchStart(row, touch(200))
    fireEvent.touchMove(row, touch(160))  // dx=40 < 60
    fireEvent.touchEnd(row)

    expect(onRemoveEntry).not.toHaveBeenCalled()
  })

  it('does not swipe when entry has logged sets', () => {
    const onRemoveEntry = vi.fn()
    const entryWithSets: SessionEntry = {
      ...baseEntry,
      sets: [{ weight: { kind: 'single', value: 80 }, reps: 10 }],
    }
    render(<EntryRow {...defaultProps} entry={entryWithSets} onRemoveEntry={onRemoveEntry} />)
    const row = screen.getByText('Chest').closest('.relative') as Element

    fireEvent.touchStart(row, touch(200))
    fireEvent.touchMove(row, touch(130))  // dx=70 > 60
    fireEvent.touchEnd(row)

    expect(onRemoveEntry).not.toHaveBeenCalled()
  })

  it('does not activate on vertical scroll movement', () => {
    const onRemoveEntry = vi.fn()
    render(<EntryRow {...defaultProps} onRemoveEntry={onRemoveEntry} />)
    const row = screen.getByText('Chest').closest('.relative') as Element

    fireEvent.touchStart(row, touch(200, 200))
    fireEvent.touchMove(row, { touches: [{ clientX: 195, clientY: 130 }] })  // mainly vertical
    fireEvent.touchEnd(row)

    expect(onRemoveEntry).not.toHaveBeenCalled()
  })
})
