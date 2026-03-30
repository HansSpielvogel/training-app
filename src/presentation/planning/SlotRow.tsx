import type { PlanSlotDetail } from '@application/planning'

interface SlotRowProps {
  slot: PlanSlotDetail
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}

export function SlotRow({ slot, isFirst, isLast, onMoveUp, onMoveDown, onDelete }: SlotRowProps) {
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
