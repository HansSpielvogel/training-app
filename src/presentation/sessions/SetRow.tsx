import { useState } from 'react'
import type { SessionSet, SessionStatus } from '@application/sessions'
import { formatSets } from '../shared/formatSets'

interface SetRowProps {
  set: SessionSet
  setIndex: number
  isLast: boolean
  sessionStatus: SessionStatus
  onRemoveLast: () => void
  onUpdateRpe: (rpe: number | null) => void
}

export function SetRow({ set, setIndex, isLast, sessionStatus, onRemoveLast, onUpdateRpe }: SetRowProps) {
  const [editing, setEditing] = useState(false)
  const [rpeInput, setRpeInput] = useState(set.rpe !== undefined ? String(set.rpe) : '')
  const [rpeError, setRpeError] = useState<string>()

  function handleEditConfirm() {
    setRpeError(undefined)
    if (rpeInput.trim() === '') {
      onUpdateRpe(null)
      setEditing(false)
      return
    }
    const val = parseInt(rpeInput, 10)
    if (!Number.isInteger(val) || val < 1 || val > 10 || String(val) !== rpeInput.trim()) {
      setRpeError('1–10')
      return
    }
    onUpdateRpe(val)
    setEditing(false)
  }

  function handleEditCancel() {
    setRpeInput(set.rpe !== undefined ? String(set.rpe) : '')
    setRpeError(undefined)
    setEditing(false)
  }

  const canEdit = sessionStatus === 'in-progress'

  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 rounded-md">
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <span className="text-sm text-gray-700 flex-1 min-w-0">{`Set ${setIndex + 1}: `}{formatSets([set])}</span>
        {canEdit && !editing && (
          <button
            onClick={() => { setRpeInput(set.rpe !== undefined ? String(set.rpe) : ''); setEditing(true) }}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-300 hover:text-gray-500 opacity-80 hover:opacity-100 transition-opacity flex-shrink-0"
            aria-label="Edit RPE"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
      </div>
      {editing ? (
        <div className="flex items-center gap-1 ml-2">
          <div className="flex flex-col items-end">
            <input
              type="number"
              inputMode="numeric"
              value={rpeInput}
              onChange={(e) => { setRpeInput(e.target.value); setRpeError(undefined) }}
              placeholder="RPE"
              autoFocus
              className={`w-16 px-2 py-1 text-sm border rounded-md ${rpeError ? 'border-red-400' : 'border-gray-300'}`}
            />
            {rpeError && <p className="text-xs text-red-500 mt-0.5">{rpeError}</p>}
          </div>
          <button onClick={handleEditConfirm} className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md">✓</button>
          <button onClick={handleEditCancel} className="px-2 py-1 text-xs text-gray-500 border border-gray-300 rounded-md">✕</button>
        </div>
      ) : (
        isLast && (
          <button
            onClick={onRemoveLast}
            className="p-2 text-red-400 hover:text-red-600"
            aria-label="Remove last set"
            // intentionally small — reduces accidental taps on a destructive action
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )
      )}
    </div>
  )
}
