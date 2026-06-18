import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className={`toggle-track ${theme === 'light' ? 'light' : ''}`}>
        <span className="toggle-thumb">
          {theme === 'dark' ? (
            <i className="bi bi-moon-stars-fill"></i>
          ) : (
            <i className="bi bi-sun-fill"></i>
          )}
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
