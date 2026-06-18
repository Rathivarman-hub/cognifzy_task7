const weatherIcons = {
  Clear: 'bi-sun-fill',
  Clouds: 'bi-cloud-fill',
  Rain: 'bi-cloud-rain-fill',
  Drizzle: 'bi-cloud-drizzle-fill',
  Thunderstorm: 'bi-cloud-lightning-rain-fill',
  Snow: 'bi-snow',
  Mist: 'bi-cloud-haze-fill',
  Fog: 'bi-cloud-haze2-fill',
};

const WeatherCard = ({ data, compact = false }) => {
  if (!data) return null;

  const iconClass = weatherIcons[data.weather?.[0]?.main] || 'bi-cloud-fill';
  const temp = Math.round(data.main?.temp);
  const feelsLike = Math.round(data.main?.feels_like);
  const humidity = data.main?.humidity;
  const windSpeed = data.wind?.speed;
  const description = data.weather?.[0]?.description;
  const city = data.name;
  const country = data.sys?.country;

  if (compact) {
    return (
      <div className="weather-card-compact app-card p-3 rounded-3">
        <div className="d-flex align-items-center gap-3">
          <i className={`bi ${iconClass} weather-icon-sm`}></i>
          <div>
            <div className="weather-temp-lg">{temp}°C</div>
            <div className="text-muted small">{city}, {country}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-card app-card p-4 rounded-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h4 className="mb-0">{city}</h4>
          <span className="badge bg-primary">{country}</span>
        </div>
        <i className={`bi ${iconClass} weather-icon-xl`}></i>
      </div>

      <div className="weather-temp mb-2">{temp}°C</div>
      <p className="text-muted text-capitalize mb-4">{description}</p>

      <div className="row g-3">
        <div className="col-4">
          <div className="weather-stat">
            <i className="bi bi-thermometer-half me-1"></i>
            <div className="stat-value">{feelsLike}°C</div>
            <div className="stat-label">Feels Like</div>
          </div>
        </div>
        <div className="col-4">
          <div className="weather-stat">
            <i className="bi bi-droplet-fill me-1"></i>
            <div className="stat-value">{humidity}%</div>
            <div className="stat-label">Humidity</div>
          </div>
        </div>
        <div className="col-4">
          <div className="weather-stat">
            <i className="bi bi-wind me-1"></i>
            <div className="stat-value">{windSpeed} m/s</div>
            <div className="stat-label">Wind</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
