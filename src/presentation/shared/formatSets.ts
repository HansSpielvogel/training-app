import type { SetSnapshot } from '@application/analytics'
import type { Weight } from '@application/sessions'

function formatWeight(w: Weight): string {
  switch (w.kind) {
    case 'single': return `${w.value} kg`
    case 'bilateral': return `${w.perSide} kg/side`
    case 'stacked': return `${w.base + w.added} kg`
  }
}

export function formatLastWeight(weight: Weight, exerciseName?: string): string {
  switch (weight.kind) {
    case 'single': return `${weight.value} kg`
    case 'bilateral': return `${weight.perSide} kg/side`
    case 'stacked':
      if (exerciseName?.endsWith(' LH')) return `LH +${weight.added} kg`
      return `${weight.base} +${weight.added} kg`
  }
}

export function formatLastSets(sets: readonly SetSnapshot[], exerciseName?: string): string {
  if (sets.length === 0) return ''

  const weightStrs = sets.map(s => formatLastWeight(s.weight, exerciseName))
  const allSameWeight = weightStrs.every(w => w === weightStrs[0])
  const allSameReps = sets.every(s => s.reps === sets[0].reps)
  const allSameRpe = sets.every(s => s.rpe === sets[0].rpe)

  if (allSameWeight && allSameReps && sets.length > 1) {
    const rpeStr = (allSameRpe && sets[0].rpe !== undefined) ? ` @${sets[0].rpe}` : ''
    return `${weightStrs[0]} × ${sets[0].reps}${rpeStr} (${sets.length} sets)`
  }

  return sets.map((s, i) => {
    const rpeStr = s.rpe !== undefined ? ` @${s.rpe}` : ''
    return `${weightStrs[i]} × ${s.reps}${rpeStr}`
  }).join(', ')
}

export function formatSets(sets: readonly SetSnapshot[]): string {
  if (sets.length === 0) return ''

  const weightStrs = sets.map(s => formatWeight(s.weight))
  const allSameWeight = weightStrs.every(w => w === weightStrs[0])
  const allSameReps = sets.every(s => s.reps === sets[0].reps)
  const allSameRpe = sets.every(s => s.rpe === sets[0].rpe)

  if (allSameWeight && allSameReps && sets.length > 1) {
    const rpeStr = (allSameRpe && sets[0].rpe !== undefined) ? ` @${sets[0].rpe}` : ''
    return `${weightStrs[0]} × ${sets[0].reps}${rpeStr} (${sets.length} sets)`
  }

  return sets.map((s, i) => {
    const rpeStr = s.rpe !== undefined ? ` @${s.rpe}` : ''
    return `${weightStrs[i]} × ${s.reps}${rpeStr}`
  }).join(', ')
}
