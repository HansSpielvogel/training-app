import { describe, it, expect } from 'vitest'
import { computeRotationSuggestion } from './computeRotationSuggestion'
import type { TrainingSession } from '@domain/sessions'

function makeSession(exerciseIds: (string | undefined)[], muscleGroupId = 'mg-1'): TrainingSession {
  return {
    id: crypto.randomUUID(),
    planId: 'plan-1',
    planName: 'Test Plan',
    status: 'completed',
    startedAt: new Date(),
    completedAt: new Date(),
    entries: exerciseIds.map((exerciseDefinitionId) => ({
      muscleGroupId,
      exerciseDefinitionId,
      sets: [],
    })),
  }
}

describe('computeRotationSuggestion', () => {
  it('returns null for empty history', () => {
    expect(computeRotationSuggestion('mg-1', [])).toBeNull()
  })

  it('returns null when only 1 distinct exercise in history', () => {
    const sessions = [makeSession(['ex-a']), makeSession(['ex-a']), makeSession(['ex-a'])]
    expect(computeRotationSuggestion('mg-1', sessions)).toBeNull()
  })

  it('returns null when 2 equally-used non-recent candidates', () => {
    // newest-first: ex-c, ex-a, ex-b
    // most recent = ex-c (excl); candidates ex-a(1), ex-b(1) → all equal → null
    const sessions = [makeSession(['ex-c']), makeSession(['ex-a']), makeSession(['ex-b'])]
    expect(computeRotationSuggestion('mg-1', sessions)).toBeNull()
  })

  it('suggests least-used when 2 unequally-used exercises', () => {
    // newest-first: ex-a, ex-b, ex-a → ex-a(2) most recent, ex-b(1) only candidate → suggest ex-b
    const sessions = [makeSession(['ex-a']), makeSession(['ex-b']), makeSession(['ex-a'])]
    expect(computeRotationSuggestion('mg-1', sessions)).toBe('ex-b')
  })

  it('tie-breaks by recency when multiple candidates tie for minimum count', () => {
    // newest-first: ex-a, ex-b, ex-c, ex-d, ex-b
    // entries = [ex-a, ex-b, ex-c, ex-d, ex-b]
    // counts: ex-a=1 (most recent, excl), ex-b=2, ex-c=1, ex-d=1
    // not all equal; leastUsed = [ex-c, ex-d] — tie for min(1)
    // ex-c first occurrence index 2, ex-d index 3 → ex-d used longer ago → suggest ex-d
    const sessions = [
      makeSession(['ex-a']),
      makeSession(['ex-b']),
      makeSession(['ex-c']),
      makeSession(['ex-d']),
      makeSession(['ex-b']),
    ]
    expect(computeRotationSuggestion('mg-1', sessions)).toBe('ex-d')
  })

  it('full 5-session case: suggests least-used non-recent exercise', () => {
    // newest-first: ex-c, ex-a, ex-b, ex-a, ex-c
    // counts: ex-c=2 (most recent, excl), ex-a=2, ex-b=1
    // not all equal; leastUsed = [ex-b] → suggest ex-b
    const sessions = [
      makeSession(['ex-c']),
      makeSession(['ex-a']),
      makeSession(['ex-b']),
      makeSession(['ex-a']),
      makeSession(['ex-c']),
    ]
    expect(computeRotationSuggestion('mg-1', sessions)).toBe('ex-b')
  })

  it('only considers last 5 sessions with the muscle group', () => {
    // 6 sessions; 6th (oldest) introduces ex-c which should be ignored
    // After taking 5: ex-a(3), ex-b(2); most recent=ex-a; candidate ex-b → suggest ex-b
    const sessions = [
      makeSession(['ex-a']),
      makeSession(['ex-b']),
      makeSession(['ex-a']),
      makeSession(['ex-b']),
      makeSession(['ex-a']),
      makeSession(['ex-c']),
    ]
    expect(computeRotationSuggestion('mg-1', sessions)).toBe('ex-b')
  })

  it('ignores sessions for other muscle groups', () => {
    const sessions = [makeSession(['ex-a'], 'mg-1'), makeSession(['ex-other'], 'mg-2')]
    expect(computeRotationSuggestion('mg-1', sessions)).toBeNull()
  })
})
