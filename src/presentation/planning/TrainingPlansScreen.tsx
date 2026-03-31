import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DuplicatePlanNameError } from '@application/planning'
import type { TrainingPlanSummary } from '@application/planning'
import { useTrainingPlans } from './useTrainingPlans'
import { InlineEditForm } from '../shared/InlineEditForm'
import { ConfirmDeleteDialog } from '../shared/ConfirmDeleteDialog'

type Mode =
  | { type: 'list' }
  | { type: 'adding' }
  | { type: 'editing'; id: string; currentName: string }
  | { type: 'deleting'; id: string; name: string }

interface PlanRowProps {
  plan: TrainingPlanSummary
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
}

function PlanRow({ plan, onOpen, onEdit, onDelete }: PlanRowProps) {
  return (
    <div className="flex items-center px-4 py-3 border-b border-gray-100">
      <button onClick={onOpen} className="flex-1 text-left">
        <span className="text-sm font-medium text-gray-800">{plan.name}</span>
        <span className="ml-2 text-xs text-gray-400">{plan.slotCount} slots</span>
      </button>
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

export function TrainingPlansScreen() {
  const navigate = useNavigate()
  const { plans, create, rename, remove } = useTrainingPlans()
  const [mode, setMode] = useState<Mode>({ type: 'list' })
  const [formError, setFormError] = useState<string>()

  function reset() {
    setMode({ type: 'list' })
    setFormError(undefined)
  }

  async function handleCreate(name: string) {
    setFormError(undefined)
    try {
      await create(name)
      reset()
    } catch (err) {
      if (err instanceof DuplicatePlanNameError) setFormError('A plan with this name already exists')
      else setFormError('Name cannot be empty')
    }
  }

  async function handleRename(id: string, name: string) {
    setFormError(undefined)
    try {
      await rename(id, name)
      reset()
    } catch (err) {
      if (err instanceof DuplicatePlanNameError) setFormError('A plan with this name already exists')
      else setFormError('Name cannot be empty')
    }
  }

  async function handleDelete(id: string) {
    await remove(id)
    reset()
  }

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 py-4 border-b border-gray-200 bg-white">
        <h1 className="text-xl font-semibold text-gray-900">Training Plans</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {plans.length === 0 && mode.type === 'list' ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <p className="text-sm">No training plans yet.</p>
            <p className="text-sm">Tap "Add Training Plan" to get started.</p>
          </div>
        ) : (
          <div>
            {plans.map((plan) => (
              <div key={plan.id}>
                {mode.type === 'editing' && mode.id === plan.id ? (
                  <div className="p-3">
                    <InlineEditForm
                      initial={mode.currentName}
                      placeholder="Plan name"
                      onSubmit={(name) => handleRename(plan.id, name)}
                      onCancel={reset}
                      error={formError}
                    />
                  </div>
                ) : mode.type === 'deleting' && mode.id === plan.id ? (
                  <ConfirmDeleteDialog
                    itemName={plan.name}
                    onConfirm={() => handleDelete(plan.id)}
                    onCancel={reset}
                  />
                ) : (
                  <PlanRow
                    plan={plan}
                    onOpen={() => navigate(`/training-plans/${plan.id}`)}
                    onEdit={() => { setFormError(undefined); setMode({ type: 'editing', id: plan.id, currentName: plan.name }) }}
                    onDelete={() => { setFormError(undefined); setMode({ type: 'deleting', id: plan.id, name: plan.name }) }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {mode.type === 'adding' && (
          <div className="p-3">
            <InlineEditForm
              placeholder="Plan name"
              onSubmit={handleCreate}
              onCancel={reset}
              error={formError}
            />
          </div>
        )}
      </div>

      {mode.type === 'list' && (
        <div className="px-4 py-2 border-t border-gray-200 bg-white">
          <button
            onClick={() => { setFormError(undefined); setMode({ type: 'adding' }) }}
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium text-sm"
          >
            + Add Training Plan
          </button>
        </div>
      )}
    </div>
  )
}
