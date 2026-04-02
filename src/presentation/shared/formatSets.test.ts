import { describe, it, expect } from 'vitest'
import { formatSets } from './formatSets'
import type { SessionSet } from '@application/sessions'

function set(value: number, reps: number, rpe?: number): SessionSet {
  return { weight: { kind: 'single', value }, reps, ...(rpe !== undefined ? { rpe } : {}) }
}

describe('formatSets', () => {
  it('returns empty string for empty array', () => {
    expect(formatSets([])).toBe('')
  })

  it('formats a single set', () => {
    expect(formatSets([set(80, 10)])).toBe('80 kg × 10')
  })

  it('collapses identical sets into (N sets)', () => {
    expect(formatSets([set(80, 10), set(80, 10), set(80, 10)])).toBe('80 kg × 10 (3 sets)')
  })

  it('expands sets when weights differ', () => {
    expect(formatSets([set(80, 10), set(85, 8)])).toBe('80 kg × 10, 85 kg × 8')
  })

  it('expands sets when reps differ', () => {
    expect(formatSets([set(80, 10), set(80, 9), set(80, 8)])).toBe('80 kg × 10, 80 kg × 9, 80 kg × 8')
  })

  it('includes @rpe on single set', () => {
    expect(formatSets([set(80, 10, 8)])).toBe('80 kg × 10 @8')
  })

  it('includes @rpe in collapsed form when all rpe equal', () => {
    expect(formatSets([set(80, 10, 8), set(80, 10, 8)])).toBe('80 kg × 10 @8 (2 sets)')
  })

  it('omits rpe in collapsed form when rpe varies', () => {
    expect(formatSets([set(80, 10, 7), set(80, 10, 8)])).toBe('80 kg × 10 (2 sets)')
  })

  it('includes @rpe per set in expanded form', () => {
    expect(formatSets([set(80, 10, 8), set(85, 8, 9)])).toBe('80 kg × 10 @8, 85 kg × 8 @9')
  })

  it('formats bilateral weight correctly', () => {
    const s: SessionSet = { weight: { kind: 'bilateral', perSide: 15 }, reps: 12 }
    expect(formatSets([s])).toBe('15 kg/side × 12')
  })

  it('formats stacked weight correctly', () => {
    const s: SessionSet = { weight: { kind: 'stacked', base: 50, added: 10 }, reps: 15 }
    expect(formatSets([s])).toBe('60 kg × 15')
  })
})
