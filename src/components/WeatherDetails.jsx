import Icon from './Icon'


function WeatherDetails({ weather }) {
  if (!weather) return null

  const windSpeed = (weather.wind.speed * 3.6).toFixed(1)

  const getWindDirection = (degree) => {
    const directions = [
      'N', 'NE', 'E', 'SE',
      'S', 'SW', 'W', 'NW'
    ]

    return directions[
      Math.round(degree / 45) % 8
    ]
  }

  const formatTime = (timestamp) => {
    return new Date(
      (timestamp + weather.timezone) * 1000
    ).toISOString().slice(11, 16)
  }

  const details = [
    {
      icon: 'droplet',
      label: 'Humidity',
      value: `${weather.main.humidity}%`
    },
    {
      icon: 'wind',
      label: 'Wind speed',
      value: `${windSpeed} km/h`
    },
    {
      icon: 'compass',
      label: 'Wind direction',
      value: getWindDirection(weather.wind.deg || 0)
    },
    {
      icon: 'cloud',
      label: 'Cloud cover',
      value: `${weather.clouds.all}%`
    },
    {
      icon: 'gauge',
      label: 'Pressure',
      value: `${weather.main.pressure} hPa`
    },
    {
      icon: 'eye',
      label: 'Visibility',
      value: `${(weather.visibility / 1000).toFixed(1)} km`
    },
    {
      icon: 'thermometer',
      label: 'Feels like',
      value: `${Math.round(weather.main.feels_like)}°C`
    },
    {
      icon: 'sunrise',
      label: 'Sunrise',
      value: formatTime(weather.sys.sunrise)
    },
    {
      icon: 'sunset',
      label: 'Sunset',
      value: formatTime(weather.sys.sunset)
    }
  ]

  return (
    <section className="details-section">
      <div className="section-heading">
        <span>DETAILED CONDITIONS</span>
        <h3>Weather details</h3>
      </div>

      <div className="details-grid">
        {details.map((item) => (
          <div className="detail-item" key={item.label}>
            <span className="detail-icon">
              <Icon name={item.icon} />
            </span>

            <div>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default WeatherDetails