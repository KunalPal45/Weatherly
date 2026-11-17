
function SmartWeatherAssistant({ weather, forecast }) {
  if (!weather) return null

  // Get current weather information
  const temperature = weather.main?.temp ?? 0
  const feelsLike = weather.main?.feels_like ?? temperature
  const humidity = weather.main?.humidity ?? 0

  const condition =
    weather.weather?.[0]?.main?.toLowerCase() || 'clear'

  // Check upcoming forecast for rain
  const forecastList = forecast?.list || []
  const upcomingForecast = forecastList.slice(0, 4)

  const rainProbability = upcomingForecast.reduce(
    (highest, item) => Math.max(highest, item.pop || 0),
    0
  )

  const hasRain = upcomingForecast.some(
    item =>
      item.rain?.['3h'] > 0 ||
      item.weather?.some(w =>
        ['rain', 'drizzle', 'thunderstorm'].includes(
          w.main?.toLowerCase()
        )
      )
  )

  // 1. Clothing recommendation
  let clothingAdvice = ''

  if (temperature >= 32) {
    clothingAdvice =
      'Wear light cotton clothes, sunglasses and comfortable footwear.'
  } else if (temperature >= 24) {
    clothingAdvice =
      'Light and breathable clothes are a good choice today.'
  } else if (temperature >= 15) {
    clothingAdvice =
      'Wear comfortable clothes and consider carrying a light jacket.'
  } else {
    clothingAdvice =
      'Wear warm clothes and consider a jacket or sweater.'
  }

  // 2. Umbrella recommendation
  let umbrellaAdvice = ''
  let umbrellaIcon = '☀️'

  if (hasRain || rainProbability >= 0.4) {
    umbrellaAdvice =
      'Rain may occur soon. Carry an umbrella before going outside.'
    umbrellaIcon = '☂️'
  } else {
    umbrellaAdvice =
      'Rain chances look low in the upcoming forecast. An umbrella may not be necessary.'
  }

  // 3. Outdoor activity recommendation
  let activityAdvice = ''

  if (
    condition.includes('thunderstorm') ||
    condition.includes('rain') ||
    condition.includes('drizzle')
  ) {
    activityAdvice =
      'Consider indoor activities until the weather improves.'
  } else if (temperature >= 36) {
    activityAdvice =
      'Avoid strenuous outdoor activities during the hottest hours.'
  } else if (
    condition.includes('clear') ||
    condition.includes('cloud')
  ) {
    activityAdvice =
      'A walk, cycling or outdoor exercise could be enjoyable. Prefer cooler hours if it is warm.'
  } else {
    activityAdvice =
      'Choose a comfortable outdoor activity and check conditions before heading out.'
  }

  // 4. Hydration recommendation
  let hydrationAdvice = ''

  if (temperature >= 35 || feelsLike >= 38) {
    hydrationAdvice =
      'It feels very hot. Drink water regularly and take breaks in the shade.'
  } else if (temperature >= 28 || humidity >= 75) {
    hydrationAdvice =
      'Stay hydrated throughout the day, especially when spending time outdoors.'
  } else {
    hydrationAdvice =
      'Keep drinking water regularly to stay hydrated.'
  }

  // 5. Daily weather summary
  let dailySummary = ''

  if (
    condition.includes('rain') ||
    condition.includes('thunderstorm')
  ) {
    dailySummary =
      'Wet weather is expected. Plan your outdoor activities carefully.'
  } else if (temperature >= 35) {
    dailySummary =
      'It is going to be a hot day. Take precautions when spending time outside.'
  } else if (condition.includes('clear')) {
    dailySummary =
      'Clear conditions are here. Enjoy your day and stay comfortable.'
  } else {
    dailySummary =
      'Check the latest conditions before planning your activities.'
  }

  return (
    <section className="smart-assistant">
      {/* Assistant heading */}
      <div className="assistant-header">
        <div className="assistant-title">
          <div className="assistant-icon">✦</div>

          <div>
            <h2>Weatherly Intelligence</h2>
            <p>Your personal weather assistant</p>
          </div>
        </div>

        <span className="assistant-badge">
          <span className="assistant-status-dot"></span>
          AI ACTIVE
        </span>
      </div>

      {/* Daily weather summary */}
      <div className="assistant-summary">
        <div className="summary-content">
          <span className="summary-label">
            TODAY'S WEATHER ADVICE
          </span>

          <h3>
            {temperature >= 32
              ? 'A warm day ahead!'
              : temperature <= 15
                ? 'A cool day ahead!'
                : 'Make the most of today!'}
          </h3>

          <p>{dailySummary}</p>
        </div>

        <div className="summary-temperature">
          <span>{Math.round(temperature)}°</span>
          <small>Current temperature</small>
        </div>
      </div>

      {/* Four smart recommendation cards */}
      <div className="assistant-grid">

        <article className="assistant-card clothing-card">
          <div className="assistant-card-top">
            <div className="assistant-card-icon">👕</div>
            <span className="assistant-card-number">01</span>
          </div>

          <span className="assistant-card-category">
            COMFORT GUIDE
          </span>

          <h3>What to wear</h3>
          <p>{clothingAdvice}</p>
        </article>

        <article className="assistant-card umbrella-card">
          <div className="assistant-card-top">
            <div className="assistant-card-icon">
              {umbrellaIcon}
            </div>
            <span className="assistant-card-number">02</span>
          </div>

          <span className="assistant-card-category">
            RAIN FORECAST
          </span>

          <h3>Umbrella advice</h3>
          <p>{umbrellaAdvice}</p>

          <div className="assistant-rain-probability">
            <span>Rain probability</span>
            <strong>
              {Math.round(rainProbability * 100)}%
            </strong>
          </div>
        </article>

        <article className="assistant-card activity-card">
          <div className="assistant-card-top">
            <div className="assistant-card-icon">🏃</div>
            <span className="assistant-card-number">03</span>
          </div>

          <span className="assistant-card-category">
            PLAN YOUR DAY
          </span>

          <h3>Outdoor activities</h3>
          <p>{activityAdvice}</p>
        </article>

        <article className="assistant-card hydration-card">
          <div className="assistant-card-top">
            <div className="assistant-card-icon">💧</div>
            <span className="assistant-card-number">04</span>
          </div>

          <span className="assistant-card-category">
            HEALTH REMINDER
          </span>

          <h3>Hydration advice</h3>
          <p>{hydrationAdvice}</p>
        </article>

      </div>

      {/* Smart tip */}
      <div className="assistant-tip">
        <span className="tip-icon">💡</span>

        <div>
          <h3>Smart tip of the day</h3>
          <p>
            {feelsLike > temperature + 3
              ? 'It feels warmer than the actual temperature. Take extra care when spending time outdoors.'
              : humidity >= 80
                ? 'Humidity is high. Take breaks and stay hydrated during outdoor activities.'
                : 'Check the forecast before planning longer outdoor activities.'}
          </p>
        </div>
      </div>

      <div className="assistant-footer">
        Recommendations are generated from your current weather
        and upcoming forecast.
      </div>
    </section>
  )
}

export default SmartWeatherAssistant
