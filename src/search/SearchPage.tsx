import { useState, useEffect, useMemo, useCallback } from 'react'
import { useLocationSearch } from '../shared/hooks/useLocationSearch'
import { useLocationProfile } from '../shared/hooks/useLocationProfile'
import { useZctaBoundary } from '../shared/hooks/useZctaBoundary'
import { useZctaCentroids } from '../shared/hooks/useZctaCentroids'
import { emptyRow } from './components/CriteriaBuilder'
import type { CriterionRow } from './components/CriteriaBuilder'
import type { SearchCriterion } from '../api/types'
import SearchMapView from './components/SearchMapView'
import SearchSidePanel from './components/SearchSidePanel'

type View = 'search' | 'results' | 'profile'

export default function SearchPage() {
  const [view, setView] = useState<View>('search')
  const [selectedZip, setSelectedZip] = useState<string | null>(null)
  const [criteriaRows, setCriteriaRows] = useState<CriterionRow[]>([emptyRow()])
  const [criteriaLimit, setCriteriaLimit] = useState('25')

  const { results, fields, loading: searchLoading, fieldsLoading, error: searchError, search } = useLocationSearch()
  const { data: profileData, loading: profileLoading, fetchProfile } = useLocationProfile()
  const { geojson: boundary } = useZctaBoundary(selectedZip)

  const resultZips = useMemo(
    () => results?.results.map(r => r.zip) ?? [],
    [results]
  )
  const { centroids } = useZctaCentroids(resultZips)

  const scores = useMemo(() => {
    const map = new Map<string, number>()
    results?.results.forEach(r => map.set(r.zip, r.composite_score))
    return map
  }, [results])

  const handleSearch = useCallback(async (criteria: SearchCriterion[], limit: number) => {
    await search({ criteria, limit })
    setView('results')
    setSelectedZip(null)
  }, [search])

  const handleSelectZip = useCallback((zip: string) => {
    setSelectedZip(zip)
    setView('profile')
    fetchProfile(zip)
  }, [fetchProfile])

  // If selected zip changes externally (e.g. marker click), fetch profile
  useEffect(() => {
    if (selectedZip && view === 'profile') {
      fetchProfile(selectedZip)
    }
  }, [selectedZip])

  return (
    <div className="relative" style={{ height: 'calc(100vh - 64px)' }}>
      <SearchMapView
        centroids={centroids}
        scores={scores}
        selectedZip={selectedZip}
        boundary={boundary}
        onSelectZip={handleSelectZip}
      />
      <SearchSidePanel
        view={view}
        onViewChange={setView}
        fields={fields}
        fieldsLoading={fieldsLoading}
        searchLoading={searchLoading}
        searchError={searchError}
        onSearch={handleSearch}
        criteriaRows={criteriaRows}
        setCriteriaRows={setCriteriaRows}
        criteriaLimit={criteriaLimit}
        setCriteriaLimit={setCriteriaLimit}
        results={results}
        selectedZip={selectedZip}
        onSelectZip={handleSelectZip}
        profileData={profileData}
        profileLoading={profileLoading}
      />
    </div>
  )
}
