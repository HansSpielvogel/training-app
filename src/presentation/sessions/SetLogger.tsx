import { useState } from 'react'
import type { SessionSet } from '@application/sessions'
import type { Weight } from '@application/sessions'
import { parseWeight } from '@application/sessions'
import { DEFAULT_SET_COUNT } from '@application/exercises'
import { formatSets, formatLastSets } from '../shared/formatSets'

interface Props {
  sets: readonly SessionSet[]
  lastSets: SessionSet[] | null
  defaultSets?: number
  exerciseName?: string
  onAdd: (weight: Weight, reps: number, count: number, rpe?: number) => void
  onRemoveLast: () => void
}

export function SetLogger({ sets, lastSets, defaultSets, exerciseName, onAdd, onRemoveLast }: Props) {
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
        {mode === 'quick' ? (
          <button
            onClick={handleQuickAdd}
            disabled={!weightInput || !repsInput}
            className="flex-1 py-2.5 text-sm bg-blue-600 text-white rounded-md disabled:bg-gray-200 disabled:text-gray-400 font-medium"
          >
            Log {n}×
          </button>
        ) : (
          <button
            onClick={handleIndividualAdd}
            disabled={!weightInput || !repsInput}
            className="flex-1 py-2.5 text-sm bg-blue-600 text-white rounded-md disabled:bg-gray-200 disabled:text-gray-400 font-medium"
          >
            Add Set
          </button>
        )}
        <button
          onClick={() => setMode(mode === 'quick' ? 'individual' : 'quick')}
          className="px-3 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-md"
        >
          {mode === 'quick' ? 'Individual' : 'Quick sets'}
        </button>
      </div>

      {sets.length > 0 && (
        <div className="space-y-1">
          {sets.map((set, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-gray-50 rounded-md">
              <span className="text-sm text-gray-700">
                {`Set ${i + 1}: `}{formatSets([set])}
              </span>
              {i === sets.length - 1 && (
                <button
                  onClick={onRemoveLast}
                  className="p-2 text-red-400 hover:text-red-600"
                  aria-label="Remove last set"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
