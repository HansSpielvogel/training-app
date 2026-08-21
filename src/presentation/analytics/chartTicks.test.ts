import { describe, it, expect } from 'vitest'
import { computeNiceTicks } from './chartTicks'

describe('computeNiceTicks', () => {
  it('returns rounded intermediate ticks for a wide range', () => {
    const ticks = computeNiceTicks(3, 91, 4)
    expect(ticks.length).toBeGreaterThanOrEqual(3)
    expect(ticks[0]).toBeLessThanOrEqual(3)
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(91)
    for (const t of ticks) expect(Number.isFinite(t)).toBe(true)
  })

  it('produces readable ticks for a narrow range without duplicates', () => {
    const ticks = computeNiceTicks(45, 50, 4)
    const unique = new Set(ticks)
    expect(unique.size).toBe(ticks.length)
    expect(ticks[0]).toBeLessThanOrEqual(45)
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(50)
  })

  it('handles a zero-inclusive range', () => {
    const ticks = computeNiceTicks(0, 100, 5)
    expect(ticks[0]).toBe(0)
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(100)
  })

  it('handles a single-value range without dividing by zero', () => {
    const ticks = computeNiceTicks(50, 50, 4)
    expect(ticks).toEqual([50])
  })

  it('avoids ugly decimal steps for strength-training weight data', () => {
    const ticks = computeNiceTicks(20, 80, 4)
    for (const t of ticks) expect(t % 1).toBe(0)
  })
})
