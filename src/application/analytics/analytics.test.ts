import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { TrainingDatabase } from '@infrastructure/db/database'
import { DexieTrainingSessionRepository } from '@infrastructure/sessions/DexieTrainingSessionRepository'
import { DexieMuscleGroupRepository } from '@infrastructure/exercises/DexieMuscleGroupRepository'
import type { TrainingSession } from '@domain/sessions/TrainingSession'
import { getExerciseProgression } from './getExerciseProgression'
import { getMuscleGroupVolume } from './getMuscleGroupVolume'
import { getSessionSummaries } from './getSessionSummaries'
import { getLastUsedByExercise } from './getLastUsedByExercise'

let sessionRepo: DexieTrainingSessionRepository
let muscleGroupRepo: DexieMuscleGroupRepository

beforeEach(() => {
  const db = new TrainingDatabase({ indexedDB: new IDBFactory(), IDBKeyRange })
  sessionRepo = new DexieTrainingSessionRepository(db)
  muscleGroupRepo = new DexieMuscleGroupRepository(db)
})

function makeSession(overrides: Partial<TrainingSession> = {}): TrainingSession {
  const base: TrainingSession = {
    id: 'session-1',
    planId: 'plan-1',
    planName: 'Push',
    status: 'completed',
    startedAt: new Date('2024-01-01'),
    completedAt: new Date('2024-01-01'),
    entries: [],
  }
  return { ...base, ...overrides }
}

describe('getExerciseProgression', () => {
  it('returns empty array when no sessions have the exercise', async () => {
    await sessionRepo.save(makeSession({
      entries: [{ muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-other', sets: [{ weight: { kind: 'single', value: 50 }, reps: 10 }] }],
    }))

    const result = await getExerciseProgression(sessionRepo, 'ex-bench')
    expect(result).toHaveLength(0)
  })

  it('returns one point per session with max weight (single)', async () => {
    await sessionRepo.save(makeSession({
      id: 's1',
      completedAt: new Date('2024-01-01'),
      entries: [{
        muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench',
        sets: [
          { weight: { kind: 'single', value: 80 }, reps: 10 },
          { weight: { kind: 'single', value: 85 }, reps: 8 },
        ],
      }],
    }))
    await sessionRepo.save(makeSession({
      id: 's2',
      completedAt: new Date('2024-01-08'),
      entries: [{
        muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench',
        sets: [{ weight: { kind: 'single', value: 90 }, reps: 8 }],
      }],
    }))

    const result = await getExerciseProgression(sessionRepo, 'ex-bench')
    expect(result).toHaveLength(2)
    expect(result[0].weight).toBe(85)
    expect(result[0].weightUnit).toBe('kg')
    expect(result[0].sets).toHaveLength(2)
    expect(result[1].weight).toBe(90)
    expect(result[1].sets).toHaveLength(1)
  })

  it('normalizes bilateral weight to perSide with kg/side unit', async () => {
    await sessionRepo.save(makeSession({
      entries: [{
        muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-curl',
        sets: [{ weight: { kind: 'bilateral', perSide: 15 }, reps: 12 }],
      }],
    }))

    const result = await getExerciseProgression(sessionRepo, 'ex-curl')
    expect(result[0].weight).toBe(15)
    expect(result[0].weightUnit).toBe('kg/side')
  })

  it('normalizes stacked weight to base + added', async () => {
    await sessionRepo.save(makeSession({
      entries: [{
        muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-cable',
        sets: [{ weight: { kind: 'stacked', base: 50, added: 10 }, reps: 15 }],
      }],
    }))

    const result = await getExerciseProgression(sessionRepo, 'ex-cable')
    expect(result[0].weight).toBe(60)
    expect(result[0].weightUnit).toBe('kg')
  })

  it('caps results at 20 most recent sessions', async () => {
    for (let i = 0; i < 25; i++) {
      await sessionRepo.save(makeSession({
        id: `s-${i}`,
        completedAt: new Date(`2024-01-${String(i + 1).padStart(2, '0')}`),
        entries: [{
          muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench',
          sets: [{ weight: { kind: 'single', value: 80 + i }, reps: 8 }],
        }],
      }))
    }

    const result = await getExerciseProgression(sessionRepo, 'ex-bench')
    expect(result).toHaveLength(20)
    // Should be the 20 most recent (indices 5..24, weights 85..104)
    expect(result[0].weight).toBe(85)
    expect(result[19].weight).toBe(104)
  })

  it('returns points sorted by date ascending', async () => {
    await sessionRepo.save(makeSession({
      id: 's2', completedAt: new Date('2024-02-01'),
      entries: [{ muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench', sets: [{ weight: { kind: 'single', value: 90 }, reps: 8 }] }],
    }))
    await sessionRepo.save(makeSession({
      id: 's1', completedAt: new Date('2024-01-01'),
      entries: [{ muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench', sets: [{ weight: { kind: 'single', value: 80 }, reps: 10 }] }],
    }))

    const result = await getExerciseProgression(sessionRepo, 'ex-bench')
    expect(result[0].weight).toBe(80)
    expect(result[1].weight).toBe(90)
  })

  it('computes average RPE for a session with RPE sets', async () => {
    await sessionRepo.save(makeSession({
      entries: [{
        muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench',
        sets: [
          { weight: { kind: 'single', value: 80 }, reps: 10, rpe: 7 },
          { weight: { kind: 'single', value: 80 }, reps: 10, rpe: 9 },
        ],
      }],
    }))

    const result = await getExerciseProgression(sessionRepo, 'ex-bench')
    expect(result[0].avgRpe).toBe(8)
  })

  it('omits avgRpe when no sets have RPE', async () => {
    await sessionRepo.save(makeSession({
      entries: [{
        muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench',
        sets: [{ weight: { kind: 'single', value: 80 }, reps: 10 }],
      }],
    }))

    const result = await getExerciseProgression(sessionRepo, 'ex-bench')
    expect(result[0].avgRpe).toBeUndefined()
  })

  it('ignores sets without RPE when computing average', async () => {
    await sessionRepo.save(makeSession({
      entries: [{
        muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench',
        sets: [
          { weight: { kind: 'single', value: 80 }, reps: 10, rpe: 6 },
          { weight: { kind: 'single', value: 80 }, reps: 10 },
        ],
      }],
    }))

    const result = await getExerciseProgression(sessionRepo, 'ex-bench')
    expect(result[0].avgRpe).toBe(6)
  })

  it('computes average reps across all sets in a session', async () => {
    await sessionRepo.save(makeSession({
      entries: [{
        muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench',
        sets: [
          { weight: { kind: 'single', value: 80 }, reps: 10 },
          { weight: { kind: 'single', value: 85 }, reps: 8 },
          { weight: { kind: 'single', value: 80 }, reps: 9 },
        ],
      }],
    }))

    const result = await getExerciseProgression(sessionRepo, 'ex-bench')
    expect(result[0].avgReps).toBe(9) // round((10+8+9)/3)
  })

  it('computes movedSum as sum of normalizedWeight × reps across all sets', async () => {
    await sessionRepo.save(makeSession({
      entries: [{
        muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench',
        sets: [
          { weight: { kind: 'single', value: 80 }, reps: 10 },
          { weight: { kind: 'single', value: 85 }, reps: 8 },
        ],
      }],
    }))

    const result = await getExerciseProgression(sessionRepo, 'ex-bench')
    expect(result[0].movedSum).toBe(80 * 10 + 85 * 8) // 800 + 680 = 1480
  })

  it('computes movedSum correctly for varying set counts', async () => {
    await sessionRepo.save(makeSession({
      entries: [{
        muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench',
        sets: [
          { weight: { kind: 'single', value: 100 }, reps: 5 },
          { weight: { kind: 'single', value: 100 }, reps: 5 },
          { weight: { kind: 'single', value: 100 }, reps: 5 },
        ],
      }],
    }))

    const result = await getExerciseProgression(sessionRepo, 'ex-bench')
    expect(result[0].movedSum).toBe(1500)
  })

  it('normalizes bilateral weight for movedSum', async () => {
    await sessionRepo.save(makeSession({
      entries: [{
        muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-curl',
        sets: [{ weight: { kind: 'bilateral', perSide: 15 }, reps: 12 }],
      }],
    }))

    const result = await getExerciseProgression(sessionRepo, 'ex-curl')
    expect(result[0].movedSum).toBe(15 * 12) // perSide value used
  })

  it('normalizes stacked weight for movedSum', async () => {
    await sessionRepo.save(makeSession({
      entries: [{
        muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-cable',
        sets: [{ weight: { kind: 'stacked', base: 50, added: 10 }, reps: 15 }],
      }],
    }))

    const result = await getExerciseProgression(sessionRepo, 'ex-cable')
    expect(result[0].movedSum).toBe(60 * 15)
  })

  it('returns movedSum of 0 when sets have zero reps', async () => {
    await sessionRepo.save(makeSession({
      entries: [{
        muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench',
        sets: [{ weight: { kind: 'single', value: 80 }, reps: 0 }],
      }],
    }))

    const result = await getExerciseProgression(sessionRepo, 'ex-bench')
    expect(result[0].movedSum).toBe(0)
  })

  it('returns all sessions when limit is Infinity', async () => {
    for (let i = 0; i < 25; i++) {
      await sessionRepo.save(makeSession({
        id: `s-${i}`,
        completedAt: new Date(`2024-01-${String(i + 1).padStart(2, '0')}`),
        entries: [{
          muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench',
          sets: [{ weight: { kind: 'single', value: 80 + i }, reps: 8 }],
        }],
      }))
    }

    const result = await getExerciseProgression(sessionRepo, 'ex-bench', Infinity)
    expect(result).toHaveLength(25)
  })
})

describe('getMuscleGroupVolume', () => {
  beforeEach(async () => {
    await muscleGroupRepo.save({ id: 'mg-chest', name: 'Chest' })
    await muscleGroupRepo.save({ id: 'mg-back', name: 'Back' })
    await muscleGroupRepo.save({ id: 'mg-legs', name: 'Legs' })
  })

  it('returns empty array when no sessions', async () => {
    const result = await getMuscleGroupVolume(sessionRepo, muscleGroupRepo)
    expect(result).toHaveLength(0)
  })

  it('aggregates set counts per muscle group across sessions', async () => {
    await sessionRepo.save(makeSession({
      id: 's1',
      entries: [
        { muscleGroupId: 'mg-chest', exerciseDefinitionId: 'ex-bench', sets: [{ weight: { kind: 'single', value: 80 }, reps: 10 }, { weight: { kind: 'single', value: 80 }, reps: 10 }] },
        { muscleGroupId: 'mg-back', exerciseDefinitionId: 'ex-row', sets: [{ weight: { kind: 'single', value: 60 }, reps: 12 }] },
      ],
    }))
    await sessionRepo.save(makeSession({
      id: 's2',
      entries: [
        { muscleGroupId: 'mg-chest', exerciseDefinitionId: 'ex-bench', sets: [{ weight: { kind: 'single', value: 80 }, reps: 10 }] },
      ],
    }))

    const result = await getMuscleGroupVolume(sessionRepo, muscleGroupRepo)
    const chest = result.find(v => v.muscleGroupId === 'mg-chest')!
    const back = result.find(v => v.muscleGroupId === 'mg-back')!
    expect(chest.setCount).toBe(3)
    expect(chest.muscleGroupName).toBe('Chest')
    expect(back.setCount).toBe(1)
    expect(back.muscleGroupName).toBe('Back')
  })

  it('sorts by set count descending', async () => {
    await sessionRepo.save(makeSession({
      entries: [
        { muscleGroupId: 'mg-back', exerciseDefinitionId: 'ex-row', sets: [{ weight: { kind: 'single', value: 60 }, reps: 12 }, { weight: { kind: 'single', value: 60 }, reps: 12 }, { weight: { kind: 'single', value: 60 }, reps: 12 }] },
        { muscleGroupId: 'mg-chest', exerciseDefinitionId: 'ex-bench', sets: [{ weight: { kind: 'single', value: 80 }, reps: 10 }] },
      ],
    }))

    const result = await getMuscleGroupVolume(sessionRepo, muscleGroupRepo)
    expect(result[0].muscleGroupId).toBe('mg-back')
    expect(result[1].muscleGroupId).toBe('mg-chest')
  })

  it('excludes muscle groups with zero sets', async () => {
    await sessionRepo.save(makeSession({
      entries: [
        { muscleGroupId: 'mg-chest', exerciseDefinitionId: 'ex-bench', sets: [{ weight: { kind: 'single', value: 80 }, reps: 10 }] },
      ],
    }))

    const result = await getMuscleGroupVolume(sessionRepo, muscleGroupRepo)
    expect(result.find(v => v.muscleGroupId === 'mg-legs')).toBeUndefined()
    expect(result.find(v => v.muscleGroupId === 'mg-back')).toBeUndefined()
  })
})

describe('getSessionSummaries', () => {
  it('returns empty array when no completed sessions', async () => {
    const result = await getSessionSummaries(sessionRepo)
    expect(result).toHaveLength(0)
  })

  it('maps sessions to summary items correctly', async () => {
    await sessionRepo.save(makeSession({
      id: 's1',
      planName: 'Push Day',
      completedAt: new Date('2024-03-01'),
      entries: [
        { muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench', sets: [{ weight: { kind: 'single', value: 80 }, reps: 10 }] },
        { muscleGroupId: 'mg-2', exerciseDefinitionId: 'ex-shoulder', sets: [] },
      ],
    }))

    const result = await getSessionSummaries(sessionRepo)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('s1')
    expect(result[0].planName).toBe('Push Day')
    expect(result[0].exerciseCount).toBe(1) // only entries with sets
    expect(result[0].date).toEqual(new Date('2024-03-01'))
  })

  it('sorts sessions newest first', async () => {
    await sessionRepo.save(makeSession({ id: 's1', completedAt: new Date('2024-01-01'), entries: [] }))
    await sessionRepo.save(makeSession({ id: 's2', completedAt: new Date('2024-03-01'), entries: [] }))
    await sessionRepo.save(makeSession({ id: 's3', completedAt: new Date('2024-02-01'), entries: [] }))

    const result = await getSessionSummaries(sessionRepo)
    expect(result[0].id).toBe('s2')
    expect(result[1].id).toBe('s3')
    expect(result[2].id).toBe('s1')
  })
})

describe('getLastUsedByExercise', () => {
  it('returns empty object when no sessions', async () => {
    const result = await getLastUsedByExercise(sessionRepo)
    expect(result).toEqual({})
  })

  it('returns last-used weight, reps, and sets per exercise', async () => {
    const sets = [{ weight: { kind: 'single' as const, value: 80 }, reps: 10 }]
    await sessionRepo.save(makeSession({
      id: 's1',
      completedAt: new Date('2024-01-01'),
      entries: [{ muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench', sets }],
    }))

    const result = await getLastUsedByExercise(sessionRepo)
    expect(result['ex-bench'].weight).toBe(80)
    expect(result['ex-bench'].reps).toBe(10)
    expect(result['ex-bench'].sets).toHaveLength(1)
    expect(result['ex-bench'].sets[0].reps).toBe(10)
  })

  it('picks the most recent session for each exercise', async () => {
    await sessionRepo.save(makeSession({
      id: 's1',
      startedAt: new Date('2024-01-01'),
      completedAt: new Date('2024-01-01'),
      entries: [{ muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench', sets: [{ weight: { kind: 'single', value: 80 }, reps: 10 }] }],
    }))
    await sessionRepo.save(makeSession({
      id: 's2',
      startedAt: new Date('2024-02-01'),
      completedAt: new Date('2024-02-01'),
      entries: [{ muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench', sets: [{ weight: { kind: 'single', value: 90 }, reps: 8 }] }],
    }))

    const result = await getLastUsedByExercise(sessionRepo)
    expect(result['ex-bench'].weight).toBe(90)
    expect(result['ex-bench'].reps).toBe(8)
  })

  it('picks the max-weight set within the most recent session', async () => {
    await sessionRepo.save(makeSession({
      entries: [{
        muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench',
        sets: [
          { weight: { kind: 'single', value: 80 }, reps: 10 },
          { weight: { kind: 'single', value: 90 }, reps: 6 },
          { weight: { kind: 'single', value: 85 }, reps: 8 },
        ],
      }],
    }))

    const result = await getLastUsedByExercise(sessionRepo)
    expect(result['ex-bench'].weight).toBe(90)
    expect(result['ex-bench'].reps).toBe(6)
  })

  it('handles bilateral and stacked weight normalization', async () => {
    await sessionRepo.save(makeSession({
      id: 's1',
      entries: [
        { muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-curl', sets: [{ weight: { kind: 'bilateral', perSide: 15 }, reps: 12 }] },
        { muscleGroupId: 'mg-2', exerciseDefinitionId: 'ex-cable', sets: [{ weight: { kind: 'stacked', base: 50, added: 10 }, reps: 15 }] },
      ],
    }))

    const result = await getLastUsedByExercise(sessionRepo)
    expect(result['ex-curl'].weight).toBe(15)
    expect(result['ex-curl'].weightUnit).toBe('kg/side')
    expect(result['ex-curl'].reps).toBe(12)
    expect(result['ex-cable'].weight).toBe(60)
    expect(result['ex-cable'].weightUnit).toBe('kg')
    expect(result['ex-cable'].reps).toBe(15)
  })

  it('omits exercises with no sets', async () => {
    await sessionRepo.save(makeSession({
      entries: [{ muscleGroupId: 'mg-1', exerciseDefinitionId: 'ex-bench', sets: [] }],
    }))

    const result = await getLastUsedByExercise(sessionRepo)
    expect(result['ex-bench']).toBeUndefined()
  })
})
