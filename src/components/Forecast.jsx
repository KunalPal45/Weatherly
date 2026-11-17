function Forecast({ forecast }) {
  if (!forecast || !forecast.list) return null

  const dailyForecast = Object.values(
    forecast.list.reduce((days, item) => {
      const date = item.dt_txt.split(' ')[0]

      if (!days[date]) {
        days[date] = item
      } else {
        const currentHour = Number(
          days[date].dt_txt.split(' ')[1].slice(0, 2)
        )

        const newHour = Number(
          item.dt_txt.split(' ')[1].slice(0, 2)
        )

        if (
          Math.abs(newHour - 12) <
          Math.abs(currentHour - 12)
        ) {
          days[date] = item
        }
      }

      return days
    }, {})
  ).slice(0, 5)

  return (
    <div className="forecast-section">
    <h3 className="panel-title">5-DAY FORECAST</h3>
    <div className="forecast-list">
      {dailyForecast.map((day, index) => {
        const date = new Date(
          `${day.dt_txt.slice(0, 10)}T12:00:00`
        )

        const dayName = index === 0
          ? 'Today'
          : date.toLocaleDateString('en-US', {
              weekday: 'short'
            })

        return (
          <div className="forecast-card" key={day.dt}>
            <div className="forecast-date">
              <strong>{dayName}</strong>

              <span>
                {date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>

            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
            />

            <div className="forecast-info">
              <span className="forecast-description">
                {day.weather[0].description}
              </span>

              <span className="forecast-rain">
                Rain {day.pop != null
                  ? Math.round(day.pop * 100)
                  : 0}%
              </span>
            </div>

            <div className="forecast-temps">
              <strong className="forecast-temp">
                {Math.round(day.main.temp)}°
              </strong>

              <span className="forecast-range">
                {Math.round(day.main.temp_min)}° / {Math.round(day.main.temp_max)}°
              </span>
            </div>
          </div>
        )
      })}
    </div>
    </div>
  )
}

export default Forecast