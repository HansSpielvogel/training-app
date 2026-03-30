import { useState, useRef } from 'react'
import type { ExerciseDefinition, MuscleGroup } from '@application/exercises'
import { DuplicateExerciseNameError, NoMuscleGroupError, InvalidImportError } from '@application/exercises'
import { useMuscleGroups } from './useMuscleGroups'
import { useExerciseDefinitions } from './useExerciseDefinitions'

type Mode =
  | { type: 'list' }
  | { type: 'adding' }
  | { type: 'editing'; exercise: ExerciseDefinition }
  | { type: 'deleting'; id: string; name: string }

function ExerciseForm({
  initial,
  muscleGroups,
  onSubmit,
  onCancel,
  error,
}: {
  initial?: { name: string; muscleGroupIds: string[] }
  muscleGroups: MuscleGroup[]
  onSubmit: (name: string, muscleGroupIds: string[]) => void
  onCancel: () => void
  error?: string
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initial?.muscleGroupIds ?? []),
  )

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
          onClick={() => onSubmit(name, [...selectedIds])}
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

export function ExerciseDefinitionsPage() {
  const { muscleGroups } = useMuscleGroups()
  const [filterMuscleGroupId, setFilterMuscleGroupId] = useState<string | undefined>()
  const { exerciseDefinitions, create, update, remove, exportLibrary, importLibrary } =
    useExerciseDefinitions(filterMuscleGroupId)
  const [mode, setMode] = useState<Mode>({ type: 'list' })
  const [formError, setFormError] = useState<string>()
  const [importError, setImportError] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function muscleGroupName(id: string) {
    return muscleGroups.find((mg) => mg.id === id)?.name ?? id
  }

  async function handleCreate(name: string, muscleGroupIds: string[]) {
    setFormError(undefined)
    try {
      await create(name, muscleGroupIds)
      setMode({ type: 'list' })
    } catch (err) {
      if (err instanceof DuplicateExerciseNameError) setFormError('An exercise with this name already exists')
      else if (err instanceof NoMuscleGroupError) setFormError('Select at least one muscle group')
      else setFormError('Name cannot be empty')
    }
  }

  async function handleUpdate(id: string, name: string, muscleGroupIds: string[]) {
    setFormError(undefined)
    try {
      await update(id, name, muscleGroupIds)
      setMode({ type: 'list' })
    } catch (err) {
      if (err instanceof DuplicateExerciseNameError) setFormError('An exercise with this name already exists')
      else if (err instanceof NoMuscleGroupError) setFormError('Select at least one muscle group')
      else setFormError('Name cannot be empty')
    }
  }

  async function handleDelete(id: string) {
    await remove(id)
    setMode({ type: 'list' })
  }

  async function handleExport() {
    const json = await exportLibrary()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'exercise-library.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportClick() {
    setImportError(undefined)
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const proceed = window.confirm(
        'This will replace all muscle groups and exercises. Continue?',
      )
      if (!proceed) return
      await importLibrary(data)
    } catch (err) {
      if (err instanceof InvalidImportError) setImportError(err.message)
      else setImportError('Failed to read file. Make sure it is a valid export.')
    }
  }

  function reset() {
    setMode({ type: 'list' })
    setFormError(undefined)
  }

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Exercises</h1>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md font-medium"
              title="Export library"
            >
              Export
            </button>
            <button
              onClick={handleImportClick}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md font-medium"
              title="Import library"
            >
              Import
            </button>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />
          </div>
        </div>
        {importError && <p className="mt-1 text-xs text-red-600">{importError}</p>}
      </header>

      {/* Muscle group filter */}
      <div className="px-4 py-2 bg-white border-b border-gray-100">
        <select
          value={filterMuscleGroupId ?? ''}
          onChange={(e) => setFilterMuscleGroupId(e.target.value || undefined)}
          className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md bg-white"
        >
          <option value="">All muscle groups</option>
          {muscleGroups.map((mg) => (
            <option key={mg.id} value={mg.id}>{mg.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto">
        {exerciseDefinitions.length === 0 && mode.type === 'list' ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <p className="text-sm">No exercises yet.</p>
            <p className="text-sm">Tap + to add the first one.</p>
          </div>
        ) : (
          <div>
            {exerciseDefinitions.map((ed) => (
              <div key={ed.id}>
                {mode.type === 'editing' && mode.exercise.id === ed.id ? (
                  <div className="p-3">
                    <ExerciseForm
                      initial={{ name: mode.exercise.name, muscleGroupIds: mode.exercise.muscleGroupIds }}
                      muscleGroups={muscleGroups}
                      onSubmit={(name, ids) => handleUpdate(ed.id, name, ids)}
                      onCancel={reset}
                      error={formError}
                    />
                  </div>
                ) : mode.type === 'deleting' && mode.id === ed.id ? (
                  <div className="px-4 py-3 border-b border-gray-100 bg-red-50">
                    <p className="text-sm text-gray-700 mb-2">Delete <strong>{ed.name}</strong>?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(ed.id)}
                        className="px-4 py-1.5 bg-red-600 text-white text-sm rounded-md"
                      >
                        Delete
                      </button>
                      <button onClick={reset} className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center px-4 py-3 border-b border-gray-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">{ed.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {ed.muscleGroupIds.map(muscleGroupName).join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => { setFormError(undefined); setMode({ type: 'editing', exercise: ed }) }}
                      className="p-2 text-gray-400 hover:text-blue-600"
                      aria-label="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setMode({ type: 'deleting', id: ed.id, name: ed.name })}
                      className="p-2 text-gray-400 hover:text-red-600"
                      aria-label="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {mode.type === 'adding' && (
          <div className="p-3">
            <ExerciseForm
              muscleGroups={muscleGroups}
              onSubmit={handleCreate}
              onCancel={reset}
              error={formError}
            />
          </div>
        )}
      </div>

      {mode.type === 'list' && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={() => { setFormError(undefined); setMode({ type: 'adding' }) }}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium text-sm"
          >
            + Add Exercise
          </button>
        </div>
      )}
    </div>
  )
}
