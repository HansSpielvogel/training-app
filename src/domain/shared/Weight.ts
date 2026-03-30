export type Weight =
  | { kind: 'single'; value: number }
  | { kind: 'bilateral'; perSide: number }
  | { kind: 'stacked'; base: number; added: number }

export function parseWeight(input: string): Weight {
  const s = input.trim()

  const bilateral = s.match(/^2[x×](\d+(?:\.\d+)?)$/i)
  if (bilateral) return { kind: 'bilateral', perSide: parseFloat(bilateral[1]) }

  const stacked = s.match(/^(\d+(?:\.\d+)?)\+(\d+(?:\.\d+)?)$/)
  if (stacked) return { kind: 'stacked', base: parseFloat(stacked[1]), added: parseFloat(stacked[2]) }

  const single = s.match(/^-?\d+(?:\.\d+)?$/)
  if (single) return { kind: 'single', value: parseFloat(s) }

  throw new Error(`Invalid weight notation: "${input}"`)
}
