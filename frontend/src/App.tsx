import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import theme from './theme';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './pages/Unauthorized';

const App: React.FC = () => {
  useEffect(() => {
    // Set security headers
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:;";
    document.head.appendChild(meta);

    // Set CSRF token
    const csrfMeta = document.createElement('meta');
    csrfMeta.name = 'csrf-token';
    csrfMeta.content = crypto.randomUUID();
    document.head.appendChild(csrfMeta);

    return () => {
      document.head.removeChild(meta);
      document.head.removeChild(csrfMeta);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
