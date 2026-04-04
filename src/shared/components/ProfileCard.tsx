interface ProfileCardProps {
  label: string
  value: string
  subtext?: string
}

export default function ProfileCard({ label, value, subtext }: ProfileCardProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-[20px] transition-colors hover:border-[var(--color-border-hover)]" role="group" aria-label={label}>
      <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-[var(--color-text-dim)] mb-[8px]" id={`card-${label.replace(/\s+/g, '-').toLowerCase()}`}>
        {label}
      </p>
      <p className="text-[18px] font-semibold text-[var(--color-text)] truncate font-[var(--font-mono)]" aria-describedby={`card-${label.replace(/\s+/g, '-').toLowerCase()}`}>
        {value}
      </p>
      {subtext && (
        <p className="text-[12px] text-[var(--color-text-sub)] mt-[6px]">{subtext}</p>
      )}
    </div>
  )
}
