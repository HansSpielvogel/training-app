import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getTrainingPlan,
  deleteTrainingPlan,
} from '@application/planning'
import type { TrainingPlanDetail, PlanSlotDetail } from '@application/planning'
import { DexieTrainingPlanRepository } from '@infrastructure/planning/DexieTrainingPlanRepository'
import { DexieMuscleGroupRepository } from '@infrastructure/exercises/DexieMuscleGroupRepository'

// Hooks are the composition root — they wire use cases to repositories
export function useTrainingPlanDetail(planId: string) {
  const repo = useRef(new DexieTrainingPlanRepository()).current
  const muscleGroupRepo = useRef(new DexieMuscleGroupRepository()).current
  const navigate = useNavigate()
  const [plan, setPlan] = useState<TrainingPlanDetail | undefined>()

  useEffect(() => {
    getTrainingPlan(repo, muscleGroupRepo, planId).then(setPlan)
  }, [repo, muscleGroupRepo, planId])

  const addSlot = useCallback((muscleGroupId: string) => {
    if (!plan) return
    const maxOrder = plan.slots.reduce((max, s) => Math.max(max, s.order), 0)
    const newSlot: PlanSlotDetail = {
      id: crypto.randomUUID(),
      muscleGroupId,
      muscleGroupName: muscleGroupId,
      order: maxOrder + 1,
      optional: false,
    }
    setPlan((prev) => prev ? { ...prev, slots: [...prev.slots, newSlot] } : prev)
  }, [plan])

  const removeSlot = useCallback((slotId: string) => {
    setPlan((prev) => prev ? { ...prev, slots: prev.slots.filter((s) => s.id !== slotId) } : prev)
  }, [])

  const moveSlot = useCallback((slotId: string, direction: 'up' | 'down') => {
    setPlan((prev) => {
      if (!prev) return prev
      const slots = [...prev.slots]
      const index = slots.findIndex((s) => s.id === slotId)
      if (index === -1) return prev
      const swapIndex = direction === 'up' ? index - 1 : index + 1
      if (swapIndex < 0 || swapIndex >= slots.length) return prev
      const a = slots[index]
      const b = slots[swapIndex]
      slots[index] = { ...a, order: b.order }
      slots[swapIndex] = { ...b, order: a.order }
      return { ...prev, slots }
    })
  }, [])

  const renamePlan = useCallback((newName: string) => {
    const trimmed = newName.trim()
    if (!trimmed) throw new Error('Name cannot be empty')
    setPlan((prev) => prev ? { ...prev, name: trimmed } : prev)
  }, [])

  const toggleSlotOptional = useCallback((slotId: string, optional: boolean) => {
    setPlan((prev) => prev
      ? { ...prev, slots: prev.slots.map((s) => s.id === slotId ? { ...s, optional } : s) }
      : prev
    )
  }, [])

  const save = useCallback(async () => {
    if (!plan) return
    await repo.savePlan({ id: plan.id, name: plan.name, createdAt: plan.createdAt })
    await repo.deleteSlotsByPlan(plan.id)
    await repo.saveSlots(plan.slots.map((s) => ({
      id: s.id,
      planId: plan.id,
      muscleGroupId: s.muscleGroupId,
      order: s.order,
      optional: s.optional || undefined,
    })))
    navigate('/training-plans')
  }, [plan, repo, navigate])

  const discard = useCallback(() => {
    navigate('/training-plans')
  }, [navigate])

  const deletePlan = useCallback(async () => {
    await deleteTrainingPlan(repo, planId)
  }, [repo, planId])

  return { plan, addSlot, removeSlot, moveSlot, toggleSlotOptional, renamePlan, save, discard, deletePlan }
}
