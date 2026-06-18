import { useState } from 'react';
import { weatherApi } from '../services/weatherApi';
import WeatherCard from '../components/WeatherCard';

const popularCities = ['Mumbai', 'Delhi', 'Chennai', 'Bangalore', 'London', 'New York', 'Tokyo', 'Sydney'];

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    try {
      const data = await weatherApi.getByCity(cityName);
      setWeather(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'City not found');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) fetchWeather(city.trim());
  };

  const handleLocation = () => {
    if (!navigator.geolocation) return setError('Geolocation not supported');
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const data = await weatherApi.getByCoords(coords.latitude, coords.longitude);
          setWeather(data.data);
          setError('');
        } catch { setError('Could not get weather for your location'); }
        finally { setLoading(false); }
      },
      () => { setError('Location access denied'); setLoading(false); }
    );
  };

  return (
    <div className="weather-page container py-4">
      <div className="page-header mb-4">
        <h2><i className="bi bi-cloud-sun-fill me-2 text-primary"></i>Weather</h2>
        <p className="text-muted">Real-time weather for any city worldwide</p>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8 col-lg-6">
          <form onSubmit={handleSubmit} className="d-flex gap-2">
            <input
              type="text"
              className="form-control app-input"
              placeholder="Search city..."
              value={city}
              onChange={e => setCity(e.target.value)}
            />
            <button type="submit" className="btn btn-primary px-4" disabled={loading}>
              <i className="bi bi-search"></i>
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={handleLocation} title="Use my location">
              <i className="bi bi-geo-alt-fill"></i>
            </button>
          </form>
        </div>
      </div>

      {/* Popular Cities */}
      <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center">
        {popularCities.map(c => (
          <button key={c} className="btn btn-sm chip-btn" onClick={() => fetchWeather(c)}>{c}</button>
        ))}
      </div>

      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="mt-3 text-muted">Fetching weather...</p>
        </div>
      )}

      {weather && !loading && (
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <WeatherCard data={weather} />
          </div>
        </div>
      )}

      {!weather && !loading && !error && (
        <div className="text-center py-5">
          <i className="bi bi-cloud-sun display-1 text-muted opacity-25"></i>
          <p className="text-muted mt-3">Search for a city or use your location</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
