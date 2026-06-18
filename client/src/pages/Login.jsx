import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OAuthButton from '../components/OAuthButton';

const Login = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login, register, handleOAuthCallback } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const err = searchParams.get('error');
    if (token) { handleOAuthCallback(token); navigate('/dashboard', { replace: true }); }
    if (err) setError('OAuth login failed. Please try again.');
  }, [searchParams]);

  // If already authenticated, redirect to dashboard
  if (user) return <Navigate to="/dashboard" replace />;


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100 py-5">
      <div className="auth-card app-card p-4 p-md-5 rounded-4" style={{ width: '100%', maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <div className="auth-logo mb-3">
            <i className="bi bi-cpu-fill"></i>
          </div>
          <h3 className="mb-1">Welcome {mode === 'login' ? 'back' : 'aboard'}</h3>
          <p className="text-muted small">
            {mode === 'login' ? "Sign in to your CognifyZ account" : "Create your CognifyZ account"}
          </p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill"></i> {error}
          </div>
        )}

        <div className="d-flex flex-column gap-2 mb-4">
          <OAuthButton provider="google" />
          <OAuthButton provider="github" />
        </div>

        <div className="divider-text my-3"><span>or continue with email</span></div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="mb-3">
              <label className="form-label small fw-semibold">Full Name</label>
              <input
                type="text" name="name" className="form-control app-input"
                placeholder="John Doe" value={form.name} onChange={handleChange} required
              />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email</label>
            <input
              type="email" name="email" className="form-control app-input"
              placeholder="you@example.com" value={form.email} onChange={handleChange} required
            />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <input
              type="password" name="password" className="form-control app-input"
              placeholder="••••••••" value={form.password} onChange={handleChange} required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span> Loading...</>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <p className="text-center mt-4 mb-0 small text-muted">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button className="btn btn-link p-0 small" onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
