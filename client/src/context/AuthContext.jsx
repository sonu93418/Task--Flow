import { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getMe } from '../api/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('taskflow_token');
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data.data.user);
        } catch {
          localStorage.removeItem('taskflow_token');
          localStorage.removeItem('taskflow_user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await loginUser({ email, password });
      const { token, user: userData } = res.data.data;
      localStorage.setItem('taskflow_token', token);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      const data = err.response?.data;
      const message = data?.errors?.[0] || data?.message || err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setError(null);
    try {
      const res = await registerUser({ name, email, password });
      const { token, user: userData } = res.data.data;
      localStorage.setItem('taskflow_token', token);
      localStorage.setItem('taskflow_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      const data = err.response?.data;
      const message = data?.errors?.[0] || data?.message || err.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  /**
   * Login using a JWT token directly (used after OAuth redirect).
   * Stores the token and fetches the user profile from /auth/me.
   */
  const loginWithToken = useCallback(async (token) => {
    setError(null);
    try {
      localStorage.setItem('taskflow_token', token);
      const res = await getMe();
      const userData = res.data.data.user;
      localStorage.setItem('taskflow_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      const message = err.response?.data?.message || err.message || 'OAuth login failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, loginWithToken, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}
