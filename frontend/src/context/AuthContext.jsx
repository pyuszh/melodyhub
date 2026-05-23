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
    // Backend sends token in cookie AND we grab it from header if present
    // For Render → Vercel cross-origin, store it manually
    // The backend also returns it in the JSON body as message/user
    // We'll store whatever the interceptor needs:
    if (res.headers?.authorization) {
      localStorage.setItem('token', res.headers.authorization.replace('Bearer ', ''));
    }
    // Fallback: if token comes back in body (add it on backend side optionally)
    // For now we re-login returns cookie; if CORS blocks cookie we rely on interceptor
    // Store user info
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (credentials) => {
    const res = await apiRegister(credentials);
    const { user: u } = res.data;
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
