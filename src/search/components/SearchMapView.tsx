import { MapContainer, TileLayer, CircleMarker, Tooltip, GeoJSON, useMap } from 'react-leaflet'
import type { FeatureCollection } from 'geojson'
import type { ZipCentroid } from '../../shared/hooks/useZctaCentroids'
import { useEffect, useMemo, memo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface SearchMapViewProps {
  centroids: ZipCentroid[]
  scores: Map<string, number>
  selectedZip: string | null
  boundary: FeatureCollection | null
  onSelectZip: (zip: string) => void
}

const GOLD = '#f0b429'
const BLUE = '#60a5fa'
const US_CENTER: [number, number] = [39.8, -98.5]
const DEFAULT_ZOOM = 4
const BOUNDARY_STYLE = { color: GOLD, weight: 2, fillColor: GOLD, fillOpacity: 0.15 }
const TOOLTIP_STYLE = { fontFamily: 'var(--font-mono)', fontSize: '12px' }

function FitMarkers({ centroids }: { centroids: ZipCentroid[] }) {
  const map = useMap()

  useEffect(() => {
    if (centroids.length === 0) return
    const bounds = L.latLngBounds(centroids.map(c => [c.lat, c.lon]))
    if (bounds.isValid()) {
      map.flyToBounds(bounds, { padding: [80, 80], maxZoom: 12, duration: 1 })
    }
  }, [centroids, map])

  return null
}

export default memo(function SearchMapView({ centroids, scores, selectedZip, boundary, onSelectZip }: SearchMapViewProps) {
  const maxScore = useMemo(() => {
    let max = 0
    scores.forEach(v => { if (v > max) max = v })
    return max || 1
  }, [scores])

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

        {boundary && selectedZip && (
          <GeoJSON
            key={`boundary-${selectedZip}`}
            data={boundary}
            style={BOUNDARY_STYLE}
          />
        )}

        {centroids.map(c => {
          const score = scores.get(c.zip) ?? 0
          const normalized = score / maxScore
          const radius = 6 + normalized * 8
          const isSelected = c.zip === selectedZip

          return (
            <CircleMarker
              key={c.zip}
              center={[c.lat, c.lon]}
              radius={radius}
              pathOptions={{
                color: isSelected ? BLUE : GOLD,
                fillColor: isSelected ? BLUE : GOLD,
                fillOpacity: isSelected ? 0.9 : 0.3 + normalized * 0.4,
                weight: isSelected ? 3 : 1.5,
              }}
              eventHandlers={{
                click: () => onSelectZip(c.zip),
              }}
            >
              <Tooltip direction="top" offset={[0, -radius]}>
                <span style={TOOLTIP_STYLE}>{c.zip} — Score: {score.toFixed(1)}</span>
              </Tooltip>
            </CircleMarker>
          )
        })}

        {centroids.length > 0 && <FitMarkers centroids={centroids} />}
      </MapContainer>
    </div>
  )
})
