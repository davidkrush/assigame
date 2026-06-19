import { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../api/auth';
import { getErrorMessage } from '../api/client';
import { adaptUser } from '../utils/adapters';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const persist = (adapted) => {
    localStorage.setItem('auth_token', adapted.token || '');
    localStorage.setItem('user', JSON.stringify(adapted));
    setUser(adapted);
  };

  // credentials: { login, motdepasse } -- "login" peut être l'email
  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { data } = await authApi.login(credentials);
      const adapted = adaptUser(data);
      persist(adapted);
      return { success: true, user: adapted };
    } catch (err) {
      return { success: false, error: getErrorMessage(err, 'Email ou mot de passe incorrect.') };
    } finally {
      setLoading(false);
    }
  }, []);

  // payload: { nom, prenom, email, motdepasse, telephone }
  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const { data } = await authApi.register(payload);
      const adapted = adaptUser(data);
      persist(adapted);
      return { success: true, user: adapted };
    } catch (err) {
      return { success: false, error: getErrorMessage(err, "L'inscription a échoué.") };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
