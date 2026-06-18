import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { weatherApi } from '../services/weatherApi';
import { newsApi } from '../services/newsApi';
import WeatherCard from '../components/WeatherCard';
import NewsCard from '../components/NewsCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [weatherError, setWeatherError] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            const data = await weatherApi.getByCoords(coords.latitude, coords.longitude);
            setWeather(data.data);
          } catch {
            fetchWeatherByCity('Chennai');
          } finally { setLoadingWeather(false); }
        },
        () => fetchWeatherByCity('Chennai')
      );
    } else {
      fetchWeatherByCity('Chennai');
    }

    newsApi.getByCategory('technology', 1)
      .then(d => setNews(d.data?.articles?.slice(0, 3) || []))
      .catch(() => setNews([]))
      .finally(() => setLoadingNews(false));
  }, []);

  const fetchWeatherByCity = async (city) => {
    try {
      const data = await weatherApi.getByCity(city);
      setWeather(data.data);
    } catch { setWeatherError('Could not load weather data'); }
    finally { setLoadingWeather(false); }
  };

  const stats = [
    { icon: 'bi-cloud-check-fill', label: 'Weather Updates', value: '24/7', color: '#6366f1' },
    { icon: 'bi-newspaper', label: 'News Articles', value: '50k+', color: '#22d3ee' },
    { icon: 'bi-shield-fill-check', label: 'Secure Session', value: 'Active', color: '#4ade80' },
    { icon: 'bi-lightning-charge-fill', label: 'API Status', value: 'Online', color: '#fbbf24' },
  ];

  return (
    <div className="dashboard-page container-fluid px-4 py-4">
      {/* Welcome */}
      <div className="welcome-banner app-card rounded-4 p-4 mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="user-avatar-lg">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} />
              : <span>{user?.name?.charAt(0).toUpperCase()}</span>}
          </div>
          <div>
            <h4 className="mb-0">Welcome back, {user?.name?.split(' ')[0]}! 👋</h4>
            <p className="text-muted mb-0 small">{user?.email} · {user?.provider || 'local'} account</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {stats.map((s, i) => (
          <div className="col-6 col-lg-3" key={i}>
            <div className="stat-card app-card rounded-4 p-3 d-flex align-items-center gap-3">
              <div className="stat-icon" style={{ background: s.color + '22', color: s.color }}>
                <i className={`bi ${s.icon}`}></i>
              </div>
              <div>
                <div className="stat-value fw-bold">{s.value}</div>
                <div className="text-muted small">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Weather Widget */}
        <div className="col-12 col-lg-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0"><i className="bi bi-cloud-sun-fill me-2 text-primary"></i>Weather</h5>
            <Link to="/weather" className="btn btn-sm btn-outline-primary">View All</Link>
          </div>
          {loadingWeather ? (
            <div className="app-card rounded-4 p-4 text-center">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : weatherError ? (
            <div className="app-card rounded-4 p-4 text-center text-muted">{weatherError}</div>
          ) : (
            <WeatherCard data={weather} />
          )}
        </div>

        {/* News Widget */}
        <div className="col-12 col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0"><i className="bi bi-newspaper me-2 text-primary"></i>Latest News</h5>
            <Link to="/news" className="btn btn-sm btn-outline-primary">View All</Link>
          </div>
          {loadingNews ? (
            <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
          ) : (
            <div className="row g-3">
              {news.map((article, i) => (
                <div className="col-12 col-md-4" key={i}>
                  <NewsCard article={article} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
