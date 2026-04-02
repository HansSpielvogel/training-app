import { useState } from 'react'
import type { SessionSummaryItem } from '@application/analytics'
import type { TrainingSession } from '@application/sessions'
import type { ExerciseDefinition } from '@application/exercises'
import { formatSets } from '../shared/formatSets'

interface Props {
  sessions: SessionSummaryItem[]
  exercises: ExerciseDefinition[]
  getSessionDetail: (id: string) => Promise<TrainingSession | undefined>
}

export function TrainingCalendarView({ sessions, exercises, getSessionDetail }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [detailCache, setDetailCache] = useState<Record<string, TrainingSession>>({})

  async function handleToggle(id: string) {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    setExpandedId(id)
    if (!detailCache[id]) {
      const detail = await getSessionDetail(id)
      if (detail) setDetailCache(prev => ({ ...prev, [id]: detail }))
    }
  }

  const exerciseNameMap = new Map(exercises.map(e => [e.id, e.name]))

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-400">
        <p className="text-sm">No sessions yet.</p>
        <p className="text-sm">Complete your first workout to see it here.</p>
      </div>
    )
  }

  return (
    <div>
      {sessions.map(session => {
        const isExpanded = expandedId === session.id
        const detail = detailCache[session.id]
        return (
          <div key={session.id} className="border-b border-gray-100">
            <button
              className="w-full flex items-center px-4 py-3 text-left"
              onClick={() => handleToggle(session.id)}
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{session.planName}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {session.date.toLocaleDateString()} · {session.exerciseCount} exercise{session.exerciseCount !== 1 ? 's' : ''}
                </p>
              </div>
              <span className="text-gray-500 text-sm ml-2">{isExpanded ? '▲' : '▼'}</span>
            </button>
            {isExpanded && detail && (
              <div className="px-4 pb-3">
                {detail.entries.filter(e => e.sets.length > 0).map((entry, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-xs font-medium text-gray-700">
                      {entry.exerciseDefinitionId ? (exerciseNameMap.get(entry.exerciseDefinitionId) ?? entry.exerciseDefinitionId) : '—'}
                    </p>
                    <p className="text-xs text-gray-400">{formatSets(entry.sets)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
