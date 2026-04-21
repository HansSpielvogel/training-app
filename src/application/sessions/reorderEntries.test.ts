import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { TrainingDatabase } from '@infrastructure/db/database'
import { DexieTrainingSessionRepository } from '@infrastructure/sessions/DexieTrainingSessionRepository'
import { DexieTrainingPlanRepository } from '@infrastructure/planning/DexieTrainingPlanRepository'
import { DexieMuscleGroupRepository } from '@infrastructure/exercises/DexieMuscleGroupRepository'
import { createTrainingPlan, addPlanSlot } from '@application/planning'
import { startSession } from './startSession'
import { reorderEntries } from './reorderEntries'

let sessionRepo: DexieTrainingSessionRepository
let planRepo: DexieTrainingPlanRepository
let muscleGroupRepo: DexieMuscleGroupRepository

beforeEach(() => {
  const db = new TrainingDatabase({ indexedDB: new IDBFactory(), IDBKeyRange })
  sessionRepo = new DexieTrainingSessionRepository(db)
  planRepo = new DexieTrainingPlanRepository(db)
  muscleGroupRepo = new DexieMuscleGroupRepository(db)
})

async function seedSession() {
  await muscleGroupRepo.save({ id: 'mg-chest', name: 'Chest' })
  await muscleGroupRepo.save({ id: 'mg-back', name: 'Back' })
  await muscleGroupRepo.save({ id: 'mg-arms', name: 'Arms' })
  await createTrainingPlan(planRepo, 'Push')
  const [plan] = await planRepo.listPlans()
  await addPlanSlot(planRepo, plan.id, 'mg-chest')
  await addPlanSlot(planRepo, plan.id, 'mg-back')
  await addPlanSlot(planRepo, plan.id, 'mg-arms')
  return startSession(sessionRepo, planRepo, plan.id)
}

describe('reorderEntries', () => {
  it('moves entry from lower to higher index', async () => {
    const session = await seedSession()
    await reorderEntries(sessionRepo, session.id, 0, 2)
    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries.map(e => e.muscleGroupId)).toEqual(['mg-back', 'mg-arms', 'mg-chest'])
  })

  it('moves entry from higher to lower index', async () => {
    const session = await seedSession()
    await reorderEntries(sessionRepo, session.id, 2, 0)
    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries.map(e => e.muscleGroupId)).toEqual(['mg-arms', 'mg-chest', 'mg-back'])
  })

  it('is a no-op when fromIndex equals toIndex', async () => {
    const session = await seedSession()
    await reorderEntries(sessionRepo, session.id, 1, 1)
    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries.map(e => e.muscleGroupId)).toEqual(['mg-chest', 'mg-back', 'mg-arms'])
  })

  it('persists the new order', async () => {
    const session = await seedSession()
    await reorderEntries(sessionRepo, session.id, 0, 1)
    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries[0].muscleGroupId).toBe('mg-back')
    expect(loaded?.entries[1].muscleGroupId).toBe('mg-chest')
  })

  it('throws for unknown session', async () => {
    await expect(reorderEntries(sessionRepo, 'unknown', 0, 1)).rejects.toThrow('Session not found')
  })
})
