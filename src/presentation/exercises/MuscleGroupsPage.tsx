import { useState } from 'react'
import { DuplicateNameError, MuscleGroupInUseError } from '@application/exercises'
import type { MuscleGroup } from '@application/exercises'
import { useMuscleGroups } from './useMuscleGroups'

type Mode =
  | { type: 'list' }
  | { type: 'adding' }
  | { type: 'editing'; id: string; currentName: string }
  | { type: 'deleting'; id: string; name: string }

function InlineForm({
  initial,
  onSubmit,
  onCancel,
  error,
}: {
  initial?: string
  onSubmit: (name: string) => void
  onCancel: () => void
  error?: string
}) {
  const [value, setValue] = useState(initial ?? '')
  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit(value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Muscle group name"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onSubmit(value)}
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

function MuscleGroupRow({
  mg,
  onEdit,
  onDelete,
}: {
  mg: MuscleGroup
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-center px-4 py-3 border-b border-gray-100">
      <span className="flex-1 text-sm text-gray-800">{mg.name}</span>
      <button onClick={onEdit} className="p-2 text-gray-400 hover:text-blue-600" aria-label="Rename">
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

export function MuscleGroupsPage() {
  const { muscleGroups, create, rename, remove } = useMuscleGroups()
  const [mode, setMode] = useState<Mode>({ type: 'list' })
  const [formError, setFormError] = useState<string>()
  const [deleteError, setDeleteError] = useState<string>()

  async function handleCreate(name: string) {
    setFormError(undefined)
    try {
      await create(name)
      setMode({ type: 'list' })
    } catch (err) {
      if (err instanceof DuplicateNameError) setFormError('A muscle group with this name already exists')
      else setFormError('Name cannot be empty')
    }
  }

  async function handleRename(id: string, name: string) {
    setFormError(undefined)
    try {
      await rename(id, name)
      setMode({ type: 'list' })
    } catch (err) {
      if (err instanceof DuplicateNameError) setFormError('A muscle group with this name already exists')
      else setFormError('Name cannot be empty')
    }
  }

  async function handleDelete(id: string) {
    setDeleteError(undefined)
    try {
      await remove(id)
      setMode({ type: 'list' })
    } catch (err) {
      if (err instanceof MuscleGroupInUseError) {
        setDeleteError('This muscle group is used by exercises. Remove those exercises first.')
      }
    }
  }

  function startEdit(mg: MuscleGroup) {
    setFormError(undefined)
    setDeleteError(undefined)
    setMode({ type: 'editing', id: mg.id, currentName: mg.name })
  }

  function startDelete(mg: MuscleGroup) {
    setFormError(undefined)
    setDeleteError(undefined)
    setMode({ type: 'deleting', id: mg.id, name: mg.name })
  }

  function reset() {
    setMode({ type: 'list' })
    setFormError(undefined)
    setDeleteError(undefined)
  }

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-semibold text-gray-900">Muscle Groups</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {muscleGroups.length === 0 && mode.type === 'list' ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <p className="text-sm">No muscle groups yet.</p>
            <p className="text-sm">Tap "Add Muscle Group" to get started.</p>
          </div>
        ) : (
          <div>
            {muscleGroups.map((mg) => (
              <div key={mg.id}>
                {mode.type === 'editing' && mode.id === mg.id ? (
                  <div className="p-3">
                    <InlineForm
                      initial={mode.currentName}
                      onSubmit={(name) => handleRename(mg.id, name)}
                      onCancel={reset}
                      error={formError}
                    />
                  </div>
                ) : mode.type === 'deleting' && mode.id === mg.id ? (
                  <div className="px-4 py-3 border-b border-gray-100 bg-red-50">
                    <p className="text-sm text-gray-700 mb-2">Delete <strong>{mg.name}</strong>?</p>
                    {deleteError && <p className="text-xs text-red-600 mb-2">{deleteError}</p>}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(mg.id)}
                        className="px-4 py-1.5 bg-red-600 text-white text-sm rounded-md"
                      >
                        Delete
                      </button>
                      <button
                        onClick={reset}
                        className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <MuscleGroupRow
                    mg={mg}
                    onEdit={() => startEdit(mg)}
                    onDelete={() => startDelete(mg)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {mode.type === 'adding' && (
          <div className="p-3">
            <InlineForm
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
            + Add Muscle Group
          </button>
        </div>
      )}
    </div>
  )
}
