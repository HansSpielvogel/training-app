import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { TrainingDatabase } from '@infrastructure/db/database'
import { DexieTrainingPlanRepository } from './DexieTrainingPlanRepository'
import type { TrainingPlan } from '@domain/planning/TrainingPlan'
import type { PlanSlot } from '@domain/planning/PlanSlot'

const NOW = new Date('2024-01-01')

function plan(id: string, name: string): TrainingPlan {
  return { id, name, createdAt: NOW }
}

function slot(id: string, planId: string, muscleGroupId: string, order: number): PlanSlot {
  return { id, planId, muscleGroupId, order }
}

let repo: DexieTrainingPlanRepository

beforeEach(() => {
  const db = new TrainingDatabase({ indexedDB: new IDBFactory(), IDBKeyRange })
  repo = new DexieTrainingPlanRepository(db)
})

describe('plans', () => {
  it('listPlans returns empty initially', async () => {
    expect(await repo.listPlans()).toEqual([])
  })

  it('savePlan and findPlanById', async () => {
    await repo.savePlan(plan('p1', 'Core'))
    expect(await repo.findPlanById('p1')).toEqual(plan('p1', 'Core'))
  })

  it('listPlans returns plans sorted by name', async () => {
    await repo.savePlan(plan('p2', 'Beine'))
    await repo.savePlan(plan('p1', 'Arms'))
    const names = (await repo.listPlans()).map((p) => p.name)
    expect(names).toEqual(['Arms', 'Beine'])
  })

  it('findPlanByName is case-insensitive', async () => {
    await repo.savePlan(plan('p1', 'Core'))
    expect(await repo.findPlanByName('core')).toEqual(plan('p1', 'Core'))
    expect(await repo.findPlanByName('CORE')).toEqual(plan('p1', 'Core'))
  })

  it('findPlanByName returns undefined when not found', async () => {
    expect(await repo.findPlanByName('Unknown')).toBeUndefined()
  })

  it('deletePlan removes the plan', async () => {
    await repo.savePlan(plan('p1', 'Core'))
    await repo.deletePlan('p1')
    expect(await repo.findPlanById('p1')).toBeUndefined()
  })

  it('countPlans', async () => {
    expect(await repo.countPlans()).toBe(0)
    await repo.savePlan(plan('p1', 'Core'))
    expect(await repo.countPlans()).toBe(1)
  })
})

describe('slots', () => {
  it('listSlotsByPlan returns slots sorted by order', async () => {
    await repo.savePlan(plan('p1', 'Core'))
    await repo.saveSlot(slot('s2', 'p1', 'mg-b', 1))
    await repo.saveSlot(slot('s1', 'p1', 'mg-a', 0))
    const slots = await repo.listSlotsByPlan('p1')
    expect(slots.map((s) => s.order)).toEqual([0, 1])
  })

  it('findSlotById', async () => {
    await repo.savePlan(plan('p1', 'Core'))
    await repo.saveSlot(slot('s1', 'p1', 'mg-a', 0))
    expect(await repo.findSlotById('s1')).toEqual(slot('s1', 'p1', 'mg-a', 0))
  })

  it('saveSlots (bulk)', async () => {
    await repo.savePlan(plan('p1', 'Core'))
    await repo.saveSlots([slot('s1', 'p1', 'mg-a', 0), slot('s2', 'p1', 'mg-b', 1)])
    expect(await repo.listSlotsByPlan('p1')).toHaveLength(2)
  })

  it('deleteSlot removes slot', async () => {
    await repo.savePlan(plan('p1', 'Core'))
    await repo.saveSlot(slot('s1', 'p1', 'mg-a', 0))
    await repo.deleteSlot('s1')
    expect(await repo.findSlotById('s1')).toBeUndefined()
  })

  it('deleteSlotsByPlan removes all slots for a plan', async () => {
    await repo.savePlan(plan('p1', 'Core'))
    await repo.savePlan(plan('p2', 'Arms'))
    await repo.saveSlot(slot('s1', 'p1', 'mg-a', 0))
    await repo.saveSlot(slot('s2', 'p2', 'mg-b', 0))
    await repo.deleteSlotsByPlan('p1')
    expect(await repo.listSlotsByPlan('p1')).toHaveLength(0)
    expect(await repo.listSlotsByPlan('p2')).toHaveLength(1)
  })

  it('maxOrderByPlan returns -1 when no slots', async () => {
    await repo.savePlan(plan('p1', 'Core'))
    expect(await repo.maxOrderByPlan('p1')).toBe(-1)
  })

  it('maxOrderByPlan returns max order', async () => {
    await repo.savePlan(plan('p1', 'Core'))
    await repo.saveSlots([slot('s1', 'p1', 'mg-a', 0), slot('s2', 'p1', 'mg-b', 2)])
    expect(await repo.maxOrderByPlan('p1')).toBe(2)
  })
})
