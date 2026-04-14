import { describe, it, expect } from 'vitest'
import { formatLastWeight, formatLastSets } from './formatSets'
import type { SessionSet } from '@application/sessions'
import type { Weight } from '@application/sessions'

describe('formatLastWeight', () => {
  it('formats single weight', () => {
    const w: Weight = { kind: 'single', value: 22.5 }
    expect(formatLastWeight(w)).toBe('22.5 kg')
  })

  it('formats bilateral weight', () => {
    const w: Weight = { kind: 'bilateral', perSide: 15 }
    expect(formatLastWeight(w)).toBe('15 kg/side')
  })

  it('formats stacked weight with components', () => {
    const w: Weight = { kind: 'stacked', base: 31.5, added: 2.5 }
    expect(formatLastWeight(w)).toBe('31.5 +2.5 kg')
  })

  it('formats stacked weight for LH exercise with only added', () => {
    const w: Weight = { kind: 'stacked', base: 20, added: 10 }
    expect(formatLastWeight(w, 'Schulterdrücken LH')).toBe('LH +10 kg')
  })

  it('formats stacked weight normally when exercise does not end with LH', () => {
    const w: Weight = { kind: 'stacked', base: 31.5, added: 2.5 }
    expect(formatLastWeight(w, 'Beinpresse')).toBe('31.5 +2.5 kg')
  })
})

describe('formatLastSets', () => {
  it('returns empty string for empty array', () => {
    expect(formatLastSets([])).toBe('')
  })

  it('formats stacked sets collapsed using component notation', () => {
    const sets: SessionSet[] = [
      { weight: { kind: 'stacked', base: 31.5, added: 2.5 }, reps: 8 },
      { weight: { kind: 'stacked', base: 31.5, added: 2.5 }, reps: 8 },
      { weight: { kind: 'stacked', base: 31.5, added: 2.5 }, reps: 8 },
    ]
    expect(formatLastSets(sets)).toBe('31.5 +2.5 kg × 8 (3 sets)')
  })

  it('formats LH stacked sets with LH prefix', () => {
    const sets: SessionSet[] = [
      { weight: { kind: 'stacked', base: 20, added: 10 }, reps: 6 },
      { weight: { kind: 'stacked', base: 20, added: 10 }, reps: 6 },
    ]
    expect(formatLastSets(sets, 'Schulterdrücken LH')).toBe('LH +10 kg × 6 (2 sets)')
  })
})
