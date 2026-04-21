import { useState } from 'react'
import type { SessionSet, SessionStatus } from '@application/sessions'
import type { Weight } from '@application/sessions'
import { parseWeight } from '@application/sessions'
import { DEFAULT_SET_COUNT } from '@application/exercises'
import { formatLastSets } from '../shared/formatSets'
import { SetRow } from './SetRow'
import { SetInputForm } from './SetInputForm'

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

  function handleAdd() {
    const parsed = parseInputs()
    if (!parsed) return
    onAdd(parsed.weight, parsed.reps, mode === 'quick' ? n : 1, parsed.rpe)
    if (mode === 'quick') {
      setWeightInput('')
      setAddedWeightInput('')
      setRepsInput('')
    }
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
      <SetInputForm
        weightInput={weightInput}
        addedWeightInput={addedWeightInput}
        repsInput={repsInput}
        rpeInput={rpeInput}
        weightError={weightError}
        rpeError={rpeError}
        mode={mode}
        n={n}
        onWeightChange={(v) => { setWeightInput(v); setWeightError(undefined) }}
        onAddedWeightChange={(v) => { setAddedWeightInput(v); setWeightError(undefined) }}
        onRepsChange={setRepsInput}
        onRpeChange={(v) => { setRpeInput(v); setRpeError(undefined) }}
        onToggleMinus={() => setWeightInput((prev) => prev.startsWith('-') ? prev.slice(1) : '-' + prev)}
        onModeChange={setMode}
        onAdd={handleAdd}
        onFocus={handleFocus}
      />
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
