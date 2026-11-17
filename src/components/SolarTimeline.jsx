
import { useEffect, useState } from 'react'

function SolarTimeline({ weather }) {
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Update the clock every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 30000)

    return () => clearInterval(timer)
  }, [])

  // Wait until weather and sunlight data are available
  if (!weather?.sys?.sunrise || !weather?.sys?.sunset) {
    return null
  }

  // OpenWeather provides timezone offset in seconds
  const timezoneOffset = weather.timezone || 0

  // Convert UTC timestamps into the searched location's local time
  const localNow = Math.floor(currentTime / 1000) + timezoneOffset
  const sunrise = weather.sys.sunrise + timezoneOffset
  const sunset = weather.sys.sunset + timezoneOffset

  const secondsInDay = 24 * 60 * 60

  const currentSeconds = ((localNow % secondsInDay) + secondsInDay) % secondsInDay
  const sunriseSeconds = ((sunrise % secondsInDay) + secondsInDay) % secondsInDay
  const sunsetSeconds = ((sunset % secondsInDay) + secondsInDay) % secondsInDay

  // Calculate how far the sun has travelled between sunrise and sunset
  const daylightDuration = sunsetSeconds - sunriseSeconds

  const rawProgress =
    daylightDuration > 0
      ? (currentSeconds - sunriseSeconds) / daylightDuration
      : 0

  const progress = Math.max(0, Math.min(1, rawProgress))

  // Find the sun's position on a quadratic curved path
  const startX = 30
  const startY = 140
  const controlX = 180
  const controlY = -25
  const endX = 330
  const endY = 140

  const x =
    (1 - progress) ** 2 * startX +
    2 * (1 - progress) * progress * controlX +
    progress ** 2 * endX

  const y =
    (1 - progress) ** 2 * startY +
    2 * (1 - progress) * progress * controlY +
    progress ** 2 * endY

  // Get the current local hour at the searched location
  const localDate = new Date(localNow * 1000)
  const hour = localDate.getUTCHours()

  let theme = 'evening'

  if (hour >= 5 && hour < 12) {
    theme = 'morning'
  } else if (hour >= 12 && hour < 17) {
    theme = 'afternoon'
  }

  // Format a time using the searched location's local clock
  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000)

    return date.toLocaleTimeString('en-IN', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const currentClock = formatTime(currentSeconds)
  const sunriseTime = formatTime(sunriseSeconds)
  const sunsetTime = formatTime(sunsetSeconds)

  return (
    <section className={`solar-timeline theme-${theme}`}>
      <div className="solar-header">
        <div>
          <p className="solar-eyebrow">SUN MOVEMENT</p>
          <h2>Today's Sunlight</h2>
        </div>

        <div className="solar-live">
          <span className="live-dot"></span>
          LIVE
        </div>
      </div>

      <div className="solar-clock">
        <span>{currentClock}</span>
        <small>Local time</small>
      </div>

      <div className="solar-arc-wrapper">
        <svg
          className="solar-arc"
          viewBox="0 0 360 165"
          role="img"
          aria-label="Sun position between sunrise and sunset"
        >
          <defs>
            <linearGradient id="solarArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>

          <path
            className="solar-arc-track"
            d="M 30 140 Q 180 -25 330 140"
          />

          <path
            className="solar-arc-progress"
            d="M 30 140 Q 180 -25 330 140"
            pathLength="100"
            style={{ strokeDasharray: `${progress * 100} 100` }}
          />

          <circle cx="30" cy="140" r="5" className="solar-endpoint" />
          <circle cx="330" cy="140" r="5" className="solar-endpoint" />

         <g
  className="solar-moving-sun"
  transform={`translate(${x} ${y})`}
>
          
            <circle r="25" className="sun-glow" />
            <circle r="13" className="sun-core" />
          </g>
        </svg>
      </div>

      <div className="solar-times">
        <div>
        <span className="solar-time-icon sunrise-icon">☀</span>
          <div>
            <strong>{sunriseTime}</strong>
            <small>Sunrise</small>
          </div>
        </div>

        <div className="solar-daylight">
          <span>{Math.round(progress * 100)}%</span>
          <small>Daylight progress</small>
        </div>

        <div>
          <span className="solar-time-icon sunset-icon">☀</span>
          <div>
            <strong>{sunsetTime}</strong>
            <small>Sunset</small>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SolarTimeline
