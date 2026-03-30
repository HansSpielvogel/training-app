import { describe, it, expect, beforeEach } from 'vitest'
import type { IMuscleGroupRepository } from '@domain/exercises/IMuscleGroupRepository'
import type { IExerciseDefinitionRepository } from '@domain/exercises/IExerciseDefinitionRepository'
import type { MuscleGroup } from '@domain/exercises/MuscleGroup'
import type { ExerciseDefinition } from '@domain/exercises/ExerciseDefinition'
import { DuplicateNameError, MuscleGroupInUseError } from '@domain/exercises/MuscleGroup'
import { listMuscleGroups } from './listMuscleGroups'
import { createMuscleGroup } from './createMuscleGroup'
import { renameMuscleGroup } from './renameMuscleGroup'
import { deleteMuscleGroup } from './deleteMuscleGroup'

function makeMuscleGroupRepo(initial: MuscleGroup[] = []): IMuscleGroupRepository {
  const store = new Map(initial.map((mg) => [mg.id, mg]))
  return {
    list: async () => [...store.values()],
    findById: async (id) => store.get(id),
    findByName: async (name) => {
      const lower = name.toLowerCase()
      return [...store.values()].find((mg) => mg.name.toLowerCase() === lower)
    },
    save: async (mg) => { store.set(mg.id, mg) },
    delete: async (id) => { store.delete(id) },
    clear: async () => { store.clear() },
  }
}

function makeExerciseRepo(initial: ExerciseDefinition[] = []): IExerciseDefinitionRepository {
  const store = new Map(initial.map((ed) => [ed.id, ed]))
  return {
    list: async () => [...store.values()],
    listByMuscleGroup: async (mgId) =>
      [...store.values()].filter((ed) => ed.muscleGroupIds.includes(mgId)),
    findById: async (id) => store.get(id),
    findByName: async (name) => {
      const lower = name.toLowerCase()
      return [...store.values()].find((ed) => ed.name.toLowerCase() === lower)
    },
    save: async (ed) => { store.set(ed.id, ed) },
    delete: async (id) => { store.delete(id) },
    clear: async () => { store.clear() },
  }
}

describe('listMuscleGroups', () => {
  it('returns all muscle groups from repo', async () => {
    const repo = makeMuscleGroupRepo([{ id: '1', name: 'Chest' }])
    expect(await listMuscleGroups(repo)).toHaveLength(1)
  })
})

describe('createMuscleGroup', () => {
  let repo: IMuscleGroupRepository

  beforeEach(() => { repo = makeMuscleGroupRepo() })

  it('creates a muscle group with a valid name', async () => {
    await createMuscleGroup(repo, 'Chest')
    expect(await repo.list()).toHaveLength(1)
    expect((await repo.list())[0].name).toBe('Chest')
  })

  it('trims whitespace before saving', async () => {
    await createMuscleGroup(repo, '  Chest  ')
    expect((await repo.list())[0].name).toBe('Chest')
  })

  it('throws DuplicateNameError for duplicate name (case-insensitive)', async () => {
    await createMuscleGroup(repo, 'Chest')
    await expect(createMuscleGroup(repo, 'chest')).rejects.toThrow(DuplicateNameError)
  })

  it('throws on empty name', async () => {
    await expect(createMuscleGroup(repo, '')).rejects.toThrow('Name cannot be empty')
  })
})

describe('renameMuscleGroup', () => {
  let repo: IMuscleGroupRepository

  beforeEach(() => {
    repo = makeMuscleGroupRepo([
      { id: '1', name: 'Chest' },
      { id: '2', name: 'Back' },
    ])
  })

  it('renames to a new unique name', async () => {
    await renameMuscleGroup(repo, '1', 'Pecs')
    expect((await repo.findById('1'))?.name).toBe('Pecs')
  })

  it('allows renaming to the same name (no-op)', async () => {
    await expect(renameMuscleGroup(repo, '1', 'Chest')).resolves.not.toThrow()
  })

  it('throws DuplicateNameError when name conflicts with another group', async () => {
    await expect(renameMuscleGroup(repo, '1', 'back')).rejects.toThrow(DuplicateNameError)
  })

  it('throws on empty name', async () => {
    await expect(renameMuscleGroup(repo, '1', '')).rejects.toThrow('Name cannot be empty')
  })
})

describe('deleteMuscleGroup', () => {
  it('deletes when not referenced', async () => {
    const mgRepo = makeMuscleGroupRepo([{ id: '1', name: 'Chest' }])
    const exRepo = makeExerciseRepo()
    await deleteMuscleGroup(mgRepo, exRepo, '1')
    expect(await mgRepo.findById('1')).toBeUndefined()
  })

  it('throws MuscleGroupInUseError when referenced by exercises', async () => {
    const mgRepo = makeMuscleGroupRepo([{ id: '1', name: 'Chest' }])
    const exRepo = makeExerciseRepo([{ id: 'e1', name: 'Bench', muscleGroupIds: ['1'] }])
    await expect(deleteMuscleGroup(mgRepo, exRepo, '1')).rejects.toThrow(MuscleGroupInUseError)
  })
})
