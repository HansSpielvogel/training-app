import type { IExerciseDefinitionRepository } from '@domain/exercises/IExerciseDefinitionRepository'

export async function deleteExerciseDefinition(
  repo: IExerciseDefinitionRepository,
  id: string,
): Promise<void> {
  await repo.delete(id)
}
