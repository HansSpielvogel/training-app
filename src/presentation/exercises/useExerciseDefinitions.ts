import { useState, useEffect, useCallback } from 'react'
import type { ExerciseDefinition } from '@application/exercises'
import {
  listExerciseDefinitions,
  createExerciseDefinition,
  editExerciseDefinition,
  deleteExerciseDefinition,
  exportExerciseLibrary,
  importExerciseLibrary,
} from '@application/exercises'
import { DexieMuscleGroupRepository } from '@infrastructure/exercises/DexieMuscleGroupRepository'
import { DexieExerciseDefinitionRepository } from '@infrastructure/exercises/DexieExerciseDefinitionRepository'

// Hooks are the composition root — they wire use cases to repositories
const muscleGroupRepo = new DexieMuscleGroupRepository()
const exerciseRepo = new DexieExerciseDefinitionRepository()

export function useExerciseDefinitions(filterMuscleGroupId?: string) {
  const [exerciseDefinitions, setExerciseDefinitions] = useState<ExerciseDefinition[]>([])

  const refresh = useCallback(async () => {
    setExerciseDefinitions(await listExerciseDefinitions(exerciseRepo, filterMuscleGroupId))
  }, [filterMuscleGroupId])

  useEffect(() => { refresh() }, [refresh])

  const create = useCallback(async (name: string, muscleGroupIds: string[], notes?: string) => {
    await createExerciseDefinition(exerciseRepo, name, muscleGroupIds, notes)
    await refresh()
  }, [refresh])

  const update = useCallback(async (id: string, name: string, muscleGroupIds: string[], notes?: string) => {
    await editExerciseDefinition(exerciseRepo, id, name, muscleGroupIds, notes)
    await refresh()
  }, [refresh])

  const remove = useCallback(async (id: string) => {
    await deleteExerciseDefinition(exerciseRepo, id)
    await refresh()
  }, [refresh])

  const exportLibrary = useCallback(async (): Promise<string> => {
    const data = await exportExerciseLibrary(muscleGroupRepo, exerciseRepo)
    return JSON.stringify(data, null, 2)
  }, [])

  const importLibrary = useCallback(async (jsonData: unknown) => {
    await importExerciseLibrary(muscleGroupRepo, exerciseRepo, jsonData)
    await refresh()
  }, [refresh])

  return { exerciseDefinitions, create, update, remove, exportLibrary, importLibrary }
}
