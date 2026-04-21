interface Props {
  confirmFinish: boolean
  onKeepGoing: () => void
  onConfirmFinish: () => void
  onRequestFinish: () => void
}

export function SessionFooter({ confirmFinish, onKeepGoing, onConfirmFinish, onRequestFinish }: Props) {
  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="px-4 py-2">
        {confirmFinish ? (
          <div className="flex gap-2">
            <button
              onClick={onKeepGoing}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm"
            >
              Keep Going
            </button>
            <button
              onClick={onConfirmFinish}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium text-sm"
            >
              Finish
            </button>
          </div>
        ) : (
          <button
            onClick={onRequestFinish}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium text-sm"
          >
            Finish Session
          </button>
        )}
      </div>
    </div>
  )
}
