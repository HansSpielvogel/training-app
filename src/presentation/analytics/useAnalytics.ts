import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getExerciseProgression,
  getMuscleGroupVolume,
  getSessionSummaries,
  getLastUsedByExercise,
} from '@application/analytics'
import type { ExerciseProgressionPoint, MuscleGroupVolume, SessionSummaryItem, SessionDetailView, SessionEntryView } from '@application/analytics'
import { listExerciseDefinitions, listMuscleGroups } from '@application/exercises'
import type { ExerciseDefinition } from '@application/exercises'
import type { MuscleGroup } from '@application/exercises'
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
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([])
  const [exerciseIdsWithHistory, setExerciseIdsWithHistory] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getSessionSummaries(sessionRepo),
      getMuscleGroupVolume(sessionRepo, muscleGroupRepo),
      listExerciseDefinitions(exerciseRepo),
      getLastUsedByExercise(sessionRepo),
      listMuscleGroups(muscleGroupRepo),
    ]).then(([summaries, volumes, exList, lastUsed, mgs]) => {
      setSessionSummaries(summaries)
      setMuscleGroupVolumes(volumes)
      setExercises(exList)
      setMuscleGroups(mgs)
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
    async (id: string): Promise<SessionDetailView | undefined> => {
      const session = await sessionRepo.getById(id)
      if (!session) return undefined
      const entries: SessionEntryView[] = await Promise.all(
        session.entries
          .filter(e => e.sets.length > 0)
          .map(async e => {
            const exercise = e.exerciseDefinitionId ? await exerciseRepo.findById(e.exerciseDefinitionId) : undefined
            return {
              exerciseName: exercise?.name ?? e.exerciseDefinitionId ?? '—',
              sets: e.sets.map(s => ({ weight: s.weight, reps: s.reps, ...(s.rpe !== undefined ? { rpe: s.rpe } : {}) })),
            }
          })
      )
      return {
        id: session.id,
        planName: session.planName,
        date: new Date(session.completedAt ?? session.startedAt),
        entries,
      }
    },
    [sessionRepo, exerciseRepo],
  )

  return { sessionSummaries, muscleGroupVolumes, exercises, muscleGroups, exerciseIdsWithHistory, loading, getProgression, getFullProgression, getSessionDetail }
}
