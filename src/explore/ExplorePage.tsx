import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useLocationProfile } from '../shared/hooks/useLocationProfile'
import { useZctaBoundary } from '../shared/hooks/useZctaBoundary'
import MapView from './components/MapView'
import SidePanel from './components/SidePanel'

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const zip = searchParams.get('zip')
  const { data, loading, error, fetchProfile } = useLocationProfile()
  const { geojson, loading: boundaryLoading, error: boundaryError } = useZctaBoundary(zip)

  useEffect(() => {
    if (zip) {
      fetchProfile(zip)
    }
  }, [zip, fetchProfile])

  const handleSubmit = (newZip: string) => {
    setSearchParams({ zip: newZip })
  }

  return (
    <div className="relative" style={{ height: 'calc(100vh - 64px)' }}>
      <MapView geojson={geojson} zip={zip} loading={boundaryLoading} onClickZip={handleSubmit} />
      <SidePanel
        data={data}
        loading={loading}
        error={error || boundaryError}
        onSubmit={handleSubmit}
        lastZip={zip}
      />
    </div>
  )
}
