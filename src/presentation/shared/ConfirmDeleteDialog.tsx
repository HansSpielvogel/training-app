interface ConfirmDeleteDialogProps {
  itemName: string
  messageSuffix?: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  error?: string
}

export function ConfirmDeleteDialog({
  itemName,
  messageSuffix,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  error,
}: ConfirmDeleteDialogProps) {
  return (
    <div className="px-4 py-3 border-b border-gray-100 bg-red-50">
      <p className="text-sm text-gray-700 mb-2">
        {confirmLabel} <strong>{itemName}</strong>{messageSuffix}?
      </p>
      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="px-4 py-1.5 bg-red-600 text-white text-sm rounded-md"
        >
          {confirmLabel}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
