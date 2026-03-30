import { describe, it, expect } from 'vitest'
import { createMuscleGroup, DuplicateNameError, MuscleGroupInUseError } from './MuscleGroup'

describe('createMuscleGroup', () => {
  it('creates a valid muscle group', () => {
    const mg = createMuscleGroup('1', 'Chest')
    expect(mg.id).toBe('1')
    expect(mg.name).toBe('Chest')
  })

  it('trims whitespace from name', () => {
    const mg = createMuscleGroup('1', '  Chest  ')
    expect(mg.name).toBe('Chest')
  })

  it('rejects empty name', () => {
    expect(() => createMuscleGroup('1', '')).toThrow('Name cannot be empty')
  })

  it('rejects whitespace-only name', () => {
    expect(() => createMuscleGroup('1', '   ')).toThrow('Name cannot be empty')
  })
})

describe('DuplicateNameError', () => {
  it('is an Error with correct name', () => {
    const err = new DuplicateNameError('Chest')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('DuplicateNameError')
    expect(err.message).toContain('Chest')
  })
})

describe('MuscleGroupInUseError', () => {
  it('is an Error with correct name', () => {
    const err = new MuscleGroupInUseError()
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('MuscleGroupInUseError')
  })
})
