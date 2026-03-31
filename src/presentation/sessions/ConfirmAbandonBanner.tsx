interface Props {
  onAbandon: () => void
  onCancel: () => void
}

export function ConfirmAbandonBanner({ onAbandon, onCancel }: Props) {
  return (
    <div className="px-4 py-3 bg-red-50 border-b border-red-200">
      <p className="text-sm font-medium text-red-800 mb-0.5">Abandon this session?</p>
      <p className="text-xs text-red-600 mb-3">All logged sets will be lost.</p>
      <div className="flex gap-2">
        <button
          onClick={onAbandon}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg font-medium"
        >
          Abandon
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg font-medium"
        >
          Keep Going
        </button>
      </div>
    </div>
  )
}
