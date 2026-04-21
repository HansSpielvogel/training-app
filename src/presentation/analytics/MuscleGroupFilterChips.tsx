import type { MuscleGroup } from '@application/exercises'

interface Props {
  groups: MuscleGroup[]
  selected: string | null
  onSelect: (id: string | null) => void
}

export function MuscleGroupFilterChips({ groups, selected, onSelect }: Props) {
  if (groups.length === 0) return null
  return (
    <div className="relative">
    <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none">
      {groups.map(g => (
        <button
          key={g.id}
          onClick={() => onSelect(selected === g.id ? null : g.id)}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            selected === g.id
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-300'
          }`}
        >
          {g.name}
        </button>
      ))}
    </div>
    <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />
    </div>
  )
}
