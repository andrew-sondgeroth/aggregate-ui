import { useState } from 'react'
import type { LocationProfileResponse } from '../../api/types'
import ZipInput from '../../shared/components/ZipInput'
import SidePanelContainer, { SkeletonCards } from '../../shared/components/SidePanelContainer'
import ErrorMessage from '../../shared/components/ErrorMessage'
import DataSourceBadge from '../../shared/components/DataSourceBadge'
import ProfileSummary from './ProfileSummary'

interface SidePanelProps {
  data: LocationProfileResponse | null
  loading: boolean
  error: string | null
  onSubmit: (zip: string) => void
  lastZip?: string | null
}

export default function SidePanel({ data, loading, error, onSubmit, lastZip }: SidePanelProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <SidePanelContainer
      title="Explore"
      header={<ZipInput onSubmit={onSubmit} loading={loading} value={lastZip ?? ''} />}
      expanded={expanded}
    >
      {error && (
        <ErrorMessage message={error} onRetry={lastZip ? () => onSubmit(lastZip) : undefined} />
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
          <ProfileSummary data={data} onExpandedChange={setExpanded} />
        </>
      )}

      {!data && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
          <div className="h-12 w-12 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-[var(--color-text-dim)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-[14px] text-[var(--color-text-sub)] mb-1">Enter a ZIP code to explore</p>
          <p className="text-[12px] text-[var(--color-text-dim)]">View the area boundary and location data</p>
        </div>
      )}
    </SidePanelContainer>
  )
}
