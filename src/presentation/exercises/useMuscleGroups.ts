import { useState, useEffect, useCallback, useRef } from 'react'
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
export function useMuscleGroups() {
  const muscleGroupRepo = useRef(new DexieMuscleGroupRepository()).current
  const exerciseRepo = useRef(new DexieExerciseDefinitionRepository()).current
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([])

  const refresh = useCallback(async () => {
    setMuscleGroups(await listMuscleGroups(muscleGroupRepo))
  }, [muscleGroupRepo])

  useEffect(() => { refresh() }, [refresh])

  const create = useCallback(async (name: string) => {
    await createMuscleGroup(muscleGroupRepo, name)
    await refresh()
  }, [muscleGroupRepo, refresh])

  const rename = useCallback(async (id: string, newName: string) => {
    await renameMuscleGroup(muscleGroupRepo, id, newName)
    await refresh()
  }, [muscleGroupRepo, refresh])

  const remove = useCallback(async (id: string) => {
    await deleteMuscleGroup(muscleGroupRepo, exerciseRepo, id)
    await refresh()
  }, [muscleGroupRepo, exerciseRepo, refresh])

  return { muscleGroups, create, rename, remove }
}
