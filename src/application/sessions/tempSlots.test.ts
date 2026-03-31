import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { TrainingDatabase } from '@infrastructure/db/database'
import { DexieTrainingSessionRepository } from '@infrastructure/sessions/DexieTrainingSessionRepository'
import { DexieTrainingPlanRepository } from '@infrastructure/planning/DexieTrainingPlanRepository'
import { DexieMuscleGroupRepository } from '@infrastructure/exercises/DexieMuscleGroupRepository'
import { createTrainingPlan, addPlanSlot } from '@application/planning'
import { startSession } from './startSession'
import { addSet } from './addSet'
import { addTempSlot } from './addTempSlot'
import { removeTempSlot } from './removeTempSlot'
import { addPlanSlotsToSession } from './addPlanSlotsToSession'

let sessionRepo: DexieTrainingSessionRepository
let planRepo: DexieTrainingPlanRepository
let muscleGroupRepo: DexieMuscleGroupRepository

beforeEach(() => {
  const db = new TrainingDatabase({ indexedDB: new IDBFactory(), IDBKeyRange })
  sessionRepo = new DexieTrainingSessionRepository(db)
  planRepo = new DexieTrainingPlanRepository(db)
  muscleGroupRepo = new DexieMuscleGroupRepository(db)
})

async function seedPlan(name: string, muscleGroupIds: string[]) {
  for (const id of muscleGroupIds) {
    await muscleGroupRepo.save({ id, name: id })
  }
  await createTrainingPlan(planRepo, name)
  const [plan] = await planRepo.listPlans()
  for (const id of muscleGroupIds) {
    await addPlanSlot(planRepo, plan.id, id)
  }
  return plan
}

describe('addTempSlot', () => {
  it('appends a temp entry with isTemp: true', async () => {
    const plan = await seedPlan('Push', ['mg-chest'])
    const session = await startSession(sessionRepo, planRepo, plan.id)

    await addTempSlot(sessionRepo, session.id, 'mg-arms')

    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries).toHaveLength(2)
    expect(loaded?.entries[1].muscleGroupId).toBe('mg-arms')
    expect(loaded?.entries[1].isTemp).toBe(true)
    expect(loaded?.entries[1].sets).toHaveLength(0)
  })

  it('original entries are unchanged (not temp)', async () => {
    const plan = await seedPlan('Push', ['mg-chest'])
    const session = await startSession(sessionRepo, planRepo, plan.id)

    await addTempSlot(sessionRepo, session.id, 'mg-arms')

    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries[0].isTemp).toBeFalsy()
  })
})

describe('removeTempSlot', () => {
  it('removes an empty temp slot', async () => {
    const plan = await seedPlan('Push', ['mg-chest'])
    const session = await startSession(sessionRepo, planRepo, plan.id)
    await addTempSlot(sessionRepo, session.id, 'mg-arms')

    await removeTempSlot(sessionRepo, session.id, 1)

    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries).toHaveLength(1)
    expect(loaded?.entries[0].muscleGroupId).toBe('mg-chest')
  })

  it('throws when temp slot has sets', async () => {
    const plan = await seedPlan('Push', ['mg-chest'])
    const session = await startSession(sessionRepo, planRepo, plan.id)
    await addTempSlot(sessionRepo, session.id, 'mg-arms')
    await addSet(sessionRepo, session.id, 1, { kind: 'single', value: 20 }, 12)

    await expect(removeTempSlot(sessionRepo, session.id, 1)).rejects.toThrow()
  })

  it('throws when trying to remove a plan slot', async () => {
    const plan = await seedPlan('Push', ['mg-chest'])
    const session = await startSession(sessionRepo, planRepo, plan.id)

    await expect(removeTempSlot(sessionRepo, session.id, 0)).rejects.toThrow('Cannot remove a plan slot')
  })
})

describe('addPlanSlotsToSession', () => {
  it('adds temp entries for muscle groups not already in session', async () => {
    const plan1 = await seedPlan('Push', ['mg-chest'])
    const plan2id = 'plan-2'
    await planRepo.savePlan({ id: plan2id, name: 'Legs', createdAt: new Date() })
    await addPlanSlot(planRepo, plan2id, 'mg-legs')
    await addPlanSlot(planRepo, plan2id, 'mg-calves')

    const session = await startSession(sessionRepo, planRepo, plan1.id)
    await addPlanSlotsToSession(sessionRepo, planRepo, session.id, plan2id)

    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries).toHaveLength(3)
    expect(loaded?.entries[1].muscleGroupId).toBe('mg-legs')
    expect(loaded?.entries[1].isTemp).toBe(true)
    expect(loaded?.entries[2].muscleGroupId).toBe('mg-calves')
    expect(loaded?.entries[2].isTemp).toBe(true)
  })

  it('skips muscle groups already in the session', async () => {
    const plan1 = await seedPlan('Push', ['mg-chest', 'mg-legs'])
    const plan2id = 'plan-2'
    await planRepo.savePlan({ id: plan2id, name: 'Overlap', createdAt: new Date() })
    await addPlanSlot(planRepo, plan2id, 'mg-legs')

    const session = await startSession(sessionRepo, planRepo, plan1.id)
    await addPlanSlotsToSession(sessionRepo, planRepo, session.id, plan2id)

    const loaded = await sessionRepo.getById(session.id)
    // mg-legs already in session → not duplicated
    expect(loaded?.entries).toHaveLength(2)
  })

  it('no-op when all muscle groups overlap', async () => {
    const plan1 = await seedPlan('Push', ['mg-chest'])
    const plan2id = 'plan-2'
    await planRepo.savePlan({ id: plan2id, name: 'Same', createdAt: new Date() })
    await addPlanSlot(planRepo, plan2id, 'mg-chest')

    const session = await startSession(sessionRepo, planRepo, plan1.id)
    await addPlanSlotsToSession(sessionRepo, planRepo, session.id, plan2id)

    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries).toHaveLength(1)
  })
})
