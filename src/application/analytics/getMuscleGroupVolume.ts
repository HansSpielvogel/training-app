import type { ITrainingSessionRepository } from '@domain/sessions/ITrainingSessionRepository'
import type { IMuscleGroupRepository } from '@domain/exercises/IMuscleGroupRepository'
import type { MuscleGroupVolume } from '@domain/analytics'

export async function getMuscleGroupVolume(
  sessionRepo: ITrainingSessionRepository,
  muscleGroupRepo: IMuscleGroupRepository,
): Promise<MuscleGroupVolume[]> {
  const [sessions, muscleGroups] = await Promise.all([
    sessionRepo.listCompleted(),
    muscleGroupRepo.list(),
  ])

  const nameMap = new Map(muscleGroups.map(mg => [mg.id, mg.name]))
  const counts = new Map<string, number>()

  for (const session of sessions) {
    for (const entry of session.entries) {
      counts.set(entry.muscleGroupId, (counts.get(entry.muscleGroupId) ?? 0) + entry.sets.length)
    }
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count > 0)
    .map(([id, setCount]) => ({
      muscleGroupId: id,
      muscleGroupName: nameMap.get(id) ?? id,
      setCount,
    }))
    .sort((a, b) => b.setCount - a.setCount)
}
