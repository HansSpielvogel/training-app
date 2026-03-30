import { describe, it, expect } from 'vitest'
import {
  createExerciseDefinition,
  DuplicateExerciseNameError,
  NoMuscleGroupError,
} from './ExerciseDefinition'

describe('createExerciseDefinition', () => {
  it('creates a valid exercise definition', () => {
    const ed = createExerciseDefinition('1', 'Squat', ['mg1', 'mg2'])
    expect(ed.id).toBe('1')
    expect(ed.name).toBe('Squat')
    expect(ed.muscleGroupIds).toEqual(['mg1', 'mg2'])
  })

  it('trims whitespace from name', () => {
    const ed = createExerciseDefinition('1', '  Squat  ', ['mg1'])
    expect(ed.name).toBe('Squat')
  })

  it('rejects empty name', () => {
    expect(() => createExerciseDefinition('1', '', ['mg1'])).toThrow('Name cannot be empty')
  })

  it('rejects whitespace-only name', () => {
    expect(() => createExerciseDefinition('1', '   ', ['mg1'])).toThrow('Name cannot be empty')
  })

  it('rejects empty muscleGroupIds', () => {
    expect(() => createExerciseDefinition('1', 'Squat', [])).toThrow(NoMuscleGroupError)
  })
})

describe('DuplicateExerciseNameError', () => {
  it('is an Error with correct name', () => {
    const err = new DuplicateExerciseNameError('Squat')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('DuplicateExerciseNameError')
    expect(err.message).toContain('Squat')
  })
})

describe('NoMuscleGroupError', () => {
  it('is an Error with correct name', () => {
    const err = new NoMuscleGroupError()
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('NoMuscleGroupError')
  })
})
