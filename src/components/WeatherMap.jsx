
import { useEffect } from 'react'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom map marker
const locationIcon = L.divIcon({
  className: 'custom-weather-marker',
  html: `
    <div style="
      width: 22px;
      height: 22px;
      background: #ef4444;
      border: 4px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 12px rgba(0,0,0,0.4);
    "></div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
})

// This component moves the map when coordinates change
function MapUpdater({ center }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(center, 10, {
      duration: 1.5
    })
  }, [center, map])

  return null
}

function WeatherMap({ weather }) {

  // Get coordinates from OpenWeather response
  const latitude = weather?.coord?.lat
  const longitude = weather?.coord?.lon

  // Don't render map without valid coordinates
  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number'
  ) {
    return (
      <div className="map-card">
        <p>Location coordinates are not available.</p>
      </div>
    )
  }

  const center = [latitude, longitude]

  return (
    <div className="map-card">

      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom={true}
        className="weather-map"
      >

        {/* Move map when a new location is searched */}
        <MapUpdater center={center} />

        {/* OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Location marker */}
        <Marker
          position={center}
          icon={locationIcon}
        >
          <Popup>
            <strong>{weather.name}</strong>
            <br />
            Latitude: {latitude.toFixed(4)}
            <br />
            Longitude: {longitude.toFixed(4)}
          </Popup>
        </Marker>

      </MapContainer>

      <div className="map-location">
        <strong>{weather.name}</strong>
        <br />
        Latitude: {latitude.toFixed(4)} | Longitude: {longitude.toFixed(4)}
      </div>

    </div>
  )
}

export default WeatherMap
