import { describe, it, expect } from 'vitest'
import type { IMuscleGroupRepository } from '@domain/exercises/IMuscleGroupRepository'
import type { IExerciseDefinitionRepository } from '@domain/exercises/IExerciseDefinitionRepository'
import type { MuscleGroup } from '@domain/exercises/MuscleGroup'
import type { ExerciseDefinition } from '@domain/exercises/ExerciseDefinition'
import { exportExerciseLibrary } from './exportExerciseLibrary'
import { importExerciseLibrary, InvalidImportError } from './importExerciseLibrary'

function makeMgRepo(initial: MuscleGroup[] = []): IMuscleGroupRepository {
  const store = new Map(initial.map((mg) => [mg.id, mg]))
  return {
    list: async () => [...store.values()],
    findById: async (id) => store.get(id),
    findByName: async () => undefined,
    save: async (mg) => { store.set(mg.id, mg) },
    delete: async (id) => { store.delete(id) },
    clear: async () => { store.clear() },
  }
}

function makeEdRepo(initial: ExerciseDefinition[] = []): IExerciseDefinitionRepository {
  const store = new Map(initial.map((ed) => [ed.id, ed]))
  return {
    list: async () => [...store.values()],
    listByMuscleGroup: async () => [],
    findById: async (id) => store.get(id),
    findByName: async () => undefined,
    save: async (ed) => { store.set(ed.id, ed) },
    delete: async (id) => { store.delete(id) },
    clear: async () => { store.clear() },
  }
}

describe('exportExerciseLibrary', () => {
  it('exports with version 1 and all data', async () => {
    const mgRepo = makeMgRepo([{ id: '1', name: 'Chest' }])
    const edRepo = makeEdRepo([{ id: 'e1', name: 'Bench', muscleGroupIds: ['1'] }])
    const result = await exportExerciseLibrary(mgRepo, edRepo)
    expect(result.version).toBe(1)
    expect(result.muscleGroups).toHaveLength(1)
    expect(result.exerciseDefinitions).toHaveLength(1)
  })

  it('exports empty arrays when library is empty', async () => {
    const result = await exportExerciseLibrary(makeMgRepo(), makeEdRepo())
    expect(result.muscleGroups).toEqual([])
    expect(result.exerciseDefinitions).toEqual([])
  })
})

describe('importExerciseLibrary', () => {
  it('replaces existing data with imported data', async () => {
    const mgRepo = makeMgRepo([{ id: 'old', name: 'Old' }])
    const edRepo = makeEdRepo()
    const imported = {
      version: 1,
      muscleGroups: [{ id: '1', name: 'Chest' }],
      exerciseDefinitions: [{ id: 'e1', name: 'Bench', muscleGroupIds: ['1'] }],
    }
    await importExerciseLibrary(mgRepo, edRepo, imported)
    const mgs = await mgRepo.list()
    expect(mgs).toHaveLength(1)
    expect(mgs[0].id).toBe('1')
    expect(await edRepo.list()).toHaveLength(1)
  })

  it('throws InvalidImportError for non-object input', async () => {
    await expect(importExerciseLibrary(makeMgRepo(), makeEdRepo(), null)).rejects.toThrow(
      InvalidImportError,
    )
  })

  it('throws InvalidImportError for wrong version', async () => {
    await expect(
      importExerciseLibrary(makeMgRepo(), makeEdRepo(), { version: 2, muscleGroups: [], exerciseDefinitions: [] }),
    ).rejects.toThrow(InvalidImportError)
  })

  it('throws InvalidImportError when muscleGroups is missing', async () => {
    await expect(
      importExerciseLibrary(makeMgRepo(), makeEdRepo(), { version: 1, exerciseDefinitions: [] }),
    ).rejects.toThrow(InvalidImportError)
  })

  it('does not modify existing data on invalid file', async () => {
    const mgRepo = makeMgRepo([{ id: 'existing', name: 'Existing' }])
    const edRepo = makeEdRepo()
    await expect(
      importExerciseLibrary(mgRepo, edRepo, 'not-an-object'),
    ).rejects.toThrow(InvalidImportError)
    expect(await mgRepo.list()).toHaveLength(1)
  })
})
