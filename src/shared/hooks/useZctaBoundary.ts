import { useState, useEffect, useRef } from 'react'
import type { FeatureCollection } from 'geojson'

interface UseZctaBoundaryResult {
  geojson: FeatureCollection | null
  loading: boolean
  error: string | null
}

const TIGERWEB_BASE = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/PUMA_TAD_TAZ_UGA_ZCTA/MapServer/1/query'

export function useZctaBoundary(zip: string | null): UseZctaBoundaryResult {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cache = useRef(new Map<string, FeatureCollection>())
  const activeZip = useRef<string | null>(null)

  useEffect(() => {
    activeZip.current = zip

    if (!zip) {
      setGeojson(null)
      setError(null)
      setLoading(false)
      return
    }

    // Immediately clear old boundary to prevent stale display
    setGeojson(null)
    setError(null)

    const cached = cache.current.get(zip)
    if (cached) {
      setGeojson(cached)
      setLoading(false)
      return
    }

    setLoading(true)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const params = new URLSearchParams({
      where: `ZCTA5='${zip}'`,
      outFields: 'ZCTA5',
      outSR: '4326',
      f: 'geojson',
    })

    fetch(`${TIGERWEB_BASE}?${params}`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch boundary data')
        return res.json()
      })
      .then((data: FeatureCollection) => {
        if (activeZip.current !== zip) return // Stale response
        if (!data.features || data.features.length === 0) {
          throw new Error('No boundary found for this ZIP code')
        }
        cache.current.set(zip, data)
        setGeojson(data)
      })
      .catch(err => {
        if ((err as Error).name === 'AbortError') return
        if (activeZip.current !== zip) return // Stale error
        setError(err instanceof Error ? err.message : 'Failed to fetch boundary')
      })
      .finally(() => {
        if (activeZip.current === zip) setLoading(false)
      })

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [zip])

  return { geojson, loading, error }
}
