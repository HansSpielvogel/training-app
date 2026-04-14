import { useState, useRef } from 'react'
import { InvalidImportError } from '@application/exercises'

interface ExerciseImportExportProps {
  onExport: () => Promise<string>
  onImport: (data: unknown) => Promise<void>
}

export function ExerciseImportExport({ onExport, onImport }: ExerciseImportExportProps) {
  const [importError, setImportError] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleExport() {
    const json = await onExport()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'exercise-library.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportClick() {
    setImportError(undefined)
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const proceed = window.confirm('This will replace all muscle groups and exercises. Continue?')
      if (!proceed) return
      await onImport(data)
    } catch (err) {
      if (err instanceof InvalidImportError) setImportError(err.message)
      else setImportError('Failed to read file. Make sure it is a valid export.')
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md font-medium"
          title="Export library"
        >
          Export
        </button>
        <button
          onClick={handleImportClick}
          className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md font-medium"
          title="Import library"
        >
          Import
        </button>
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />
      </div>
      {importError && <p className="mt-1 text-xs text-red-600">{importError}</p>}
    </>
  )
}
