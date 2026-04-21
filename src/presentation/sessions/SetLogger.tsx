import { useState } from 'react'
import type { SessionSet, SessionStatus } from '@application/sessions'
import type { Weight } from '@application/sessions'
import { parseWeight } from '@application/sessions'
import { DEFAULT_SET_COUNT } from '@application/exercises'
import { formatLastSets } from '../shared/formatSets'
import { SetRow } from './SetRow'

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

export function SetLogger({ sets, lastSets, defaultSets, exerciseName, sessionStatus, onAdd, onRemoveLast, onUpdateSetRpe }: Props) {
  const n = defaultSets ?? DEFAULT_SET_COUNT
  const [mode, setMode] = useState<'quick' | 'individual'>('quick')
  const [weightInput, setWeightInput] = useState('')
  const [addedWeightInput, setAddedWeightInput] = useState('')
  const [repsInput, setRepsInput] = useState('')
  const [rpeInput, setRpeInput] = useState('')
  const [weightError, setWeightError] = useState<string>()
  const [rpeError, setRpeError] = useState<string>()

  function applyPreset(set: SessionSet) {
    const w = set.weight
    if (w.kind === 'bilateral') {
      setWeightInput(`2x${w.perSide}`)
      setAddedWeightInput('')
    } else if (w.kind === 'stacked') {
      setWeightInput(String(w.base))
      setAddedWeightInput(String(w.added))
    } else {
      setWeightInput(String(w.value))
      setAddedWeightInput('')
    }
    setRepsInput(String(set.reps))
    setRpeInput(set.rpe !== undefined ? String(set.rpe) : '')
    setWeightError(undefined)
    setRpeError(undefined)
  }

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
        <button
          type="button"
          onClick={() => applyPreset(lastSets[0])}
          className="flex items-center gap-1.5 min-h-[44px] text-left text-gray-500 hover:text-blue-600 w-full"
          aria-label="Preset from last session"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm truncate">Last: {formatLastSets(lastSets, exerciseName)}</span>
        </button>
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
