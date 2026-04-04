import { useState, useEffect, useRef } from 'react'

export interface ZipCentroid {
  zip: string
  lat: number
  lon: number
}

const TIGERWEB_BASE = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/PUMA_TAD_TAZ_UGA_ZCTA/MapServer/1/query'
const BATCH_SIZE = 50

interface UseZctaCentroidsResult {
  centroids: ZipCentroid[]
  loading: boolean
  error: string | null
}

async function fetchBatch(zips: string[], signal: AbortSignal): Promise<ZipCentroid[]> {
  const whereClause = `ZCTA5 IN (${zips.map(z => `'${z}'`).join(',')})`
  const params = new URLSearchParams({
    where: whereClause,
    outFields: 'ZCTA5,CENTLAT,CENTLON',
    returnGeometry: 'false',
    f: 'json',
  })

  const res = await fetch(`${TIGERWEB_BASE}?${params}`, { signal })
  if (!res.ok) throw new Error('Failed to fetch centroids')

  const data = await res.json()
  if (!data.features) return []

  return data.features.map((f: { attributes: { ZCTA5: string; CENTLAT: string; CENTLON: string } }) => ({
    zip: f.attributes.ZCTA5,
    lat: parseFloat(f.attributes.CENTLAT),
    lon: parseFloat(f.attributes.CENTLON),
  }))
}

export function useZctaCentroids(zips: string[]): UseZctaCentroidsResult {
  const [centroids, setCentroids] = useState<ZipCentroid[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cache = useRef(new Map<string, ZipCentroid>())

  useEffect(() => {
    if (zips.length === 0) {
      setCentroids([])
      return
    }

    const uncached = zips.filter(z => !cache.current.has(z))
    const cached = zips.filter(z => cache.current.has(z)).map(z => cache.current.get(z)!)

    if (uncached.length === 0) {
      setCentroids(cached)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    const batches: string[][] = []
    for (let i = 0; i < uncached.length; i += BATCH_SIZE) {
      batches.push(uncached.slice(i, i + BATCH_SIZE))
    }

    Promise.all(batches.map(batch => fetchBatch(batch, controller.signal)))
      .then(results => {
        const fetched = results.flat()
        fetched.forEach(c => cache.current.set(c.zip, c))
        setCentroids([...cached, ...fetched])
      })
      .catch(err => {
        if ((err as Error).name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'Failed to fetch centroids')
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [zips.join(',')])

  return { centroids, loading, error }
}
