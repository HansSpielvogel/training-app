import { useState, useEffect, useCallback, useRef } from 'react'
import type { ExerciseDefinition } from '@application/exercises'
import {
  listExerciseDefinitions,
  createExerciseDefinition,
  editExerciseDefinition,
  deleteExerciseDefinition,
  exportExerciseLibrary,
  importExerciseLibrary,
} from '@application/exercises'
import type { LastUsedEntry } from '@application/analytics'
import { getLastUsedByExercise } from '@application/analytics'
import { DexieMuscleGroupRepository } from '@infrastructure/exercises/DexieMuscleGroupRepository'
import { DexieExerciseDefinitionRepository } from '@infrastructure/exercises/DexieExerciseDefinitionRepository'
import { DexieTrainingSessionRepository } from '@infrastructure/sessions/DexieTrainingSessionRepository'

// Hooks are the composition root — they wire use cases to repositories
export function useExerciseDefinitions(filterMuscleGroupId?: string) {
  const muscleGroupRepo = useRef(new DexieMuscleGroupRepository()).current
  const exerciseRepo = useRef(new DexieExerciseDefinitionRepository()).current
  const sessionRepo = useRef(new DexieTrainingSessionRepository()).current
  const [exerciseDefinitions, setExerciseDefinitions] = useState<ExerciseDefinition[]>([])
  const [lastUsedByExercise, setLastUsedByExercise] = useState<Record<string, LastUsedEntry>>({})

  const refresh = useCallback(async () => {
    const [defs, lastUsed] = await Promise.all([
      listExerciseDefinitions(exerciseRepo, filterMuscleGroupId),
      getLastUsedByExercise(sessionRepo),
    ])
    setExerciseDefinitions(defs)
    setLastUsedByExercise(lastUsed)
  }, [exerciseRepo, sessionRepo, filterMuscleGroupId])

  useEffect(() => { refresh() }, [refresh])

  const create = useCallback(async (name: string, muscleGroupIds: string[], notes?: string, defaultSets?: number) => {
    await createExerciseDefinition(exerciseRepo, name, muscleGroupIds, notes, defaultSets)
    await refresh()
  }, [exerciseRepo, refresh])

  const update = useCallback(async (id: string, name: string, muscleGroupIds: string[], notes?: string, defaultSets?: number) => {
    await editExerciseDefinition(exerciseRepo, id, name, muscleGroupIds, notes, defaultSets)
    await refresh()
  }, [exerciseRepo, refresh])

  const remove = useCallback(async (id: string) => {
    await deleteExerciseDefinition(exerciseRepo, id)
    await refresh()
  }, [exerciseRepo, refresh])

  const exportLibrary = useCallback(async (): Promise<string> => {
    const data = await exportExerciseLibrary(muscleGroupRepo, exerciseRepo)
    return JSON.stringify(data, null, 2)
  }, [muscleGroupRepo, exerciseRepo])

  const importLibrary = useCallback(async (jsonData: unknown) => {
    await importExerciseLibrary(muscleGroupRepo, exerciseRepo, jsonData)
    await refresh()
  }, [muscleGroupRepo, exerciseRepo, refresh])

  return { exerciseDefinitions, lastUsedByExercise, create, update, remove, exportLibrary, importLibrary }
}
