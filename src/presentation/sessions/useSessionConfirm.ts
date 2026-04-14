import { useState, useCallback } from 'react'

export function useSessionConfirm(
  complete: () => Promise<void>,
  abandon: () => Promise<void>,
  onDone: () => void,
) {
  const [confirmFinish, setConfirmFinish] = useState(false)
  const [confirmAbandon, setConfirmAbandon] = useState(false)

  const handleComplete = useCallback(async () => {
    await complete()
    onDone()
  }, [complete, onDone])

  const handleAbandon = useCallback(async () => {
    await abandon()
    onDone()
  }, [abandon, onDone])

  return { confirmFinish, setConfirmFinish, confirmAbandon, setConfirmAbandon, handleComplete, handleAbandon }
}
