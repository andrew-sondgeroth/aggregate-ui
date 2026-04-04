import type { ReactNode } from 'react'

interface SidePanelContainerProps {
  title: string
  header?: ReactNode
  children: ReactNode
}

export default function SidePanelContainer({ title, header, children }: SidePanelContainerProps) {
  return (
    <div className="absolute top-4 left-4 bottom-4 z-[1000] w-[400px] max-w-[calc(100vw-32px)] flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-base)]/90 backdrop-blur-xl overflow-hidden">
      <div className="shrink-0 px-5 pt-5 pb-4 border-b border-[var(--color-border)]">
        <h1 className="text-[18px] font-semibold text-[var(--color-text)] mb-4">{title}</h1>
        {header}
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
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
