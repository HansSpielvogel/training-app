import type { MuscleGroup } from '@application/exercises'
import type { TrainingPlan } from '@application/planning'

interface Props {
  showMuscleGroupPicker: boolean
  showPlanPicker: boolean
  muscleGroups: MuscleGroup[]
  availablePlans: TrainingPlan[]
  planPickerMessage?: string
  onAddTempSlot: (muscleGroupId: string) => void
  onAddPlanSlots: (planId: string) => void
  onOpenMuscleGroupPicker: () => void
  onOpenPlanPicker: () => void
  onCancelMuscleGroupPicker: () => void
  onCancelPlanPicker: () => void
}

export function SlotPickerPanel({
  showMuscleGroupPicker,
  showPlanPicker,
  muscleGroups,
  availablePlans,
  planPickerMessage,
  onAddTempSlot,
  onAddPlanSlots,
  onOpenMuscleGroupPicker,
  onOpenPlanPicker,
  onCancelMuscleGroupPicker,
  onCancelPlanPicker,
}: Props) {
  if (showMuscleGroupPicker) {
    return (
      <div className="px-4 pt-3 pb-2">
        <p className="text-xs text-gray-500 mb-2">Select muscle group:</p>
        <div className="max-h-40 overflow-y-auto">
          {muscleGroups.map(mg => (
            <button
              key={mg.id}
              onClick={() => onAddTempSlot(mg.id)}
              className="block w-full text-left px-3 py-2 text-sm text-gray-700 active:bg-gray-50 rounded-md min-h-[44px]"
            >
              {mg.name}
            </button>
          ))}
        </div>
        <button
          onClick={onCancelMuscleGroupPicker}
          className="mt-1 w-full py-2 text-sm text-gray-500 border border-gray-200 rounded-md"
        >
          Cancel
        </button>
      </div>
    )
  }

  if (showPlanPicker) {
    return (
      <div className="px-4 pt-3 pb-2">
        <p className="text-xs text-gray-500 mb-2">Add slots from plan:</p>
        {planPickerMessage && (
          <p className="text-xs text-amber-600 mb-2">{planPickerMessage}</p>
        )}
        <div className="max-h-40 overflow-y-auto">
          {availablePlans.length === 0 ? (
            <p className="text-xs text-gray-400 py-2">No other plans available.</p>
          ) : (
            availablePlans.map(plan => (
              <button
                key={plan.id}
                onClick={() => onAddPlanSlots(plan.id)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 active:bg-gray-50 rounded-md min-h-[44px]"
              >
                {plan.name}
              </button>
            ))
          )}
        </div>
        <button
          onClick={onCancelPlanPicker}
          className="mt-1 w-full py-2 text-sm text-gray-500 border border-gray-200 rounded-md"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 py-2 flex gap-3 border-b border-gray-100">
      <button
        onClick={onOpenMuscleGroupPicker}
        className="py-1.5 px-3 text-sm text-blue-600 font-medium border border-blue-200 rounded-full"
      >
        + Add muscle group
      </button>
      <button
        onClick={onOpenPlanPicker}
        className="py-1.5 px-3 text-sm text-blue-600 font-medium border border-blue-200 rounded-full"
      >
        + Add plan
      </button>
    </div>
  )
}
