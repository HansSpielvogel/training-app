import { useState } from 'react'
import type { MuscleGroup } from '@application/exercises'

interface ExerciseFormProps {
  initial?: { name: string; muscleGroupIds: string[]; defaultSets?: number }
  muscleGroups: MuscleGroup[]
  onSubmit: (name: string, muscleGroupIds: string[], defaultSets: number) => void
  onCancel: () => void
  error?: string
}

export function ExerciseForm({ initial, muscleGroups, onSubmit, onCancel, error }: ExerciseFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initial?.muscleGroupIds ?? []),
  )
  const [defaultSets, setDefaultSets] = useState(initial?.defaultSets ?? 3)

  function toggleMuscleGroup(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <input
        autoFocus
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Exercise name"
      />
      <div className="mt-2 flex items-center gap-2">
        <label className="text-xs text-gray-500 whitespace-nowrap">Default sets</label>
        <input
          type="number"
          min={1}
          value={defaultSets}
          onChange={(e) => setDefaultSets(Number(e.target.value))}
          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mt-2">
        <p className="text-xs text-gray-500 mb-1">Muscle groups (select at least one)</p>
        <div className="flex flex-wrap gap-2">
          {muscleGroups.map((mg) => (
            <button
              key={mg.id}
              type="button"
              onClick={() => toggleMuscleGroup(mg.id)}
              className={`px-3 py-1 text-xs rounded-full border ${
                selectedIds.has(mg.id)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300'
              }`}
            >
              {mg.name}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onSubmit(name, [...selectedIds], defaultSets)}
          className="flex-1 py-2 bg-blue-600 text-white text-sm rounded-md font-medium"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm rounded-md font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
