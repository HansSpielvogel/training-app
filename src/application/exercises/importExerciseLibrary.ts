import type { IMuscleGroupRepository } from '@domain/exercises/IMuscleGroupRepository'
import type { IExerciseDefinitionRepository } from '@domain/exercises/IExerciseDefinitionRepository'
import type { ExerciseLibraryExport } from './exportExerciseLibrary'

export class InvalidImportError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidImportError'
  }
}

function validate(data: unknown): ExerciseLibraryExport {
  if (typeof data !== 'object' || data === null) throw new InvalidImportError('Invalid file format')
  const obj = data as Record<string, unknown>
  if (obj.version !== 1) throw new InvalidImportError('Unsupported version')
  if (!Array.isArray(obj.muscleGroups)) throw new InvalidImportError('Missing muscleGroups array')
  if (!Array.isArray(obj.exerciseDefinitions))
    throw new InvalidImportError('Missing exerciseDefinitions array')
  for (const mg of obj.muscleGroups) {
    if (typeof mg.id !== 'string' || typeof mg.name !== 'string')
      throw new InvalidImportError('Invalid muscle group entry')
  }
  for (const ed of obj.exerciseDefinitions) {
    if (
      typeof ed.id !== 'string' ||
      typeof ed.name !== 'string' ||
      !Array.isArray(ed.muscleGroupIds)
    )
      throw new InvalidImportError('Invalid exercise definition entry')
  }
  return data as ExerciseLibraryExport
}

export async function importExerciseLibrary(
  muscleGroupRepo: IMuscleGroupRepository,
  exerciseRepo: IExerciseDefinitionRepository,
  data: unknown,
): Promise<void> {
  const validated = validate(data)
  await muscleGroupRepo.clear()
  await exerciseRepo.clear()
  for (const mg of validated.muscleGroups) await muscleGroupRepo.save(mg)
  for (const ed of validated.exerciseDefinitions) await exerciseRepo.save(ed)
}
