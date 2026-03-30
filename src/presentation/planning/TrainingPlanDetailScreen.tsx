import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { PlanSlotDetail } from '@application/planning'
import { DuplicatePlanNameError } from '@application/planning'
import { useTrainingPlanDetail } from './useTrainingPlanDetail'
import { useMuscleGroups } from '../exercises/useMuscleGroups'
import { InlineEditForm } from '../shared/InlineEditForm'
import { ConfirmDeleteDialog } from '../shared/ConfirmDeleteDialog'

type Mode =
  | { type: 'list' }
  | { type: 'adding' }
  | { type: 'deletingSlot'; slotId: string; name: string }
  | { type: 'renamingPlan'; currentName: string }
  | { type: 'deletingPlan' }

interface SlotRowProps {
  slot: PlanSlotDetail
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}

function SlotRow({ slot, isFirst, isLast, onMoveUp, onMoveDown, onDelete }: SlotRowProps) {
  return (
    <div className="flex items-center px-4 py-3 border-b border-gray-100">
      <span className="flex-1 text-sm text-gray-800">{slot.muscleGroupName}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="p-2 text-gray-400 disabled:opacity-20 hover:text-blue-600"
          aria-label="Move up"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="p-2 text-gray-400 disabled:opacity-20 hover:text-blue-600"
          aria-label="Move down"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-600"
          aria-label="Remove slot"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export function TrainingPlanDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { plan, addSlot, removeSlot, moveSlot, renamePlan, deletePlan } = useTrainingPlanDetail(id!)
  const { muscleGroups } = useMuscleGroups()
  const [mode, setMode] = useState<Mode>({ type: 'list' })
  const [renameError, setRenameError] = useState<string>()

  if (!plan) return null

  async function handleAdd(muscleGroupId: string) {
    await addSlot(muscleGroupId)
    setMode({ type: 'list' })
  }

  async function handleDeleteSlot(slotId: string) {
    await removeSlot(slotId)
    setMode({ type: 'list' })
  }

  async function handleRename(name: string) {
    setRenameError(undefined)
    try {
      await renamePlan(name)
      setMode({ type: 'list' })
    } catch (err) {
      if (err instanceof DuplicatePlanNameError) setRenameError('A plan with this name already exists')
      else setRenameError('Name cannot be empty')
    }
  }

  async function handleDeletePlan() {
    await deletePlan()
    navigate('/training-plans')
  }

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 py-4 border-b border-gray-200 bg-white flex items-center gap-3">
        <button
          onClick={() => navigate('/training-plans')}
          className="p-1 text-gray-500 hover:text-gray-800"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="flex-1 text-xl font-semibold text-gray-900">{plan.name}</h1>
        <button onClick={() => setMode({ type: 'renamingPlan', currentName: plan.name })} className="p-2 text-gray-400 hover:text-blue-600" aria-label="Rename plan">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button onClick={() => setMode({ type: 'deletingPlan' })} className="p-2 text-gray-400 hover:text-red-600" aria-label="Delete plan">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </header>

      {mode.type === 'renamingPlan' && (
        <div className="p-3 bg-blue-50 border-b border-blue-200">
          <InlineEditForm
            initial={mode.currentName}
            onSubmit={handleRename}
            onCancel={() => setMode({ type: 'list' })}
            error={renameError}
          />
        </div>
      )}

      {mode.type === 'deletingPlan' && (
        <ConfirmDeleteDialog
          itemName={plan.name}
          messageSuffix=" and all its slots"
          onConfirm={handleDeletePlan}
          onCancel={() => setMode({ type: 'list' })}
        />
      )}

      <div className="flex-1 overflow-y-auto">
        {plan.slots.length === 0 && mode.type === 'list' ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <p className="text-sm">No slots yet.</p>
            <p className="text-sm">Tap "Add Muscle Group" to get started.</p>
          </div>
        ) : (
          <div>
            {plan.slots.map((slot, index) => (
              <div key={slot.id}>
                {mode.type === 'deletingSlot' && mode.slotId === slot.id ? (
                  <ConfirmDeleteDialog
                    itemName={slot.muscleGroupName}
                    confirmLabel="Remove"
                    onConfirm={() => handleDeleteSlot(slot.id)}
                    onCancel={() => setMode({ type: 'list' })}
                  />
                ) : (
                  <SlotRow
                    slot={slot}
                    isFirst={index === 0}
                    isLast={index === plan.slots.length - 1}
                    onMoveUp={() => moveSlot(slot.id, 'up')}
                    onMoveDown={() => moveSlot(slot.id, 'down')}
                    onDelete={() => setMode({ type: 'deletingSlot', slotId: slot.id, name: slot.muscleGroupName })}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {mode.type === 'adding' && (
          <div className="p-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Select muscle group:</p>
            <div className="space-y-1">
              {muscleGroups.map((mg) => (
                <button
                  key={mg.id}
                  onClick={() => handleAdd(mg.id)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-800 bg-gray-50 hover:bg-blue-50 rounded-md border border-gray-200"
                >
                  {mg.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMode({ type: 'list' })}
              className="mt-3 w-full py-2 bg-gray-100 text-gray-700 text-sm rounded-md"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {mode.type === 'list' && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={() => setMode({ type: 'adding' })}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium text-sm"
          >
            + Add Muscle Group
          </button>
        </div>
      )}
    </div>
  )
}
