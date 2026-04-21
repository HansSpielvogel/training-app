import { SessionProgressBar } from './SessionProgressBar'

interface Props {
  planName: string
  doneCount: number
  totalEntries: number
  hasAnyActivity: boolean
  onAbandon: () => void
}

export function SessionHeader({ planName, doneCount, totalEntries, hasAnyActivity, onAbandon }: Props) {
  return (
    <header
      className="px-4 py-4 border-b border-gray-200 bg-white"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
    >
      <div className="flex items-center justify-between">
        <h1 className="flex-1 min-w-0 truncate text-xl font-semibold text-gray-900 leading-tight">{planName}</h1>
        <button
          onClick={onAbandon}
          className="ml-3 p-2 text-sm text-red-500 min-h-[44px] flex items-center"
        >
          Abandon
        </button>
      </div>
      <SessionProgressBar done={doneCount} total={totalEntries} />
      {!hasAnyActivity && (
        <p className="text-sm text-gray-500 mt-1">Tap a slot to log sets</p>
      )}
    </header>
  )
}
