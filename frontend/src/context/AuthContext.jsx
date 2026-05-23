import { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (credentials) => {
    const res = await apiLogin(credentials);
    const { user: u, token } = res.data;
    if (token) localStorage.setItem('token', token);   // ← save token
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (credentials) => {
    const res = await apiRegister(credentials);
    const { user: u, token } = res.data;
    if (token) localStorage.setItem('token', token);   // ← save token
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    try { await apiLogout(); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isArtist: user?.role === 'artist' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);