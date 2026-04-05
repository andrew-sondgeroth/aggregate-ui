import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents } from 'react-leaflet'
import type { FeatureCollection } from 'geojson'
import { useEffect, useState, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapViewProps {
  geojson: FeatureCollection | null
  zip: string | null
  loading: boolean
  onClickZip: (zip: string) => void
}

const GOLD = '#f0b429'
const US_CENTER: [number, number] = [39.8, -98.5]
const DEFAULT_ZOOM = 4
const BOUNDARY_STYLE = { color: GOLD, weight: 2, fillColor: GOLD, fillOpacity: 0.15 }
const TIGERWEB_BASE = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/PUMA_TAD_TAZ_UGA_ZCTA/MapServer/1/query'

function FitBounds({ geojson }: { geojson: FeatureCollection }) {
  const map = useMap()

  useEffect(() => {
    const layer = L.geoJSON(geojson)
    const bounds = layer.getBounds()
    if (bounds.isValid()) {
      map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 14, duration: 1 })
    }
  }, [geojson, map])

  return null
}

function MapClickHandler({ onClickZip, onLookupChange }: { onClickZip: (zip: string) => void; onLookupChange: (loading: boolean) => void }) {
  const handleClick = useCallback(async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng
    onLookupChange(true)
    try {
      const params = new URLSearchParams({
        geometry: `${lng},${lat}`,
        geometryType: 'esriGeometryPoint',
        inSR: '4326',
        spatialRel: 'esriSpatialRelIntersects',
        outFields: 'ZCTA5',
        returnGeometry: 'false',
        f: 'json',
      })
      const res = await fetch(`${TIGERWEB_BASE}?${params}`)
      if (!res.ok) return
      const data = await res.json()
      const zcta = data.features?.[0]?.attributes?.ZCTA5
      if (zcta) {
        onClickZip(zcta)
      }
    } catch {
      // Silently ignore — user can retry by clicking again
    } finally {
      onLookupChange(false)
    }
  }, [onClickZip, onLookupChange])

  useMapEvents({ click: handleClick })
  return null
}

export default function MapView({ geojson, zip, loading, onClickZip }: MapViewProps) {
  const [lookingUp, setLookingUp] = useState(false)
  const isLoading = loading || lookingUp

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={US_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapClickHandler onClickZip={onClickZip} onLookupChange={setLookingUp} />

        {geojson && (
          <>
            <GeoJSON
              key={zip}
              data={geojson}
              style={BOUNDARY_STYLE}
            />
            <FitBounds geojson={geojson} />
          </>
        )}
      </MapContainer>

      {isLoading && (
        <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2 rounded-lg bg-[var(--color-bg-card)]/90 backdrop-blur px-4 py-2 border border-[var(--color-border)] text-[13px] text-[var(--color-text-sub)]">
          <svg className="animate-spin h-4 w-4 text-[var(--color-gold)]" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {lookingUp ? 'Finding ZIP code...' : 'Loading boundary...'}
        </div>
      )}
    </div>
  )
}
