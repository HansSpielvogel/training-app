import { useState } from 'react'

interface InlineEditFormProps {
  initial?: string
  placeholder?: string
  onSubmit: (value: string) => void
  onCancel: () => void
  error?: string
}

export function InlineEditForm({ initial, placeholder, onSubmit, onCancel, error }: InlineEditFormProps) {
  const [value, setValue] = useState(initial ?? '')
  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit(value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onSubmit(value)}
          className="flex-1 py-2 bg-blue-600 text-white text-sm rounded-md font-medium"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm rounded-md font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
