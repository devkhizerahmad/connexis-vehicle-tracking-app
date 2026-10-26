// AuthContext.tsx — Authentication state provider.
// Manages isAuthenticated, login(), and logout() for the app-wide auth flow.
// App.tsx conditionally renders LoginScreen vs RootNavigator based on isAuthenticated.
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
} | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;