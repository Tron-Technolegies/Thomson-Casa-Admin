
import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from 'react';

import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Only these roles can access the Admin portal.
const ALLOWED_ROLES = ['admin', 'project_lead'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const decodeJWT = (jwt) => {
    try {
      const payload = jwt.split('.')[1];
      const base64 = payload
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      return JSON.parse(atob(base64));
    } catch (error) {
      console.error('JWT decoding failed:', error);
      return null;
    }
  };

  // Normalize role names for comparison.
  const normalizeRole = (role) => {
    return role?.toLowerCase().trim().replace(/[\s-]+/g, '_');
  };

  // Validate existing session.
  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const decoded = decodeJWT(token);
    const role = normalizeRole(decoded?.role);

    const isValid =
      decoded &&
      decoded.exp * 1000 > Date.now() &&
      ALLOWED_ROLES.includes(role);

    if (isValid) {
      setUser(decoded);
    } else {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }

    setLoading(false);
  }, [token]);

  // Login.
  const login = async (username, password) => {
    try {
      // Clear previous session.
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);

      const response = await api.post(
        '/admin/auth/login/',
        { username, password }
      );

      if (!response.access) {
        return {
          success: false,
          error: 'Invalid username or password.'
        };
      }

      const decoded = decodeJWT(response.access);

      if (
        !decoded ||
        !decoded.exp ||
        decoded.exp * 1000 <= Date.now()
      ) {
        return {
          success: false,
          error: 'Invalid or expired login token.'
        };
      }

      const role = normalizeRole(decoded.role);

      // Validate Admin portal access.
      if (!ALLOWED_ROLES.includes(role)) {
        return {
          success: false,
          error: 'You are not authorized to access the Admin portal. Please use your correct login portal.'
        };
      }

      // Save token only after successful validation.
      localStorage.setItem('token', response.access);
      setToken(response.access);
      setUser(decoded);

      return { success: true };

    } catch (error) {
      console.error('Login error:', error);

      return {
        success: false,
        error: error.message || 'Login failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
