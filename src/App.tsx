import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { MuscleGroupsPage } from './presentation/exercises/MuscleGroupsPage'
import { ExerciseDefinitionsPage } from './presentation/exercises/ExerciseDefinitionsPage'

export default function App() {
  return (
    <BrowserRouter>
      <div id="app-root" className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/exercise-definitions" replace />} />
            <Route path="/muscle-groups" element={<MuscleGroupsPage />} />
            <Route path="/exercise-definitions" element={<ExerciseDefinitionsPage />} />
          </Routes>
        </div>
        <nav className="flex border-t border-gray-200 bg-white">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Exercises
          </NavLink>
        </nav>
      </div>
    </BrowserRouter>
  )
}
