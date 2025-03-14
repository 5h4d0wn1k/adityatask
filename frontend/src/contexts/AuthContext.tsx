import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hardcoded admin user for testing
const ADMIN_USER = {
  email: 'admin@testmail.com',
  password: 'Asdf@2468',
  user: {
    id: 'admin-1',
    email: 'admin@testmail.com',
    name: 'Admin User',
    role: 'admin'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const validateToken = async (token: string) => {
    try {
      // For the admin user, skip API validation
      if (user?.email === ADMIN_USER.email) {
        return;
      }

      const response = await api.get('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (error) {
      throw error;
    }
  };

  const refreshToken = useCallback(async () => {
    try {
      // For admin user, just return the same token
      if (user?.email === ADMIN_USER.email) {
        return;
      }

      const refresh = localStorage.getItem('refreshToken');
      if (!refresh) throw new Error('No refresh token available');

      const response = await api.post('/auth/refresh-token', { refreshToken: refresh });
      const { accessToken, newRefreshToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      await validateToken(accessToken);
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      throw error;
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      // Check for admin credentials
      if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
        // Generate a mock token for admin
        const mockToken = btoa(JSON.stringify({ sub: ADMIN_USER.user.id, role: 'admin' }));
        localStorage.setItem('accessToken', mockToken);
        localStorage.setItem('refreshToken', mockToken);
        setUser(ADMIN_USER.user);
        return;
      }

      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Prevent registration with admin email
      if (email === ADMIN_USER.email) {
        throw new Error('This email is reserved');
      }

      const response = await api.post('/auth/register', { email, password, name });
      const { accessToken, refreshToken, user } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // Check if it's the admin token
          try {
            const decoded = JSON.parse(atob(token));
            if (decoded.sub === ADMIN_USER.user.id) {
              setUser(ADMIN_USER.user);
              setLoading(false);
              return;
            }
          } catch (e) {
            // Not a base64 token, proceed with normal validation
          }

          const decoded = jwtDecode(token) as { exp: number };
          if (decoded.exp * 1000 < Date.now()) {
            await refreshToken();
          } else {
            await validateToken(token);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [refreshToken]);

  useEffect(() => {
    const refreshTokenInterval = setInterval(refreshToken, 14 * 60 * 1000); // Refresh every 14 minutes
    return () => clearInterval(refreshTokenInterval);
  }, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 