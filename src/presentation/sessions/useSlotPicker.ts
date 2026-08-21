import { useState } from 'react'
import type { TrainingSession } from '@application/sessions'
import type { TrainingPlan } from '@application/planning'

// Muscle-group/plan picker panel state and its add-slot handlers
export function useSlotPicker(
  session: TrainingSession | null,
  addTempSlot: (muscleGroupId: string) => Promise<void>,
  addPlanSlots: (planId: string) => Promise<number>,
  listPlans: () => Promise<TrainingPlan[]>,
) {
  const [showMuscleGroupPicker, setShowMuscleGroupPicker] = useState(false)
  const [showPlanPicker, setShowPlanPicker] = useState(false)
  const [availablePlans, setAvailablePlans] = useState<TrainingPlan[]>([])
  const [planPickerMessage, setPlanPickerMessage] = useState<string>()

  async function handleAddTempSlot(muscleGroupId: string) {
    setShowMuscleGroupPicker(false)
    await addTempSlot(muscleGroupId)
  }

  async function handleOpenPlanPicker() {
    const plans = await listPlans()
    setAvailablePlans(plans.filter((p) => p.id !== session?.planId))
    setShowPlanPicker(true)
    setPlanPickerMessage(undefined)
  }

  async function handleAddPlanSlots(planId: string) {
    const added = await addPlanSlots(planId)
    if (added === 0) {
      setPlanPickerMessage('All muscle groups from that plan are already in this session.')
    } else {
      setShowPlanPicker(false)
    }
  }

  return {
    showMuscleGroupPicker, setShowMuscleGroupPicker,
    showPlanPicker, setShowPlanPicker,
    availablePlans,
    planPickerMessage,
    handleAddTempSlot,
    handleOpenPlanPicker,
    handleAddPlanSlots,
  }
}
