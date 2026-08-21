import { describe, it, expect } from 'vitest'
import exerciseLibrary from '../../../openspec/seed/exercise-library.json'

describe('Torso Rotation muscle group tagging', () => {
  const torsoRotation = exerciseLibrary.exerciseDefinitions.find((ex) => ex.name === 'Torso Rotation')

  it('is tagged only with the side-abs group, not general Bauch', () => {
    expect(torsoRotation?.muscleGroupIds).toEqual(['mg-bauch-seite'])
  })

  it('is not surfaced when filtering exercises for general Bauch (mg-bauch)', () => {
    const forGeneralBauch = exerciseLibrary.exerciseDefinitions.filter((ex) => ex.muscleGroupIds.includes('mg-bauch'))
    expect(forGeneralBauch.some((ex) => ex.name === 'Torso Rotation')).toBe(false)
  })

  it('is available when filtering exercises for Bauch Seite (mg-bauch-seite)', () => {
    const forBauchSeite = exerciseLibrary.exerciseDefinitions.filter((ex) => ex.muscleGroupIds.includes('mg-bauch-seite'))
    expect(forBauchSeite.some((ex) => ex.name === 'Torso Rotation')).toBe(true)
  })
})
