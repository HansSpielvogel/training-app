import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { MuscleGroupsPage } from './presentation/exercises/MuscleGroupsPage'
import { ExerciseDefinitionsPage } from './presentation/exercises/ExerciseDefinitionsPage'
import { TrainingPlansScreen } from './presentation/planning/TrainingPlansScreen'
import { TrainingPlanDetailScreen } from './presentation/planning/TrainingPlanDetailScreen'
import { SessionStartScreen } from './presentation/sessions/SessionStartScreen'
import { ActiveSessionScreen } from './presentation/sessions/ActiveSessionScreen'
import { AnalyticsScreen } from './presentation/analytics/AnalyticsScreen'
import { ErrorBoundary } from './presentation/shared/ErrorBoundary'
import { UpdateBanner } from './presentation/shared/UpdateBanner'
import { seedTrainingPlans } from '@application/planning'
import { seedExerciseLibrary } from '@application/exercises'
import { DexieTrainingPlanRepository } from '@infrastructure/planning/DexieTrainingPlanRepository'
import { DexieMuscleGroupRepository } from '@infrastructure/exercises/DexieMuscleGroupRepository'
import { DexieExerciseDefinitionRepository } from '@infrastructure/exercises/DexieExerciseDefinitionRepository'

export default function App() {
  useEffect(() => {
    const planRepo = new DexieTrainingPlanRepository()
    const muscleGroupRepo = new DexieMuscleGroupRepository()
    const exerciseRepo = new DexieExerciseDefinitionRepository()
    seedExerciseLibrary(muscleGroupRepo, exerciseRepo)
    seedTrainingPlans(planRepo)
  }, [])

  return (
    <BrowserRouter basename="/training-app">
      <div id="app-root" className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 overflow-hidden">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Navigate to="/sessions" replace />} />
              <Route path="/sessions" element={<SessionStartScreen />} />
              <Route path="/sessions/active" element={<ActiveSessionScreen />} />
              <Route path="/training-plans" element={<TrainingPlansScreen />} />
              <Route path="/training-plans/:id" element={<TrainingPlanDetailScreen />} />
              <Route path="/muscle-groups" element={<MuscleGroupsPage />} />
              <Route path="/exercise-definitions" element={<ExerciseDefinitionsPage />} />
              <Route path="/analytics" element={<AnalyticsScreen />} />
            </Routes>
          </ErrorBoundary>
        </div>
        <nav
          className="flex border-t border-gray-200 bg-white"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <NavLink
            to="/sessions"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 text-xs font-medium ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`
            }
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Train
          </NavLink>
          <NavLink
            to="/training-plans"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 text-xs font-medium ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`
            }
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Plans
          </NavLink>
          <NavLink
            to="/muscle-groups"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 text-xs font-medium ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`
            }
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Muscles
          </NavLink>
          <NavLink
            to="/exercise-definitions"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 text-xs font-medium ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`
            }
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            Exercises
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 text-xs font-medium ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`
            }
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Stats
          </NavLink>
        </nav>
        <UpdateBanner />
      </div>
    </BrowserRouter>
  )
}
