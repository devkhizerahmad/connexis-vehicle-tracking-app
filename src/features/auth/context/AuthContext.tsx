// AuthContext.tsx — authentication state provider.
//
// Owns the session (not the form). The screen calls `login(credentials)` and
// receives a LoginOutcome; the provider only flips to `signedIn` when the
// credential check succeeded. The session has an absolute expiry, so an app left
// open overnight signs itself out (OWASP ASVS V3.5 / NIST session management).
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import authService from '../services/authService';
import rememberedUsernameStore from '../services/rememberedUsername';
import type { AuthError, Credentials, LoginOutcome, Session } from '../types/auth';

export type AuthStatus = 'signedOut' | 'authenticating' | 'signedIn';

export interface AuthContextValue {
  status: AuthStatus;
  isAuthenticated: boolean;
  session: Session | null;
  /** Resolves with the outcome so the form can render inline errors. Never throws. */
  login: (credentials: Credentials) => Promise<LoginOutcome>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

interface AuthProviderProps {
  children: ReactNode;
}

const UNKNOWN_ERROR: AuthError = {
  code: 'unknown',
  message: 'Something went wrong. Please try again.',
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>('signedOut');
  const [session, setSession] = useState<Session | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const logout = useCallback(() => {
    // Clear local session first, then best-effort server revocation.
    setSession(null);
    setStatus('signedOut');
    void authService.logout();
  }, []);

  const login = useCallback(
    async (credentials: Credentials): Promise<LoginOutcome> => {
      setStatus('authenticating');

      let outcome: LoginOutcome;
      try {
        outcome = await authService.login(credentials);
      } catch {
        outcome = { ok: false, error: UNKNOWN_ERROR };
      }

      if (!mounted.current) {
        return outcome;
      }

      if (!outcome.ok) {
        setStatus('signedOut');
        return outcome;
      }

      // Persist only the username, and only after a successful sign-in.
      if (credentials.rememberMe) {
        await rememberedUsernameStore.write(credentials.username);
      } else {
        await rememberedUsernameStore.clear();
      }

      if (!mounted.current) {
        return outcome;
      }

      setSession(outcome.session);
      setStatus('signedIn');
      return outcome;
    },
    [],
  );

  // Absolute session expiry — no silent extension.
  useEffect(() => {
    if (!session) {
      return;
    }
    const remaining = session.expiresAt - Date.now();
    if (remaining <= 0) {
      setSession(null);
      setStatus('signedOut');
      return;
    }
    const timer = setTimeout(() => {
      setSession(null);
      setStatus('signedOut');
    }, remaining);
    return () => clearTimeout(timer);
  }, [session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      isAuthenticated: status === 'signedIn' && session !== null,
      session,
      login,
      logout,
    }),
    [status, session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
