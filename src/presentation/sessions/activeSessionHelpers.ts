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

export function remapSingleIndex(idx: number, fromIndex: number, toIndex: number): number {
  if (idx === fromIndex) return toIndex
  if (fromIndex < toIndex && idx > fromIndex && idx <= toIndex) return idx - 1
  if (fromIndex > toIndex && idx >= toIndex && idx < fromIndex) return idx + 1
  return idx
}

export function remapIndexedMap<T>(map: Record<number, T>, fromIndex: number, toIndex: number): Record<number, T> {
  if (fromIndex === toIndex) return map
  const result: Record<number, T> = {}
  for (const key of Object.keys(map)) {
    const idx = Number(key)
    result[remapSingleIndex(idx, fromIndex, toIndex)] = map[idx]
  }
  return result
}

export function shiftIndexedMapAfterRemoval<T>(map: Record<number, T>, removedIndex: number): Record<number, T> {
  const result: Record<number, T> = {}
  for (const key of Object.keys(map)) {
    const idx = Number(key)
    if (idx === removedIndex) continue
    result[idx > removedIndex ? idx - 1 : idx] = map[idx]
  }
  return result
}

export function shiftSetAfterRemoval(set: Set<number>, removedIndex: number): Set<number> {
  const result = new Set<number>()
  for (const idx of set) {
    if (idx === removedIndex) continue
    result.add(idx > removedIndex ? idx - 1 : idx)
  }
  return result
}
