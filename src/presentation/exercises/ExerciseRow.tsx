import type { ExerciseDefinition } from '@application/exercises'
import type { LastUsedEntry } from '@application/analytics'
import { formatSets } from '../shared/formatSets'

interface ExerciseRowProps {
  ed: ExerciseDefinition
  muscleGroupNames: string
  lastUsed?: LastUsedEntry
  onEdit: () => void
  onDelete: () => void
}

export function ExerciseRow({ ed, muscleGroupNames, lastUsed, onEdit, onDelete }: ExerciseRowProps) {
  return (
    <div className="flex items-center px-4 py-3 border-b border-gray-100">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800">{ed.name}</p>
        <p className="text-xs text-gray-400 truncate">{muscleGroupNames}</p>
        {lastUsed && (
          <p className="text-xs text-gray-500 mt-0.5">{formatSets(lastUsed.sets)}</p>
        )}
      </div>
      <button onClick={onEdit} className="p-2 text-gray-400 hover:text-blue-600" aria-label="Edit">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-600" aria-label="Delete">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}
