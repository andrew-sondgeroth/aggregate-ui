import type { DataSourceStatus } from '../../api/types'

interface DataSourceBadgeProps {
  name: string
  status: DataSourceStatus
}

export default function DataSourceBadge({ name, status }: DataSourceBadgeProps) {
  const available = status.available

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium font-[var(--font-mono)] px-2.5 py-1 rounded-md border ${
        available
          ? 'border-[var(--color-accent-green)]/20 text-[var(--color-accent-green)] bg-[var(--color-accent-green)]/5'
          : 'border-[var(--color-accent-red)]/20 text-[var(--color-accent-red)] bg-[var(--color-accent-red)]/5'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${available ? 'bg-[var(--color-accent-green)]' : 'bg-[var(--color-accent-red)]'}`}
      />
      {name}
    </span>
  )
}
