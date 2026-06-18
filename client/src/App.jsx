import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Weather from './pages/Weather';
import News from './pages/News';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const AppLayout = () => (
  <div className="app-layout">
    <Navbar />
    <main className="app-main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </main>
  </div>
);

const App = () => (
  <BrowserRouter future={{v7_relativeSplatPath:true,v7_startTransition:true}}>
    <ThemeProvider>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
