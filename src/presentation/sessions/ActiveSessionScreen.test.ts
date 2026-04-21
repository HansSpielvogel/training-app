import { describe, it, expect } from 'vitest'
import { findNextIncomplete, findActiveEntry, remapDoneIndices } from './activeSessionHelpers'

describe('findNextIncomplete', () => {
  it('advances to next slot after finish button', () => {
    // slot 0 done, advance from 0 → next incomplete is 1
    expect(findNextIncomplete(0, new Set([0]), 3)).toBe(1)
  })

  it('advances to next slot after log-and-collapse', () => {
    // slot 1 done via collapse, advance from 1 → next incomplete is 2
    expect(findNextIncomplete(1, new Set([0, 1]), 3)).toBe(2)
  })

  it('skips already-done slots', () => {
    // slots 0 and 1 done, advance from 0 → next incomplete is 2
    expect(findNextIncomplete(0, new Set([0, 1]), 4)).toBe(2)
  })

  it('returns null when last slot is done', () => {
    expect(findNextIncomplete(2, new Set([0, 1, 2]), 3)).toBeNull()
  })

  it('returns null when no remaining slots after current', () => {
    expect(findNextIncomplete(2, new Set([2]), 3)).toBeNull()
  })
})

describe('findActiveEntry', () => {
  const entry = (sets: number, exId?: string) => ({
    sets: Array(sets).fill({}),
    exerciseDefinitionId: exId,
  })

  it('returns first entry with sets that is not done', () => {
    const entries = [entry(0), entry(2, 'ex-1'), entry(0)]
    expect(findActiveEntry(entries, new Set())).toBe(1)
  })

  it('returns first entry with exercise assigned that is not done', () => {
    const entries = [entry(0), entry(0, 'ex-1'), entry(0)]
    expect(findActiveEntry(entries, new Set())).toBe(1)
  })

  it('skips done entries', () => {
    const entries = [entry(2, 'ex-1'), entry(3, 'ex-2'), entry(0)]
    expect(findActiveEntry(entries, new Set([0]))).toBe(1)
  })

  it('returns null when all started entries are done', () => {
    const entries = [entry(2, 'ex-1'), entry(3, 'ex-2')]
    expect(findActiveEntry(entries, new Set([0, 1]))).toBeNull()
  })

  it('returns null when no entries have been started', () => {
    const entries = [entry(0), entry(0), entry(0)]
    expect(findActiveEntry(entries, new Set())).toBeNull()
  })
})

describe('remapDoneIndices', () => {
  it('returns same set when fromIndex equals toIndex', () => {
    const done = new Set([0, 2])
    expect(remapDoneIndices(done, 1, 1)).toBe(done)
  })

  it('remaps the moved entry index', () => {
    const done = new Set([0])
    expect(remapDoneIndices(done, 0, 2)).toEqual(new Set([2]))
  })

  it('shifts indices down when moving item down (from < to)', () => {
    // moving index 0 to index 2: entries [A,B,C,D] → [B,C,A,D]
    // done=[1] (B) → B was at 1, now at 0 (shifted down)
    const done = new Set([1])
    expect(remapDoneIndices(done, 0, 2)).toEqual(new Set([0]))
  })

  it('shifts indices up when moving item up (from > to)', () => {
    // moving index 2 to index 0: entries [A,B,C,D] → [C,A,B,D]
    // done=[1] (B) → B was at 1, now at 2 (shifted up)
    const done = new Set([1])
    expect(remapDoneIndices(done, 2, 0)).toEqual(new Set([2]))
  })

  it('correctly handles multiple done indices', () => {
    // moving index 0 to index 2: [A,B,C,D] → [B,C,A,D]
    // done=[0,1,3] → A→2, B→0, D→3
    const done = new Set([0, 1, 3])
    expect(remapDoneIndices(done, 0, 2)).toEqual(new Set([2, 0, 3]))
  })

  it('returns empty set when no done indices', () => {
    expect(remapDoneIndices(new Set(), 0, 2)).toEqual(new Set())
  })
})
