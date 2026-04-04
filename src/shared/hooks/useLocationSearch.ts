import { useState, useCallback, useEffect } from 'react'
import type { LocationSearchRequest, LocationSearchResponse, SearchFieldsResponse } from '../../api/types'
import { demoClient } from '../../api/client'

interface UseLocationSearchResult {
  results: LocationSearchResponse | null
  fields: SearchFieldsResponse | null
  loading: boolean
  fieldsLoading: boolean
  error: string | null
  search: (request: LocationSearchRequest) => Promise<void>
}

export function useLocationSearch(): UseLocationSearchResult {
  const [results, setResults] = useState<LocationSearchResponse | null>(null)
  const [fields, setFields] = useState<SearchFieldsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [fieldsLoading, setFieldsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFieldsLoading(true)
    demoClient.getSearchFields()
      .then(setFields)
      .catch(() => {})
      .finally(() => setFieldsLoading(false))
  }, [])

  const search = useCallback(async (request: LocationSearchRequest) => {
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const result = await demoClient.search(request)
      setResults(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, fields, loading, fieldsLoading, error, search }
}
