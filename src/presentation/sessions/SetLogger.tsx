import { useState } from 'react'
import type { SessionSet } from '@application/sessions'
import type { Weight } from '@application/sessions'
import { parseWeight } from '@application/sessions'

function formatWeight(w: Weight): string {
  if (w.kind === 'single') return String(w.value)
  if (w.kind === 'bilateral') return `2×${w.perSide}`
  return `${w.base}+${w.added}`
}

interface Props {
  sets: readonly SessionSet[]
  lastSets: SessionSet[] | null
  onAdd: (weight: Weight, reps: number) => void
  onRemoveLast: () => void
}

export function SetLogger({ sets, lastSets, onAdd, onRemoveLast }: Props) {
  const [weightInput, setWeightInput] = useState('')
  const [repsInput, setRepsInput] = useState('')
  const [weightError, setWeightError] = useState<string>()

  function handleAdd() {
    setWeightError(undefined)
    let weight: Weight
    try {
      weight = parseWeight(weightInput)
    } catch {
      setWeightError('Invalid weight (e.g. 22.5, 2x15, 31.5+2.3)')
      return
    }
    const reps = parseInt(repsInput, 10)
    if (!reps || reps <= 0) return
    onAdd(weight, reps)
    setWeightInput('')
    setRepsInput('')
  }

  return (
    <div className="space-y-2">
      {lastSets && lastSets.length > 0 && (
        <p className="text-sm text-gray-500">
          Last: {lastSets.map((s) => `${formatWeight(s.weight)}×${s.reps}`).join('  ')}
        </p>
      )}
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <input
            type="text"
            inputMode="decimal"
            placeholder="Weight"
            value={weightInput}
            onChange={(e) => { setWeightInput(e.target.value); setWeightError(undefined) }}
            className={`w-full px-3 py-2 text-sm border rounded-md ${weightError ? 'border-red-400' : 'border-gray-300'}`}
          />
          {weightError && <p className="mt-0.5 text-xs text-red-500">{weightError}</p>}
        </div>
        <input
          type="number"
          inputMode="numeric"
          placeholder="Reps"
          value={repsInput}
          onChange={(e) => setRepsInput(e.target.value)}
          className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-md"
        />
        <button
          onClick={handleAdd}
          disabled={!weightInput || !repsInput}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-40"
        >
          Add
        </button>
      </div>

      {sets.length > 0 && (
        <div className="space-y-1">
          {sets.map((set, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-gray-50 rounded-md">
              <span className="text-sm text-gray-700">
                {`Set ${i + 1}: ${formatWeight(set.weight)} × ${set.reps}`}
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
