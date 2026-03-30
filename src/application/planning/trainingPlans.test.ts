import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { TrainingDatabase } from '@infrastructure/db/database'
import { DexieTrainingPlanRepository } from '@infrastructure/planning/DexieTrainingPlanRepository'
import { DexieMuscleGroupRepository } from '@infrastructure/exercises/DexieMuscleGroupRepository'
import { DuplicatePlanNameError } from '@domain/planning/TrainingPlan'
import { listTrainingPlans } from './listTrainingPlans'
import { createTrainingPlan } from './createTrainingPlan'
import { renameTrainingPlan } from './renameTrainingPlan'
import { deleteTrainingPlan } from './deleteTrainingPlan'
import { getTrainingPlan } from './getTrainingPlan'
import { addPlanSlot } from './addPlanSlot'
import { removePlanSlot } from './removePlanSlot'
import { movePlanSlot } from './movePlanSlot'
import { seedTrainingPlans } from './seedTrainingPlans'

let repo: DexieTrainingPlanRepository
let muscleGroupRepo: DexieMuscleGroupRepository

beforeEach(() => {
  const db = new TrainingDatabase({ indexedDB: new IDBFactory(), IDBKeyRange })
  repo = new DexieTrainingPlanRepository(db)
  muscleGroupRepo = new DexieMuscleGroupRepository(db)
})

describe('createTrainingPlan', () => {
  it('creates a plan with valid name', async () => {
    await createTrainingPlan(repo, 'Core')
    const plans = await repo.listPlans()
    expect(plans).toHaveLength(1)
    expect(plans[0].name).toBe('Core')
  })

  it('trims whitespace', async () => {
    await createTrainingPlan(repo, '  Core  ')
    expect((await repo.listPlans())[0].name).toBe('Core')
  })

  it('throws DuplicatePlanNameError on duplicate (case-insensitive)', async () => {
    await createTrainingPlan(repo, 'Core')
    await expect(createTrainingPlan(repo, 'core')).rejects.toThrow(DuplicatePlanNameError)
  })

  it('throws on empty name', async () => {
    await expect(createTrainingPlan(repo, '')).rejects.toThrow('Name cannot be empty')
  })
})

describe('renameTrainingPlan', () => {
  it('renames to a new unique name', async () => {
    await createTrainingPlan(repo, 'Core')
    const [plan] = await repo.listPlans()
    await renameTrainingPlan(repo, plan.id, 'Core+Beine')
    expect((await repo.findPlanById(plan.id))?.name).toBe('Core+Beine')
  })

  it('allows same name (no-op)', async () => {
    await createTrainingPlan(repo, 'Core')
    const [plan] = await repo.listPlans()
    await expect(renameTrainingPlan(repo, plan.id, 'Core')).resolves.not.toThrow()
  })

  it('throws DuplicatePlanNameError when conflicting with another plan', async () => {
    await createTrainingPlan(repo, 'Core')
    await createTrainingPlan(repo, 'Arms')
    const plans = await repo.listPlans() // sorted: Arms, Core
    const armsPlan = plans.find((p) => p.name === 'Arms')!
    await expect(renameTrainingPlan(repo, armsPlan.id, 'core')).rejects.toThrow(DuplicatePlanNameError)
  })
})

describe('deleteTrainingPlan', () => {
  it('deletes plan and its slots', async () => {
    await createTrainingPlan(repo, 'Core')
    const [plan] = await repo.listPlans()
    await muscleGroupRepo.save({ id: 'mg-1', name: 'Bauch' })
    await addPlanSlot(repo, plan.id, 'mg-1')
    await deleteTrainingPlan(repo, plan.id)
    expect(await repo.findPlanById(plan.id)).toBeUndefined()
    expect(await repo.listSlotsByPlan(plan.id)).toHaveLength(0)
  })
})

describe('listTrainingPlans', () => {
  it('returns plans with slot counts', async () => {
    await createTrainingPlan(repo, 'Core')
    await createTrainingPlan(repo, 'Arms')
    const [arms, core] = await listTrainingPlans(repo) // sorted by name
    expect(arms.name).toBe('Arms')
    expect(arms.slotCount).toBe(0)
    expect(core.name).toBe('Core')

    await muscleGroupRepo.save({ id: 'mg-1', name: 'Bauch' })
    await addPlanSlot(repo, core.id, 'mg-1')
    const updated = await listTrainingPlans(repo)
    expect(updated.find((p) => p.id === core.id)?.slotCount).toBe(1)
  })
})

describe('getTrainingPlan', () => {
  it('returns plan with slot details including muscle group names', async () => {
    await createTrainingPlan(repo, 'Core')
    await muscleGroupRepo.save({ id: 'mg-1', name: 'Bauch' })
    const [plan] = await repo.listPlans()
    await addPlanSlot(repo, plan.id, 'mg-1')
    const detail = await getTrainingPlan(repo, muscleGroupRepo, plan.id)
    expect(detail?.slots).toHaveLength(1)
    expect(detail?.slots[0].muscleGroupName).toBe('Bauch')
  })

  it('returns undefined for unknown plan', async () => {
    expect(await getTrainingPlan(repo, muscleGroupRepo, 'unknown')).toBeUndefined()
  })
})

describe('addPlanSlot', () => {
  it('appends slot at the end', async () => {
    await createTrainingPlan(repo, 'Core')
    await muscleGroupRepo.save({ id: 'mg-1', name: 'Bauch' })
    await muscleGroupRepo.save({ id: 'mg-2', name: 'Rücken' })
    const [plan] = await repo.listPlans()
    await addPlanSlot(repo, plan.id, 'mg-1')
    await addPlanSlot(repo, plan.id, 'mg-2')
    const slots = await repo.listSlotsByPlan(plan.id)
    expect(slots[0].muscleGroupId).toBe('mg-1')
    expect(slots[1].muscleGroupId).toBe('mg-2')
    expect(slots[0].order).toBeLessThan(slots[1].order)
  })
})

describe('removePlanSlot', () => {
  it('removes the slot', async () => {
    await createTrainingPlan(repo, 'Core')
    await muscleGroupRepo.save({ id: 'mg-1', name: 'Bauch' })
    const [plan] = await repo.listPlans()
    await addPlanSlot(repo, plan.id, 'mg-1')
    const [slot] = await repo.listSlotsByPlan(plan.id)
    await removePlanSlot(repo, slot.id)
    expect(await repo.listSlotsByPlan(plan.id)).toHaveLength(0)
  })
})

describe('movePlanSlot', () => {
  it('moves a slot up', async () => {
    await createTrainingPlan(repo, 'Core')
    await muscleGroupRepo.save({ id: 'mg-1', name: 'A' })
    await muscleGroupRepo.save({ id: 'mg-2', name: 'B' })
    const [plan] = await repo.listPlans()
    await addPlanSlot(repo, plan.id, 'mg-1')
    await addPlanSlot(repo, plan.id, 'mg-2')
    let slots = await repo.listSlotsByPlan(plan.id)
    const secondId = slots[1].id
    await movePlanSlot(repo, plan.id, secondId, 'up')
    slots = await repo.listSlotsByPlan(plan.id)
    expect(slots[0].id).toBe(secondId)
  })

  it('moves a slot down', async () => {
    await createTrainingPlan(repo, 'Core')
    await muscleGroupRepo.save({ id: 'mg-1', name: 'A' })
    await muscleGroupRepo.save({ id: 'mg-2', name: 'B' })
    const [plan] = await repo.listPlans()
    await addPlanSlot(repo, plan.id, 'mg-1')
    await addPlanSlot(repo, plan.id, 'mg-2')
    let slots = await repo.listSlotsByPlan(plan.id)
    const firstId = slots[0].id
    await movePlanSlot(repo, plan.id, firstId, 'down')
    slots = await repo.listSlotsByPlan(plan.id)
    expect(slots[1].id).toBe(firstId)
  })

  it('does nothing when moving first slot up', async () => {
    await createTrainingPlan(repo, 'Core')
    await muscleGroupRepo.save({ id: 'mg-1', name: 'A' })
    const [plan] = await repo.listPlans()
    await addPlanSlot(repo, plan.id, 'mg-1')
    const [slot] = await repo.listSlotsByPlan(plan.id)
    await expect(movePlanSlot(repo, plan.id, slot.id, 'up')).resolves.not.toThrow()
  })
})

describe('seedTrainingPlans', () => {
  it('seeds when no plans exist', async () => {
    await seedTrainingPlans(repo)
    expect(await repo.countPlans()).toBe(5)
  })

  it('does not seed when plans already exist', async () => {
    await createTrainingPlan(repo, 'Core')
    await seedTrainingPlans(repo)
    expect(await repo.countPlans()).toBe(1)
  })
})
