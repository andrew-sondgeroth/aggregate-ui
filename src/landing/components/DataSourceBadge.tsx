import type { DataSourceStatus } from '../../api/types'

interface DataSourceBadgeProps {
  name: string
  status: DataSourceStatus
}

export default function DataSourceBadge({ name, status }: DataSourceBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full"
      style={{
        backgroundColor: status.available
          ? 'rgba(34, 197, 94, 0.1)'
          : 'rgba(239, 68, 68, 0.1)',
        color: status.available
          ? 'var(--color-accent-green)'
          : 'var(--color-accent-red)',
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: status.available
            ? 'var(--color-accent-green)'
            : 'var(--color-accent-red)',
        }}
      />
      {name}
    </span>
  )
}
