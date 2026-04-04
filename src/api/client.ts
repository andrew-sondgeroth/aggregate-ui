import type { LocationProfileResponse, LocationSearchRequest, LocationSearchResponse, SearchFieldsResponse } from './types'

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://aggregateapi-production.up.railway.app'

export class AggregateApiClient {
  baseUrl: string
  apiKey: string

  constructor(baseUrl: string = DEFAULT_BASE_URL, apiKey: string = '') {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    }
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey
    }

    const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new ApiError(res.status, body || res.statusText)
    }

    return res.json()
  }

  async getProfile(zip: string): Promise<LocationProfileResponse> {
    return this.request(`/api/v1/location-profile?zip=${encodeURIComponent(zip)}`)
  }

  async search(request: LocationSearchRequest): Promise<LocationSearchResponse> {
    return this.request('/api/v1/location-search', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getSearchFields(): Promise<SearchFieldsResponse> {
    return this.request('/api/v1/search-fields')
  }
}

export class ApiError extends Error {
  status: number
  body: string

  constructor(status: number, body: string) {
    super(`API error ${status}: ${body}`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export const demoClient = new AggregateApiClient(
  DEFAULT_BASE_URL,
  import.meta.env.VITE_DEMO_API_KEY || '',
)
