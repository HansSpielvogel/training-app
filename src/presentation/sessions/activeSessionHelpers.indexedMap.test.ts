import { describe, it, expect } from 'vitest'
import { remapIndexedMap, shiftIndexedMapAfterRemoval } from './activeSessionHelpers'

describe('remapIndexedMap', () => {
  it('remaps the moved entry and displaces entries between from and to (moving down)', () => {
    // [a,b,c,d] → drag index 0 to index 2 → [b,c,a,d]
    const map = { 0: 'a', 1: 'b', 2: 'c', 3: 'd' }
    expect(remapIndexedMap(map, 0, 2)).toEqual({ 0: 'b', 1: 'c', 2: 'a', 3: 'd' })
  })

  it('remaps the moved entry and displaces entries between from and to (moving up)', () => {
    // [a,b,c,d] → drag index 2 to index 0 → [c,a,b,d]
    const map = { 0: 'a', 1: 'b', 2: 'c', 3: 'd' }
    expect(remapIndexedMap(map, 2, 0)).toEqual({ 0: 'c', 1: 'a', 2: 'b', 3: 'd' })
  })

  it('returns same map when fromIndex equals toIndex', () => {
    const map = { 0: 'a', 1: 'b' }
    expect(remapIndexedMap(map, 1, 1)).toEqual({ 0: 'a', 1: 'b' })
  })

  it('handles sparse map — missing indices are simply absent from output', () => {
    // Only indices 0 and 2 have data; moving 0 to 2: [a,?,c] → [?,c,a]
    const map = { 0: 'a', 2: 'c' }
    expect(remapIndexedMap(map, 0, 2)).toEqual({ 1: 'c', 2: 'a' })
  })
})

describe('shiftIndexedMapAfterRemoval', () => {
  it('drops the removed entry and shifts all higher indices down by 1', () => {
    const map = { 0: 'a', 1: 'b', 2: 'c', 3: 'd' }
    expect(shiftIndexedMapAfterRemoval(map, 1)).toEqual({ 0: 'a', 1: 'c', 2: 'd' })
  })

  it('removing index 0 shifts all remaining entries', () => {
    const map = { 0: 'a', 1: 'b', 2: 'c' }
    expect(shiftIndexedMapAfterRemoval(map, 0)).toEqual({ 0: 'b', 1: 'c' })
  })

  it('removing the last entry only drops it', () => {
    const map = { 0: 'a', 1: 'b', 2: 'c' }
    expect(shiftIndexedMapAfterRemoval(map, 2)).toEqual({ 0: 'a', 1: 'b' })
  })

  it('handles sparse map — indices absent from map are simply absent from output', () => {
    // Only indices 0 and 2 have data; remove index 1: index 2 shifts to 1
    const map = { 0: 'a', 2: 'c' }
    expect(shiftIndexedMapAfterRemoval(map, 1)).toEqual({ 0: 'a', 1: 'c' })
  })
})
