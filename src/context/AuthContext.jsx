import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'dsa_arena_token';
const USER_KEY  = 'dsa_arena_user';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const AuthContext = createContext(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user,  setUser]  = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  // Persist to localStorage and state together
  const persistAuth = (newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updates };
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  // Register — returns { success, message }
  const register = useCallback(async (username, email, password) => {
    const { data } = await axios.post(`${API_BASE}/api/auth/register`, {
      username, email, password,
    });
    persistAuth(data.data.token, data.data.user);
    return { success: true };
  }, []);

  // Login — returns { success, message }
  const login = useCallback(async (email, password) => {
    const { data } = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
    persistAuth(data.data.token, data.data.user);
    return { success: true };
  }, []);

  const logout = useCallback(() => clearAuth(), []);

  // Axios instance pre-loaded with the auth header
  const authAxios = useCallback(() => {
    return axios.create({
      baseURL: API_BASE,
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, authAxios, isAuthenticated: !!token, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
