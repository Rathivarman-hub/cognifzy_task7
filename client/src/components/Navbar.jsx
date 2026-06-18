import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const scrollYAtOpen = useRef(0);

  // Close on scroll (only after 10px movement to avoid reflow false-trigger)
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => {
      if (Math.abs(window.scrollY - scrollYAtOpen.current) > 10) {
        setIsOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const openMenu = () => {
    scrollYAtOpen.current = window.scrollY;
    setIsOpen(true);
  };

  const toggleMenu = () => (isOpen ? setIsOpen(false) : openMenu());
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  return (
    <header className="app-navbar">
      <div className="app-navbar__inner">

        {/* Brand */}
        <Link className="app-navbar__brand" to="/" onClick={closeMenu}>
          <span className="brand-icon"><i className="bi bi-cpu-fill"></i></span>
          <span className="brand-text">PulseBoard</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="app-navbar__links">
          {user && (
            <>
              <Link className="nav-link" to="/dashboard"><i className="bi bi-grid-1x2-fill me-1"></i>Dashboard</Link>
              <Link className="nav-link" to="/weather"><i className="bi bi-cloud-sun-fill me-1"></i>Weather</Link>
              <Link className="nav-link" to="/news"><i className="bi bi-newspaper me-1"></i>News</Link>
            </>
          )}
        </nav>

        {/* Right side actions */}
        <div className="app-navbar__actions">
          <ThemeToggle />
          {user ? (
            <>
              <div className="user-avatar">
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} />
                  : <span>{user.name?.charAt(0).toUpperCase()}</span>}
              </div>
              <span className="user-name">{user.name}</span>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </>
          ) : (
            <Link className="btn btn-primary btn-sm px-3" to="/login" onClick={closeMenu}>Sign In</Link>
          )}
        </div>

        {/* Hamburger — mobile only */}
        <button
          className={`app-navbar__toggler ${isOpen ? 'is-open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="app-navbar__mobile">
          {user && (
            <nav className="app-navbar__mobile-links">
              <Link className="nav-link" to="/dashboard" onClick={closeMenu}><i className="bi bi-grid-1x2-fill me-2"></i>Dashboard</Link>
              <Link className="nav-link" to="/weather" onClick={closeMenu}><i className="bi bi-cloud-sun-fill me-2"></i>Weather</Link>
              <Link className="nav-link" to="/news" onClick={closeMenu}><i className="bi bi-newspaper me-2"></i>News</Link>
            </nav>
          )}
          <div className="app-navbar__mobile-actions">
            <ThemeToggle />
            {user ? (
              <>
                <div className="d-flex align-items-center gap-2">
                  <div className="user-avatar">
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} />
                      : <span>{user.name?.charAt(0).toUpperCase()}</span>}
                  </div>
                  <span className="user-name">{user.name}</span>
                </div>
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i>Logout
                </button>
              </>
            ) : (
              <Link className="btn btn-primary btn-sm px-3" to="/login" onClick={closeMenu}>Sign In</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
