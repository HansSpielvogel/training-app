import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActiveSession } from './useActiveSession'
import { useTrainingPlans } from '../planning/useTrainingPlans'

export function SessionStartScreen() {
  const navigate = useNavigate()
  const { session, loading, start } = useActiveSession()
  const { plans } = useTrainingPlans()

  useEffect(() => {
    if (!loading && session) navigate('/sessions/active', { replace: true })
  }, [session, loading, navigate])

  async function handleStart(planId: string) {
    await start(planId)
    navigate('/sessions/active')
  }

  if (loading) return null

  return (
    <div className="flex flex-col h-full">
      <header
        className="px-4 py-4 border-b border-gray-200 bg-white"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
      >
        <h1 className="text-xl font-semibold text-gray-900">Start Workout</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <p className="text-sm">No training plans found.</p>
            <p className="text-sm">Create a plan first in the Plans tab.</p>
          </div>
        ) : (
          <div>
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => handleStart(plan.id)}
                className="w-full flex items-center px-4 py-3 border-b border-gray-100 active:bg-gray-50 min-h-[56px]"
              >
                <div className="flex-1 text-left">
                  <span className="text-sm font-medium text-gray-800">{plan.name}</span>
                  <span className="ml-2 text-xs text-gray-400">{plan.slotCount} slots</span>
                </div>
                <span className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium">
                  Start
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
