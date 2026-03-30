import type { MuscleGroupVolume } from '@application/analytics'

interface Props {
  volumes: MuscleGroupVolume[]
}

export function MuscleGroupVolumeView({ volumes }: Props) {
  if (volumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-400">
        <p className="text-sm">No training data yet.</p>
      </div>
    )
  }

  const max = volumes[0].setCount

  return (
    <div className="px-4 py-3 space-y-3">
      {volumes.map(v => (
        <div key={v.muscleGroupId}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-800">{v.muscleGroupName}</span>
            <span className="text-gray-400">{v.setCount} sets</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(v.setCount / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
