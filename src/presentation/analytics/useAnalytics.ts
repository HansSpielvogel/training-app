import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getExerciseProgression,
  getMuscleGroupVolume,
  getSessionSummaries,
  getLastUsedByExercise,
} from '@application/analytics'
import type { ExerciseProgressionPoint, MuscleGroupVolume, SessionSummaryItem } from '@application/analytics'
import { listExerciseDefinitions } from '@application/exercises'
import type { ExerciseDefinition } from '@application/exercises'
import { DexieTrainingSessionRepository } from '@infrastructure/sessions/DexieTrainingSessionRepository'
import { DexieExerciseDefinitionRepository } from '@infrastructure/exercises/DexieExerciseDefinitionRepository'
import { DexieMuscleGroupRepository } from '@infrastructure/exercises/DexieMuscleGroupRepository'

// Hooks are the composition root — they wire use cases to repositories
export function useAnalytics() {
  const sessionRepo = useRef(new DexieTrainingSessionRepository()).current
  const exerciseRepo = useRef(new DexieExerciseDefinitionRepository()).current
  const muscleGroupRepo = useRef(new DexieMuscleGroupRepository()).current

  const [sessionSummaries, setSessionSummaries] = useState<SessionSummaryItem[]>([])
  const [muscleGroupVolumes, setMuscleGroupVolumes] = useState<MuscleGroupVolume[]>([])
  const [exercises, setExercises] = useState<ExerciseDefinition[]>([])
  const [exerciseIdsWithHistory, setExerciseIdsWithHistory] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getSessionSummaries(sessionRepo),
      getMuscleGroupVolume(sessionRepo, muscleGroupRepo),
      listExerciseDefinitions(exerciseRepo),
      getLastUsedByExercise(sessionRepo),
    ]).then(([summaries, volumes, exList, lastUsed]) => {
      setSessionSummaries(summaries)
      setMuscleGroupVolumes(volumes)
      setExercises(exList)
      setExerciseIdsWithHistory(new Set(Object.keys(lastUsed)))
    }).finally(() => {
      setLoading(false)
    })
  }, [sessionRepo, muscleGroupRepo, exerciseRepo])

  const getProgression = useCallback(
    (exerciseDefinitionId: string): Promise<ExerciseProgressionPoint[]> =>
      getExerciseProgression(sessionRepo, exerciseDefinitionId),
    [sessionRepo],
  )

  const getFullProgression = useCallback(
    (exerciseDefinitionId: string): Promise<ExerciseProgressionPoint[]> =>
      getExerciseProgression(sessionRepo, exerciseDefinitionId, Infinity),
    [sessionRepo],
  )

  const getSessionDetail = useCallback(
    (id: string) => sessionRepo.getById(id),
    [sessionRepo],
  )

  return { sessionSummaries, muscleGroupVolumes, exercises, exerciseIdsWithHistory, loading, getProgression, getFullProgression, getSessionDetail }
}
