import { describe, it, expect } from 'vitest'
import { createSessionSet } from './TrainingSession'

describe('createSessionSet RPE validation', () => {
  const w = { kind: 'single' as const, value: 80 }

  it('accepts undefined rpe', () => {
    const set = createSessionSet(w, 10)
    expect(set.rpe).toBeUndefined()
  })

  it('accepts valid rpe 1', () => {
    expect(createSessionSet(w, 10, 1).rpe).toBe(1)
  })

  it('accepts valid rpe 10', () => {
    expect(createSessionSet(w, 10, 10).rpe).toBe(10)
  })

  it('rejects rpe 0', () => {
    expect(() => createSessionSet(w, 10, 0)).toThrow()
  })

  it('rejects rpe 11', () => {
    expect(() => createSessionSet(w, 10, 11)).toThrow()
  })

  it('rejects non-integer rpe', () => {
    expect(() => createSessionSet(w, 10, 7.5)).toThrow()
  })
})
