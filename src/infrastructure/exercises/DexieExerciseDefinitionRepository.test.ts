import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { TrainingDatabase } from '@infrastructure/db/database'
import { DexieExerciseDefinitionRepository } from './DexieExerciseDefinitionRepository'

let repo: DexieExerciseDefinitionRepository

beforeEach(() => {
  const db = new TrainingDatabase({ indexedDB: new IDBFactory(), IDBKeyRange })
  repo = new DexieExerciseDefinitionRepository(db)
})

describe('DexieExerciseDefinitionRepository', () => {
  it('list returns empty array initially', async () => {
    expect(await repo.list()).toEqual([])
  })

  it('save and findById', async () => {
    await repo.save({ id: '1', name: 'Squat', muscleGroupIds: ['mg1'] })
    const found = await repo.findById('1')
    expect(found).toEqual({ id: '1', name: 'Squat', muscleGroupIds: ['mg1'] })
  })

  it('list returns items sorted alphabetically', async () => {
    await repo.save({ id: '1', name: 'Squat', muscleGroupIds: ['mg1'] })
    await repo.save({ id: '2', name: 'Bench Press', muscleGroupIds: ['mg2'] })
    await repo.save({ id: '3', name: 'Deadlift', muscleGroupIds: ['mg1'] })
    const list = await repo.list()
    expect(list.map((e) => e.name)).toEqual(['Bench Press', 'Deadlift', 'Squat'])
  })

  it('listByMuscleGroup filters by muscle group', async () => {
    await repo.save({ id: '1', name: 'Squat', muscleGroupIds: ['mg-legs'] })
    await repo.save({ id: '2', name: 'Bench Press', muscleGroupIds: ['mg-chest'] })
    await repo.save({ id: '3', name: 'Leg Press', muscleGroupIds: ['mg-legs', 'mg-back'] })
    const legs = await repo.listByMuscleGroup('mg-legs')
    expect(legs.map((e) => e.id).sort()).toEqual(['1', '3'])
  })

  it('findByName is case-insensitive', async () => {
    await repo.save({ id: '1', name: 'Squat', muscleGroupIds: ['mg1'] })
    expect(await repo.findByName('squat')).toEqual({ id: '1', name: 'Squat', muscleGroupIds: ['mg1'] })
  })

  it('delete removes the item', async () => {
    await repo.save({ id: '1', name: 'Squat', muscleGroupIds: ['mg1'] })
    await repo.delete('1')
    expect(await repo.findById('1')).toBeUndefined()
  })

  it('clear removes all items', async () => {
    await repo.save({ id: '1', name: 'Squat', muscleGroupIds: ['mg1'] })
    await repo.clear()
    expect(await repo.list()).toEqual([])
  })
})
