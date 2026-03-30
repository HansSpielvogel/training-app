import { describe, it, expect } from 'vitest'
import { createTrainingPlan, DuplicatePlanNameError } from './TrainingPlan'

describe('createTrainingPlan', () => {
  it('creates a valid plan', () => {
    const plan = createTrainingPlan('1', 'Oberkörper A')
    expect(plan.id).toBe('1')
    expect(plan.name).toBe('Oberkörper A')
    expect(plan.createdAt).toBeInstanceOf(Date)
  })

  it('trims whitespace from name', () => {
    const plan = createTrainingPlan('1', '  Oberkörper A  ')
    expect(plan.name).toBe('Oberkörper A')
  })

  it('rejects empty name', () => {
    expect(() => createTrainingPlan('1', '')).toThrow('Name cannot be empty')
  })

  it('rejects whitespace-only name', () => {
    expect(() => createTrainingPlan('1', '   ')).toThrow('Name cannot be empty')
  })

  it('accepts a custom createdAt', () => {
    const date = new Date('2024-01-01')
    const plan = createTrainingPlan('1', 'Core', date)
    expect(plan.createdAt).toBe(date)
  })
})

describe('DuplicatePlanNameError', () => {
  it('is an Error with correct name', () => {
    const err = new DuplicatePlanNameError('Core')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('DuplicatePlanNameError')
    expect(err.message).toContain('Core')
  })
})
