import { useState, useEffect } from 'react'
import type { ExerciseDefinition } from '@application/exercises'
import type { ExerciseProgressionPoint } from '@application/analytics'
import { ProgressionChart } from './ProgressionChart'
import { formatSets } from '../shared/formatSets'

function formatDate(date: Date): string {
  return date.toLocaleDateString()
}

interface Props {
  exercises: ExerciseDefinition[]
  getProgression: (exerciseDefinitionId: string) => Promise<ExerciseProgressionPoint[]>
  getFullProgression: (exerciseDefinitionId: string) => Promise<ExerciseProgressionPoint[]>
}

export function ExerciseProgressionView({ exercises, getProgression, getFullProgression }: Props) {
  const [selected, setSelected] = useState<ExerciseDefinition | null>(null)
  const [view, setView] = useState<'chart' | 'list'>('list')
  const [chartPoints, setChartPoints] = useState<ExerciseProgressionPoint[]>([])
  const [listPoints, setListPoints] = useState<ExerciseProgressionPoint[]>([])

  useEffect(() => {
    if (!selected) return
    getProgression(selected.id).then(setChartPoints)
    getFullProgression(selected.id).then(pts => setListPoints([...pts].reverse()))
  }, [selected, getProgression, getFullProgression])

  if (selected) {
    const noData = chartPoints.length === 0
    return (
      <div>
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
          <button
            onClick={() => { setSelected(null); setView('list') }}
            className="text-gray-500 text-sm mr-3"
          >
            ← Back
          </button>
          <span className="flex-1 text-sm font-semibold text-gray-800">{selected.name}</span>
          {chartPoints.length >= 1 && (
            <div className="flex rounded-md overflow-hidden border border-gray-200">
              <button
                onClick={() => setView('chart')}
                className={`px-3 py-1 text-xs font-medium ${view === 'chart' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                Chart
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1 text-xs font-medium ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                List
              </button>
            </div>
          )}
        </div>
        <div className={view === 'chart' ? 'px-4 py-4' : ''}>
          {noData ? (
            <p className="text-sm text-gray-400 text-center mt-8 px-4">No data for this exercise yet.</p>
          ) : view === 'chart' ? (
            <ProgressionChart points={chartPoints} />
          ) : (
            <div>
              {listPoints.map((p, i) => (
                <div key={i} className="flex items-center px-4 py-3 border-b border-gray-100">
                  <span className="w-20 text-xs text-gray-400 shrink-0">{formatDate(p.date)}</span>
                  <span className="text-sm text-gray-700">{formatSets(p.sets)}</span>
                </div>
              ))}
            </div>
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
