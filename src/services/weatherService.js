
import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0'
const OPEN_METEO_GEO_URL =
  'https://geocoding-api.open-meteo.com/v1/search'

// --------------------------------
// 1. Get current weather by city
// --------------------------------
export const getCurrentWeather = async (city) => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric'
    }
  })

  return response.data
}

// --------------------------------
// 2. Get forecast by city
// --------------------------------
export const getForecast = async (city) => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric'
    }
  })

  return response.data
}

// --------------------------------
// 3. Get current weather by coordinates
// --------------------------------
export const getCurrentWeatherByCoordinates = async (lat, lon) => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric'
    }
  })

  return response.data
}

// --------------------------------
// 4. Get forecast by coordinates
// --------------------------------
export const getForecastByCoordinates = async (lat, lon) => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric'
    }
  })

  return response.data
}

// --------------------------------
// 5. Get location using Indian PIN code
// --------------------------------
export const getLocationFromPincode = async (pincode) => {

  // Validate PIN code
  if (!/^\d{6}$/.test(pincode)) {
    throw new Error('INVALID_PINCODE')
  }

  // Step 1: Get postal details from India Post
  const postalResponse = await axios.get(
    `https://api.postalpincode.in/pincode/${pincode}`
  )

  const postalData = postalResponse.data?.[0]

  if (
    postalData?.Status !== 'Success' ||
    !postalData.PostOffice?.length
  ) {
    throw new Error('PIN_NOT_FOUND')
  }

  // Get the first post office result
  const office = postalData.PostOffice[0]

  // Step 2: Find district coordinates using OpenWeather
  const geoResponse = await axios.get(`${GEO_URL}/direct`, {
    params: {
      q: `${office.District},${office.State},IN`,
      limit: 1,
      appid: API_KEY
    }
  })

  const geoData = geoResponse.data?.[0]

  if (!geoData) {
    throw new Error('LOCATION_NOT_FOUND')
  }

  // Step 3: Return postal details and coordinates
  return {
    name: geoData.name,
    district: office.District,
    state: office.State,
    pincode,
    lat: geoData.lat,
    lon: geoData.lon,
    country: 'IN'
  }
}

// --------------------------------
// 6. Get city autocomplete suggestions
// --------------------------------
export const getCitySuggestions = async (query) => {

  // Step 1: Search Indian cities
  const indianRequest = axios.get(OPEN_METEO_GEO_URL, {
    params: {
      name: query,
      count: 5,
      language: 'en',
      countryCode: 'IN'
    }
  })

  // Step 2: Search international cities
  const globalRequest = axios.get(`${GEO_URL}/direct`, {
    params: {
      q: query,
      limit: 5,
      appid: API_KEY
    }
  })

  // Step 3: Run both searches
  const [indianResult, globalResult] = await Promise.allSettled([
    indianRequest,
    globalRequest
  ])

  // Step 4: Convert Indian results
  const indianCities =
    indianResult.status === 'fulfilled'
      ? (indianResult.value.data?.results || []).map((place) => ({
          name: place.name,
          state: place.admin1 || '',
          country: 'IN',
          lat: place.latitude,
          lon: place.longitude
        }))
      : []

  // Step 5: Get global results
  const globalCities =
    globalResult.status === 'fulfilled'
      ? globalResult.value.data || []
      : []

  // If both searches fail, report the error
  if (
    indianResult.status === 'rejected' &&
    globalResult.status === 'rejected'
  ) {
    throw globalResult.reason
  }

  // Step 6: Remove duplicate locations
  const uniqueGlobalCities = globalCities.filter((globalCity) => {

    return !indianCities.some((indianCity) => {

      const sameName =
        indianCity.name.toLowerCase() ===
        globalCity.name.toLowerCase()

      const sameCountry =
        indianCity.country === globalCity.country

      const sameCoordinates =
        Math.abs(indianCity.lat - globalCity.lat) < 0.01 &&
        Math.abs(indianCity.lon - globalCity.lon) < 0.01

      return sameCountry && (sameName || sameCoordinates)
    })
  })

  // Step 7: Return Indian cities first
  return [
    ...indianCities,
    ...uniqueGlobalCities
  ]
}
