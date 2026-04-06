import { useState } from 'react'

interface ProfileCardProps {
  label: string
  value: string
  subtext?: string
  tooltip?: string
}

export default function ProfileCard({ label, value, subtext, tooltip }: ProfileCardProps) {
  const [showTip, setShowTip] = useState(false)

  return (
    <div
      className="relative rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-[20px] transition-colors hover:border-[var(--color-border-hover)]"
      role="group"
      aria-label={label}
      onMouseEnter={() => tooltip && setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-[var(--color-text-dim)] mb-[8px] flex items-center gap-1.5">
        {label}
        {tooltip && (
          <svg className="w-3 h-3 text-[var(--color-text-dim)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4m0-4h.01" />
          </svg>
        )}
      </p>
      <p className="text-[18px] font-semibold text-[var(--color-text)] truncate font-[var(--font-mono)]">
        {value}
      </p>
      {subtext && (
        <p className="text-[12px] text-[var(--color-text-sub)] mt-[6px]">{subtext}</p>
      )}
      {showTip && tooltip && (
        <div className="absolute z-20 left-0 right-0 top-full mt-2 px-3 py-2 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[12px] text-[var(--color-text-sub)] leading-relaxed shadow-lg pointer-events-none">
          {tooltip}
        </div>
      )}
    </div>
  )
}
