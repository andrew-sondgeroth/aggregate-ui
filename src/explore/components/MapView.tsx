import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import type { FeatureCollection } from 'geojson'
import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapViewProps {
  geojson: FeatureCollection | null
  zip: string | null
  loading: boolean
}

const GOLD = '#f0b429'
const US_CENTER: [number, number] = [39.8, -98.5]
const DEFAULT_ZOOM = 4
const BOUNDARY_STYLE = { color: GOLD, weight: 2, fillColor: GOLD, fillOpacity: 0.15 }

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

export default function MapView({ geojson, zip, loading }: MapViewProps) {
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

      {loading && (
        <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2 rounded-lg bg-[var(--color-bg-card)]/90 backdrop-blur px-4 py-2 border border-[var(--color-border)] text-[13px] text-[var(--color-text-sub)]">
          <svg className="animate-spin h-4 w-4 text-[var(--color-gold)]" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading boundary...
        </div>
      )}
    </div>
  )
}
