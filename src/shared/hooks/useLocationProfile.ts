import { useState, useCallback } from 'react'
import type { LocationProfileResponse } from '../../api/types'
import { demoClient, AggregateApiClient } from '../../api/client'

interface UseLocationProfileResult {
  data: LocationProfileResponse | null
  loading: boolean
  error: string | null
  fetchProfile: (zip: string) => Promise<void>
}

export function useLocationProfile(
  baseUrl?: string,
  apiKey?: string,
): UseLocationProfileResult {
  const [data, setData] = useState<LocationProfileResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async (zip: string) => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const client = (baseUrl || apiKey) ? new AggregateApiClient(baseUrl, apiKey) : demoClient
      const result = await client.getProfile(zip)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }, [baseUrl, apiKey])

  return { data, loading, error, fetchProfile }
}
