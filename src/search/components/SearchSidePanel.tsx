import type { LocationProfileResponse, LocationSearchResponse, SearchFieldsResponse, SearchCriterion } from '../../api/types'
import type { CriterionRow } from './CriteriaBuilder'
import DataSourceBadge from '../../landing/components/DataSourceBadge'
import ProfileSummary from '../../explore/components/ProfileSummary'
import CriteriaBuilder from './CriteriaBuilder'

type View = 'search' | 'results' | 'profile'

interface SearchSidePanelProps {
  view: View
  onViewChange: (view: View) => void
  // Search
  fields: SearchFieldsResponse | null
  fieldsLoading: boolean
  searchLoading: boolean
  searchError: string | null
  onSearch: (criteria: SearchCriterion[], limit: number) => void
  criteriaRows: CriterionRow[]
  setCriteriaRows: React.Dispatch<React.SetStateAction<CriterionRow[]>>
  criteriaLimit: string
  setCriteriaLimit: React.Dispatch<React.SetStateAction<string>>
  // Results
  results: LocationSearchResponse | null
  selectedZip: string | null
  onSelectZip: (zip: string) => void
  // Profile
  profileData: LocationProfileResponse | null
  profileLoading: boolean
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-[13px] text-[var(--color-text-sub)] hover:text-[var(--color-text)] transition mb-3"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  )
}

function ResultsList({ results, selectedZip, onSelect }: {
  results: LocationSearchResponse
  selectedZip: string | null
  onSelect: (zip: string) => void
}) {
  return (
    <div className="space-y-2">
      <div className="text-[12px] text-[var(--color-text-dim)] mb-3">
        {results.total_matches.toLocaleString()} matches, showing {results.returned}
      </div>
      {results.results.map(r => (
        <button
          key={r.zip}
          onClick={() => onSelect(r.zip)}
          className={`w-full text-left rounded-xl border p-3 transition ${
            r.zip === selectedZip
              ? 'border-[var(--color-gold)]/50 bg-[var(--color-bg-card)]'
              : 'border-[var(--color-border)] bg-[var(--color-bg-alt)] hover:border-[var(--color-border-hover)]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-[var(--font-mono)] text-[14px] font-medium text-[var(--color-text)]">{r.zip}</span>
            <span className="font-[var(--font-mono)] text-[12px] text-[var(--color-gold)]">{r.composite_score.toFixed(1)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-gold)]"
              style={{ width: `${Math.min(r.composite_score, 100)}%` }}
            />
          </div>
          {Object.keys(r.field_scores).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {Object.entries(r.field_scores).slice(0, 3).map(([field, score]) => (
                <span key={field} className="text-[10px] text-[var(--color-text-dim)]">
                  {field.replace(/_/g, ' ')}: <span className="text-[var(--color-text-sub)]">{score.value.toLocaleString()}</span>
                </span>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

function SkeletonCards() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-3 animate-pulse">
          <div className="h-4 w-16 bg-[var(--color-border)] rounded mb-2" />
          <div className="h-1.5 bg-[var(--color-border)] rounded-full" />
        </div>
      ))}
    </div>
  )
}

export default function SearchSidePanel(props: SearchSidePanelProps) {
  const {
    view, onViewChange,
    fields, fieldsLoading, searchLoading, searchError, onSearch,
    criteriaRows, setCriteriaRows, criteriaLimit, setCriteriaLimit,
    results, selectedZip, onSelectZip,
    profileData, profileLoading,
  } = props

  return (
    <div className="absolute top-4 left-4 bottom-4 z-[1000] w-[400px] max-w-[calc(100vw-32px)] flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-base)]/90 backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-5 pt-5 pb-4 border-b border-[var(--color-border)]">
        <h1 className="text-[18px] font-semibold text-[var(--color-text)]">
          {view === 'search' && 'Search'}
          {view === 'results' && 'Results'}
          {view === 'profile' && `ZIP ${selectedZip}`}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {view === 'search' && (
          <CriteriaBuilder
            fields={fields}
            fieldsLoading={fieldsLoading}
            loading={searchLoading}
            onSearch={onSearch}
            rows={criteriaRows}
            setRows={setCriteriaRows}
            limit={criteriaLimit}
            setLimit={setCriteriaLimit}
          />
        )}

        {view === 'results' && (
          <div className="px-5 py-4">
            <BackButton onClick={() => onViewChange('search')} label="Back to search" />

            {searchError && (
              <div className="text-[var(--color-red)] text-[14px] mb-3">{searchError}</div>
            )}

            {searchLoading && <SkeletonCards />}

            {results && (
              <ResultsList
                results={results}
                selectedZip={selectedZip}
                onSelect={onSelectZip}
              />
            )}

            {!results && !searchLoading && !searchError && (
              <div className="text-[14px] text-[var(--color-text-dim)] text-center py-8">No results</div>
            )}
          </div>
        )}

        {view === 'profile' && (
          <div className="py-4">
            <div className="px-5">
              <BackButton onClick={() => onViewChange('results')} label="Back to results" />
            </div>

            {profileLoading && (
              <div className="px-5 pb-4 grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-[20px] animate-pulse">
                    <div className="h-3 w-16 bg-[var(--color-border)] rounded mb-3" />
                    <div className="h-5 w-20 bg-[var(--color-border)] rounded" />
                  </div>
                ))}
              </div>
            )}

            {profileData && (
              <>
                <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)]">
                  <span className="font-[var(--font-mono)] text-[14px] font-medium text-[var(--color-gold)]">ZIP {profileData.zip}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(profileData.data_sources).map(([name, status]) => (
                      <DataSourceBadge key={name} name={name} status={status} />
                    ))}
                  </div>
                </div>
                <ProfileSummary data={profileData} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
