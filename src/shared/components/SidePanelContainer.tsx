import { useState, type ReactNode } from 'react'

interface SidePanelContainerProps {
  title: string
  header?: ReactNode
  children: ReactNode
  expanded?: boolean
}

export default function SidePanelContainer({ title, header, children, expanded = false }: SidePanelContainerProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile toggle button — visible only on small screens when collapsed */}
      <button
        onClick={() => setCollapsed(false)}
        className={`sm:hidden fixed bottom-4 left-4 z-[1001] rounded-xl bg-[var(--color-gold)] px-5 py-3 font-semibold text-[var(--color-bg-base)] text-[14px] shadow-lg shadow-[var(--color-gold)]/20 ${collapsed ? '' : 'hidden'}`}
        aria-label="Open panel"
      >
        {title}
      </button>

      {/* Panel: bottom sheet on mobile, left sidebar on desktop */}
      <div className={`
        absolute z-[1000] flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-base)]/90 backdrop-blur-xl overflow-hidden
        inset-x-2 bottom-2 top-auto h-[55vh]
        sm:inset-x-auto sm:top-4 sm:left-4 sm:bottom-4 sm:h-auto
        transition-all duration-300
        ${expanded ? 'sm:w-[calc(100vw-32px)] sm:max-w-[800px]' : 'sm:w-[400px]'}
        ${collapsed ? 'translate-y-[calc(100%+16px)] sm:translate-y-0 sm:-translate-x-[calc(100%+32px)]' : ''}
      `}>
        <div className="shrink-0 px-5 pt-5 pb-4 border-b border-[var(--color-border)] flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-[18px] font-semibold text-[var(--color-text)] mb-4">{title}</h1>
            {header}
          </div>
          {/* Collapse button */}
          <button
            onClick={() => setCollapsed(true)}
            className="shrink-0 mt-0.5 p-1.5 rounded-lg text-[var(--color-text-dim)] hover:text-[var(--color-text-sub)] hover:bg-[var(--color-bg-card)] transition"
            aria-label="Collapse panel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}

export function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="px-5 pb-4 grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-[20px] animate-pulse">
          <div className="h-3 w-16 bg-[var(--color-border)] rounded mb-3" />
          <div className="h-5 w-20 bg-[var(--color-border)] rounded" />
        </div>
      ))}
    </div>
  )
}
