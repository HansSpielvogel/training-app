import { useState, useEffect, useCallback } from 'react'
import type { MuscleGroup } from '@application/exercises'
import {
  listMuscleGroups,
  createMuscleGroup,
  renameMuscleGroup,
  deleteMuscleGroup,
} from '@application/exercises'
import { DexieMuscleGroupRepository } from '@infrastructure/exercises/DexieMuscleGroupRepository'
import { DexieExerciseDefinitionRepository } from '@infrastructure/exercises/DexieExerciseDefinitionRepository'

// Hooks are the composition root — they wire use cases to repositories
const muscleGroupRepo = new DexieMuscleGroupRepository()
const exerciseRepo = new DexieExerciseDefinitionRepository()

export function useMuscleGroups() {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([])

  const refresh = useCallback(async () => {
    setMuscleGroups(await listMuscleGroups(muscleGroupRepo))
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const create = useCallback(async (name: string) => {
    await createMuscleGroup(muscleGroupRepo, name)
    await refresh()
  }, [refresh])

  const rename = useCallback(async (id: string, newName: string) => {
    await renameMuscleGroup(muscleGroupRepo, id, newName)
    await refresh()
  }, [refresh])

  const remove = useCallback(async (id: string) => {
    await deleteMuscleGroup(muscleGroupRepo, exerciseRepo, id)
    await refresh()
  }, [refresh])

  return { muscleGroups, create, rename, remove }
}
