import { useState, useEffect } from 'react'
import type { ExerciseDefinition } from '@application/exercises'
import type { ExerciseProgressionPoint } from '@application/analytics'
import { ProgressionChart } from './ProgressionChart'

interface Props {
  exercises: ExerciseDefinition[]
  getProgression: (exerciseDefinitionId: string) => Promise<ExerciseProgressionPoint[]>
}

export function ExerciseProgressionView({ exercises, getProgression }: Props) {
  const [selected, setSelected] = useState<ExerciseDefinition | null>(null)
  const [points, setPoints] = useState<ExerciseProgressionPoint[]>([])

  useEffect(() => {
    if (!selected) return
    getProgression(selected.id).then(setPoints)
  }, [selected, getProgression])

  if (selected) {
    return (
      <div>
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
          <button
            onClick={() => setSelected(null)}
            className="text-blue-600 text-sm font-medium mr-3"
          >
            ← Back
          </button>
          <span className="text-sm font-semibold text-gray-800">{selected.name}</span>
        </div>
        <div className="px-4 py-4">
          {points.length === 0 ? (
            <p className="text-sm text-gray-400 text-center mt-8">No data for this exercise yet.</p>
          ) : (
            <ProgressionChart points={points} />
          )}
        </div>
      </div>
    )
  }

  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-400">
        <p className="text-sm">No exercises found.</p>
      </div>
    )
  }

  return (
    <div>
      {exercises.map(ex => (
        <button
          key={ex.id}
          onClick={() => setSelected(ex)}
          className="w-full flex items-center px-4 py-3 border-b border-gray-100 text-left"
        >
          <span className="flex-1 text-sm font-medium text-gray-800">{ex.name}</span>
          <span className="text-gray-400 text-xs">›</span>
        </button>
      ))}
    </div>
  )
}
