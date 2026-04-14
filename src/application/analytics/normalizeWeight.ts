import type { Weight } from '@domain/shared/Weight'

export function normalizeWeight(weight: Weight): { value: number; unit: string } {
  switch (weight.kind) {
    case 'single': return { value: weight.value, unit: 'kg' }
    case 'bilateral': return { value: weight.perSide, unit: 'kg/side' }
    case 'stacked': return { value: weight.base + weight.added, unit: 'kg' }
  }
}
