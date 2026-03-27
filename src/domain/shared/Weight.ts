export type WeightUnit = 'kg' | 'lbs'

export interface Weight {
  readonly value: number
  readonly unit: WeightUnit
}

export function createWeight(value: number, unit: WeightUnit): Weight {
  if (value < 0) throw new Error('Weight value must be non-negative')
  return { value, unit }
}

export function toKg(weight: Weight): number {
  return weight.unit === 'kg' ? weight.value : weight.value * 0.453592
}
