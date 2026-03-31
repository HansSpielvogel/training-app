import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { TrainingDatabase } from '@infrastructure/db/database'
import { DexieTrainingSessionRepository } from '@infrastructure/sessions/DexieTrainingSessionRepository'
import { DexieTrainingPlanRepository } from '@infrastructure/planning/DexieTrainingPlanRepository'
import { DexieMuscleGroupRepository } from '@infrastructure/exercises/DexieMuscleGroupRepository'
import { createTrainingPlan } from '@application/planning'
import { startSession } from './startSession'
import { assignVariation } from './assignVariation'
import { addSet } from './addSet'
import { removeLastSet } from './removeLastSet'
import { completeSession } from './completeSession'
import { getLastVariationsForMuscleGroup } from './getLastVariationsForMuscleGroup'
import { computeRotationSuggestion } from './computeRotationSuggestion'
import { addPlanSlot, updateSlotOptional } from '@application/planning'

let sessionRepo: DexieTrainingSessionRepository
let planRepo: DexieTrainingPlanRepository
let muscleGroupRepo: DexieMuscleGroupRepository

beforeEach(() => {
  const db = new TrainingDatabase({ indexedDB: new IDBFactory(), IDBKeyRange })
  sessionRepo = new DexieTrainingSessionRepository(db)
  planRepo = new DexieTrainingPlanRepository(db)
  muscleGroupRepo = new DexieMuscleGroupRepository(db)
})

async function seedPlanWithSlots() {
  await muscleGroupRepo.save({ id: 'mg-chest', name: 'Chest' })
  await muscleGroupRepo.save({ id: 'mg-back', name: 'Back' })
  await createTrainingPlan(planRepo, 'Push')
  const [plan] = await planRepo.listPlans()
  await addPlanSlot(planRepo, plan.id, 'mg-chest')
  await addPlanSlot(planRepo, plan.id, 'mg-back')
  return plan
}

describe('startSession', () => {
  it('creates an in-progress session with one entry per plan slot', async () => {
    const plan = await seedPlanWithSlots()
    const session = await startSession(sessionRepo, planRepo, plan.id)

    expect(session.planId).toBe(plan.id)
    expect(session.planName).toBe('Push')
    expect(session.status).toBe('in-progress')
    expect(session.entries).toHaveLength(2)
    expect(session.entries[0].muscleGroupId).toBe('mg-chest')
    expect(session.entries[1].muscleGroupId).toBe('mg-back')
    expect(session.entries[0].sets).toHaveLength(0)
  })

  it('persists the session', async () => {
    const plan = await seedPlanWithSlots()
    const session = await startSession(sessionRepo, planRepo, plan.id)
    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.id).toBe(session.id)
  })

  it('throws for unknown plan', async () => {
    await expect(startSession(sessionRepo, planRepo, 'unknown')).rejects.toThrow('Plan not found')
  })

  it('propagates optional flag from plan slot to session entry', async () => {
    const plan = await seedPlanWithSlots()
    const [slot] = await planRepo.listSlotsByPlan(plan.id)
    await updateSlotOptional(planRepo, slot.id, true)

    const session = await startSession(sessionRepo, planRepo, plan.id)

    expect(session.entries[0].optional).toBe(true)
    expect(session.entries[1].optional).toBe(false)
  })
})

describe('assignVariation', () => {
  it('assigns exercise to the entry at given index', async () => {
    const plan = await seedPlanWithSlots()
    const session = await startSession(sessionRepo, planRepo, plan.id)

    await assignVariation(sessionRepo, session.id, 0, 'ex-benchpress')

    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries[0].exerciseDefinitionId).toBe('ex-benchpress')
    expect(loaded?.entries[1].exerciseDefinitionId).toBeUndefined()
  })
})

describe('addSet', () => {
  it('appends a set to the entry', async () => {
    const plan = await seedPlanWithSlots()
    const session = await startSession(sessionRepo, planRepo, plan.id)
    await assignVariation(sessionRepo, session.id, 0, 'ex-benchpress')

    await addSet(sessionRepo, session.id, 0, { kind: 'single', value: 80 }, 10)
    await addSet(sessionRepo, session.id, 0, { kind: 'single', value: 85 }, 8)

    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries[0].sets).toHaveLength(2)
    expect(loaded?.entries[0].sets[0]).toEqual({ weight: { kind: 'single', value: 80 }, reps: 10 })
    expect(loaded?.entries[0].sets[1]).toEqual({ weight: { kind: 'single', value: 85 }, reps: 8 })
  })

  it('stores rpe when provided', async () => {
    const plan = await seedPlanWithSlots()
    const session = await startSession(sessionRepo, planRepo, plan.id)

    await addSet(sessionRepo, session.id, 0, { kind: 'single', value: 80 }, 10, 8)

    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries[0].sets[0].rpe).toBe(8)
  })

  it('stores no rpe when not provided', async () => {
    const plan = await seedPlanWithSlots()
    const session = await startSession(sessionRepo, planRepo, plan.id)

    await addSet(sessionRepo, session.id, 0, { kind: 'single', value: 80 }, 10)

    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries[0].sets[0].rpe).toBeUndefined()
  })

  it('rejects invalid rpe', async () => {
    const plan = await seedPlanWithSlots()
    const session = await startSession(sessionRepo, planRepo, plan.id)

    await expect(addSet(sessionRepo, session.id, 0, { kind: 'single', value: 80 }, 10, 11)).rejects.toThrow()
  })
})

describe('removeLastSet', () => {
  it('removes the last set from the entry', async () => {
    const plan = await seedPlanWithSlots()
    const session = await startSession(sessionRepo, planRepo, plan.id)
    await addSet(sessionRepo, session.id, 0, { kind: 'single', value: 80 }, 10)
    await addSet(sessionRepo, session.id, 0, { kind: 'single', value: 85 }, 8)

    await removeLastSet(sessionRepo, session.id, 0)

    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries[0].sets).toHaveLength(1)
    expect(loaded?.entries[0].sets[0].weight).toEqual({ kind: 'single', value: 80 })
  })

  it('is a no-op when no sets exist', async () => {
    const plan = await seedPlanWithSlots()
    const session = await startSession(sessionRepo, planRepo, plan.id)

    await expect(removeLastSet(sessionRepo, session.id, 0)).resolves.not.toThrow()
    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries[0].sets).toHaveLength(0)
  })
})

describe('completeSession', () => {
  it('marks session as completed with a timestamp', async () => {
    const plan = await seedPlanWithSlots()
    const session = await startSession(sessionRepo, planRepo, plan.id)

    await completeSession(sessionRepo, session.id)

    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.status).toBe('completed')
    expect(loaded?.completedAt).toBeDefined()
  })

  it('completed session appears in listCompleted', async () => {
    const plan = await seedPlanWithSlots()
    const session = await startSession(sessionRepo, planRepo, plan.id)
    await completeSession(sessionRepo, session.id)

    const completed = await sessionRepo.listCompleted()
    expect(completed).toHaveLength(1)
    expect(completed[0].id).toBe(session.id)
  })
})

describe('SessionEntry isTemp', () => {
  it('plan slots have no isTemp flag', async () => {
    const plan = await seedPlanWithSlots()
    const session = await startSession(sessionRepo, planRepo, plan.id)
    expect(session.entries[0].isTemp).toBeFalsy()
  })

  it('session entry can have isTemp: true when saved directly', async () => {
    const plan = await seedPlanWithSlots()
    const session = await startSession(sessionRepo, planRepo, plan.id)
    const withTemp = {
      ...session,
      entries: [...session.entries, { muscleGroupId: 'mg-arms', sets: [], isTemp: true }],
    }
    await sessionRepo.save(withTemp)
    const loaded = await sessionRepo.getById(session.id)
    expect(loaded?.entries[2].isTemp).toBe(true)
  })
})

describe('getLastVariationsForMuscleGroup', () => {
  it('returns recently used exercise IDs for a muscle group', async () => {
    const plan = await seedPlanWithSlots()

    const s1 = await startSession(sessionRepo, planRepo, plan.id)
    await assignVariation(sessionRepo, s1.id, 0, 'ex-benchpress')
    await completeSession(sessionRepo, s1.id)

    const s2 = await startSession(sessionRepo, planRepo, plan.id)
    await assignVariation(sessionRepo, s2.id, 0, 'ex-incline')
    await completeSession(sessionRepo, s2.id)

    const ids = await getLastVariationsForMuscleGroup(sessionRepo, 'mg-chest', 4)
    expect(ids[0]).toBe('ex-incline')
    expect(ids[1]).toBe('ex-benchpress')
  })

  it('returns distinct IDs only', async () => {
    const plan = await seedPlanWithSlots()

    const s1 = await startSession(sessionRepo, planRepo, plan.id)
    await assignVariation(sessionRepo, s1.id, 0, 'ex-benchpress')
    await completeSession(sessionRepo, s1.id)

    const s2 = await startSession(sessionRepo, planRepo, plan.id)
    await assignVariation(sessionRepo, s2.id, 0, 'ex-benchpress')
    await completeSession(sessionRepo, s2.id)

    const ids = await getLastVariationsForMuscleGroup(sessionRepo, 'mg-chest', 4)
    expect(ids).toHaveLength(1)
    expect(ids[0]).toBe('ex-benchpress')
  })

  it('respects the limit', async () => {
    const plan = await seedPlanWithSlots()

    for (const exId of ['ex-a', 'ex-b', 'ex-c', 'ex-d', 'ex-e']) {
      const s = await startSession(sessionRepo, planRepo, plan.id)
      await assignVariation(sessionRepo, s.id, 0, exId)
      await completeSession(sessionRepo, s.id)
    }

    const ids = await getLastVariationsForMuscleGroup(sessionRepo, 'mg-chest', 4)
    expect(ids).toHaveLength(4)
  })

  it('returns empty array when no completed sessions', async () => {
    const ids = await getLastVariationsForMuscleGroup(sessionRepo, 'mg-chest', 4)
    expect(ids).toHaveLength(0)
  })
})

describe('computeRotationSuggestion (integration)', () => {
  it('returns a suggestion when qualifying history exists', async () => {
    const plan = await seedPlanWithSlots()

    const s1 = await startSession(sessionRepo, planRepo, plan.id)
    await assignVariation(sessionRepo, s1.id, 0, 'ex-benchpress')
    await completeSession(sessionRepo, s1.id)

    const s2 = await startSession(sessionRepo, planRepo, plan.id)
    await assignVariation(sessionRepo, s2.id, 0, 'ex-incline')
    await completeSession(sessionRepo, s2.id)

    const s3 = await startSession(sessionRepo, planRepo, plan.id)
    await assignVariation(sessionRepo, s3.id, 0, 'ex-incline')
    await completeSession(sessionRepo, s3.id)

    const sessions = await sessionRepo.listCompleted()
    // Most recent: ex-incline (used 2x); candidate: ex-benchpress (1x) → suggest ex-benchpress
    expect(computeRotationSuggestion('mg-chest', sessions)).toBe('ex-benchpress')
  })

  it('returns null when conditions are not met (only 1 distinct exercise)', async () => {
    const plan = await seedPlanWithSlots()

    const s1 = await startSession(sessionRepo, planRepo, plan.id)
    await assignVariation(sessionRepo, s1.id, 0, 'ex-benchpress')
    await completeSession(sessionRepo, s1.id)

    const sessions = await sessionRepo.listCompleted()
    expect(computeRotationSuggestion('mg-chest', sessions)).toBeNull()
  })
})
