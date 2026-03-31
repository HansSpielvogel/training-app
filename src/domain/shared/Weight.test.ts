import { describe, it, expect } from 'vitest'
import { parseWeight } from './Weight'

describe('parseWeight', () => {
  it('parses single weight', () => {
    expect(parseWeight('22.5')).toEqual({ kind: 'single', value: 22.5 })
  })

  it('parses integer single weight', () => {
    expect(parseWeight('100')).toEqual({ kind: 'single', value: 100 })
  })

  it('parses negative single (assisted exercise)', () => {
    expect(parseWeight('-12.5')).toEqual({ kind: 'single', value: -12.5 })
  })

  it('parses bilateral with x', () => {
    expect(parseWeight('2x15')).toEqual({ kind: 'bilateral', perSide: 15 })
  })

  it('parses bilateral with ×', () => {
    expect(parseWeight('2×15')).toEqual({ kind: 'bilateral', perSide: 15 })
  })

  it('parses bilateral with decimal', () => {
    expect(parseWeight('2x22.5')).toEqual({ kind: 'bilateral', perSide: 22.5 })
  })

  it('parses stacked weight', () => {
    expect(parseWeight('31.5+2.3')).toEqual({ kind: 'stacked', base: 31.5, added: 2.3 })
  })

  it('parses stacked with integers', () => {
    expect(parseWeight('15+1.25')).toEqual({ kind: 'stacked', base: 15, added: 1.25 })
  })

  it('trims whitespace', () => {
    expect(parseWeight('  22.5  ')).toEqual({ kind: 'single', value: 22.5 })
  })

  it('throws on invalid input', () => {
    expect(() => parseWeight('abc')).toThrow()
  })

  it('throws on multi-plus expression', () => {
    expect(() => parseWeight('1+2+3')).toThrow()
  })

  it('throws on empty string', () => {
    expect(() => parseWeight('')).toThrow()
  })

  it('parses single weight with comma decimal', () => {
    expect(parseWeight('22,5')).toEqual({ kind: 'single', value: 22.5 })
  })

  it('parses stacked weight with comma decimals', () => {
    expect(parseWeight('31,5+2,3')).toEqual({ kind: 'stacked', base: 31.5, added: 2.3 })
  })

  it('parses bilateral with comma decimal', () => {
    expect(parseWeight('2x22,5')).toEqual({ kind: 'bilateral', perSide: 22.5 })
  })
})
