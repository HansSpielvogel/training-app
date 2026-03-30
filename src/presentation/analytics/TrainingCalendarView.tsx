import type { SessionSummaryItem } from '@application/analytics'

interface Props {
  sessions: SessionSummaryItem[]
}

export function TrainingCalendarView({ sessions }: Props) {
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
      {sessions.map(session => (
        <div key={session.id} className="flex items-center px-4 py-3 border-b border-gray-100">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{session.planName}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {session.date.toLocaleDateString()} · {session.exerciseCount} exercise{session.exerciseCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
