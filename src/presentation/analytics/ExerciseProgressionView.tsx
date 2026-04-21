import { useState, useEffect, useMemo } from 'react'
import type { ExerciseDefinition, MuscleGroup } from '@application/exercises'
import type { ExerciseProgressionPoint } from '@application/analytics'
import { ProgressionChart } from './ProgressionChart'
import { MuscleGroupFilterChips } from './MuscleGroupFilterChips'
import { formatSets } from '../shared/formatSets'

function formatDate(date: Date): string {
  return date.toLocaleDateString()
}

interface Props {
  exercises: ExerciseDefinition[]
  muscleGroups: MuscleGroup[]
  getProgression: (exerciseDefinitionId: string) => Promise<ExerciseProgressionPoint[]>
  getFullProgression: (exerciseDefinitionId: string) => Promise<ExerciseProgressionPoint[]>
}

type ChartMetric = 'weight' | 'volume'

function formatVolume(p: ExerciseProgressionPoint): string {
  return p.movedSum !== undefined ? `${Math.round(p.movedSum)} kg moved` : '—'
}

export function ExerciseProgressionView({ exercises, muscleGroups, getProgression, getFullProgression }: Props) {
  const [selected, setSelected] = useState<ExerciseDefinition | null>(null)
  const [view, setView] = useState<'chart' | 'list'>('list')
  const [chartMetric, setChartMetric] = useState<ChartMetric>('weight')
  const [chartPoints, setChartPoints] = useState<ExerciseProgressionPoint[]>([])
  const [listPoints, setListPoints] = useState<ExerciseProgressionPoint[]>([])
  const [selectedMuscleGroupId, setSelectedMuscleGroupId] = useState<string | null>(null)

  const filterableGroups = useMemo(() => {
    const ids = new Set(exercises.flatMap(e => e.muscleGroupIds))
    return muscleGroups.filter(mg => ids.has(mg.id))
  }, [exercises, muscleGroups])

  const filteredExercises = selectedMuscleGroupId
    ? exercises.filter(e => e.muscleGroupIds.includes(selectedMuscleGroupId))
    : exercises

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
            className="min-h-[38px] px-2 flex items-center text-gray-500 text-sm mr-1"
          >
            ← Back
          </button>
          <span className="flex-1 text-sm font-semibold text-gray-800">{selected.name}</span>
          {chartPoints.length >= 1 && (
            <div className="flex rounded-md overflow-hidden border border-gray-200">
              <button
                onClick={() => setView('chart')}
                className={`px-3 min-h-[38px] text-xs font-medium ${view === 'chart' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                Chart
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 min-h-[38px] text-xs font-medium ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
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
            <>
              <div className="flex gap-1 pb-3">
                {(['weight', 'volume'] as ChartMetric[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setChartMetric(m)}
                    className={`px-3 min-h-[38px] text-xs font-medium rounded-full ${chartMetric === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {m === 'weight' ? 'Weight & Reps' : 'Volume'}
                  </button>
                ))}
              </div>
              <ProgressionChart points={chartPoints} metric={chartMetric} />
            </>
          ) : (
            <div>
              {listPoints.map((p, i) => (
                <div key={i} className="flex items-center px-4 py-3 border-b border-gray-100">
                  <span className="w-20 text-xs text-gray-400 shrink-0">{formatDate(p.date)}</span>
                  <span className="flex-1 text-sm text-gray-700">{formatSets(p.sets)}</span>
                  <span className="text-xs text-gray-500 ml-2 shrink-0">{formatVolume(p)}</span>
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
      <MuscleGroupFilterChips groups={filterableGroups} selected={selectedMuscleGroupId} onSelect={setSelectedMuscleGroupId} />
      {filteredExercises.map(ex => (
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
