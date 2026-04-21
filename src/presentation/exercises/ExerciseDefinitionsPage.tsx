import { useState } from 'react'
import type { ExerciseDefinition } from '@application/exercises'
import { DuplicateExerciseNameError, NoMuscleGroupError } from '@application/exercises'
import { useMuscleGroups } from './useMuscleGroups'
import { useExerciseDefinitions } from './useExerciseDefinitions'
import { ExerciseForm } from './ExerciseForm'
import { ExerciseRow } from './ExerciseRow'
import { ConfirmDeleteDialog } from '../shared/ConfirmDeleteDialog'
import { MuscleGroupFilterChips } from '../shared/MuscleGroupFilterChips'
import { ExerciseImportExport } from './ExerciseImportExport'

type Mode =
  | { type: 'list' }
  | { type: 'adding' }
  | { type: 'editing'; exercise: ExerciseDefinition }
  | { type: 'deleting'; id: string; name: string }

export function ExerciseDefinitionsPage() {
  const { muscleGroups } = useMuscleGroups()
  const [filterMuscleGroupId, setFilterMuscleGroupId] = useState<string | undefined>()
  const { exerciseDefinitions, lastUsedByExercise, create, update, remove, exportLibrary, importLibrary } =
    useExerciseDefinitions(filterMuscleGroupId)
  const [mode, setMode] = useState<Mode>({ type: 'list' })
  const [formError, setFormError] = useState<string>()

  function muscleGroupName(id: string) {
    return muscleGroups.find((mg) => mg.id === id)?.name ?? id
  }

  async function handleCreate(name: string, muscleGroupIds: string[], defaultSets: number) {
    setFormError(undefined)
    try {
      await create(name, muscleGroupIds, undefined, defaultSets)
      setMode({ type: 'list' })
    } catch (err) {
      if (err instanceof DuplicateExerciseNameError) setFormError('An exercise with this name already exists')
      else if (err instanceof NoMuscleGroupError) setFormError('Select at least one muscle group')
      else setFormError('Name cannot be empty')
    }
  }

  async function handleUpdate(id: string, name: string, muscleGroupIds: string[], defaultSets: number) {
    setFormError(undefined)
    try {
      await update(id, name, muscleGroupIds, undefined, defaultSets)
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

  function reset() {
    setMode({ type: 'list' })
    setFormError(undefined)
  }

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Exercises</h1>
          <ExerciseImportExport onExport={exportLibrary} onImport={importLibrary} />
        </div>
      </header>

      <div className="bg-white border-b border-gray-100">
        <MuscleGroupFilterChips
          groups={muscleGroups}
          selected={filterMuscleGroupId ?? null}
          onSelect={(id) => setFilterMuscleGroupId(id ?? undefined)}
        />
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
                      initial={{ name: mode.exercise.name, muscleGroupIds: mode.exercise.muscleGroupIds, defaultSets: mode.exercise.defaultSets }}
                      muscleGroups={muscleGroups}
                      onSubmit={(name, ids, sets) => handleUpdate(ed.id, name, ids, sets)}
                      onCancel={reset}
                      error={formError}
                    />
                  </div>
                ) : mode.type === 'deleting' && mode.id === ed.id ? (
                  <ConfirmDeleteDialog
                    itemName={ed.name}
                    onConfirm={() => handleDelete(ed.id)}
                    onCancel={reset}
                  />
                ) : (
                  <ExerciseRow
                    ed={ed}
                    muscleGroupNames={ed.muscleGroupIds.map(muscleGroupName).join(', ')}
                    lastUsed={lastUsedByExercise[ed.id]}
                    onEdit={() => { setFormError(undefined); setMode({ type: 'editing', exercise: ed }) }}
                    onDelete={() => setMode({ type: 'deleting', id: ed.id, name: ed.name })}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {mode.type === 'adding' && (
          <div className="p-3">
            <ExerciseForm
              muscleGroups={muscleGroups}
              onSubmit={(name, ids, sets) => handleCreate(name, ids, sets)}
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
