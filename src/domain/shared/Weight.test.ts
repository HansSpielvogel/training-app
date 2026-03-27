import { describe, it, expect } from 'vitest'
import { createWeight, toKg } from './Weight'

describe('Weight', () => {
  it('creates a valid weight in kg', () => {
    const w = createWeight(100, 'kg')
    expect(w.value).toBe(100)
    expect(w.unit).toBe('kg')
  })

  it('converts lbs to kg', () => {
    const w = createWeight(100, 'lbs')
    expect(toKg(w)).toBeCloseTo(45.3592, 3)
  })

  it('rejects negative values', () => {
    expect(() => createWeight(-1, 'kg')).toThrow('non-negative')
  })
})
