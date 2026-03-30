import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getExerciseProgression,
  getMuscleGroupVolume,
  getSessionSummaries,
} from '@application/analytics'
import type { ExerciseProgressionPoint, MuscleGroupVolume, SessionSummaryItem } from '@application/analytics'
import { DexieTrainingSessionRepository } from '@infrastructure/sessions/DexieTrainingSessionRepository'
import { DexieExerciseDefinitionRepository } from '@infrastructure/exercises/DexieExerciseDefinitionRepository'
import { DexieMuscleGroupRepository } from '@infrastructure/exercises/DexieMuscleGroupRepository'
import type { ExerciseDefinition } from '@application/exercises'

// Hooks are the composition root — they wire use cases to repositories
export function useAnalytics() {
  const sessionRepo = useRef(new DexieTrainingSessionRepository()).current
  const exerciseRepo = useRef(new DexieExerciseDefinitionRepository()).current
  const muscleGroupRepo = useRef(new DexieMuscleGroupRepository()).current

  const [sessionSummaries, setSessionSummaries] = useState<SessionSummaryItem[]>([])
  const [muscleGroupVolumes, setMuscleGroupVolumes] = useState<MuscleGroupVolume[]>([])
  const [exercises, setExercises] = useState<ExerciseDefinition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getSessionSummaries(sessionRepo),
      getMuscleGroupVolume(sessionRepo, muscleGroupRepo),
      exerciseRepo.list(),
    ]).then(([summaries, volumes, exList]) => {
      setSessionSummaries(summaries)
      setMuscleGroupVolumes(volumes)
      setExercises(exList)
    }).finally(() => {
      setLoading(false)
    })
  }, [sessionRepo, muscleGroupRepo, exerciseRepo])

  const getProgression = useCallback(
    (exerciseDefinitionId: string): Promise<ExerciseProgressionPoint[]> =>
      getExerciseProgression(sessionRepo, exerciseDefinitionId),
    [sessionRepo],
  )

  return { sessionSummaries, muscleGroupVolumes, exercises, loading, getProgression }
}
