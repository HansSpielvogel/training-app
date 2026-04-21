export function findNextIncomplete(current: number | null, doneIndices: Set<number>, total: number): number | null {
  const start = current !== null ? current + 1 : 0
  for (let i = start; i < total; i++) {
    if (!doneIndices.has(i)) return i
  }
  return null
}

export function findActiveEntry(entries: readonly { sets: readonly unknown[]; exerciseDefinitionId?: string }[], doneIndices: Set<number>): number | null {
  for (let i = 0; i < entries.length; i++) {
    if (doneIndices.has(i)) continue
    const e = entries[i]
    if (e.exerciseDefinitionId || e.sets.length > 0) return i
  }
  return null
}

export function remapDoneIndices(done: Set<number>, fromIndex: number, toIndex: number): Set<number> {
  if (fromIndex === toIndex) return done
  const result = new Set<number>()
  for (const idx of done) {
    if (idx === fromIndex) {
      result.add(toIndex)
    } else if (fromIndex < toIndex && idx > fromIndex && idx <= toIndex) {
      result.add(idx - 1)
    } else if (fromIndex > toIndex && idx >= toIndex && idx < fromIndex) {
      result.add(idx + 1)
    } else {
      result.add(idx)
    }
  }
  return result
}
