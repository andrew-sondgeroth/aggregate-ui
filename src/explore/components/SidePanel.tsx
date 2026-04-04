import type { LocationProfileResponse } from '../../api/types'
import ZipInput from '../../shared/components/ZipInput'
import DataSourceBadge from '../../landing/components/DataSourceBadge'
import ProfileSummary from './ProfileSummary'

interface SidePanelProps {
  data: LocationProfileResponse | null
  loading: boolean
  error: string | null
  onSubmit: (zip: string) => void
}

function SkeletonCards() {
  return (
    <div className="px-5 pb-4 grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-[20px] animate-pulse">
          <div className="h-3 w-16 bg-[var(--color-border)] rounded mb-3" />
          <div className="h-5 w-20 bg-[var(--color-border)] rounded" />
        </div>
      ))}
    </div>
  )
}

export default function SidePanel({ data, loading, error, onSubmit }: SidePanelProps) {
  return (
    <div className="absolute top-4 left-4 bottom-4 z-[1000] w-[400px] max-w-[calc(100vw-32px)] flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-base)]/90 backdrop-blur-xl overflow-hidden">
      <div className="shrink-0 px-5 pt-5 pb-4 border-b border-[var(--color-border)]">
        <h1 className="text-[18px] font-semibold text-[var(--color-text)] mb-4">Explore</h1>
        <ZipInput onSubmit={onSubmit} loading={loading} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="px-5 py-4 text-[var(--color-red)] text-[14px]">{error}</div>
        )}

        {loading && !data && <SkeletonCards />}

        {data && (
          <>
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)]">
              <span className="font-[var(--font-mono)] text-[14px] font-medium text-[var(--color-gold)]">ZIP {data.zip}</span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(data.data_sources).map(([name, status]) => (
                  <DataSourceBadge key={name} name={name} status={status} />
                ))}
              </div>
            </div>
            <ProfileSummary data={data} />
          </>
        )}

        {!data && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
            <div className="h-12 w-12 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[var(--color-text-dim)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-[14px] text-[var(--color-text-sub)] mb-1">Enter a ZIP code to explore</p>
            <p className="text-[12px] text-[var(--color-text-dim)]">View the area boundary and location data</p>
          </div>
        )}
      </div>
    </div>
  )
}
