import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { TrainingDatabase } from '@infrastructure/db/database'
import { DexieTrainingSessionRepository } from '@infrastructure/sessions/DexieTrainingSessionRepository'
import { DexieTrainingPlanRepository } from '@infrastructure/planning/DexieTrainingPlanRepository'
import { DexieMuscleGroupRepository } from '@infrastructure/exercises/DexieMuscleGroupRepository'
import { createTrainingPlan, addPlanSlot } from '@application/planning'
import { startSession } from './startSession'
import { assignVariation } from './assignVariation'
import { addSet } from './addSet'
import { completeSession } from './completeSession'
import { getLastSetsForExercise } from './getLastSetsForExercise'

let sessionRepo: DexieTrainingSessionRepository
let planRepo: DexieTrainingPlanRepository

beforeEach(() => {
  const db = new TrainingDatabase({ indexedDB: new IDBFactory(), IDBKeyRange })
  sessionRepo = new DexieTrainingSessionRepository(db)
  planRepo = new DexieTrainingPlanRepository(db)
  const muscleGroupRepo = new DexieMuscleGroupRepository(db)
  // seed inline per test — shared setup below
  Object.assign(sessionRepo, { _db: db })
  Object.assign(planRepo, { _db: db })
  Object.assign(muscleGroupRepo, { _db: db })
})

async function seedPlan() {
  const db = (planRepo as unknown as { db: TrainingDatabase }).db
  const mgRepo = new DexieMuscleGroupRepository(db)
  await mgRepo.save({ id: 'mg-chest', name: 'Chest' })
  await createTrainingPlan(planRepo, 'Push')
  const [plan] = await planRepo.listPlans()
  await addPlanSlot(planRepo, plan.id, 'mg-chest')
  return plan
}

describe('getLastSetsForExercise', () => {
  it('returns null when no completed sessions', async () => {
    expect(await getLastSetsForExercise(sessionRepo, 'ex-bench')).toBeNull()
  })

  it('returns null when exercise was never used', async () => {
    const plan = await seedPlan()
    const s = await startSession(sessionRepo, planRepo, plan.id)
    await assignVariation(sessionRepo, s.id, 0, 'ex-incline')
    await addSet(sessionRepo, s.id, 0, { kind: 'single', value: 60 }, 10)
    await completeSession(sessionRepo, s.id)

    expect(await getLastSetsForExercise(sessionRepo, 'ex-bench')).toBeNull()
  })

  it('returns null when exercise was logged but with no sets', async () => {
    const plan = await seedPlan()
    const s = await startSession(sessionRepo, planRepo, plan.id)
    await assignVariation(sessionRepo, s.id, 0, 'ex-bench')
    // no sets added
    await completeSession(sessionRepo, s.id)

    expect(await getLastSetsForExercise(sessionRepo, 'ex-bench')).toBeNull()
  })

  it('returns sets from the most recent session where the exercise was used', async () => {
    const plan = await seedPlan()

    const s1 = await startSession(sessionRepo, planRepo, plan.id)
    await assignVariation(sessionRepo, s1.id, 0, 'ex-bench')
    await addSet(sessionRepo, s1.id, 0, { kind: 'single', value: 70 }, 12)
    await completeSession(sessionRepo, s1.id)

    const s2 = await startSession(sessionRepo, planRepo, plan.id)
    await assignVariation(sessionRepo, s2.id, 0, 'ex-bench')
    await addSet(sessionRepo, s2.id, 0, { kind: 'single', value: 80 }, 10)
    await addSet(sessionRepo, s2.id, 0, { kind: 'single', value: 82.5 }, 8)
    await completeSession(sessionRepo, s2.id)

    const result = await getLastSetsForExercise(sessionRepo, 'ex-bench')
    expect(result).toHaveLength(2)
    expect(result![0]).toEqual({ weight: { kind: 'single', value: 80 }, reps: 10 })
    expect(result![1]).toEqual({ weight: { kind: 'single', value: 82.5 }, reps: 8 })
  })

  it('ignores sessions where a different exercise was used', async () => {
    const plan = await seedPlan()

    const s1 = await startSession(sessionRepo, planRepo, plan.id)
    await assignVariation(sessionRepo, s1.id, 0, 'ex-bench')
    await addSet(sessionRepo, s1.id, 0, { kind: 'single', value: 80 }, 10)
    await completeSession(sessionRepo, s1.id)

    const s2 = await startSession(sessionRepo, planRepo, plan.id)
    await assignVariation(sessionRepo, s2.id, 0, 'ex-incline')
    await addSet(sessionRepo, s2.id, 0, { kind: 'single', value: 60 }, 12)
    await completeSession(sessionRepo, s2.id)

    // most recent session used ex-incline, not ex-bench → go back to s1
    const result = await getLastSetsForExercise(sessionRepo, 'ex-bench')
    expect(result).toHaveLength(1)
    expect(result![0].weight).toEqual({ kind: 'single', value: 80 })
  })
})
