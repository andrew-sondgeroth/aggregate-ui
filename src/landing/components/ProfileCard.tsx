interface ProfileCardProps {
  label: string
  value: string
  subtext?: string
}

export default function ProfileCard({ label, value, subtext }: ProfileCardProps) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
      <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-xl font-semibold text-[var(--color-text-primary)]">
        {value}
      </div>
      {subtext && (
        <div className="text-xs text-[var(--color-text-secondary)] mt-1">
          {subtext}
        </div>
      )}
    </div>
  )
}
