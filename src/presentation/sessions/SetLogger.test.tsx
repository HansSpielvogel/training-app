import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SetLogger } from './SetLogger'
import type { Weight } from '@application/sessions'

const noop = () => {}
const defaultProps = {
  sets: [],
  lastSets: null,
  sessionStatus: 'in-progress' as const,
  onAdd: noop,
  onRemoveLast: noop,
  onUpdateSetRpe: noop,
}

describe('SetLogger', () => {
  describe('minus toggle', () => {
    it('prepends - to empty input', () => {
      render(<SetLogger {...defaultProps} />)
      fireEvent.click(screen.getByLabelText('Toggle negative'))
      expect(screen.getByPlaceholderText('Weight')).toHaveValue('-')
    })

    it('prepends - to existing value', () => {
      render(<SetLogger {...defaultProps} />)
      const input = screen.getByPlaceholderText('Weight')
      fireEvent.change(input, { target: { value: '22.5' } })
      fireEvent.click(screen.getByLabelText('Toggle negative'))
      expect(input).toHaveValue('-22.5')
    })

    it('removes - if already negative', () => {
      render(<SetLogger {...defaultProps} />)
      const input = screen.getByPlaceholderText('Weight')
      fireEvent.change(input, { target: { value: '-22.5' } })
      fireEvent.click(screen.getByLabelText('Toggle negative'))
      expect(input).toHaveValue('22.5')
    })
  })

  describe('addedWeightInput', () => {
    it('creates stacked weight when added field has a value', () => {
      const onAdd = vi.fn()
      render(<SetLogger {...defaultProps} onAdd={onAdd} />)
      fireEvent.change(screen.getByPlaceholderText('Weight'), { target: { value: '30' } })
      fireEvent.change(screen.getByPlaceholderText('+add'), { target: { value: '2.5' } })
      fireEvent.change(screen.getByPlaceholderText('Reps'), { target: { value: '10' } })
      fireEvent.click(screen.getByText(/Log/))
      expect(onAdd).toHaveBeenCalledWith<[Weight, number, number, undefined]>(
        { kind: 'stacked', base: 30, added: 2.5 }, 10, expect.any(Number), undefined,
      )
    })

    it('handles comma decimal in added field', () => {
      const onAdd = vi.fn()
      render(<SetLogger {...defaultProps} onAdd={onAdd} />)
      fireEvent.change(screen.getByPlaceholderText('Weight'), { target: { value: '30' } })
      fireEvent.change(screen.getByPlaceholderText('+add'), { target: { value: '2,5' } })
      fireEvent.change(screen.getByPlaceholderText('Reps'), { target: { value: '10' } })
      fireEvent.click(screen.getByText(/Log/))
      expect(onAdd).toHaveBeenCalledWith<[Weight, number, number, undefined]>(
        { kind: 'stacked', base: 30, added: 2.5 }, 10, expect.any(Number), undefined,
      )
    })

    it('falls back to normal parse when added field is empty', () => {
      const onAdd = vi.fn()
      render(<SetLogger {...defaultProps} onAdd={onAdd} />)
      fireEvent.change(screen.getByPlaceholderText('Weight'), { target: { value: '30' } })
      fireEvent.change(screen.getByPlaceholderText('Reps'), { target: { value: '10' } })
      fireEvent.click(screen.getByText(/Log/))
      expect(onAdd).toHaveBeenCalledWith<[Weight, number, number, undefined]>(
        { kind: 'single', value: 30 }, 10, expect.any(Number), undefined,
      )
    })
  })

  describe('segmented control', () => {
    it('shows both Quick and Individual segments always', () => {
      render(<SetLogger {...defaultProps} />)
      expect(screen.getByText('Quick')).toBeInTheDocument()
      expect(screen.getByText('Individual')).toBeInTheDocument()
    })

    it('switches to individual mode and back via segments', () => {
      render(<SetLogger {...defaultProps} />)
      fireEvent.click(screen.getByText('Individual'))
      expect(screen.getByRole('button', { name: /Add Set/ })).toBeInTheDocument()
      fireEvent.click(screen.getByText('Quick'))
      expect(screen.getByRole('button', { name: /Log/ })).toBeInTheDocument()
    })
  })

  describe('individual mode prefill', () => {
    it('retains weight and reps after first set is logged in individual mode', () => {
      const onAdd = vi.fn()
      render(<SetLogger {...defaultProps} onAdd={onAdd} />)

      fireEvent.click(screen.getByText('Individual'))
      fireEvent.change(screen.getByPlaceholderText('Weight'), { target: { value: '80' } })
      fireEvent.change(screen.getByPlaceholderText('Reps'), { target: { value: '10' } })
      fireEvent.click(screen.getByText('Add Set'))

      expect(screen.getByPlaceholderText('Weight')).toHaveValue('80')
      expect(screen.getByPlaceholderText('Reps')).toHaveValue(10)
    })
  })

  describe('preset from last', () => {
    const lastSets = [{ weight: { kind: 'single' as const, value: 60 }, reps: 10 }]

    it('shows preset button when lastSets is non-null', () => {
      render(<SetLogger {...defaultProps} lastSets={lastSets} />)
      expect(screen.getByLabelText('Preset from last session')).toBeInTheDocument()
    })

    it('hides preset button when lastSets is null', () => {
      render(<SetLogger {...defaultProps} lastSets={null} />)
      expect(screen.queryByLabelText('Preset from last session')).not.toBeInTheDocument()
    })

    it('fills weight and reps on preset click (single weight)', () => {
      render(<SetLogger {...defaultProps} lastSets={lastSets} />)
      fireEvent.click(screen.getByLabelText('Preset from last session'))
      expect(screen.getByPlaceholderText('Weight')).toHaveValue('60')
      expect(screen.getByPlaceholderText('Reps')).toHaveValue(10)
    })

    it('fills RPE when prior set has RPE', () => {
      const setsWithRpe = [{ weight: { kind: 'single' as const, value: 60 }, reps: 10, rpe: 8 }]
      render(<SetLogger {...defaultProps} lastSets={setsWithRpe} />)
      fireEvent.click(screen.getByLabelText('Preset from last session'))
      expect(screen.getByPlaceholderText('RPE (1-10)')).toHaveValue(8)
    })

    it('leaves RPE empty when prior set has no RPE', () => {
      render(<SetLogger {...defaultProps} lastSets={lastSets} />)
      fireEvent.click(screen.getByLabelText('Preset from last session'))
      expect(screen.getByPlaceholderText('RPE (1-10)')).toHaveValue(null)
    })

    it('fills stacked weight into weight and add fields', () => {
      const stackedSets = [{ weight: { kind: 'stacked' as const, base: 40, added: 5 }, reps: 8 }]
      render(<SetLogger {...defaultProps} lastSets={stackedSets} />)
      fireEvent.click(screen.getByLabelText('Preset from last session'))
      expect(screen.getByPlaceholderText('Weight')).toHaveValue('40')
      expect(screen.getByPlaceholderText('+add')).toHaveValue('5')
    })

    it('fills bilateral weight as 2x notation', () => {
      const bilateralSets = [{ weight: { kind: 'bilateral' as const, perSide: 15 }, reps: 12 }]
      render(<SetLogger {...defaultProps} lastSets={bilateralSets} />)
      fireEvent.click(screen.getByLabelText('Preset from last session'))
      expect(screen.getByPlaceholderText('Weight')).toHaveValue('2x15')
    })

    it('does not auto-submit after preset click', () => {
      const onAdd = vi.fn()
      render(<SetLogger {...defaultProps} lastSets={lastSets} onAdd={onAdd} />)
      fireEvent.click(screen.getByLabelText('Preset from last session'))
      expect(onAdd).not.toHaveBeenCalled()
    })
  })

  describe('scroll on focus', () => {
    beforeEach(() => {
      Element.prototype.scrollIntoView = vi.fn()
    })

    it('calls scrollIntoView on weight input focus', async () => {
      vi.useFakeTimers()
      render(<SetLogger {...defaultProps} />)
      fireEvent.focus(screen.getByPlaceholderText('Weight'))
      vi.advanceTimersByTime(300)
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' })
      vi.useRealTimers()
    })

    it('calls scrollIntoView on reps input focus', async () => {
      vi.useFakeTimers()
      render(<SetLogger {...defaultProps} />)
      fireEvent.focus(screen.getByPlaceholderText('Reps'))
      vi.advanceTimersByTime(300)
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' })
      vi.useRealTimers()
    })
  })
})
