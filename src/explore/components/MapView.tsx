import { MapContainer, TileLayer, WMSTileLayer, useMap, useMapEvents } from 'react-leaflet'
import type { FeatureCollection } from 'geojson'
import { useEffect, useState, useCallback, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapViewProps {
  geojson: FeatureCollection | null
  zip: string | null
  loading: boolean
  onClickZip: (zip: string) => void
}

const GREEN = '#34d399'
const US_CENTER: [number, number] = [39.8, -98.5]
const DEFAULT_ZOOM = 4
const BOUNDARY_STYLE: L.PathOptions = { color: GREEN, weight: 2, fillColor: GREEN, fillOpacity: 0.15 }
const TIGERWEB_BASE = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/PUMA_TAD_TAZ_UGA_ZCTA/MapServer/1/query'
const TIGERWEB_WMS = 'https://tigerweb.geo.census.gov/arcgis/services/TIGERweb/tigerWMS_Current/MapServer/WMSServer'
const ZCTA_BOUNDARY_MIN_ZOOM = 9

// Imperative layer management — removes old layers immediately when zip/geojson changes
function SelectedBoundary({ zip, geojson }: { zip: string | null; geojson: FeatureCollection | null }) {
  const map = useMap()
  const layerRef = useRef<L.GeoJSON | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    // Always remove old layers first
    if (layerRef.current) {
      map.removeLayer(layerRef.current)
      layerRef.current = null
    }
    if (markerRef.current) {
      map.removeLayer(markerRef.current)
      markerRef.current = null
    }

    if (!zip || !geojson) return

    // Add new boundary layer
    const layer = L.geoJSON(geojson, { style: BOUNDARY_STYLE })
    layer.addTo(map)
    layerRef.current = layer

    // Add zip label at centroid
    const bounds = layer.getBounds()
    if (bounds.isValid()) {
      const center = bounds.getCenter()
      const icon = L.divIcon({
        className: '',
        html: `<div style="font-family:var(--font-mono);font-size:13px;font-weight:600;color:${GREEN};text-shadow:0 1px 4px rgba(0,0,0,0.8),0 0 2px rgba(0,0,0,0.9);white-space:nowrap;pointer-events:none">${zip}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      })
      const marker = L.marker(center, { icon, interactive: false })
      marker.addTo(map)
      markerRef.current = marker

      map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 14, duration: 1 })
    }

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
        markerRef.current = null
      }
    }
  }, [zip, geojson, map])

  return null
}

function ZctaBoundaryOverlay() {
  const map = useMap()
  const [visible, setVisible] = useState(map.getZoom() >= ZCTA_BOUNDARY_MIN_ZOOM)

  useMapEvents({
    zoomend: () => setVisible(map.getZoom() >= ZCTA_BOUNDARY_MIN_ZOOM),
  })

  if (!visible) return null

  return (
    <WMSTileLayer
      url={TIGERWEB_WMS}
      layers="77"
      format="image/png"
      transparent
      opacity={0.4}
      minZoom={ZCTA_BOUNDARY_MIN_ZOOM}
      className="zcta-wms-overlay"
    />
  )
}

function MapClickHandler({ onClickZip, onLookupChange }: { onClickZip: (zip: string) => void; onLookupChange: (loading: boolean) => void }) {
  const activeRequest = useRef(0)

  const handleClick = useCallback(async (e: L.LeafletMouseEvent) => {
    const requestId = ++activeRequest.current
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
      if (!res.ok || activeRequest.current !== requestId) return
      const data = await res.json()
      if (activeRequest.current !== requestId) return
      const zcta = data.features?.[0]?.attributes?.ZCTA5
      if (zcta) {
        onClickZip(zcta)
      }
    } catch {
      // Silently ignore
    } finally {
      if (activeRequest.current === requestId) {
        onLookupChange(false)
      }
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

        <ZctaBoundaryOverlay />
        <MapClickHandler onClickZip={onClickZip} onLookupChange={setLookingUp} />
        <SelectedBoundary zip={zip} geojson={geojson} />
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
