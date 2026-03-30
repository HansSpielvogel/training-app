import type { TrainingSession } from '@domain/sessions/TrainingSession'

export function computeRotationSuggestion(
  muscleGroupId: string,
  sessions: TrainingSession[],
): string | null {
  // Take last 5 sessions that have an entry for this muscle group
  const relevant = sessions
    .filter((s) => s.entries.some((e) => e.muscleGroupId === muscleGroupId && e.exerciseDefinitionId))
    .slice(0, 5)

  if (relevant.length === 0) return null

  // Flatten entries for this muscle group, newest session first
  const entries: string[] = []
  for (const session of relevant) {
    for (const entry of session.entries) {
      if (entry.muscleGroupId === muscleGroupId && entry.exerciseDefinitionId) {
        entries.push(entry.exerciseDefinitionId)
      }
    }
  }

  const distinct = [...new Set(entries)]
  if (distinct.length < 2) return null

  const mostRecentId = entries[0]

  const counts = new Map<string, number>()
  for (const id of entries) {
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }

  const candidates = distinct.filter((id) => id !== mostRecentId)
  if (candidates.length === 0) return null

  const candidateCounts = candidates.map((id) => counts.get(id) ?? 0)
  const minCount = Math.min(...candidateCounts)
  const maxCount = Math.max(...candidateCounts)

  // No suggestion when 2+ candidates are all equally used (no clear winner)
  if (candidates.length > 1 && minCount === maxCount) return null

  const leastUsed = candidates.filter((id) => (counts.get(id) ?? 0) === minCount)

  if (leastUsed.length === 1) return leastUsed[0]

  // Tie-break: prefer the one whose most recent usage is oldest
  // (= first occurrence at the highest index in the entries array, since entries are newest-first)
  let bestId = leastUsed[0]
  let bestIdx = entries.indexOf(bestId)

  for (const candidateId of leastUsed.slice(1)) {
    const idx = entries.indexOf(candidateId)
    if (idx > bestIdx) {
      bestIdx = idx
      bestId = candidateId
    }
  }

  return bestId
}
