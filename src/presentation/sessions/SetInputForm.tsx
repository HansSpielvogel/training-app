interface Props {
  weightInput: string
  addedWeightInput: string
  repsInput: string
  rpeInput: string
  weightError?: string
  rpeError?: string
  mode: 'quick' | 'individual'
  n: number
  onWeightChange: (v: string) => void
  onAddedWeightChange: (v: string) => void
  onRepsChange: (v: string) => void
  onRpeChange: (v: string) => void
  onToggleMinus: () => void
  onModeChange: (mode: 'quick' | 'individual') => void
  onAdd: () => void
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void
}

export function SetInputForm({
  weightInput, addedWeightInput, repsInput, rpeInput, weightError, rpeError,
  mode, n, onWeightChange, onAddedWeightChange, onRepsChange, onRpeChange,
  onToggleMinus, onModeChange, onAdd, onFocus,
}: Props) {
  return (
    <>
      <div className="space-y-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onToggleMinus}
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
            onChange={(e) => { onWeightChange(e.target.value) }}
            onFocus={onFocus}
            className={`flex-1 px-3 py-2 border rounded-md ${weightError ? 'border-red-400' : 'border-gray-300'}`}
          />
          <input
            type="text"
            inputMode="decimal"
            placeholder="+add"
            value={addedWeightInput}
            onChange={(e) => { onAddedWeightChange(e.target.value) }}
            onFocus={onFocus}
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
            onChange={(e) => onRepsChange(e.target.value)}
            onFocus={onFocus}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />
          <div className="flex-1 flex flex-col">
            <input
              type="number"
              inputMode="numeric"
              placeholder="RPE (1-10)"
              value={rpeInput}
              onChange={(e) => { onRpeChange(e.target.value) }}
              onFocus={onFocus}
              className={`w-full px-3 py-2 border rounded-md ${rpeError ? 'border-red-400' : 'border-gray-300'}`}
            />
            {rpeError && <p className="mt-0.5 text-xs text-red-500">{rpeError}</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onAdd}
          disabled={!weightInput || !repsInput}
          className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-md disabled:bg-gray-200 disabled:text-gray-400 font-medium"
        >
          {mode === 'quick' ? `Log ${n}×` : 'Add Set'}
        </button>
        <div className="flex rounded-md overflow-hidden border border-gray-200 shrink-0">
          <button
            type="button"
            onClick={() => onModeChange('quick')}
            className={`px-3 py-2 text-xs font-medium ${mode === 'quick' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
          >
            Quick
          </button>
          <button
            type="button"
            onClick={() => onModeChange('individual')}
            className={`px-3 py-2 text-xs font-medium ${mode === 'individual' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
          >
            Individual
          </button>
        </div>
      </div>
    </>
  )
}
