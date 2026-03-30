import { useRegisterSW } from 'virtual:pwa-register/react'

export function UpdateBanner() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-blue-600 text-white px-4 flex items-center justify-between"
      style={{ paddingTop: '0.75rem', paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
    >
      <span className="text-sm">App updated — reload to apply.</span>
      <button
        onClick={() => updateServiceWorker(true)}
        className="ml-4 px-3 py-1 bg-white text-blue-600 text-sm font-medium rounded-md"
      >
        Reload
      </button>
    </div>
  )
}
