import { useState } from 'react'
import type { SessionSet, SessionStatus } from '@application/sessions'
import type { Weight } from '@application/sessions'
import { parseWeight } from '@application/sessions'
import { DEFAULT_SET_COUNT } from '@application/exercises'
import { formatSets, formatLastSets } from '../shared/formatSets'

interface Props {
  sets: readonly SessionSet[]
  lastSets: SessionSet[] | null
  defaultSets?: number
  exerciseName?: string
  sessionStatus: SessionStatus
  onAdd: (weight: Weight, reps: number, count: number, rpe?: number) => void
  onRemoveLast: () => void
  onUpdateSetRpe: (setIndex: number, rpe: number | null) => void
}

interface SetRowProps {
  set: SessionSet
  setIndex: number
  isLast: boolean
  sessionStatus: SessionStatus
  onRemoveLast: () => void
  onUpdateRpe: (rpe: number | null) => void
}

function SetRow({ set, setIndex, isLast, sessionStatus, onRemoveLast, onUpdateRpe }: SetRowProps) {
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

export function SetLogger({ sets, lastSets, defaultSets, exerciseName, sessionStatus, onAdd, onRemoveLast, onUpdateSetRpe }: Props) {
  const n = defaultSets ?? DEFAULT_SET_COUNT
  const [mode, setMode] = useState<'quick' | 'individual'>('quick')
  const [weightInput, setWeightInput] = useState('')
  const [addedWeightInput, setAddedWeightInput] = useState('')
  const [repsInput, setRepsInput] = useState('')
  const [rpeInput, setRpeInput] = useState('')
  const [weightError, setWeightError] = useState<string>()
  const [rpeError, setRpeError] = useState<string>()

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    const el = e.currentTarget
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)
  }

  function toggleMinus() {
    setWeightInput((prev) => prev.startsWith('-') ? prev.slice(1) : '-' + prev)
  }

  function parseInputs(): { weight: Weight; reps: number; rpe?: number } | null {
    setWeightError(undefined)
    setRpeError(undefined)
    let weight: Weight
    const rawWeight = addedWeightInput.trim() !== '' ? `${weightInput}+${addedWeightInput}` : weightInput
    try {
      weight = parseWeight(rawWeight)
    } catch {
      setWeightError('Invalid weight (e.g. 22.5, 2x15, 31.5+2.3)')
      return null
    }
    const reps = parseInt(repsInput, 10)
    if (!reps || reps <= 0) return null
    let rpe: number | undefined
    if (rpeInput !== '') {
      const parsed = parseInt(rpeInput, 10)
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 10 || String(parsed) !== rpeInput.trim()) {
        setRpeError('1–10')
        return null
      }
      rpe = parsed
    }
    return { weight, reps, rpe }
  }

  function handleQuickAdd() {
    const parsed = parseInputs()
    if (!parsed) return
    onAdd(parsed.weight, parsed.reps, n, parsed.rpe)
    setWeightInput('')
    setAddedWeightInput('')
    setRepsInput('')
    setRpeInput('')
  }

  function handleIndividualAdd() {
    const parsed = parseInputs()
    if (!parsed) return
    onAdd(parsed.weight, parsed.reps, 1, parsed.rpe)
    // Retain weight and reps as prefill for the next set in individual mode
    setRpeInput('')
  }

  return (
    <div className="space-y-2">
      {lastSets && lastSets.length > 0 && (
        <p className="text-sm text-gray-500">Last: {formatLastSets(lastSets, exerciseName)}</p>
      )}
      <div className="space-y-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={toggleMinus}
            className="px-2 py-2 text-sm border border-gray-300 rounded-md text-gray-600 select-none"
            aria-label="Toggle negative"
          >
            -/+
          </button>
          <input
            type="text"
            inputMode="decimal"
            placeholder="Weight"
            value={weightInput}
            onChange={(e) => { setWeightInput(e.target.value); setWeightError(undefined) }}
            onFocus={handleFocus}
            className={`flex-1 px-3 py-2 border rounded-md ${weightError ? 'border-red-400' : 'border-gray-300'}`}
          />
          <input
            type="text"
            inputMode="decimal"
            placeholder="+add"
            value={addedWeightInput}
            onChange={(e) => { setAddedWeightInput(e.target.value); setWeightError(undefined) }}
            onFocus={handleFocus}
            className="w-16 px-2 py-2 border border-gray-300 rounded-md"
          />
        </div>
        {weightError && <p className="mt-0.5 text-xs text-red-500">{weightError}</p>}
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Reps"
            value={repsInput}
            onChange={(e) => setRepsInput(e.target.value)}
            onFocus={handleFocus}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />
          <div className="flex-1 flex flex-col">
            <input
              type="number"
              inputMode="numeric"
              placeholder="RPE (1-10)"
              value={rpeInput}
              onChange={(e) => { setRpeInput(e.target.value); setRpeError(undefined) }}
              onFocus={handleFocus}
              className={`w-full px-3 py-2 border rounded-md ${rpeError ? 'border-red-400' : 'border-gray-300'}`}
            />
            {rpeError && <p className="mt-0.5 text-xs text-red-500">{rpeError}</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={mode === 'quick' ? handleQuickAdd : handleIndividualAdd}
          disabled={!weightInput || !repsInput}
          className="flex-1 py-2.5 text-sm bg-blue-600 text-white rounded-md disabled:bg-gray-200 disabled:text-gray-400 font-medium"
        >
          {mode === 'quick' ? `Log ${n}×` : 'Add Set'}
        </button>
        <div className="flex rounded-md overflow-hidden border border-gray-200 shrink-0">
          <button
            type="button"
            onClick={() => setMode('quick')}
            className={`px-3 py-2.5 text-xs font-medium ${mode === 'quick' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
          >
            Quick
          </button>
          <button
            type="button"
            onClick={() => setMode('individual')}
            className={`px-3 py-2.5 text-xs font-medium ${mode === 'individual' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
          >
            Individual
          </button>
        </div>
      </div>

      {sets.length > 0 && (
        <div className="space-y-1">
          {sets.map((set, i) => (
            <SetRow
              key={i}
              set={set}
              setIndex={i}
              isLast={i === sets.length - 1}
              sessionStatus={sessionStatus}
              onRemoveLast={onRemoveLast}
              onUpdateRpe={(rpe) => onUpdateSetRpe(i, rpe)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
