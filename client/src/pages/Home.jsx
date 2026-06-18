import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: 'bi-cloud-sun-fill', title: 'Live Weather', desc: 'Real-time weather data for any city worldwide with auto-location detection.' },
  { icon: 'bi-newspaper', title: 'News Feed', desc: 'Curated news across categories — technology, sports, business, and more.' },
  { icon: 'bi-shield-lock-fill', title: 'OAuth Security', desc: 'Seamless sign-in with Google or GitHub using industry-standard OAuth 2.0.' },
  { icon: 'bi-speedometer2', title: 'Smart Dashboard', desc: 'Unified view of all your data with live stats and usage insights.' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section text-center py-5">
        <div className="container py-5">
          <div className="hero-badge mb-4">
            <i className="bi bi-stars me-2"></i> AI-Powered Smart Dashboard
          </div>
          <h1 className="hero-title mb-4">
            Your world,<br />
            <span className="gradient-text">intelligently connected</span>
          </h1>
          <p className="hero-subtitle mx-auto mb-5">
            Weather, news, and insights — all in one beautifully unified dashboard.
            Sign in with Google or GitHub to get started in seconds.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg px-5">
                Open Dashboard <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-lg px-5">
                  Get Started <i className="bi bi-arrow-right ms-2"></i>
                </Link>
                <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section py-4">
        <div className="container">
          <div className="row g-3 text-center">
            {[
              { val: '200+', label: 'Cities Supported' },
              { val: '50k+', label: 'News Articles Daily' },
              { val: '99.9%', label: 'API Uptime' },
              { val: '2', label: 'OAuth Providers' },
            ].map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="stat-pill app-card rounded-3 p-3">
                  <div className="stat-number">{s.val}</div>
                  <div className="stat-label text-muted small">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section py-5">
        <div className="container py-3">
          <div className="text-center mb-5">
            <h2 className="section-title">Everything you need</h2>
            <p className="text-muted">Powerful features, elegant interface</p>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={i}>
                <div className="feature-card app-card p-4 rounded-4 h-100">
                  <div className="feature-icon mb-3">
                    <i className={`bi ${f.icon}`}></i>
                  </div>
                  <h5 className="mb-2">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
