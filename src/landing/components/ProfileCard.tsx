interface ProfileCardProps {
  label: string
  value: string
  subtext?: string
}

export default function ProfileCard({ label, value, subtext }: ProfileCardProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 sm:p-6">
      <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="text-xl sm:text-2xl font-semibold text-[var(--color-text-primary)] truncate">
        {value}
      </div>
      {subtext && (
        <div className="text-xs text-[var(--color-text-secondary)] mt-1.5">
          {subtext}
        </div>
      )}
    </div>
  )
}
