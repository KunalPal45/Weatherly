
import { useState } from 'react'

import {
  getCurrentWeather,
  getForecast,
  getCurrentWeatherByCoordinates,
  getForecastByCoordinates,
  getLocationFromPincode
} from './services/weatherService'

import WeatherMap from './components/WeatherMap'
import Forecast from './components/Forecast'
import WeatherDetails from './components/WeatherDetails'
import WeatherEffects from './components/WeatherEffects'
import SmartWeatherAssistant from './components/SmartWeatherAssistant'
import SolarTimeline from './components/SolarTimeline'

import './App.css'

function App() {
  const [city, setCity] = useState('Mumbai')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [locationInfo, setLocationInfo] = useState(null)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Search weather using city, PIN code or coordinates
  const handleSearch = async (e) => {
    e.preventDefault()

    const searchValue = city.trim()

    if (!searchValue) {
      setError('Please enter a city, PIN code or coordinates.')
      return
    }

    setLoading(true)
    setError('')
    setLocationInfo(null)

    try {
      let currentWeather
      let weatherForecast

      // Check latitude and longitude
      const coordinateMatch = searchValue.match(
        /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/
      )

      if (coordinateMatch) {
        const lat = Number(coordinateMatch[1])
        const lon = Number(coordinateMatch[2])

        if (
          lat < -90 ||
          lat > 90 ||
          lon < -180 ||
          lon > 180
        ) {
          throw new Error('INVALID_COORDINATES')
        }

        const results = await Promise.all([
          getCurrentWeatherByCoordinates(lat, lon),
          getForecastByCoordinates(lat, lon)
        ])

        currentWeather = results[0]
        weatherForecast = results[1]
      }

      // Check six-digit PIN code
      else if (/^\d{6}$/.test(searchValue)) {
        const location = await getLocationFromPincode(searchValue)

        const results = await Promise.all([
          getCurrentWeatherByCoordinates(
            location.lat,
            location.lon
          ),
          getForecastByCoordinates(
            location.lat,
            location.lon
          )
        ])

        currentWeather = results[0]
        weatherForecast = results[1]

        setLocationInfo({
          ...location,
          type: 'pincode'
        })
      }

      // Otherwise search by city
      else {
        const results = await Promise.all([
          getCurrentWeather(searchValue),
          getForecast(searchValue)
        ])

        currentWeather = results[0]
        weatherForecast = results[1]
      }

      setWeather(currentWeather)
      setForecast(weatherForecast)

    } catch (err) {
      console.error('Weather search error:', err)

      if (err.message === 'INVALID_COORDINATES') {
        setError(
          'Invalid coordinates. Latitude must be between -90 and 90, and longitude between -180 and 180.'
        )
      } else if (err.message === 'INVALID_PINCODE') {
        setError('Please enter a valid six-digit PIN code.')
      } else if (err.message === 'PIN_NOT_FOUND') {
        setError('PIN code not found. Please check and try again.')
      } else if (err.message === 'LOCATION_NOT_FOUND') {
        setError('Could not find the location for this PIN code.')
      } else if (err.response?.status === 404) {
        setError('Location not found. Please check your search.')
      } else if (err.response?.status === 401) {
        setError('Weather API key is invalid or not activated.')
      } else {
        setError(
          'Something went wrong while fetching weather data. Please try again.'
        )
      }

    } finally {
      setLoading(false)
    }
  }

  // Detect actual weather condition from API
  const weatherCondition =
    weather?.weather?.[0]?.main?.toLowerCase() || 'default'

  // Current date
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div className={`dashboard weather-${weatherCondition}`}>

      {/* Automatic weather animations */}
      <WeatherEffects weather={weather} />

      {/* Header */}
      <header className="top-header">

        <div className="brand">
          <span className="brand-icon">☀</span>

          <div>
            <h2>Weatherly</h2>
            <p>Weather Dashboard 2.0</p>
          </div>
        </div>

        {/* Search */}
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City, PIN code or lat, lon..."
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>

        </form>

      </header>

      {/* Welcome section */}
      <section className="welcome-section">

        <div>
          <h1>Weather Dashboard</h1>
          <p>Discover the weather around you.</p>
        </div>

        <div className="current-date">
          {currentDate}
        </div>

      </section>

      {/* Error message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Loading message */}
      {loading && (
        <div className="loading-message">
          <div className="loader"></div>
          <p>Getting the latest weather information...</p>
        </div>
      )}

      {/* Weather dashboard */}
      {weather && !loading && (

        <>

          {/* Current weather hero */}
          <section className="weather-hero">

            <div className="hero-location">

              <div>
                <h2>{weather.name}</h2>

                <p>
                  {weather.sys?.country}

                  {locationInfo?.type === 'pincode' && (
                    <>
                      {' '} | PIN: {locationInfo.pincode}
                      {' '} | {locationInfo.district}
                      {' '} | {locationInfo.state}
                    </>
                  )}
                </p>
              </div>

            </div>

            <div className="hero-weather">

              <div className="hero-temperature">
                {Math.round(weather.main?.temp)}°
              </div>

              <div className="hero-condition">

                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
                  alt={weather.weather?.[0]?.description || 'Weather'}
                />

                <p>
                  {weather.weather?.[0]?.description}
                </p>

                <span>
                  Feels like {Math.round(weather.main?.feels_like)}°C
                </span>

              </div>

            </div>

          </section>

          {/* New animated sunlight timeline */}
          <SolarTimeline weather={weather} />

          {/* Main dashboard grid */}
          <section className="main-grid">

            <WeatherMap weather={weather} />

            <Forecast forecast={forecast} />

          </section>

          {/* Weather details */}
          <section className="details-section">

            <WeatherDetails weather={weather} />

          </section>

          {/* Smart Weather Assistant */}
          <SmartWeatherAssistant
            weather={weather}
            forecast={forecast}
          />

          {/* Extended forecast */}
          <section className="extended-section">

            <h2>Weather Overview</h2>

            <p>
              Weather in {weather.name} is currently
              {' '}
              {weather.weather?.[0]?.description}.
              {' '}
              The temperature is {Math.round(weather.main?.temp)}°C,
              with humidity at {weather.main?.humidity}%.
            </p>

          </section>

        </>

      )}

      {/* Empty state */}
      {!weather && !loading && !error && (

        <section className="empty-state">

          <div className="empty-icon">🌤️</div>

          <h2>Welcome to Weatherly</h2>

          <p>
            Search for a city, PIN code or latitude and longitude
            to discover its weather.
          </p>

        </section>

      )}

      {/* Footer */}
      <footer className="footer">

        <p>
          Weatherly 2.0 | Your personal weather companion
        </p>

        <span>
          Powered by OpenWeather
        </span>

      </footer>

    </div>
  )
}

export default App
