
function WeatherEffects({ weather }) {
  const condition =
    weather?.weather?.[0]?.main?.toLowerCase() || 'default'

  const rainDrops = Array.from({ length: 45 }, (_, i) => i)
  const snowFlakes = Array.from({ length: 35 }, (_, i) => i)
  const fogLayers = Array.from({ length: 5 }, (_, i) => i)
  const smokeLayers = Array.from({ length: 7 }, (_, i) => i)

  return (
    <div
      className={`weather-effects weather-${condition}`}
      aria-hidden="true"
    >
      {/* Clear / Sunny */}
      {condition === 'clear' && (
        <div className="sun-scene">
          <div className="sun-rays"></div>
          <div className="sun-effect"></div>
          <div className="sun-orb"></div>
        </div>
      )}

      {/* Cloudy */}
      {condition === 'clouds' && (
        <div className="cloud-container">
          <div className="cloud-effect cloud-one"></div>
          <div className="cloud-effect cloud-two"></div>
          <div className="cloud-effect cloud-three"></div>
        </div>
      )}

      {/* Rain / Drizzle */}
      {(condition === 'rain' || condition === 'drizzle') && (
        <div className="rain-container">
          {rainDrops.map((drop) => (
            <div
              className="rain-drop"
              key={drop}
              style={{
                left: `${(drop * 17) % 100}%`,
                animationDelay: `${(drop % 10) * -0.15}s`,
                animationDuration: `${0.6 + (drop % 5) * 0.1}s`,
                opacity: condition === 'drizzle' ? 0.4 : 0.85
              }}
            />
          ))}
        </div>
      )}

      {/* Snow */}
      {condition === 'snow' && (
        <div className="snow-container">
          {snowFlakes.map((flake) => (
            <div
              className="snow-flake"
              key={flake}
              style={{
                left: `${(flake * 23) % 100}%`,
                animationDelay: `${(flake % 10) * -0.5}s`,
                animationDuration: `${4 + (flake % 5)}s`
              }}
            >
              ❄
            </div>
          ))}
        </div>
      )}

      {/* Thunderstorm */}
      {condition === 'thunderstorm' && (
        <>
          <div className="rain-container">
            {rainDrops.map((drop) => (
              <div
                className="rain-drop"
                key={drop}
                style={{
                  left: `${(drop * 17) % 100}%`,
                  animationDelay: `${(drop % 10) * -0.15}s`,
                  animationDuration: `${0.6 + (drop % 5) * 0.1}s`
                }}
              />
            ))}
          </div>

          <div className="lightning-effect"></div>
        </>
      )}

      {/* Fog / Mist / Haze */}
      {['mist', 'fog', 'haze'].includes(condition) && (
        <div className="fog-container">
          {fogLayers.map((layer) => (
            <div
              className={`fog-layer fog-layer-${layer + 1}`}
              key={layer}
            />
          ))}
        </div>
      )}

      {/* Smoke — separate from fog */}
      {condition === 'smoke' && (
        <div className="smoke-container">
          {smokeLayers.map((layer) => (
            <div
              className={`smoke-layer smoke-layer-${layer + 1}`}
              key={layer}
            />
          ))}
        </div>
      )}

      {/* Dust / Sand */}
      {(condition === 'dust' || condition === 'sand') && (
        <div className="dust-container">
          {Array.from({ length: 25 }, (_, i) => (
            <div
              className="dust-particle"
              key={i}
              style={{
                top: `${(i * 19) % 100}%`,
                left: `${(i * 31) % 100}%`,
                animationDelay: `${(i % 8) * -0.5}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default WeatherEffects
