import type { PlanSlotDetail } from '@application/planning'

interface SlotRowProps {
  slot: PlanSlotDetail
  isFirst: boolean
  isLast: boolean
  onToggleOptional: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}

export function SlotRow({ slot, isFirst, isLast, onToggleOptional, onMoveUp, onMoveDown, onDelete }: SlotRowProps) {
  return (
    <div className="flex items-center px-4 py-3 border-b border-gray-100">
      <span className="flex-1 text-sm text-gray-800">{slot.muscleGroupName}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleOptional}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded border min-h-[44px] ${
            slot.optional
              ? 'text-amber-800 border-amber-300 bg-amber-100 font-medium'
              : 'text-gray-400 border-gray-200 bg-gray-50'
          }`}
          aria-label={slot.optional ? 'Mark as required' : 'Mark as optional'}
        >
          <span className={`w-3 h-3 rounded-sm border flex items-center justify-center flex-shrink-0 ${
            slot.optional ? 'bg-amber-500 border-amber-500' : 'border-gray-300'
          }`}>
            {slot.optional && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          Evtl
        </button>
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="p-3 text-gray-400 disabled:opacity-20 hover:text-blue-600"
          aria-label="Move up"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="p-3 text-gray-400 disabled:opacity-20 hover:text-blue-600"
          aria-label="Move down"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-3 text-gray-400 hover:text-red-600"
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
