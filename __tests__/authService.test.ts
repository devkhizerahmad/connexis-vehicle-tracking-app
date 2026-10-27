// authService.test.ts — credential-check contract.
// Covers the security behaviours the login UI depends on: generic failures,
// lockout, session TTL and the guarantee that no password is returned.
import authService from '../src/features/auth/services/authService';
import {
  LOCKOUT_MS,
  MAX_FAILED_ATTEMPTS,
  REMEMBERED_SESSION_TTL_MS,
  SESSION_TTL_MS,
} from '../src/features/auth/types/auth';

const credentials = (overrides: Partial<{ username: string; password: string; rememberMe: boolean }> = {}) => ({
  username: 'demo',
  password: 'Demo@1234',
  rememberMe: false,
  ...overrides,
});

describe('authService', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T09:00:00.000Z'));
    authService.__resetForTests();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  /** Runs the login promise to completion against fake timers. */
  const run = async (input: ReturnType<typeof credentials>) => {
    const promise = authService.login(input);
    await Promise.resolve();
    jest.advanceTimersByTime(1000);
    return promise;
  };

  it('rejects an unknown username with the generic credential error', async () => {
    const outcome = await run(credentials({ username: 'ghost' }));
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.code).toBe('invalid_credentials');
      expect(outcome.error.message).toBe('Incorrect username or password. Please try again.');
    }
  });

  it('rejects a wrong password with the exact same message (no enumeration)', async () => {
    const wrongPassword = await run(credentials({ password: 'nope' }));
    authService.__resetForTests();
    const unknownUser = await run(credentials({ username: 'ghost' }));

    expect(wrongPassword.ok).toBe(false);
    expect(unknownUser.ok).toBe(false);
    if (!wrongPassword.ok && !unknownUser.ok) {
      expect(wrongPassword.error.message).toBe(unknownUser.error.message);
      expect(wrongPassword.error.code).toBe(unknownUser.error.code);
    }
  });

  it('accepts the demo credentials and returns an opaque token', async () => {
    const outcome = await run(credentials());

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.session.username).toBe('demo');
      expect(outcome.session.token).toHaveLength(32);
      expect(outcome.session.token).not.toContain('Demo@1234');
      // No credential material is echoed back.
      expect(JSON.stringify(outcome.session)).not.toContain('Demo@1234');
    }
  });

  it('uses an 8 hour session by default and 30 days with Remember Me', async () => {
    const short = await run(credentials());
    const long = await run(credentials({ rememberMe: true }));

    if (short.ok) {
      expect(short.session.expiresAt - short.session.issuedAt).toBe(SESSION_TTL_MS);
    }
    if (long.ok) {
      expect(long.session.expiresAt - long.session.issuedAt).toBe(REMEMBERED_SESSION_TTL_MS);
    }
  });

  it('locks the account after the configured number of failures', async () => {
    for (let attempt = 0; attempt < MAX_FAILED_ATTEMPTS - 1; attempt += 1) {
      const attemptOutcome = await run(credentials({ password: 'wrong' }));
      expect(attemptOutcome.ok).toBe(false);
      if (!attemptOutcome.ok) {
        expect(attemptOutcome.error.code).toBe('invalid_credentials');
      }
    }

    const locked = await run(credentials({ password: 'wrong' }));
    expect(locked.ok).toBe(false);
    if (!locked.ok) {
      expect(locked.error.code).toBe('account_locked');
      expect(locked.error.retryAfterMs).toBe(LOCKOUT_MS);
    }

    // Even the CORRECT password is refused while throttled.
    const duringLock = await run(credentials());
    expect(duringLock.ok).toBe(false);
    if (!duringLock.ok) {
      expect(duringLock.error.code).toBe('account_locked');
    }
  });

  it('allows sign-in again once the lockout expires', async () => {
    for (let attempt = 0; attempt < MAX_FAILED_ATTEMPTS; attempt += 1) {
      await run(credentials({ password: 'wrong' }));
    }

    jest.advanceTimersByTime(LOCKOUT_MS + 1);
    const outcome = await run(credentials());
    expect(outcome.ok).toBe(true);
  });

  it('normalises the username (trim + case) without touching the password', async () => {
    const outcome = await run(credentials({ username: '  DEMO  ' }));
    expect(outcome.ok).toBe(true);

    const wrongCasePassword = await run(credentials({ password: 'demo@1234' }));
    expect(wrongCasePassword.ok).toBe(false);
  });

  it('rejects empty fields instead of authenticating them', async () => {
    const noUser = await run(credentials({ username: '   ' }));
    const noPassword = await run(credentials({ password: '' }));

    expect(noUser.ok).toBe(false);
    expect(noPassword.ok).toBe(false);
    if (!noUser.ok) {
      expect(noUser.error.code).toBe('validation');
      expect(noUser.error.field).toBe('username');
    }
    if (!noPassword.ok) {
      expect(noPassword.error.code).toBe('validation');
      expect(noPassword.error.field).toBe('password');
    }
  });

  it('refuses oversized payloads', async () => {
    const outcome = await run(credentials({ password: 'x'.repeat(129) }));
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.code).toBe('validation');
    }
  });
});
