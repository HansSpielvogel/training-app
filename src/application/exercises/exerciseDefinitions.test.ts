import { describe, it, expect, beforeEach } from 'vitest'
import type { IExerciseDefinitionRepository } from '@domain/exercises/IExerciseDefinitionRepository'
import type { ExerciseDefinition } from '@domain/exercises/ExerciseDefinition'
import { DuplicateExerciseNameError, NoMuscleGroupError } from '@domain/exercises/ExerciseDefinition'
import { listExerciseDefinitions } from './listExerciseDefinitions'
import { createExerciseDefinition } from './createExerciseDefinition'
import { editExerciseDefinition } from './editExerciseDefinition'
import { deleteExerciseDefinition } from './deleteExerciseDefinition'

function makeRepo(initial: ExerciseDefinition[] = []): IExerciseDefinitionRepository {
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

describe('listExerciseDefinitions', () => {
  it('returns all when no filter', async () => {
    const repo = makeRepo([
      { id: '1', name: 'Squat', muscleGroupIds: ['mg1'] },
      { id: '2', name: 'Bench', muscleGroupIds: ['mg2'] },
    ])
    expect(await listExerciseDefinitions(repo)).toHaveLength(2)
  })

  it('filters by muscle group when id provided', async () => {
    const repo = makeRepo([
      { id: '1', name: 'Squat', muscleGroupIds: ['mg-legs'] },
      { id: '2', name: 'Bench', muscleGroupIds: ['mg-chest'] },
    ])
    const result = await listExerciseDefinitions(repo, 'mg-legs')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })
})

describe('createExerciseDefinition', () => {
  let repo: IExerciseDefinitionRepository

  beforeEach(() => { repo = makeRepo() })

  it('creates with valid inputs', async () => {
    await createExerciseDefinition(repo, 'Squat', ['mg1'])
    expect(await repo.list()).toHaveLength(1)
  })

  it('throws DuplicateExerciseNameError on duplicate name', async () => {
    await createExerciseDefinition(repo, 'Squat', ['mg1'])
    await expect(createExerciseDefinition(repo, 'squat', ['mg1'])).rejects.toThrow(
      DuplicateExerciseNameError,
    )
  })

  it('throws NoMuscleGroupError when no muscle groups', async () => {
    await expect(createExerciseDefinition(repo, 'Squat', [])).rejects.toThrow(NoMuscleGroupError)
  })

  it('throws on empty name', async () => {
    await expect(createExerciseDefinition(repo, '', ['mg1'])).rejects.toThrow('Name cannot be empty')
  })
})

describe('editExerciseDefinition', () => {
  let repo: IExerciseDefinitionRepository

  beforeEach(() => {
    repo = makeRepo([
      { id: '1', name: 'Squat', muscleGroupIds: ['mg1'] },
      { id: '2', name: 'Bench', muscleGroupIds: ['mg2'] },
    ])
  })

  it('edits name and muscle groups', async () => {
    await editExerciseDefinition(repo, '1', 'Front Squat', ['mg1', 'mg2'])
    const updated = await repo.findById('1')
    expect(updated?.name).toBe('Front Squat')
    expect(updated?.muscleGroupIds).toEqual(['mg1', 'mg2'])
  })

  it('allows same name (no-op rename)', async () => {
    await expect(editExerciseDefinition(repo, '1', 'Squat', ['mg1'])).resolves.not.toThrow()
  })

  it('throws DuplicateExerciseNameError when name conflicts', async () => {
    await expect(editExerciseDefinition(repo, '1', 'bench', ['mg1'])).rejects.toThrow(
      DuplicateExerciseNameError,
    )
  })
})

describe('deleteExerciseDefinition', () => {
  it('removes the exercise definition', async () => {
    const repo = makeRepo([{ id: '1', name: 'Squat', muscleGroupIds: ['mg1'] }])
    await deleteExerciseDefinition(repo, '1')
    expect(await repo.findById('1')).toBeUndefined()
  })
})
