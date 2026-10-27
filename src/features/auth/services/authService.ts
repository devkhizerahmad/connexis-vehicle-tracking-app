// authService.ts — credential check (mock today, API-ready signature).
//
// Contract the screen depends on:
//   login(credentials) -> LoginOutcome   (never throws for a *credential* failure)
//
// Security posture modelled here, so the UI is already built for a real backend:
// - ONE generic failure message for unknown user / wrong password (no user
//   enumeration), with the same latency envelope on every path.
// - Temporary lockout after MAX_FAILED_ATTEMPTS failed attempts, with a
//   retry-after hint (anti-automation feedback, OWASP ASVS V2.2.1).
// - Opaque, expiring session token. No password is retained, logged or returned.
// - Input length bounds; a password is never trimmed or mutated.
//
// FLAG: this is a MOCK. Replace the account table + `delay()` with the real
// endpoint (`POST /auth/login`) and keep the same LoginOutcome contract. Token
// generation must move server-side; Math.random is not a CSPRNG.
import {
  Credentials,
  LOCKOUT_MS,
  LoginOutcome,
  MAX_FAILED_ATTEMPTS,
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  REMEMBERED_SESSION_TTL_MS,
  Session,
  SESSION_TTL_MS,
} from '../types/auth';

interface MockAccount {
  username: string;
  password: string;
}

/**
 * Demo accounts. `demo` is the one shared with the QA/test plan.
 * FLAG: mock data — delete with the mock service.
 */
const ACCOUNTS: readonly MockAccount[] = [
  { username: 'demo', password: 'Demo@1234' },
  { username: 'driver1', password: 'Driver@1234' },
  { username: 'admin', password: 'Admin@1234' },
];

/** Every outcome waits at least this long, so timing does not reveal the cause. */
const MIN_LATENCY_MS = 650;

const failedAttempts = new Map<string, number>();
const lockedUntil = new Map<string, number>();

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
const latency = () => wait(MIN_LATENCY_MS + Math.floor(Math.random() * 150));

const normalise = (username: string) => username.trim().toLowerCase();

function invalidCredentials(): LoginOutcome {
  // Deliberately identical for "no such user" and "wrong password".
  return {
    ok: false,
    error: {
      code: 'invalid_credentials',
      message: 'Incorrect username or password. Please try again.',
    },
  };
}

function lockedError(retryAfterMs: number): LoginOutcome {
  const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  return {
    ok: false,
    error: {
      code: 'account_locked',
      message: `Too many failed attempts. Try again in ${seconds} second${seconds === 1 ? '' : 's'}.`,
      retryAfterMs,
    },
  };
}

function validationError(field: 'username' | 'password', message: string): LoginOutcome {
  return { ok: false, error: { code: 'validation', message, field } };
}

function randomToken(): string {
  let token = '';
  for (let i = 0; i < 32; i += 1) {
    token += Math.floor(Math.random() * 16).toString(16);
  }
  return token;
}

function makeSession(username: string, rememberMe: boolean): Session {
  const issuedAt = Date.now();
  return {
    token: randomToken(),
    username,
    issuedAt,
    expiresAt: issuedAt + (rememberMe ? REMEMBERED_SESSION_TTL_MS : SESSION_TTL_MS),
    rememberMe,
  };
}

export const authService = {
  async login(credentials: Credentials): Promise<LoginOutcome> {
    const username = credentials.username ?? '';
    const password = credentials.password ?? '';
    const key = normalise(username);

    // Defense in depth: the screen validates first, the service still refuses
    // empty/oversized payloads instead of trusting its caller.
    if (!key) {
      await latency();
      return validationError('username', 'Enter your username.');
    }
    if (!password) {
      await latency();
      return validationError('password', 'Enter your password.');
    }
    if (username.length > MAX_USERNAME_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
      await latency();
      return validationError('username', 'That username or password is too long.');
    }

    // Anti-automation: refuse while the account is throttled.
    const lockExpiry = lockedUntil.get(key);
    if (lockExpiry && lockExpiry > Date.now()) {
      await latency();
      return lockedError(lockExpiry - Date.now());
    }
    if (lockExpiry) {
      lockedUntil.delete(key);
      failedAttempts.delete(key);
    }

    await latency();

    const account = ACCOUNTS.find(item => item.username === key);
    const matched = account !== undefined && account.password === password;

    if (!matched) {
      const attempts = (failedAttempts.get(key) ?? 0) + 1;
      if (attempts >= MAX_FAILED_ATTEMPTS) {
        failedAttempts.delete(key);
        lockedUntil.set(key, Date.now() + LOCKOUT_MS);
        return lockedError(LOCKOUT_MS);
      }
      failedAttempts.set(key, attempts);
      return invalidCredentials();
    }

    failedAttempts.delete(key);
    lockedUntil.delete(key);

    // The credential is validated; from here on only the session travels.
    return { ok: true, session: makeSession(key, credentials.rememberMe === true) };
  },

  /** Server-side this is `POST /auth/logout` (token revocation). No-op in mock. */
  async logout(): Promise<void> {
    return undefined;
  },

  /** Test-only: clears throttle state between cases. */
  __resetForTests(): void {
    failedAttempts.clear();
    lockedUntil.clear();
  },
};

export default authService;
