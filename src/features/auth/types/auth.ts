// auth.ts — shared auth contracts (service, context and screens all speak this).
//
// The shapes below follow the OWASP ASVS/NIST 800-63B split between a *credential
// check* (returns an opaque session) and *session state* (owned by the context).
// No password, hash or credential ever leaves `authService.login`.

/** Machine-readable failure reasons. UI maps these to copy; it never branches on strings. */
export type AuthErrorCode =
  | 'invalid_credentials'
  | 'account_locked'
  | 'validation'
  | 'network'
  | 'unknown';

export interface AuthError {
  code: AuthErrorCode;
  /** Safe to show to the user. Never reveals whether the username exists. */
  message: string;
  /** Present for `account_locked`: milliseconds until another attempt is allowed. */
  retryAfterMs?: number;
  /** Present for `validation`: which field the message belongs to. */
  field?: 'username' | 'password';
}

export interface Credentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface Session {
  /** Opaque bearer token. Never a password or derived credential. */
  token: string;
  username: string;
  issuedAt: number;
  expiresAt: number;
  rememberMe: boolean;
}

export type LoginOutcome =
  | { ok: true; session: Session }
  | { ok: false; error: AuthError };

/** Default absolute session lifetime (8 hours). */
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
/** "Remember Me" extends the session to 30 days (OWASP: avoid indefinite sessions). */
export const REMEMBERED_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
/** Failed attempts before a temporary client-side lockout. */
export const MAX_FAILED_ATTEMPTS = 5;
/** Lockout window (30 s) — mirrors a typical server-side throttle response. */
export const LOCKOUT_MS = 30 * 1000;
/** Upper bounds so an oversized paste cannot be used to exhaust the service. */
export const MAX_USERNAME_LENGTH = 254;
export const MAX_PASSWORD_LENGTH = 128;
