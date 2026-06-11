import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const SESSION_KEY = 'auth_token';
const USERNAME_KEY = 'auth_username';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(SESSION_KEY));
  const [username, setUsername] = useState(() => sessionStorage.getItem(USERNAME_KEY));

  const login = useCallback((accessToken, user) => {
    sessionStorage.setItem(SESSION_KEY, accessToken);
    sessionStorage.setItem(USERNAME_KEY, user);
    setToken(accessToken);
    setUsername(user);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    setToken(null);
    setUsername(null);
  }, []);

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
