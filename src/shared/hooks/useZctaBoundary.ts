import { useState, useEffect, useRef, useCallback } from 'react'
import type { FeatureCollection } from 'geojson'

interface UseZctaBoundaryResult {
  geojson: FeatureCollection | null
  loading: boolean
  error: string | null
}

const TIGERWEB_BASE = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWCT_Current/MapServer/2/query'

export function useZctaBoundary(zip: string | null): UseZctaBoundaryResult {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cache = useRef(new Map<string, FeatureCollection>())

  const fetchBoundary = useCallback(async (zipCode: string, signal: AbortSignal) => {
    const cached = cache.current.get(zipCode)
    if (cached) {
      setGeojson(cached)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    setGeojson(null)

    try {
      const params = new URLSearchParams({
        where: `ZCTA5CE20='${zipCode}'`,
        outFields: '*',
        outSR: '4326',
        f: 'geojson',
      })

      const res = await fetch(`${TIGERWEB_BASE}?${params}`, {
        signal,
      })

      if (!res.ok) {
        throw new Error('Failed to fetch boundary data')
      }

      const data: FeatureCollection = await res.json()

      if (!data.features || data.features.length === 0) {
        throw new Error('No boundary found for this ZIP code')
      }

      cache.current.set(zipCode, data)
      setGeojson(data)
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Failed to fetch boundary')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!zip) {
      setGeojson(null)
      setError(null)
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    fetchBoundary(zip, controller.signal)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [zip, fetchBoundary])

  return { geojson, loading, error }
}
