import type { DataSourceStatus } from '../../api/types'

interface DataSourceBadgeProps {
  name: string
  status: DataSourceStatus
}

export default function DataSourceBadge({ name, status }: DataSourceBadgeProps) {
  const ok = status.available

  return (
    <span
      className={`inline-flex items-center gap-[6px] text-[12px] font-medium font-[var(--font-mono)] px-[10px] py-[4px] rounded-md border ${
        ok
          ? 'border-[var(--color-green)]/20 text-[var(--color-green)] bg-[var(--color-green)]/5'
          : 'border-[var(--color-red)]/20 text-[var(--color-red)] bg-[var(--color-red)]/5'
      }`}
      role="status"
      aria-label={`${name}: ${ok ? 'available' : 'unavailable'}`}
    >
      <span className={`h-[6px] w-[6px] rounded-full ${ok ? 'bg-[var(--color-green)]' : 'bg-[var(--color-red)]'}`} aria-hidden="true" />
      {name}
    </span>
  )
}
