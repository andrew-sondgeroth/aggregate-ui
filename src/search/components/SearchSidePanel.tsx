import type { LocationProfileResponse, LocationSearchResponse, SearchFieldsResponse, SearchCriterion } from '../../api/types'
import type { CriterionRow } from './CriteriaBuilder'
import SidePanelContainer, { SkeletonCards } from '../../shared/components/SidePanelContainer'
import DataSourceBadge from '../../landing/components/DataSourceBadge'
import ProfileSummary from '../../explore/components/ProfileSummary'
import CriteriaBuilder from './CriteriaBuilder'

type View = 'search' | 'results' | 'profile'

interface SearchSidePanelProps {
  view: View
  onViewChange: (view: View) => void
  fields: SearchFieldsResponse | null
  fieldsLoading: boolean
  searchLoading: boolean
  searchError: string | null
  onSearch: (criteria: SearchCriterion[], limit: number) => void
  criteriaRows: CriterionRow[]
  setCriteriaRows: React.Dispatch<React.SetStateAction<CriterionRow[]>>
  criteriaLimit: string
  setCriteriaLimit: React.Dispatch<React.SetStateAction<string>>
  results: LocationSearchResponse | null
  selectedZip: string | null
  onSelectZip: (zip: string) => void
  profileData: LocationProfileResponse | null
  profileLoading: boolean
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-[13px] text-[var(--color-text-sub)] hover:text-[var(--color-text)] transition mb-3"
      aria-label={label}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
          <div className="h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden" role="progressbar" aria-valuenow={r.composite_score} aria-valuemin={0} aria-valuemax={100}>
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

const TITLES: Record<View, string> = {
  search: 'Search',
  results: 'Results',
  profile: 'Profile',
}

export default function SearchSidePanel(props: SearchSidePanelProps) {
  const {
    view, onViewChange,
    fields, fieldsLoading, searchLoading, searchError, onSearch,
    criteriaRows, setCriteriaRows, criteriaLimit, setCriteriaLimit,
    results, selectedZip, onSelectZip,
    profileData, profileLoading,
  } = props

  const title = view === 'profile' && selectedZip ? `ZIP ${selectedZip}` : TITLES[view]

  return (
    <SidePanelContainer title={title}>
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

          {searchLoading && <SkeletonCards count={3} />}

          {results && !searchLoading && results.results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-[14px] text-[var(--color-text-sub)] mb-1">No matching ZIP codes found</p>
              <p className="text-[12px] text-[var(--color-text-dim)]">Try adjusting your criteria or widening the ranges</p>
            </div>
          )}

          {results && results.results.length > 0 && (
            <ResultsList
              results={results}
              selectedZip={selectedZip}
              onSelect={onSelectZip}
            />
          )}
        </div>
      )}

      {view === 'profile' && (
        <div className="py-4">
          <div className="px-5">
            <BackButton onClick={() => onViewChange('results')} label="Back to results" />
          </div>

          {profileLoading && <SkeletonCards />}

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
    </SidePanelContainer>
  )
}
