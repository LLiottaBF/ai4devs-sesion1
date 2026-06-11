import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const SESSION_KEY = 'auth_token';
const USERNAME_KEY = 'auth_username';
const EXPIRES_IN_KEY = 'auth_expires_in';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(SESSION_KEY));
  const [username, setUsername] = useState(() => sessionStorage.getItem(USERNAME_KEY));
  const [expiresIn, setExpiresIn] = useState(() => {
    const v = sessionStorage.getItem(EXPIRES_IN_KEY);
    return v ? Number(v) : null;
  });

  const login = useCallback((accessToken, user, tokenExpiresIn) => {
    sessionStorage.setItem(SESSION_KEY, accessToken);
    sessionStorage.setItem(USERNAME_KEY, user);
    if (tokenExpiresIn != null) {
      sessionStorage.setItem(EXPIRES_IN_KEY, String(tokenExpiresIn));
    }
    setToken(accessToken);
    setUsername(user);
    setExpiresIn(tokenExpiresIn ?? null);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    sessionStorage.removeItem(EXPIRES_IN_KEY);
    setToken(null);
    setUsername(null);
    setExpiresIn(null);
  }, []);

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider value={{ token, username, expiresIn, isAuthenticated, login, logout }}>
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
