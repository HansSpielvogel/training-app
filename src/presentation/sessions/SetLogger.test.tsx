import '@testing-library/jest-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SetLogger } from './SetLogger'
import type { Weight } from '@application/sessions'

const noop = () => {}
const defaultProps = {
  sets: [],
  lastSets: null,
  onAdd: noop,
  onRemoveLast: noop,
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
