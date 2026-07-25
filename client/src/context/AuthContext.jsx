import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const bootstrap = useCallback(async () => {
    const cachedUser = localStorage.getItem('lotus_user');
    const token = localStorage.getItem('lotus_token');
    if (!token && !cachedUser) {
      setLoading(false);
      return;
    }
    try {
      const res = await authService.getMe();
      setUser(res.user);
      localStorage.setItem('lotus_user', JSON.stringify(res.user));
    } catch {
      localStorage.removeItem('lotus_token');
      localStorage.removeItem('lotus_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (credentials) => {
    setError('');
    try {
      const res = await authService.login(credentials);
      if (res.token) localStorage.setItem('lotus_token', res.token);
      localStorage.setItem('lotus_user', JSON.stringify(res.user));
      setUser(res.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      setError(message);
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore network errors on logout */
    }
    localStorage.removeItem('lotus_token');
    localStorage.removeItem('lotus_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updated) => {
    setUser(updated);
    localStorage.setItem('lotus_user', JSON.stringify(updated));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      login,
      logout,
      updateUser,
    }),
    [user, loading, error, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
