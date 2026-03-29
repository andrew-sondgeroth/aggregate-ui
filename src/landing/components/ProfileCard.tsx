interface ProfileCardProps {
  label: string
  value: string
  subtext?: string
}

export default function ProfileCard({ label, value, subtext }: ProfileCardProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 transition-colors hover:border-[var(--color-border-hover)]">
      <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em] font-medium mb-1.5">{label}</div>
      <div className="text-lg font-semibold text-[var(--color-text-primary)] truncate font-[var(--font-mono)]">{value}</div>
      {subtext && <div className="text-xs text-[var(--color-text-secondary)] mt-1">{subtext}</div>}
    </div>
  )
}
