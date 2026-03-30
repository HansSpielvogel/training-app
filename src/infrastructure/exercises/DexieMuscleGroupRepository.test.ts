import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { TrainingDatabase } from '@infrastructure/db/database'
import { DexieMuscleGroupRepository } from './DexieMuscleGroupRepository'

let repo: DexieMuscleGroupRepository

beforeEach(() => {
  const db = new TrainingDatabase({ indexedDB: new IDBFactory(), IDBKeyRange })
  repo = new DexieMuscleGroupRepository(db)
})

describe('DexieMuscleGroupRepository', () => {
  it('list returns empty array initially', async () => {
    expect(await repo.list()).toEqual([])
  })

  it('save and findById', async () => {
    await repo.save({ id: '1', name: 'Chest' })
    const found = await repo.findById('1')
    expect(found).toEqual({ id: '1', name: 'Chest' })
  })

  it('list returns items sorted alphabetically', async () => {
    await repo.save({ id: '1', name: 'Legs' })
    await repo.save({ id: '2', name: 'Arms' })
    await repo.save({ id: '3', name: 'Back' })
    const list = await repo.list()
    expect(list.map((m) => m.name)).toEqual(['Arms', 'Back', 'Legs'])
  })

  it('findByName is case-insensitive', async () => {
    await repo.save({ id: '1', name: 'Chest' })
    expect(await repo.findByName('chest')).toEqual({ id: '1', name: 'Chest' })
    expect(await repo.findByName('CHEST')).toEqual({ id: '1', name: 'Chest' })
  })

  it('findByName returns undefined when not found', async () => {
    expect(await repo.findByName('Unknown')).toBeUndefined()
  })

  it('delete removes the item', async () => {
    await repo.save({ id: '1', name: 'Chest' })
    await repo.delete('1')
    expect(await repo.findById('1')).toBeUndefined()
  })

  it('save updates existing item', async () => {
    await repo.save({ id: '1', name: 'Chest' })
    await repo.save({ id: '1', name: 'Updated Chest' })
    expect((await repo.findById('1'))?.name).toBe('Updated Chest')
  })

  it('clear removes all items', async () => {
    await repo.save({ id: '1', name: 'Chest' })
    await repo.save({ id: '2', name: 'Back' })
    await repo.clear()
    expect(await repo.list()).toEqual([])
  })
})
