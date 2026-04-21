import { useState } from 'react'
import { useAnalytics } from './useAnalytics'
import { TrainingCalendarView } from './TrainingCalendarView'
import { MuscleGroupVolumeView } from './MuscleGroupVolumeView'
import { ExerciseProgressionView } from './ExerciseProgressionView'

type Tab = 'calendar' | 'volume' | 'progression'

const TABS: { id: Tab; label: string }[] = [
  { id: 'calendar', label: 'Calendar' },
  { id: 'volume', label: 'Volume' },
  { id: 'progression', label: 'Progression' },
]

export function AnalyticsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('calendar')
  const { sessionSummaries, muscleGroupVolumes, exercises, muscleGroups, exerciseIdsWithHistory, loading, getProgression, getFullProgression, getSessionDetail } = useAnalytics()

  return (
    <div className="flex flex-col h-full">
      <header
        className="px-4 py-4 border-b border-gray-200 bg-white"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
      >
        <h1 className="text-xl font-semibold text-gray-900">Stats</h1>
        <div className="flex mt-3 border-b border-gray-200 -mb-4">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-sm border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-gray-500 font-medium'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {loading ? null : (
          <>
            {activeTab === 'calendar' && <TrainingCalendarView sessions={sessionSummaries} getSessionDetail={getSessionDetail} />}
            {activeTab === 'volume' && <MuscleGroupVolumeView volumes={muscleGroupVolumes} />}
            {activeTab === 'progression' && (
              <ExerciseProgressionView exercises={exercises.filter(e => exerciseIdsWithHistory.has(e.id))} muscleGroups={muscleGroups} getProgression={getProgression} getFullProgression={getFullProgression} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
