import { describe, it, expect } from 'vitest'
import { findNextIncomplete } from './ActiveSessionScreen'

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
